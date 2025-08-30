import { BarChart3, Scale, CheckCircle2, XCircle, Layers } from "lucide-react";
import { KeyCharacteristicCard } from '../../visualizers/sorting/BubbleSortPage'; // Reuse the card component

// Custom SVG diagram component for graph concepts, showing a Stack
const GraphDiagram = ({ nodes, edges, stack, caption }) => (
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
            <p className="text-sm font-semibold text-text-primary">Stack (Last-In, First-Out)</p>
            <div className="mt-1 flex flex-col-reverse gap-1 items-center justify-end p-2 bg-background rounded-md min-h-[100px]">
                {stack.length > 0 ? stack.map((nodeId, i) => (
                    <div key={i} className="w-24 h-7 flex items-center justify-center bg-card-light text-text-primary font-mono rounded">{nodeId}</div>
                )) : <span className="text-xs text-text-secondary">empty</span>}
            </div>
            <p className="text-xs text-text-secondary mt-2">{caption}</p>
        </div>
    </div>
);

export default function DFSExplanation() {
    const dfsInfo = {
        summary: "Depth-First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (often implicitly via recursion) to keep track of nodes, following one path to its deepest point before exploring alternatives.",
        howItWorks: ["Begin at a starting node, push it onto a stack, and mark it as visited.", "While the stack is not empty, pop a node from the top of the stack (let's call it the 'parent').", "For each of the parent's unvisited neighbors: mark it as visited and push it onto the stack.", "The key is that the most recently discovered neighbor is the next one to be processed.", "Repeat until the stack is empty."],
        characteristics: {
            timeComplexity: { value: "O(V + E)", description: "V = Vertices, E = Edges. It visits every vertex and edge once." },
            spaceComplexity: { value: "O(V)", description: "In the worst case, the stack can hold all vertices of the graph (for a path-like graph)." },
            type: { value: "Traversal", description: "Can find paths between nodes, but not necessarily the shortest path." },
        },
        pros: ["Excellent for pathfinding, maze solving, or checking if a graph is connected.", "Uses less memory than BFS on average for graphs that are very wide.", "Can be implemented elegantly with recursion."],
        cons: ["Does not guarantee finding the shortest path between two nodes.", "Can get trapped in very long paths before exploring closer nodes."],
    };

    return (
        <div className="space-y-16">
            <p className="text-center text-lg text-text-secondary max-w-3xl mx-auto">{dfsInfo.summary}</p>
            <div>
                <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Key Characteristics</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <KeyCharacteristicCard icon={<BarChart3 size={24} className="text-accent"/>} title="Time Complexity" value={dfsInfo.characteristics.timeComplexity.value} valueColor="text-red-500">{dfsInfo.characteristics.timeComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<Scale size={24} className="text-accent"/>} title="Space Complexity" value={dfsInfo.characteristics.spaceComplexity.value} valueColor="text-green-500">{dfsInfo.characteristics.spaceComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<Layers size={24} className="text-accent"/>} title="Algorithm Type" value={dfsInfo.characteristics.type.value} valueColor="text-blue-500">{dfsInfo.characteristics.type.description}</KeyCharacteristicCard>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary text-center mb-4">How It Works: The Core Logic</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <ol className="list-decimal list-inside space-y-2 pl-2 text-text-secondary">{dfsInfo.howItWorks.map((step, i) => <li key={i}>{step}</li>)}</ol>
                    <div className="space-y-6">
                        <GraphDiagram 
                            nodes={{ A: { id: 'A', x: 100, y: 20, color: 'fill-yellow-400'}, B: { id: 'B', x: 50, y: 90, color: 'fill-gray-500' }, C: { id: 'C', x: 150, y: 90, color: 'fill-gray-500' } }}
                            edges={[{ id: 1, from: 'A', to: 'B', color: 'stroke-purple-500'}, { id: 2, from: 'A', to: 'C', color: 'stroke-purple-500'}]}
                            stack={['C', 'B']}
                            caption="Process A. Push unvisited neighbors C then B onto the stack. B is now on top."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Pros</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{dfsInfo.pros.map((pro, index) => <li key={index}>{pro}</li>)}</ul></div>
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><XCircle className="text-red-500"/> Cons</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{dfsInfo.cons.map((con, index) => <li key={index}>{con}</li>)}</ul></div>
            </div>
        </div>
    );
}