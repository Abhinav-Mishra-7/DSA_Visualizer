import { Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, CheckCircle, XCircle } from 'lucide-react';
import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../shared/SectionHeader';

const dfsComplexities = [
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
                    <strong className="text-text-primary">Tree Structure:</strong> We'll traverse this tree depth-first starting from root A.
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
                    DFS explores as deep as possible before backtracking
                </p>
            </div>

            {/* Step 1 - Start with A */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 1:</strong> Start DFS from root A. Push A onto stack and mark it visited.
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
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Stack: [A] | Visited: {'A'} | Current: A</p>
            </div>

            {/* Step 2 - Go to B */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 2:</strong> From A, go to first unvisited child B. Push B onto stack.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} highlight={true} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="C" x={400} y={140} state="bg-card border-border text-text-primary" />
                    <Node id="D" x={150} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="E" x={250} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Stack: [A, B] | Visited: {'A, B'} | Current: B</p>
            </div>

            {/* Step 3 - Go to D */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 3:</strong> From B, go deeper to first unvisited child D. Push D onto stack.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} highlight={true} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="C" x={400} y={140} state="bg-card border-border text-text-primary" />
                    <Node id="D" x={150} y={220} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="E" x={250} y={220} state="bg-card border-border text-text-primary" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Stack: [A, B, D] | Visited: {'A, B, D'} | Current: D (leaf node)</p>
            </div>

            {/* Step 4 - Backtrack to B, then go to E */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 4:</strong> D has no children. Backtrack to B, then visit E.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} highlight={true} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="C" x={400} y={140} state="bg-card border-border text-text-primary" />
                    <Node id="D" x={150} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="E" x={250} y={220} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Stack: [A, B, E] | Visited: {'A, B, D, E'} | Current: E (leaf node)</p>
            </div>

            {/* Step 5 - Backtrack to A, then go to C */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 5:</strong> E has no children. Backtrack to A, then visit C.
                </p>
                <div className="relative w-full h-64 bg-background-secondary/20 border border-border rounded">
                    <svg className="absolute inset-0 w-full h-full">
                        <Edge x1={300} y1={60} x2={200} y2={140} />
                        <Edge x1={300} y1={60} x2={400} y2={140} highlight={true} />
                        <Edge x1={200} y1={140} x2={150} y2={220} />
                        <Edge x1={200} y1={140} x2={250} y2={220} />
                        <Edge x1={400} y1={140} x2={400} y2={220} />
                    </svg>
                    <Node id="A" x={300} y={60} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="B" x={200} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="C" x={400} y={140} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                    <Node id="D" x={150} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="E" x={250} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="F" x={400} y={220} state="bg-card border-border text-text-primary" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Stack: [A, C] | Visited: {'A, B, D, E, C'} | Current: C</p>
            </div>

            {/* Step 6 - Go to F */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 6:</strong> From C, go to its child F. All nodes visited!
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
                    <Node id="C" x={400} y={140} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="D" x={150} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="E" x={250} y={220} state="bg-green-500/20 border-green-400 text-green-500" />
                    <Node id="F" x={400} y={220} state="bg-yellow-500/20 border-yellow-400 text-yellow-500" />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">
                    <strong>Traversal Order:</strong> A → B → D → E → C → F | <strong>DFS Complete!</strong>
                </p>
            </div>

            {/* Final Result */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Final Result:</strong> DFS explores each branch completely before moving to the next branch.
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
                    <strong>Key Difference:</strong> DFS goes deep first (A→B→D), then backtracks, unlike BFS which goes level by level
                </p>
            </div>
        </div>
    );
};

export default function DFSExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is DFS?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>
                        Depth-First Search (DFS) is a graph traversal algorithm that explores as far down each branch as possible before backtracking. It uses a stack (either explicit or through recursion) to keep track of vertices to visit next.
                    </p>
                    <p>
                        DFS is particularly useful for topological sorting, cycle detection, finding connected components, and solving maze-like problems. The algorithm systematically explores each branch completely before moving to the next branch.
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
                            <strong className="text-text-primary">Initialize Data Structures:</strong> Set up the necessary components for DFS traversal and tracking.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Choose a source vertex s to begin the traversal</li>
                                <li>Create a stack (explicit or use recursion call stack) to manage the order of vertex processing</li>
                                <li>Initialize a visited set or boolean array to track processed vertices</li>
                                <li>Optionally create parent array for path reconstruction and timestamps for ordering</li>
                                <li>Push the source vertex s onto stack and mark it as visited</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Main Processing Loop:</strong> Process vertices from the stack in last-in-first-out order to maintain depth-first exploration.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>While the stack is not empty, continue processing</li>
                                <li>Pop the top vertex u from the stack - this becomes the current vertex being explored</li>
                                <li>The LIFO behavior ensures we go as deep as possible before backtracking</li>
                                <li>This stack-based approach naturally implements the depth-first strategy</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Neighbor Exploration Strategy:</strong> Systematically explore adjacent vertices while prioritizing depth over breadth.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>For each neighbor vertex v of the current vertex u, check if it has been visited</li>
                                <li>If v is unvisited, mark it as visited to prevent cycles</li>
                                <li>Set parent[v] = u to maintain the DFS tree structure</li>
                                <li>Push v onto the stack to continue exploration from v next</li>
                                <li>The order of neighbor processing affects the traversal path</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Depth-First Guarantee:</strong> Understand how DFS ensures complete branch exploration before backtracking.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>DFS explores each branch completely before moving to sibling branches</li>
                                <li>Backtracking occurs naturally when no unvisited neighbors remain</li>
                                <li>The stack automatically returns to previous decision points</li>
                                <li>Parent pointers form a DFS tree showing the exploration path</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Recursive Implementation Alternative:</strong> Understand the recursive approach which is often more intuitive.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>DFS can be implemented recursively using the system call stack</li>
                                <li>Base case: mark current vertex as visited and process it</li>
                                <li>Recursive case: for each unvisited neighbor, call DFS recursively</li>
                                <li>Recursion naturally handles backtracking when function calls return</li>
                                <li>Stack overflow can occur with very deep graphs in recursive implementation</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong className="text-text-primary">Applications and Variations:</strong> Leverage DFS for various graph algorithms and problem-solving techniques.
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                                <li>Topological sorting in directed acyclic graphs using finish timestamps</li>
                                <li>Cycle detection by checking for back edges to visited vertices</li>
                                <li>Finding strongly connected components using DFS and transpose graph</li>
                                <li>Maze solving and pathfinding by exploring all possible routes</li>
                                <li>Tree and graph analysis for structural properties</li>
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
                        <p>DFS visits each vertex and examines each edge exactly once in the worst case.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong>All Cases: O(V + E)</strong></li>
                            <li>V = number of vertices (each visited once)</li>
                            <li>E = number of edges (each examined once)</li>
                            <li>Linear time relative to the size of the graph</li>
                        </ul>
                        <div className="mt-3 p-3 bg-background-secondary rounded">
                            <p className="text-sm">
                                <strong>Detailed Analysis:</strong> Each vertex is pushed and popped from stack exactly once (O(V)). 
                                For each vertex, all its edges are examined once (O(E) total). 
                                Stack operations are O(1), so total time is O(V + E).
                            </p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Space needed for stack, visited array, and recursion depth.</p>
                        <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(V)</p>
                            <p className="mt-3">
                                <strong>Components:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Stack: O(V) in worst case</li>
                                <li>Visited array: O(V)</li>
                                <li>Recursion depth: O(V) for deep paths</li>
                                <li>Parent array: O(V) optional</li>
                            </ul>
                        </div>
                        <div className="mt-3 p-3 bg-background-secondary rounded">
                            <p className="text-sm">
                                <strong>Stack Depth:</strong> Maximum stack size occurs in linear graphs (like linked lists) 
                                where DFS must go V levels deep before backtracking.
                            </p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={dfsComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Memory Efficient</span> - Uses less memory than BFS for deep, narrow graphs.</li>
                            <li><span className="font-semibold text-text-primary">Natural Recursion</span> - Can be implemented elegantly using recursive functions.</li>
                            <li><span className="font-semibold text-text-primary">Topological Sorting</span> - Essential for ordering tasks with dependencies.</li>
                            <li><span className="font-semibold text-text-primary">Cycle Detection</span> - Excellent for detecting cycles in graphs using back edges.</li>
                            <li><span className="font-semibold text-text-primary">Path Finding</span> - Good for finding any path between two vertices.</li>
                            <li><span className="font-semibold text-text-primary">Linear Time Complexity</span> - O(V + E) is optimal for graph traversal.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">No Shortest Path Guarantee</span> - Does not necessarily find shortest paths in unweighted graphs.</li>
                            <li><span className="font-semibold text-text-primary">Stack Overflow Risk</span> - Recursive implementation can cause stack overflow in deep graphs.</li>
                            <li><span className="font-semibold text-text-primary">Poor for Level Analysis</span> - Does not naturally provide level-by-level information.</li>
                            <li><span className="font-semibold text-text-primary">May Get Trapped</span> - Can go very deep in one direction before exploring other options.</li>
                            <li><span className="font-semibold text-text-primary">Order Dependent</span> - Traversal order depends on how neighbors are ordered.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
