import React from 'react';
import { BarChart3, Scale, CheckCircle2, XCircle, GitBranch } from "lucide-react";

// This component is likely shared. Ensure the import path is correct for your project structure.
// If it's not in its own file, you can define it here directly.
export const KeyCharacteristicCard = ({ icon, title, value, valueColor, children }) => (
    <div className="bg-card border border-border rounded-xl p-6 flex-grow flex-shrink-0 basis-full md:basis-[30%] shadow-md hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4 mb-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">{icon}</div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <p className={`text-3xl font-bold font-mono ${valueColor}`}>{value}</p>
        <p className="text-sm text-text-secondary mt-1">{children}</p>
    </div>
);

// A custom SVG diagram component specifically for graph concepts
const GraphDiagram = ({ nodes, edges, queue, caption }) => (
    <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 120" className="w-full max-w-xs">
            {edges.map(edge => (
                <line key={edge.id} x1={nodes[edge.from].x} y1={nodes[edge.from].y} x2={nodes[edge.to].x} y2={nodes[edge.to].y} className={`stroke-2 ${edge.color}`} />
            ))}
            {Object.values(nodes).map(node => (
                <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r="12" className={node.color} />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" className="text-xs font-bold fill-white">{node.id}</text>
                </g>
            ))}
        </svg>
        <div className="mt-2 text-center">
            <p className="text-sm font-semibold text-text-primary">Queue</p>
            <div className="mt-1 flex gap-2 items-center justify-center p-2 bg-background rounded-md min-h-[36px]">
                {queue.length > 0 ? queue.map((nodeId, i) => (
                    <div key={i} className="w-7 h-7 flex items-center justify-center bg-card-light text-text-primary font-mono rounded">{nodeId}</div>
                )) : <span className="text-xs text-text-secondary">empty</span>}
            </div>
            <p className="text-xs text-text-secondary mt-2">{caption}</p>
        </div>
    </div>
);

// This is the main explanation component. It only returns JSX.
export default function BFSExplanation() {
    const bfsInfo = {
        summary: "Breadth-First Search is a fundamental graph traversal algorithm that explores neighbors level by level. It starts at a source node and explores all its immediate neighbors before moving on to their neighbors, ensuring it finds the shortest path in an unweighted graph.",
        howItWorks: ["Begin at a starting node and add it to a queue.", "Mark the starting node as visited.", "While the queue is not empty, remove the first node from the queue (let's call it the 'parent').", "For each of the parent's unvisited neighbors: mark it as visited and add it to the back of the queue.", "Repeat until the queue is empty."],
        characteristics: {
            timeComplexity: { value: "O(V + E)", description: "V = Vertices, E = Edges. It visits every vertex and edge once." },
            spaceComplexity: { value: "O(V)", description: "In the worst case, the queue can hold all vertices of the graph." },
            type: { value: "Traversal", description: "It's a complete traversal algorithm, meaning it visits every reachable node." },
        },
        pros: ["Guarantees finding the shortest path in an unweighted graph.", "Simple to implement using a queue.", "Useful in many applications like finding connected components and cycle detection."],
        cons: ["Can consume a lot of memory if the graph is wide (many nodes at one level).", "Not suitable for weighted graphs if the goal is to find the shortest path (Dijkstra's is used instead)."],
    };

    return (
        <div className="space-y-16">
            <p className="text-center text-lg text-text-secondary max-w-3xl mx-auto">{bfsInfo.summary}</p>
            <div>
                <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Key Characteristics</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <KeyCharacteristicCard icon={<BarChart3 size={24} className="text-accent"/>} title="Time Complexity" value={bfsInfo.characteristics.timeComplexity.value} valueColor="text-red-500">{bfsInfo.characteristics.timeComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<Scale size={24} className="text-accent"/>} title="Space Complexity" value={bfsInfo.characteristics.spaceComplexity.value} valueColor="text-green-500">{bfsInfo.characteristics.spaceComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<GitBranch size={24} className="text-accent"/>} title="Algorithm Type" value={bfsInfo.characteristics.type.value} valueColor="text-blue-500">{bfsInfo.characteristics.type.description}</KeyCharacteristicCard>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary text-center mb-4">How It Works: The Core Logic</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <ol className="list-decimal list-inside space-y-2 pl-2 text-text-secondary">
                        {bfsInfo.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                    <div className="space-y-6">
                        <GraphDiagram 
                            nodes={{ A: { id: 'A', x: 100, y: 20, color: 'fill-yellow-400'}, B: { id: 'B', x: 50, y: 90, color: 'fill-gray-500' }, C: { id: 'C', x: 150, y: 90, color: 'fill-gray-500' } }}
                            edges={[{ id: 1, from: 'A', to: 'B', color: 'stroke-purple-500'}, { id: 2, from: 'A', to: 'C', color: 'stroke-purple-500'}]}
                            queue={['B', 'C']}
                            caption="Process node A. Add its unvisited neighbors (B, C) to the queue."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Pros</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{bfsInfo.pros.map((pro, index) => <li key={index}>{pro}</li>)}</ul></div>
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><XCircle className="text-red-500"/> Cons</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{bfsInfo.cons.map((con, index) => <li key={index}>{con}</li>)}</ul></div>
            </div>
        </div>
    );
}