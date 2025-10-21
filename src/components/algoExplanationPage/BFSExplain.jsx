import { Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, CheckCircle, XCircle } from 'lucide-react';
import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../shared/SectionHeader';

const bfsComplexities = [
    {
        label: 'Best Case',
        complexity: 'O(V + E)',
        formula: n => n + (n-1), // V + E for tree
        color: '#22C55E' // green-500
    },
    {
        label: 'Average Case', 
        complexity: 'O(V + E)',
        formula: n => n + n, // V + E general
        color: '#3B82F6' // blue-500
    },
    {
        label: 'Worst Case',
        complexity: 'O(V + E)', 
        formula: n => n + n*n/2, // V + E for dense graph
        color: '#EF4444' // red-500
    },
];

const TreeStepVisualizer = () => {
    // Reusable Node component for tree visualization
    const Node = ({ id, state, x, y }) => (
        <div 
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
        >
            <div className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 border-2
                ${state}
            `}>
                {id}
            </div>
        </div>
    );

    // Calculate edge points to node surfaces (radius = 28px for sm:w-14 sm:h-14)
    const calculateEdgePoints = (x1, y1, x2, y2, radius = 28) => {
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

    const Edge = ({ x1, y1, x2, y2, highlight = false }) => {
        const { startX, startY, endX, endY } = calculateEdgePoints(x1, y1, x2, y2);
        return (
            <line 
                x1={startX} y1={startY} x2={endX} y2={endY} 
                className={highlight ? "stroke-yellow-400" : "stroke-border"} 
                strokeWidth="2" 
            />
        );
    };

    // Tree layout positions
    const positions = {
        A: { x: 300, y: 60 },
        B: { x: 200, y: 140 }, 
        C: { x: 400, y: 140 },
        D: { x: 150, y: 220 },
        E: { x: 250, y: 220 },
        F: { x: 400, y: 220 }
    };

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-10">
            {/* Initial Tree */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Tree Structure:</strong> We'll traverse this tree level by level starting from root A.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    {Object.entries(positions).map(([id, pos]) => (
                        <Node key={id} id={id} x={pos.x} y={pos.y} state="bg-card border-border text-text-primary" />
                    ))}
                </div>
                <p className="mt-2 text-center text-text-secondary text-sm">
                    Level 0: A | Level 1: B, C | Level 2: D, E, F
                </p>
            </div>

            {/* Step 1 - Start with A */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 1:</strong> Start BFS from root A. Enqueue A and mark it visited.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="B" x={200} y={140} state="bg-card border-border text-text-primary" />
                    <Node id="C" x={400} y={140} state="bg-card border-border text-text-primary" />
                    <Node id="D" x={150} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="E" x={250} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Queue: [A] | Visited: {'A'} | Current level: 0</p>
            </div>

            {/* Step 2 - Process A, discover B and C */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 2:</strong> Dequeue A. Discover its children B and C. Enqueue both.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} highlight={true} />
                        <Edge x1={300} y1={60} x2={400} y2={140} highlight={true} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="C" x={400} y={140} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="D" x={150} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="E" x={250} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Queue: [B, C] | Visited: {'A, B, C'} | Current level: 1</p>
            </div>

            {/* Step 3 - Process B, discover D and E */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 3:</strong> Dequeue B. Discover its children D and E. Enqueue both.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} highlight={true} />
                        <Edge x1={200} y1={140} x2={250} y2={220} highlight={true} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="C" x={400} y={140} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="D" x={150} y={220} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="E" x={250} y={220} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Queue: [C, D, E] | Visited: {'A, B, C, D, E'} | Processing level 1 → 2</p>
            </div>

            {/* Step 4 - Process C, discover F */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 4:</strong> Dequeue C. Discover its child F. Enqueue F.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} highlight={true} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="C" x={400} y={140} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="D" x={150} y={220} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="E" x={250} y={220} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                    <Node id="F" x={400} y={220} state="bg-purple-500/20 border-purple-400 text-purple-500" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Queue: [D, E, F] | Visited: {'A, B, C, D, E, F'} | All level 2 nodes discovered</p>
            </div>

            {/* Final Result */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Final Result:</strong> Process remaining queue (D, E, F have no children). BFS complete!
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="C" x={400} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="D" x={150} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="E" x={250} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="F" x={400} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">
                    <strong>Traversal Order:</strong> A → B, C → D, E, F | <strong>Distances from A:</strong> A(0), B,C(1), D,E,F(2)
                </p>
            </div>
        </div>
    );
};


export default function BFSExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is BFS?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>
                        Breadth-First Search (BFS) is a graph traversal algorithm that explores vertices level by level, starting from a chosen source vertex. It uses a queue data structure to ensure that all vertices at distance k from the source are visited before any vertex at distance k+1.
                    </p>
                    <p>
                        BFS is particularly useful for finding the shortest path between two vertices in unweighted graphs, level-order traversal of trees, and determining connectivity in graphs. The algorithm systematically explores the graph by expanding the frontier one layer at a time.
                    </p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <TreeStepVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-5 text-text-secondary">
                        <li>
                            <strong className="text-text-primary">Initialize Data Structures:</strong> Set up the necessary components for BFS traversal and tracking.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Choose a source vertex s to begin the traversal</li>
                                <li>Create an empty queue Q to manage the order of vertex processing</li>
                                <li>Initialize a visited set or boolean array to track processed vertices</li>
                                <li>Optionally create parent array for path reconstruction and level array for distance tracking</li>
                                <li>Enqueue the source vertex s and mark it as visited</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Main Processing Loop:</strong> Process vertices from the queue in first-in-first-out order to maintain level-by-level exploration.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>While the queue Q is not empty, continue processing</li>
                                <li>Dequeue the front vertex u from Q - this becomes the current vertex being explored</li>
                                <li>The dequeue operation ensures vertices are processed in the order they were discovered</li>
                                <li>This FIFO behavior is crucial for maintaining the level-order property of BFS</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Neighbor Discovery and Processing:</strong> Systematically explore all adjacent vertices of the current vertex.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>For each neighbor vertex v of the current vertex u, check if it has been visited</li>
                                <li>If v is unvisited, mark it as visited to prevent reprocessing</li>
                                <li>Set parent[v] = u to maintain the BFS tree structure for path reconstruction</li>
                                <li>Set level[v] = level[u] + 1 to track the distance from the source</li>
                                <li>Enqueue v to ensure it will be processed in the next level</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Level-by-Level Guarantee:</strong> Understand how BFS ensures shortest paths in unweighted graphs.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>All vertices at distance d from source are processed before any vertex at distance d+1</li>
                                <li>This property guarantees that the first time a vertex is discovered, it's via a shortest path</li>
                                <li>The level array maintains the shortest distance from source to each vertex</li>
                                <li>Parent pointers form a BFS tree rooted at the source vertex</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Termination and Results:</strong> Handle the completion of BFS and extract useful information.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>The algorithm terminates when the queue becomes empty</li>
                                <li>At this point, all vertices reachable from the source have been visited</li>
                                <li>For disconnected graphs, additional BFS calls may be needed from unvisited vertices</li>
                                <li>The visited array indicates which vertices are reachable from the source</li>
                                <li>Parent and level arrays can be used for path reconstruction and distance queries</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Implementation Considerations:</strong> Handle edge cases and optimize for practical use.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Use consistent neighbor ordering for reproducible traversals in visualizations</li>
                                <li>Handle self-loops by checking if neighbor equals current vertex</li>
                                <li>For weighted graphs, note that BFS finds shortest paths only in terms of edge count</li>
                                <li>Consider early termination if searching for a specific target vertex</li>
                                <li>Memory usage is bounded by the maximum width of any level in the graph</li>
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
                        <p>BFS visits each vertex and edge exactly once in the worst case.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong>All Cases: O(V + E)</strong></li>
                            <li>V = number of vertices (each visited once)</li>
                            <li>E = number of edges (each examined once)</li>
                            <li>Linear time relative to the size of the graph</li>
                        </ul>
                        <div className="mt-3 p-3 bg-background-secondary rounded">
                            <p className="text-sm">
                                <strong>Detailed Analysis:</strong> Each vertex is enqueued and dequeued exactly once (O(V)). 
                                For each vertex, all its edges are examined once (O(E) total). 
                                Queue operations are O(1), so total time is O(V + E).
                            </p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Space needed for queue, visited array, and optional auxiliary arrays.</p>
                        <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(V)</p>
                            <p className="mt-3">
                                <strong>Components:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Queue: O(V) in worst case</li>
                                <li>Visited array: O(V)</li>
                                <li>Parent array: O(V) optional</li>
                                <li>Level array: O(V) optional</li>
                            </ul>
                        </div>
                        <div className="mt-3 p-3 bg-background-secondary rounded">
                            <p className="text-sm">
                                <strong>Queue Size:</strong> Maximum queue size occurs when processing a level with many vertices, 
                                such as the leaves of a complete binary tree or a star graph center.
                            </p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={bfsComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Shortest Path Guarantee</span> - Finds shortest paths in unweighted graphs optimally.</li>
                            <li><span className="font-semibold text-text-primary">Complete and Optimal</span> - Always finds a solution if one exists, and finds the shortest one first.</li>
                            <li><span className="font-semibold text-text-primary">Level-Order Structure</span> - Natural level-by-level exploration useful for many applications.</li>
                            <li><span className="font-semibold text-text-primary">Linear Time Complexity</span> - O(V + E) is optimal for graph traversal algorithms.</li>
                            <li><span className="font-semibold text-text-primary">Versatile Applications</span> - Connectivity, shortest paths, level traversal, and graph analysis.</li>
                            <li><span className="font-semibold text-text-primary">Easy to Implement</span> - Straightforward algorithm with simple queue-based logic.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">High Memory Usage</span> - Queue can grow very large in graphs with wide levels (like star graphs).</li>
                            <li><span className="font-semibold text-text-primary">Not Suitable for Weighted Graphs</span> - Cannot find shortest paths when edges have different weights.</li>
                            <li><span className="font-semibold text-text-primary">Explores Unnecessary Nodes</span> - May visit many irrelevant nodes when searching for a specific target.</li>
                            <li><span className="font-semibold text-text-primary">Poor for Deep Graphs</span> - Less efficient than DFS for very deep, narrow graphs or trees.</li>
                            <li><span className="font-semibold text-text-primary">Cache Performance</span> - Random access pattern can lead to poor cache locality compared to DFS.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}