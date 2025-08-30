import React from 'react';

// This is a specialized version of GraphCanvas for trees.
// It uses the same prop names for compatibility with your layout.
export default function TreeCanvas({ stepData, getGraphNodeState, getGraphEdgeState }) {
    if (!stepData || !stepData.nodes) {
        return <div className="flex items-center justify-center h-full text-text-secondary">Loading Tree...</div>;
    }

    const { nodes, edges, currentNodeId } = stepData;

    return (
        <div className="flex items-center justify-center h-full w-full">
            <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Render Edges */}
                {edges.map(edge => {
                    const from = nodes.find(n => n.id === edge.from);
                    const to = nodes.find(n => n.id === edge.to);
                    if (!from || !to) return null;
                    const edgeClass = getGraphEdgeState(edge, stepData);
                    return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`transition-all duration-300 ${edgeClass}`} strokeWidth="3" />;
                })}

                {/* Render Nodes */}
                {nodes.map(node => {
                    const nodeClass = getGraphNodeState(node.id, stepData);
                    const isCurrent = currentNodeId === node.id;
                    return (
                        <g key={node.id}>
                            <circle cx={node.x} cy={node.y} r="15" className={`transition-all duration-300 ${nodeClass}`} stroke={isCurrent ? '#FBBF24' : 'white'} strokeWidth={isCurrent ? 3 : 2} />
                            <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white font-bold text-sm select-none pointer-events-none">{node.id}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}