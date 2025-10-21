import { Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, CheckCircle, XCircle } from 'lucide-react';
import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../shared/SectionHeader';

const kruskalComplexities = [
    {
        label: 'All Cases',
        complexity: 'O(E log E)',
        formula: e => e * Math.log2(e),
        color: '#22C55E'
    }
];

const EdgeStepVisualizer = ({ edges, mstEdges, currentEdge, positions }) => (
    <div className="mt-8 p-4 bg-card/50 border border-border rounded-xl">
        <p className="mb-4 text-text-secondary">
            <strong className="text-text-primary">Current Edge:</strong> {currentEdge || 'None'}
        </p>
        <div className="relative w-full h-56 bg-background-secondary/20 rounded">
            <svg className="absolute inset-0 w-full h-full">
                {edges.map(({ from, to, weight }) => {
                    const start = positions[from];
                    const end = positions[to];
                    const inMST = mstEdges.some(e => e.from === from && e.to === to);
                    const color = inMST ? '#22C55E' : (currentEdge?.startsWith(`${from}-${to}`) ? '#FBBF24' : '#6B7280');
                    return (
                        <g key={`${from}-${to}`}>
                            <line
                                x1={start.x} y1={start.y}
                                x2={end.x}   y2={end.y}
                                stroke={color} strokeWidth="3"
                            />
                            <circle
                                cx={(start.x+end.x)/2}
                                cy={(start.y+end.y)/2}
                                r="12"
                                fill="white" stroke={color}
                            />
                            <text
                                x={(start.x+end.x)/2}
                                y={(start.y+end.y)/2+4}
                                textAnchor="middle"
                                className="text-xs font-bold fill-gray-800"
                            >
                                {weight}
                            </text>
                        </g>
                    );
                })}
                {Object.entries(positions).map(([id, {x,y}]) => (
                    <g key={id}>
                        <circle cx={x} cy={y} r="16" fill="#64748B" stroke="white" strokeWidth="3" />
                        <text x={x} y={y+5} textAnchor="middle" className="fill-white font-bold">
                            {id}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    </div>
);

export default function KruskalExplanation() {
    // Sample positions for visualization
    const positions = {
        A: { x: 120, y: 60 },
        B: { x: 320, y: 60 },
        C: { x: 220, y: 160 },
        D: { x:  70, y: 260 },
        E: { x: 370, y: 260 }
    };

    // Example data for visualizer
    const edges = [
        { from: 'A', to: 'C', weight: 2 },
        { from: 'D', to: 'E', weight: 1 },
        { from: 'A', to: 'B', weight: 4 },
        { from: 'B', to: 'E', weight: 3 },
        { from: 'C', to: 'D', weight: 3 },
        { from: 'B', to: 'C', weight: 5 },
        { from: 'C', to: 'E', weight: 6 }
    ];
    const currentEdge = 'D-E(1)';
    const mstEdges = [
        { from: 'D', to: 'E', weight: 1 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'E', weight: 3 },
        { from: 'A', to: 'B', weight: 4 }
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-12 animate-fade-in-up">
            <section>
                <SectionHeader title="What is Kruskal’s Algorithm?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>
                        Kruskal’s Algorithm finds a Minimum Spanning Tree (MST) for an <strong>undirected</strong> weighted graph.
                        It sorts all edges by weight and picks the smallest edge that doesn’t form a cycle, using a Disjoint‐Set (Union‐Find) structure.
                    </p>
                    <p>
                        Because it always chooses the globally smallest valid edge, Kruskal’s Algorithm guarantees the lightest possible spanning tree.
                    </p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <EdgeStepVisualizer 
                    edges={edges} 
                    mstEdges={mstEdges} 
                    currentEdge={currentEdge} 
                    positions={positions} 
                />
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl p-6 space-y-6 hover:shadow-lg transition">
                    <ol className="list-decimal list-outside pl-6 space-y-5 text-text-secondary">
                        <li>
                            <strong>Sort All Edges:</strong> Arrange edges in non-decreasing order by weight.
                        </li>
                        <li>
                            <strong>Initialize Disjoint-Set:</strong> Make each vertex its own set.
                        </li>
                        <li>
                            <strong>Process Sorted Edges:</strong> For each edge (u,v):
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2 text-sm">
                                <li>If u and v are in different sets, union them and add edge to MST.</li>
                                <li>If they are already connected, skip to avoid cycles.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Stop:</strong> Once MST has V–1 edges, or all edges considered.
                        </li>
                    </ol>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition space-y-3">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/>Time Complexity</h3>
                        <p>
                            Sorting E edges: O(E log E). Union-Find operations: near O(1) each.
                        </p>
                        <ul className="list-none mt-2 space-y-1 text-sm">
                            <li><strong>Overall:</strong> O(E log E)</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition space-y-3">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/>Space Complexity</h3>
                        <p>
                            Stores edge list, parent array for DSU, and MST edges.
                        </p>
                        <ul className="list-none mt-2 space-y-1 text-sm">
                            <li><strong>Overall:</strong> O(V + E)</li>
                        </ul>
                    </div>
                </div>
                <TimeComplexityGraph complexities={kruskalComplexities} />
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition space-y-2">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-2"><CheckCircle />Pros</h3>
                        <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
                            <li>Optimal MST for any undirected weighted graph.</li>
                            <li>Stops early when MST is complete (V-1 edges).</li>
                            <li>Simple to implement with sort + DSU.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition space-y-2">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-2"><XCircle />Cons</h3>
                        <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
                            <li>Only for <em>undirected</em> graphs.</li>
                            <li>Sorting cost dominates: O(E log E).</li>
                            <li>Union-Find constants matter for large inputs.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}