import { useState, useRef, useMemo } from 'react';

const TimeComplexityGraph = ({ complexities, maxN = 50, title = "Time Complexity Analysis" }) => {
    const [hoverData, setHoverData] = useState(null);
    const graphRef = useRef(null);

    // Dynamically calculate the maximum number of operations based on the provided formulas
    const maxOps = useMemo(() => {
        const maxVal = Math.max(...complexities.map(c => c.formula(maxN)));
        // Add a 5% buffer to prevent lines from touching the top edge
        return maxVal > 0 ? maxVal * 1.05 : 1;
    }, [complexities, maxN]);

    // Generate the y-axis labels based on the dynamic maxOps
    const yAxisLabels = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => Math.round((maxOps / 4) * i));
    }, [maxOps]);

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
        
        // Calculate n based on mouse position (ensure it's at least 1)
        const n = Math.max(1, Math.round((x / rect.width) * (maxN - 1)) + 1);

        if (n < 1 || n > maxN) {
            if (hoverData) handleMouseLeave();
            return;
        }

        const xPercent = ((n - 1) / (maxN - 1)) * 100;

        // Calculate results for all provided complexities
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

    return (
        <div className="mt-8 bg-card/50 p-4 sm:p-10 rounded-xl border border-border select-none">
            <h3 className="font-bold text-text-primary text-center mb-6 text-xl tracking-wide">
                {title}
            </h3>
            <div className="flex pl-4 pr-2 sm:pl-8 sm:pr-4">
                {/* Y-Axis */}
                <div className="flex flex-col-reverse justify-between items-end h-72 py-4 pr-4 text-xs text-text-secondary relative">
                    {yAxisLabels.map(label => <span key={label}>{label.toLocaleString()}</span>)}
                    <span className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-sm tracking-wider">Operations</span>
                </div>

                {/* Graph Area */}
                <div className="flex-grow">
                    <div
                        ref={graphRef}
                        className="relative h-72 w-full cursor-crosshair"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Grid Lines */}
                        {yAxisLabels.map((_, i) => (
                             i > 0 && <div key={i} className="absolute w-full border-t border-dashed border-border/50" style={{ top: `${100 - (i/4)*100}%` }} />
                        ))}
                        
                        {/* SVG Graph Lines */}
                        <svg viewBox={`0 0 ${maxN} ${maxOps}`} preserveAspectRatio="none" className="absolute w-full h-full" style={{ transform: "scaleY(-1)" }}>
                            {pathData.map((path, i) => (
                                <path key={i} d={path} stroke={complexities[i].color} strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
                            ))}
                        </svg>

                        {/* Interactive Hover Elements */}
                        {hoverData && (
                            <>
                                <div className="absolute top-0 bottom-0 border-l border-dashed border-text-secondary/70" style={{ left: `${hoverData.xPercent}%` }} />
                                
                                {hoverData.results.map((result, i) => (
                                    <div key={i} className="absolute w-3 h-3 rounded-full border-2 border-card" style={{ backgroundColor: result.color, left: `${hoverData.xPercent}%`, top: `${result.yPercent}%`, transform: 'translate(-50%, -50%)' }} />
                                ))}
                                
                                <div className="absolute p-4 bg-card rounded-xl shadow-lg border border-border/70 w-52 pointer-events-none z-10"
                                     style={{ left: `${hoverData.xPercent}%`, top: '5%', transform: `translateX(${hoverData.xPercent > 65 ? '-115%' : '15%'})` }}>
                                    <p className="font-bold text-center mb-3 text-text-primary">Input size (n) = {hoverData.n}</p>
                                    <ul className="text-sm space-y-2 text-text-secondary">
                                        {hoverData.results.map((result, i) => (
                                             <li key={i} className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: result.color}}></div>
                                                    {result.label}:
                                                </span> 
                                                <code className="font-mono text-text-primary">{result.operations.toLocaleString(undefined, { maximumFractionDigits: 0 })}</code>
                                             </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>

                    {/* X-Axis */}
                    <div className="relative flex justify-between mt-2 h-6 text-xs text-text-secondary">
                        {Array.from({ length: 6 }, (_, i) => i * (maxN / 5) || 1).map(n => (
                            <span key={n} className="absolute" style={{ left: `${((n - 1) / (maxN - 1)) * 100}%`, transform: 'translateX(-50%)' }}>{Math.round(n)}</span>
                        ))}
                        <span className="absolute left-1/2 -bottom-7 text-sm">Input Size (n)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeComplexityGraph;


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