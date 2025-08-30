import React, { useRef } from 'react';

const getSVGCoordinates = (svg, event) => {
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const screenCTM = svg.getScreenCTM();
    return screenCTM ? pt.matrixTransform(screenCTM.inverse()) : null;
};

export default function GraphCanvas({ stepData, getGraphNodeState, getGraphEdgeState, onCanvasClick, onNodeClick, editMode, edgeStartNode, isDirected }) {
    const svgRef = useRef(null);
    const NODE_RADIUS = 15;

    if (!stepData || !stepData.nodes) {
        return <div className="flex items-center justify-center h-full text-text-secondary">Loading Graph...</div>;
    }

    const handleCanvasClick = (event) => {
        // Only trigger the add node function if in the correct mode and clicking on the SVG background
        if (editMode === 'add-node' && svgRef.current && event.target.tagName === 'svg') {
            const coords = getSVGCoordinates(svgRef.current, event);
            if (coords) onCanvasClick(coords);
        }
    };

    const handleNodeClick = (event, nodeId) => {
        event.stopPropagation(); // Prevent the click from bubbling up to the SVG canvas
        if (editMode === 'add-edge' || editMode === 'delete-node') {
            onNodeClick(nodeId);
        }
    };

    // Dynamically set the cursor style based on the current edit mode
    const cursorClass = {
        'add-node': 'cursor-crosshair',
        'add-edge': 'cursor-pointer',
        'delete-node': 'cursor-not-allowed',
        'idle': 'cursor-default',
    }[editMode];

    const markerMap = {
        'stroke-gray-600': 'url(#arrowhead-default)',
        'stroke-accent': 'url(#arrowhead-visited)',
        'stroke-purple-500': 'url(#arrowhead-potential)',
        'stroke-yellow-400': 'url(#arrowhead-active)',
    };

    return (
        <div className="flex items-center justify-center h-full w-full">
            <svg ref={svgRef} viewBox="0 0 600 400" className={`w-full h-full ${cursorClass}`} onClick={handleCanvasClick}>
                <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#a855f7' }} /> 
                        <stop offset="100%" style={{ stopColor: '#6366f1' }} /> 
                    </linearGradient>

                    <filter id="dropshadow" height="130%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                        <feOffset dx="1" dy="1" result="offsetblur"/>
                        <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
                        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    
                    <marker id="arrowhead-default" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" className="fill-gray-600" /></marker>
                    <marker id="arrowhead-visited" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" className="fill-accent" /></marker>
                    <marker id="arrowhead-potential" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" fill="url(#arrowGradient)" /></marker>
                    <marker id="arrowhead-active" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" className="fill-yellow-400" /></marker>
                </defs>

                <g filter="url(#dropshadow)">
                    {stepData.edges.map(edge => {
                        const from = stepData.nodes.find(n => n.id === edge.from);
                        const to = stepData.nodes.find(n => n.id === edge.to);
                        if (!from || !to) return null;
                        
                        const edgeClass = getGraphEdgeState ? getGraphEdgeState(edge, stepData) : 'stroke-gray-600';
                        const markerUrl = markerMap[edgeClass] || markerMap['stroke-gray-600'];

                        let targetX = to.x;
                        let targetY = to.y;

                        // Only shorten the line if the graph is directed (to show the arrow)
                        if (isDirected) {
                            const dx = to.x - from.x;
                            const dy = to.y - from.y;
                            const length = Math.sqrt(dx * dx + dy * dy);
                            if (length > 0) {
                                const unitX = dx / length;
                                const unitY = dy / length;
                                targetX = to.x - unitX * (NODE_RADIUS + 2);
                                targetY = to.y - unitY * (NODE_RADIUS + 2);
                            }
                        }

                        return (
                            <line 
                                key={`${edge.from}-${edge.to}`} 
                                x1={from.x} y1={from.y} 
                                x2={targetX} y2={targetY} 
                                className={`transition-all duration-300 ${edgeClass}`} 
                                strokeWidth="3" 
                                markerEnd={isDirected ? markerUrl : null} // Conditionally apply arrows
                            />
                        );
                    })}
                </g>

                {stepData.nodes.map(node => {
                    const nodeClass = getGraphNodeState ? getGraphNodeState(node.id, stepData) : 'fill-gray-500';
                    const isEdgeStart = editMode === 'add-edge' && edgeStartNode === node.id;
                    return (
                        <g key={node.id} onClick={(e) => handleNodeClick(e, node.id)} style={{ filter: 'url(#dropshadow)' }}>
                            <circle cx={node.x} cy={node.y} r={NODE_RADIUS} className={`transition-all duration-300 ${nodeClass}`} stroke={isEdgeStart ? '#FBBF24' : 'white'} strokeWidth={isEdgeStart ? 3 : 2} />
                            <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white font-bold text-sm select-none pointer-events-none">{node.id}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}


// import React, { useRef } from 'react';

// // Helper function to translate a browser click event into SVG coordinates.
// const getSVGCoordinates = (svg, event) => {
//     const pt = svg.createSVGPoint();
//     pt.x = event.clientX;
//     pt.y = event.clientY;
//     const screenCTM = svg.getScreenCTM();
//     return screenCTM ? pt.matrixTransform(screenCTM.inverse()) : null;
// };

// export default function GraphCanvas({ stepData, getGraphNodeState, getGraphEdgeState, onCanvasClick, onNodeClick, editMode, edgeStartNode }) {
//     const svgRef = useRef(null);

//     if (!stepData || !stepData.nodes) {
//         return <div className="flex items-center justify-center h-full">Loading Graph...</div>;
//     }

//     const handleCanvasClick = (event) => {
//         if (editMode === 'add-node' && svgRef.current && event.target.tagName === 'svg') {
//             const coords = getSVGCoordinates(svgRef.current, event);
//             if (coords) onCanvasClick(coords);
//         }
//     };

//     const handleNodeClick = (event, nodeId) => {
//         event.stopPropagation();
//         if (editMode === 'add-edge' || editMode === 'delete-node') {
//             onNodeClick(nodeId);
//         }
//     };

//     const cursorClass = {
//         'add-node': 'cursor-crosshair',
//         'add-edge': 'cursor-pointer',
//         'delete-node': 'cursor-not-allowed',
//         'idle': 'cursor-default',
//     }[editMode];

//     return (
//         <div className="flex items-center justify-center h-full w-full">
//             <svg ref={svgRef} viewBox="0 0 600 400" className={`w-full h-full ${cursorClass}`} onClick={handleCanvasClick}>
//                 {/* Render Edges */}
//                 {stepData.edges.map(edge => {
//                     const from = stepData.nodes.find(n => n.id === edge.from);
//                     const to = stepData.nodes.find(n => n.id === edge.to);
//                     if (!from || !to) return null;
//                     const edgeClass = getGraphEdgeState ? getGraphEdgeState(edge, stepData) : 'stroke-gray-600';
//                     return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`transition-all duration-300 ${edgeClass}`} strokeWidth="3" />;
//                 })}

//                 {/* Render Nodes */}
//                 {stepData.nodes.map(node => {
//                     const nodeClass = getGraphNodeState ? getGraphNodeState(node.id, stepData) : 'fill-gray-500';
//                     const isEdgeStart = editMode === 'add-edge' && edgeStartNode === node.id;
//                     return (
//                         <g key={node.id} onClick={(e) => handleNodeClick(e, node.id)}>
//                             <circle cx={node.x} cy={node.y} r="15" className={`transition-all duration-300 ${nodeClass}`} stroke={isEdgeStart ? '#FBBF24' : 'white'} strokeWidth={isEdgeStart ? 3 : 2} />
//                             <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white font-bold text-sm select-none pointer-events-none">{node.id}</text>
//                         </g>
//                     );
//                 })}
//             </svg>
//         </div>
//     );
// }


// // A simple layout algorithm, you might want a more sophisticated one
// const getGraphLayout = (nodes) => {
//     const radius = 150;
//     const width = 400;
//     const height = 400;
//     return nodes.map((node, i) => ({
//         ...node,
//         x: width / 2 + radius * Math.cos(2 * Math.PI * i / nodes.length),
//         y: height / 2 + radius * Math.sin(2 * Math.PI * i / nodes.length),
//     }));
// };

// export default function GraphCanvas({ stepData }) {
//     if (!stepData || !stepData.nodes) {
//         return <div className="flex items-center justify-center h-full">Loading Graph...</div>;
//     }

//     const layoutNodes = getGraphLayout(stepData.nodes);
//     const nodeMap = layoutNodes.reduce((acc, node) => ({ ...acc, [node.id]: node }), {});

//     const getNodeColor = (nodeId, state) => {
//         if (state.path?.includes(nodeId)) return 'fill-green-500';
//         if (state.current === nodeId) return 'fill-yellow-400';
//         if (state.visited?.includes(nodeId)) return 'fill-accent';
//         return 'fill-gray-500';
//     };

//     return (
//         <div className="flex items-center justify-center h-full w-full">
//             <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] max-h-[400px]">
//                 {/* Render Edges */}
//                 {stepData.edges.map(edge => {
//                     const from = nodeMap[edge.from];
//                     const to = nodeMap[edge.to];
//                     if (!from || !to) return null;
//                     return (
//                         <line
//                             key={`${edge.from}-${edge.to}`}
//                             x1={from.x} y1={from.y}
//                             x2={to.x} y2={to.y}
//                             className="stroke-gray-600" strokeWidth="2"
//                         />
//                     );
//                 })}
//                 {/* Render Nodes */}
//                 {layoutNodes.map(node => (
//                     <g key={node.id}>
//                         <circle
//                             cx={node.x} cy={node.y} r="15"
//                             className={`transition-colors duration-300 ${getNodeColor(node.id, stepData)}`}
//                             stroke="white" strokeWidth="2"
//                         />
//                         <text
//                             x={node.x} y={node.y + 5}
//                             textAnchor="middle"
//                             className="fill-white font-bold text-sm select-none"
//                         >
//                             {node.id}
//                         </text>
//                     </g>
//                 ))}
//             </svg>
//         </div>
//     );
// }