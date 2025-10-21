import { Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, CheckCircle, XCircle } from 'lucide-react';
import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../shared/SectionHeader';

const dijkstraComplexities = [
    {
        label: 'Binary Heap',
        complexity: 'O((V + E) log V)',
        formula: n => (n + n) * Math.log2(n), // (V + E) log V
        color: '#22C55E' // green-500
    },
    {
        label: 'Simple Array', 
        complexity: 'O(V²)',
        formula: n => n * n, // V²
        color: '#3B82F6' // blue-500
    },
    {
        label: 'Fibonacci Heap',
        complexity: 'O(E + V log V)', 
        formula: n => n + n * Math.log2(n), // E + V log V
        color: '#EF4444' // red-500
    },
];

const WeightedGraphVisualizer = () => {
    // Reusable Node component
    const Node = ({ id, state, x, y, distance }) => (
        <div 
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
        >
            <div className={`
                w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center text-sm font-bold transition-all duration-300 border-2
                ${state}
            `}>
                <span className="text-lg">{id}</span>
                {distance !== undefined && distance !== Infinity && (
                    <span className="text-xs bg-white/20 px-1 rounded">{distance}</span>
                )}
            </div>
        </div>
    );

    // Calculate edge points to node surfaces
    const calculateEdgePoints = (x1, y1, x2, y2, radius = 36) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const unitX = dx / distance;
        const unitY = dy / distance;
        
        return {
            startX: x1 + unitX * radius,
            startY: y1 + unitY * radius,
            endX: x2 - unitX * radius,
            endY: y2 - unitY * radius
        };
    };

    const WeightedEdge = ({ x1, y1, x2, y2, weight, highlight = false, relaxed = false }) => {
        const { startX, startY, endX, endY } = calculateEdgePoints(x1, y1, x2, y2);
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        return (
            <>
                <line 
                    x1={startX} y1={startY} x2={endX} y2={endY} 
                    className={
                        highlight ? "stroke-yellow-400" : 
                        relaxed ? "stroke-green-400" : 
                        "stroke-border"
                    } 
                    strokeWidth="3" 
                />
                <circle cx={midX} cy={midY} r="12" fill="white" stroke="gray" strokeWidth="1"/>
                <text x={midX} y={midY + 4} textAnchor="middle" className="text-xs font-bold fill-gray-800">
                    {weight}
                </text>
            </>
        );
    };

    // Graph layout positions
    const positions = {
        A: { x: 150, y: 80 },
        B: { x: 350, y: 80 }, 
        C: { x: 250, y: 180 },
        D: { x: 100, y: 280 },
        E: { x: 400, y: 280 }
    };

    const edges = [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'E', weight: 3 },
        { from: 'C', to: 'D', weight: 3 },
        { from: 'C', to: 'E', weight: 5 },
        { from: 'D', to: 'E', weight: 1 }
    ];

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-10">
            {/* Initial Graph */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Weighted Graph:</strong> Find shortest paths from source A to all other nodes.
                </p>
                <div className="relative w-full h-80 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        {edges.map((edge, i) => (
                            <WeightedEdge 
                                key={i}
                                x1={positions[edge.from].x} 
                                y1={positions[edge.from].y}
                                x2={positions[edge.to].x} 
                                y2={positions[edge.to].y}
                                weight={edge.weight}
                            />
                        ))}
                    </svg>
                    <Node id="A" x={150} y={80} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" distance={0} />
                    <Node id="B" x={350} y={80} state="bg-card border-border text-text-primary" distance="∞" />
                    <Node id="C" x={250} y={180} state="bg-card border-border text-text-primary" distance="∞" />
                    <Node id="D" x={100} y={280} state="bg-card border-border text-text-primary" distance="∞" />
                    <Node id="E" x={400} y={280} state="bg-card border-border text-text-primary" distance="∞" />
                </div>
                <p className="mt-2 text-center text-text-secondary text-sm">
                    Priority Queue: [A(0)] | All others have distance ∞
                </p>
            </div>

            {/* Step 1 - Process A */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 1:</strong> Extract A (distance 0). Relax edges A→B (weight 4) and A→C (weight 2).
                </p>
                <div className="relative w-full h-80 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <WeightedEdge x1={150} y1={80} x2={350} y2={80} weight={4} relaxed={true} />
                        <WeightedEdge x1={150} y1={80} x2={250} y2={180} weight={2} relaxed={true} />
                        <WeightedEdge x1={350} y1={80} x2={400} y2={280} weight={3} />
                        <WeightedEdge x1={250} y1={180} x2={100} y2={280} weight={3} />
                        <WeightedEdge x1={250} y1={180} x2={400} y2={280} weight={5} />
                        <WeightedEdge x1={100} y1={280} x2={400} y2={280} weight={1} />
                    </svg>
                    <Node id="A" x={150} y={80} state="bg-green-500/20 border-green-400 text-green-500" distance={0} />
                    <Node id="B" x={350} y={80} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={4} />
                    <Node id="C" x={250} y={180} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={2} />
                    <Node id="D" x={100} y={280} state="bg-card border-border text-text-primary" distance="∞" />
                    <Node id="E" x={400} y={280} state="bg-card border-border text-text-primary" distance="∞" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Priority Queue: [C(2), B(4)] | A is finalized</p>
            </div>

            {/* Step 2 - Process C */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 2:</strong> Extract C (distance 2). Relax C→D (2+3=5) and C→E (2+5=7).
                </p>
                <div className="relative w-full h-80 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <WeightedEdge x1={150} y1={80} x2={350} y2={80} weight={4} />
                        <WeightedEdge x1={150} y1={80} x2={250} y2={180} weight={2} />
                        <WeightedEdge x1={350} y1={80} x2={400} y2={280} weight={3} />
                        <WeightedEdge x1={250} y1={180} x2={100} y2={280} weight={3} relaxed={true} />
                        <WeightedEdge x1={250} y1={180} x2={400} y2={280} weight={5} relaxed={true} />
                        <WeightedEdge x1={100} y1={280} x2={400} y2={280} weight={1} />
                    </svg>
                    <Node id="A" x={150} y={80} state="bg-green-500/20 border-green-400 text-green-500" distance={0} />
                    <Node id="B" x={350} y={80} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={4} />
                    <Node id="C" x={250} y={180} state="bg-green-500/20 border-green-400 text-green-500" distance={2} />
                    <Node id="D" x={100} y={280} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={5} />
                    <Node id="E" x={400} y={280} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={7} />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Priority Queue: [B(4), D(5), E(7)] | A, C finalized</p>
            </div>

            {/* Step 3 - Process B */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 3:</strong> Extract B (distance 4). Relax B→E (4+3=7). No improvement since E already has distance 7.
                </p>
                <div className="relative w-full h-80 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <WeightedEdge x1={150} y1={80} x2={350} y2={80} weight={4} />
                        <WeightedEdge x1={150} y1={80} x2={250} y2={180} weight={2} />
                        <WeightedEdge x1={350} y1={80} x2={400} y2={280} weight={3} highlight={true} />
                        <WeightedEdge x1={250} y1={180} x2={100} y2={280} weight={3} />
                        <WeightedEdge x1={250} y1={180} x2={400} y2={280} weight={5} />
                        <WeightedEdge x1={100} y1={280} x2={400} y2={280} weight={1} />
                    </svg>
                    <Node id="A" x={150} y={80} state="bg-green-500/20 border-green-400 text-green-500" distance={0} />
                    <Node id="B" x={350} y={80} state="bg-green-500/20 border-green-400 text-green-500" distance={4} />
                    <Node id="C" x={250} y={180} state="bg-green-500/20 border-green-400 text-green-500" distance={2} />
                    <Node id="D" x={100} y={280} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={5} />
                    <Node id="E" x={400} y={280} state="bg-purple-500/20 border-purple-400 text-purple-500" distance={7} />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Priority Queue: [D(5), E(7)] | A, B, C finalized</p>
            </div>

            {/* Final Result */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Final Result:</strong> After processing D and E, all shortest distances are found!
                </p>
                <div className="relative w-full h-80 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <WeightedEdge x1={150} y1={80} x2={350} y2={80} weight={4} />
                        <WeightedEdge x1={150} y1={80} x2={250} y2={180} weight={2} />
                        <WeightedEdge x1={350} y1={80} x2={400} y2={280} weight={3} />
                        <WeightedEdge x1={250} y1={180} x2={100} y2={280} weight={3} />
                        <WeightedEdge x1={250} y1={180} x2={400} y2={280} weight={5} />
                        <WeightedEdge x1={100} y1={280} x2={400} y2={280} weight={1} />
                    </svg>
                    <Node id="A" x={150} y={80} state="bg-green-500/20 border-green-400 text-green-500" distance={0} />
                    <Node id="B" x={350} y={80} state="bg-green-500/20 border-green-400 text-green-500" distance={4} />
                    <Node id="C" x={250} y={180} state="bg-green-500/20 border-green-400 text-green-500" distance={2} />
                    <Node id="D" x={100} y={280} state="bg-green-500/20 border-green-400 text-green-500" distance={5} />
                    <Node id="E" x={400} y={280} state="bg-green-500/20 border-green-400 text-green-500" distance={6} />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">
                    <strong>Shortest Distances from A:</strong> A(0), B(4), C(2), D(5), E(6)
                </p>
            </div>
        </div>
    );
};

export default function DijkstraExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Dijkstra's Algorithm?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>
                        Dijkstra's Algorithm is a graph search algorithm that finds the shortest path between nodes in a weighted graph with non-negative edge weights. It systematically explores nodes in order of their distance from the source, ensuring that the shortest path to each node is found.
                    </p>
                    <p>
                        The algorithm uses a priority queue to always process the unvisited node with the smallest distance first. It's widely used in network routing protocols, GPS navigation systems, and social network analysis.
                    </p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <WeightedGraphVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-5 text-text-secondary">
                        <li>
                            <strong className="text-text-primary">Initialize Data Structures:</strong> Set up the necessary components for finding shortest paths.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Create a distance array initialized with infinity for all nodes except source (distance 0)</li>
                                <li>Initialize a priority queue and insert the source node with distance 0</li>
                                <li>Create a visited set to track finalized nodes</li>
                                <li>Optionally maintain a parent array for path reconstruction</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Main Processing Loop:</strong> Process nodes in order of their current shortest distance.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>While the priority queue is not empty, extract the node with minimum distance</li>
                                <li>Mark the extracted node as visited (its shortest distance is finalized)</li>
                                <li>Skip nodes that have already been processed</li>
                                <li>This greedy approach ensures optimal substructure property</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Edge Relaxation Process:</strong> Update distances to neighboring nodes through the current node.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>For each unvisited neighbor of the current node, calculate potential new distance</li>
                                <li>New distance = current node distance + edge weight to neighbor</li>
                                <li>If new distance is smaller than neighbor's current distance, update it</li>
                                <li>Update the priority queue with the improved distance</li>
                                <li>Set parent pointer for path reconstruction if needed</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Priority Queue Management:</strong> Efficiently maintain the ordering of unprocessed nodes.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Use a min-heap to always extract the node with smallest distance</li>
                                <li>Support decrease-key operation when distances are updated</li>
                                <li>Handle duplicate entries by checking if node is already visited</li>
                                <li>Modern implementations often use indexed priority queues</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Optimality Guarantee:</strong> Understand why the greedy approach produces optimal results.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>When a node is extracted from priority queue, its distance is optimal</li>
                                <li>No shorter path can exist through unprocessed nodes</li>
                                <li>This relies on non-negative edge weights assumption</li>
                                <li>Each node is processed exactly once, ensuring efficiency</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Termination and Path Reconstruction:</strong> Complete the algorithm and extract results.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Algorithm terminates when priority queue is empty or target is reached</li>
                                <li>Distance array contains shortest distances from source to all reachable nodes</li>
                                <li>Use parent array to reconstruct actual shortest paths</li>
                                <li>Handle unreachable nodes (distance remains infinity)</li>
                                <li>Consider early termination for single-target queries</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
                        <p>Depends heavily on the priority queue implementation used.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong>Binary Heap: O((V + E) log V)</strong></li>
                            <li><strong>Simple Array: O(V²)</strong></li>
                            <li><strong>Fibonacci Heap: O(E + V log V)</strong></li>
                        </ul>
                        <div className="mt-3 p-3 bg-background-secondary rounded">
                            <p className="text-sm">
                                <strong>Analysis:</strong> Each node is extracted once (V operations), each edge is relaxed at most once (E operations). 
                                Priority queue operations dominate the complexity.
                            </p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Space needed for distance array, priority queue, and auxiliary data structures.</p>
                        <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(V)</p>
                            <p className="mt-3">
                                <strong>Components:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Distance array: O(V)</li>
                                <li>Priority queue: O(V)</li>
                                <li>Visited set: O(V)</li>
                                <li>Parent array: O(V) optional</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={dijkstraComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Optimal Results</span> - Guarantees shortest paths with non-negative weights.</li>
                            <li><span className="font-semibold text-text-primary">Single-Source All-Destinations</span> - Finds shortest paths to all nodes in one run.</li>
                            <li><span className="font-semibold text-text-primary">Well-Established</span> - Proven algorithm with extensive real-world applications.</li>
                            <li><span className="font-semibold text-text-primary">Efficient Implementations</span> - Various priority queue optimizations available.</li>
                            <li><span className="font-semibold text-text-primary">Path Reconstruction</span> - Can easily reconstruct actual shortest paths.</li>
                            <li><span className="font-semibold text-text-primary">Early Termination</span> - Can stop when target node is reached.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Non-Negative Weights Only</span> - Cannot handle negative edge weights correctly.</li>
                            <li><span className="font-semibold text-text-primary">Time Complexity</span> - Can be slow for dense graphs compared to specialized algorithms.</li>
                            <li><span className="font-semibold text-text-primary">Memory Usage</span> - Requires storing distances and priority queue for all nodes.</li>
                            <li><span className="font-semibold text-text-primary">Static Graphs</span> - Not efficient for frequently changing graph structures.</li>
                            <li><span className="font-semibold text-text-primary">Single-Source Limitation</span> - Needs to run multiple times for all-pairs shortest paths.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
