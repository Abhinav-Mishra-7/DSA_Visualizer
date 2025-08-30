import { useState, useRef, useMemo, useEffect } from 'react';

const TimeComplexityGraph = ({ complexities, maxN = 50, title = "Time Complexity Analysis" }) => {
    const [hoverData, setHoverData] = useState(null);
    const [dimensions, setDimensions] = useState({
        graphHeight: 200,
        padding: 16,
        fontSize: 12,
        tooltipWidth: 180
    });
    const graphRef = useRef(null);

    // Calculate responsive dimensions
    useEffect(() => {
        const calculateDimensions = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let graphHeight, padding, fontSize, tooltipWidth;
            
            if (viewportWidth < 480) { // Mobile
                graphHeight = Math.min(180, viewportHeight * 0.25);
                padding = 12;
                fontSize = 10;
                tooltipWidth = Math.min(160, viewportWidth * 0.8);
            } else if (viewportWidth < 640) { // Large mobile
                graphHeight = Math.min(200, viewportHeight * 0.3);
                padding = 16;
                fontSize = 11;
                tooltipWidth = Math.min(180, viewportWidth * 0.7);
            } else if (viewportWidth < 768) { // Tablet
                graphHeight = Math.min(240, viewportHeight * 0.35);
                padding = 20;
                fontSize = 12;
                tooltipWidth = Math.min(200, viewportWidth * 0.6);
            } else if (viewportWidth < 1024) { // Small desktop
                graphHeight = Math.min(280, viewportHeight * 0.4);
                padding = 24;
                fontSize = 13;
                tooltipWidth = 220;
            } else { // Large desktop
                graphHeight = Math.min(320, viewportHeight * 0.45);
                padding = 32;
                fontSize = 14;
                tooltipWidth = 240;
            }
            
            setDimensions({ graphHeight, padding, fontSize, tooltipWidth });
        };

        calculateDimensions();
        window.addEventListener('resize', calculateDimensions);
        return () => window.removeEventListener('resize', calculateDimensions);
    }, []);

    // Dynamically calculate the maximum number of operations
    const maxOps = useMemo(() => {
        const maxVal = Math.max(...complexities.map(c => c.formula(maxN)));
        return maxVal > 0 ? maxVal * 1.05 : 1;
    }, [complexities, maxN]);

    // Generate responsive y-axis labels
    const yAxisLabels = useMemo(() => {
        const labelCount = dimensions.graphHeight < 200 ? 4 : 5;
        return Array.from({ length: labelCount }, (_, i) => Math.round((maxOps / (labelCount - 1)) * i));
    }, [maxOps, dimensions.graphHeight]);

    // Generate the SVG path data for each complexity line
    const pathData = useMemo(() => {
        return complexities.map(c => {
            let path = `M 1 ${c.formula(1)}`;
            for (let n = 2; n <= maxN; n++) {
                path += ` L ${n} ${c.formula(n)}`;
            }
            return path;
        });
    }, [complexities, maxN]);

    const handleMouseMove = (e) => {
        if (!graphRef.current) return;
        const rect = graphRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        
        const n = Math.max(1, Math.round((x / rect.width) * (maxN - 1)) + 1);

        if (n < 1 || n > maxN) {
            if (hoverData) handleMouseLeave();
            return;
        }

        const xPercent = ((n - 1) / (maxN - 1)) * 100;

        const results = complexities.map(c => {
            const operations = c.formula(n);
            const yPercent = 100 - (operations / maxOps) * 100;
            return {
                ...c,
                operations,
                yPercent,
            };
        });

        setHoverData({ n, xPercent, results });
    };

    const handleMouseLeave = () => setHoverData(null);

    // Responsive classes based on dimensions
    const containerPadding = `p-${Math.floor(dimensions.padding / 4)}`;
    const titleSize = dimensions.fontSize > 12 ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg';
    const labelSize = dimensions.fontSize > 12 ? 'text-xs sm:text-sm' : 'text-xs';
    const axisLabelSize = dimensions.fontSize > 12 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

    return (
        <div className={`mt-4 sm:mt-6 md:mt-8 bg-card/50 ${containerPadding} sm:p-6 md:p-8 lg:p-10 rounded-lg sm:rounded-xl border border-border select-none`}>
            <h3 className={`font-bold text-text-primary text-center mb-3 sm:mb-4 md:mb-6 ${titleSize} tracking-wide`}>
                {title}
            </h3>
            
            <div className="flex overflow-x-auto">
                <div className="flex min-w-full">
                    {/* Y-Axis */}
                    <div 
                        className={`flex flex-col-reverse justify-between items-end py-2 sm:py-4 pr-2 sm:pr-4 ${labelSize} text-text-secondary relative flex-shrink-0`}
                        style={{ height: `${dimensions.graphHeight}px` }}
                    >
                        {yAxisLabels.map(label => (
                            <span key={label} className="whitespace-nowrap">
                                {label.toLocaleString()}
                            </span>
                        ))}
                        <span 
                            className={`absolute top-1/2 -translate-y-1/2 -rotate-90 ${axisLabelSize} tracking-wider whitespace-nowrap`}
                            style={{ 
                                left: dimensions.padding < 20 ? '-35px' : '-45px'
                            }}
                        >
                            Operations
                        </span>
                    </div>

                    {/* Graph Area */}
                    <div className="flex-grow min-w-0">
                        <div
                            ref={graphRef}
                            className="relative w-full cursor-crosshair"
                            style={{ height: `${dimensions.graphHeight}px` }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Grid Lines */}
                            {yAxisLabels.map((_, i) => (
                                i > 0 && (
                                    <div 
                                        key={i} 
                                        className="absolute w-full border-t border-dashed border-border/50" 
                                        style={{ top: `${100 - (i/(yAxisLabels.length - 1))*100}%` }} 
                                    />
                                )
                            ))}
                            
                            {/* SVG Graph Lines */}
                            <svg 
                                viewBox={`0 0 ${maxN} ${maxOps}`} 
                                preserveAspectRatio="none" 
                                className="absolute w-full h-full" 
                                style={{ transform: "scaleY(-1)" }}
                            >
                                {pathData.map((path, i) => (
                                    <path 
                                        key={i} 
                                        d={path} 
                                        stroke={complexities[i].color} 
                                        strokeWidth={dimensions.graphHeight < 200 ? "2" : "2.5"} 
                                        fill="none" 
                                        vectorEffect="non-scaling-stroke" 
                                    />
                                ))}
                            </svg>

                            {/* Interactive Hover Elements */}
                            {hoverData && (
                                <>
                                    <div 
                                        className="absolute top-0 bottom-0 border-l border-dashed border-text-secondary/70" 
                                        style={{ left: `${hoverData.xPercent}%` }} 
                                    />
                                    
                                    {hoverData.results.map((result, i) => (
                                        <div 
                                            key={i} 
                                            className="absolute rounded-full border-2 border-card" 
                                            style={{ 
                                                backgroundColor: result.color, 
                                                left: `${hoverData.xPercent}%`, 
                                                top: `${result.yPercent}%`, 
                                                transform: 'translate(-50%, -50%)',
                                                width: dimensions.graphHeight < 200 ? '8px' : '12px',
                                                height: dimensions.graphHeight < 200 ? '8px' : '12px'
                                            }} 
                                        />
                                    ))}
                                    
                                    <div 
                                        className={`absolute p-2 sm:p-3 md:p-4 bg-card rounded-lg sm:rounded-xl shadow-lg border border-border/70 pointer-events-none z-10 ${labelSize}`}
                                        style={{ 
                                            left: `${hoverData.xPercent}%`, 
                                            top: '5%', 
                                            width: `${dimensions.tooltipWidth}px`,
                                            transform: `translateX(${hoverData.xPercent > 65 ? '-105%' : '5%'})` 
                                        }}
                                    >
                                        <p className={`font-bold text-center mb-2 sm:mb-3 text-text-primary ${dimensions.fontSize > 12 ? 'text-sm' : 'text-xs'}`}>
                                            Input size (n) = {hoverData.n}
                                        </p>
                                        <ul className={`space-y-1 sm:space-y-2 text-text-secondary ${dimensions.fontSize > 12 ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                                            {hoverData.results.map((result, i) => (
                                                <li key={i} className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-1 sm:gap-2 truncate">
                                                        <div 
                                                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" 
                                                            style={{backgroundColor: result.color}}
                                                        />
                                                        <span className="truncate">{result.label}:</span>
                                                    </span> 
                                                    <code className="font-mono text-text-primary whitespace-nowrap">
                                                        {result.operations.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </code>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* X-Axis */}
                        <div className={`relative flex justify-between mt-1 sm:mt-2 h-4 sm:h-6 ${labelSize} text-text-secondary`}>
                            {Array.from({ length: dimensions.graphHeight < 200 ? 4 : 6 }, (_, i) => {
                                const step = dimensions.graphHeight < 200 ? (maxN / 3) : (maxN / 5);
                                return i * step || 1;
                            }).map(n => (
                                <span 
                                    key={n} 
                                    className="absolute whitespace-nowrap" 
                                    style={{ 
                                        left: `${((n - 1) / (maxN - 1)) * 100}%`, 
                                        transform: 'translateX(-50%)' 
                                    }}
                                >
                                    {Math.round(n)}
                                </span>
                            ))}
                            <span 
                                className={`absolute left-1/2 text-center ${axisLabelSize} whitespace-nowrap`}
                                style={{ 
                                    bottom: dimensions.graphHeight < 200 ? '-20px' : '-28px',
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                Input Size (n)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend for smaller screens */}
            {dimensions.graphHeight < 220 && (
                <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2 sm:gap-4">
                    {complexities.map((complexity, i) => (
                        <div key={i} className="flex items-center gap-1 sm:gap-2">
                            <div 
                                className="w-3 h-0.5 sm:w-4 sm:h-1" 
                                style={{ backgroundColor: complexity.color }}
                            />
                            <span className={`${labelSize} text-text-secondary whitespace-nowrap`}>
                                {complexity.label}: {complexity.complexity}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimeComplexityGraph;




// import { useState, useRef, useMemo } from 'react';

// const TimeComplexityGraph = ({ complexities, maxN = 50, title = "Time Complexity Analysis" }) => {
//     const [hoverData, setHoverData] = useState(null);
//     const graphRef = useRef(null);

//     // Dynamically calculate the maximum number of operations based on the provided formulas
//     const maxOps = useMemo(() => {
//         const maxVal = Math.max(...complexities.map(c => c.formula(maxN)));
//         // Add a 5% buffer to prevent lines from touching the top edge
//         return maxVal > 0 ? maxVal * 1.05 : 1;
//     }, [complexities, maxN]);

//     // Generate the y-axis labels based on the dynamic maxOps
//     const yAxisLabels = useMemo(() => {
//         return Array.from({ length: 5 }, (_, i) => Math.round((maxOps / 4) * i));
//     }, [maxOps]);

//     // Generate the SVG path data for each complexity line
//     const pathData = useMemo(() => {
//         return complexities.map(c => {
//             let path = `M 1 ${c.formula(1)}`;
//             for (let n = 2; n <= maxN; n++) {
//                 path += ` L ${n} ${c.formula(n)}`;
//             }
//             return path;
//         });
//     }, [complexities, maxN]);

//     const handleMouseMove = (e) => {
//         if (!graphRef.current) return;
//         const rect = graphRef.current.getBoundingClientRect();
//         const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        
//         // Calculate n based on mouse position (ensure it's at least 1)
//         const n = Math.max(1, Math.round((x / rect.width) * (maxN - 1)) + 1);

//         if (n < 1 || n > maxN) {
//             if (hoverData) handleMouseLeave();
//             return;
//         }

//         const xPercent = ((n - 1) / (maxN - 1)) * 100;

//         // Calculate results for all provided complexities
//         const results = complexities.map(c => {
//             const operations = c.formula(n);
//             const yPercent = 100 - (operations / maxOps) * 100;
//             return {
//                 ...c,
//                 operations,
//                 yPercent,
//             };
//         });

//         setHoverData({ n, xPercent, results });
//     };

//     const handleMouseLeave = () => setHoverData(null);

//     return (
//         <div className="mt-8 bg-card/50 p-4 sm:p-10 rounded-xl border border-border select-none">
//             <h3 className="font-bold text-text-primary text-center mb-6 text-xl tracking-wide">
//                 {title}
//             </h3>
//             <div className="flex pl-4 pr-2 sm:pl-8 sm:pr-4">
//                 {/* Y-Axis */}
//                 <div className="flex flex-col-reverse justify-between items-end h-72 py-4 pr-4 text-xs text-text-secondary relative">
//                     {yAxisLabels.map(label => <span key={label}>{label.toLocaleString()}</span>)}
//                     <span className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-sm tracking-wider">Operations</span>
//                 </div>

//                 {/* Graph Area */}
//                 <div className="flex-grow">
//                     <div
//                         ref={graphRef}
//                         className="relative h-72 w-full cursor-crosshair"
//                         onMouseMove={handleMouseMove}
//                         onMouseLeave={handleMouseLeave}
//                     >
//                         {/* Grid Lines */}
//                         {yAxisLabels.map((_, i) => (
//                              i > 0 && <div key={i} className="absolute w-full border-t border-dashed border-border/50" style={{ top: `${100 - (i/4)*100}%` }} />
//                         ))}
                        
//                         {/* SVG Graph Lines */}
//                         <svg viewBox={`0 0 ${maxN} ${maxOps}`} preserveAspectRatio="none" className="absolute w-full h-full" style={{ transform: "scaleY(-1)" }}>
//                             {pathData.map((path, i) => (
//                                 <path key={i} d={path} stroke={complexities[i].color} strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
//                             ))}
//                         </svg>

//                         {/* Interactive Hover Elements */}
//                         {hoverData && (
//                             <>
//                                 <div className="absolute top-0 bottom-0 border-l border-dashed border-text-secondary/70" style={{ left: `${hoverData.xPercent}%` }} />
                                
//                                 {hoverData.results.map((result, i) => (
//                                     <div key={i} className="absolute w-3 h-3 rounded-full border-2 border-card" style={{ backgroundColor: result.color, left: `${hoverData.xPercent}%`, top: `${result.yPercent}%`, transform: 'translate(-50%, -50%)' }} />
//                                 ))}
                                
//                                 <div className="absolute p-4 bg-card rounded-xl shadow-lg border border-border/70 w-52 pointer-events-none z-10"
//                                      style={{ left: `${hoverData.xPercent}%`, top: '5%', transform: `translateX(${hoverData.xPercent > 65 ? '-115%' : '15%'})` }}>
//                                     <p className="font-bold text-center mb-3 text-text-primary">Input size (n) = {hoverData.n}</p>
//                                     <ul className="text-sm space-y-2 text-text-secondary">
//                                         {hoverData.results.map((result, i) => (
//                                              <li key={i} className="flex items-center justify-between">
//                                                 <span className="flex items-center gap-2">
//                                                     <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: result.color}}></div>
//                                                     {result.label}:
//                                                 </span> 
//                                                 <code className="font-mono text-text-primary">{result.operations.toLocaleString(undefined, { maximumFractionDigits: 0 })}</code>
//                                              </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* X-Axis */}
//                     <div className="relative flex justify-between mt-2 h-6 text-xs text-text-secondary">
//                         {Array.from({ length: 6 }, (_, i) => i * (maxN / 5) || 1).map(n => (
//                             <span key={n} className="absolute" style={{ left: `${((n - 1) / (maxN - 1)) * 100}%`, transform: 'translateX(-50%)' }}>{Math.round(n)}</span>
//                         ))}
//                         <span className="absolute left-1/2 -bottom-7 text-sm">Input Size (n)</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TimeComplexityGraph;


// import { useState, useRef, useMemo } from 'react';

// const TimeComplexityGraph = ({ maxN = 25 }) => {
//     const [hoverData, setHoverData] = useState(null);
//     const graphRef = useRef(null);
//     const maxOps = useMemo(() => maxN * maxN, [maxN]);

//     const yAxisLabels = useMemo(() => {
//         return Array.from({ length: 5 }, (_, i) => Math.round((maxOps / 4) * i));
//     }, [maxOps]);

//     const handleMouseMove = (e) => {
//         if (!graphRef.current) return;
//         const rect = graphRef.current.getBoundingClientRect();
//         const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
//         const n = Math.round((x / rect.width) * (maxN - 1)) + 1;

//         if (n < 1 || n > maxN) {
//             if (hoverData) handleMouseLeave();
//             return;
//         }

//         const bestCase = n;
//         const avgWorstCase = n * n;
        
//         const xPercent = ((n - 1) / (maxN - 1)) * 100;
        
//         // Calculate y-position as a percentage of maxOps
//         const bestYPercent = 100 - (bestCase / maxOps) * 100;
//         const worstYPercent = 100 - (avgWorstCase / maxOps) * 100;

//         setHoverData({ n, xPercent, bestCase, avgWorstCase, bestYPercent, worstYPercent });
//     };

//     const handleMouseLeave = () => setHoverData(null);

//     return (
//         <div className="mt-8 bg-card/50 p-4 sm:p-10 rounded-xl border border-border select-none">
//             <h3 className="font-bold text-text-primary text-center mb-6 text-xl tracking-wide">
//                 Time Complexity Analysis
//             </h3>
//             <div className="flex pl-4 pr-2 sm:pl-8 sm:pr-4">
//                 {/* Y-Axis */}
//                 <div className="flex flex-col-reverse justify-between items-end h-72 py-4 pr-4 text-xs text-text-secondary relative">
//                     {yAxisLabels.map(label => <span key={label}>{label}</span>)}
//                     <span className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-sm tracking-wider">Operations</span>
//                 </div>

//                 {/* Graph Area */}
//                 <div className="flex-grow">
//                     <div
//                         ref={graphRef}
//                         className="relative h-72 w-full cursor-crosshair"
//                         onMouseMove={handleMouseMove}
//                         onMouseLeave={handleMouseLeave}
//                     >
//                         {/* Grid Lines */}
//                         {yAxisLabels.map((_, i) => (
//                              i > 0 && <div key={i} className="absolute w-full border-t border-dashed border-border/50" style={{ top: `${100 - (i/4)*100}%` }} />
//                         ))}
                        
//                         {/* SVG Graph Lines */}
//                         <svg viewBox={`0 0 ${maxN} ${maxOps}`} preserveAspectRatio="none" className="absolute w-full h-full" style={{ transform: "scaleY(-1)" }}>
//                             {/* O(n^2) - Worst/Average Case CURVE */}
//                             <path d={`M 1 1 Q ${maxN * 0.4} 1, ${maxN} ${maxOps}`} stroke="#EF4444" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
//                             {/* O(n) - Best Case LINE */}
//                             <path d={`M 1 1 L ${maxN} ${maxN}`} stroke="#22C55E" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
//                         </svg>

//                         {/* Interactive Hover Elements */}
//                         {hoverData && (
//                             <>
//                                 <div className="absolute top-0 bottom-0 border-l border-dashed border-text-secondary/70" style={{ left: `${hoverData.xPercent}%` }} />
                                
//                                 <div className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-card" style={{ left: `${hoverData.xPercent}%`, top: `${hoverData.worstYPercent}%`, transform: 'translate(-50%, -50%)' }} />
//                                 <div className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-card" style={{ left: `${hoverData.xPercent}%`, top: `${hoverData.bestYPercent}%`, transform: 'translate(-50%, -50%)' }} />

//                                 <div className="absolute p-4 bg-card rounded-xl shadow-lg border border-border/70 w-48 pointer-events-none z-10"
//                                      style={{
//                                          left: `${hoverData.xPercent}%`,
//                                          top: '5%',
//                                          transform: `translateX(${hoverData.xPercent > 65 ? '-115%' : '15%'})`
//                                      }}>
//                                     <p className="font-bold text-center mb-3 text-text-primary">n = {hoverData.n}</p>
//                                     <ul className="text-sm space-y-2 text-text-secondary">
//                                         <li className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>Best:</span> <code className="font-mono text-text-primary">{hoverData.bestCase.toFixed(0)}</code></li>
//                                         <li className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>Average:</span> <code className="font-mono text-text-primary">{hoverData.avgWorstCase.toFixed(0)}</code></li>
//                                         <li className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>Worst:</span> <code className="font-mono text-text-primary">{hoverData.avgWorstCase.toFixed(0)}</code></li>
//                                     </ul>
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* X-Axis */}
//                     <div className="relative flex justify-between mt-2 h-6 text-xs text-text-secondary">
//                         {Array.from({ length: 6 }, (_, i) => i * 5).map(n => n === 0 ? 1 : n).map(n => (
//                             <span key={n} className="absolute" style={{ left: `${((n - 1) / (maxN - 1)) * 100}%`, transform: 'translateX(-50%)' }}>{n}</span>
//                         ))}
//                         <span className="absolute left-1/2 -bottom-7 text-sm">Input Size (n)</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TimeComplexityGraph;