import { CheckCircle, XCircle, Clock, BrainCircuit, Zap, Workflow, ListChecks, Scale, Shuffle, ArrowRight, Binary } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph';

const heapSortComplexities = [
    { label: 'Best Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#22C55E' },
    { label: 'Average Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#3B82F6' },
    { label: 'Worst Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#EF4444' },
];

const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-4 animate-fade-in-from-left">
        <div className="w-1.5 h-8 bg-accent rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            {icon} {title}
        </h2>
    </div>
);

const HeapSortBubble = ({ number, state = 'default' }) => {
    const styles = {
        default: 'bg-card border-border text-text-primary border-2',
        root: 'border-purple-400 bg-purple-500/10 text-purple-500 border-2 shadow-md shadow-purple-600',
        child: 'border-blue-400 bg-blue-500/10 text-blue-400 border-2',
        largest: 'border-yellow-400 bg-yellow-500/10 text-yellow-400 border-2',
        swap: 'border-red-400 bg-red-500/10 text-red-400 border-2 animate-pulse',
        sorted: 'border-green-400 bg-green-500/10 text-green-500 border-2 shadow-md shadow-green-500/20',
        final: 'border-green-400 bg-green-500/10 text-green-500 border-1 shadow-md shadow-green-600',
    };
    return (
        <div className={`
            w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 z-10
            ${styles[state]}
        `}>
            {number}
        </div>
    );
};

const ArrayChunk = ({ numbers, states = [] }) => (
    <div className="flex justify-center flex-wrap gap-2">
        {numbers.map((n, i) => (
            <HeapSortBubble key={i} number={n} state={states[i] || 'default'} />
        ))}
    </div>
);

const HeapTree = ({ numbers, states = [] }) => {
    const nodePositions = [
        { top: '0%', left: '50%' },   // Node 0
        { top: '35%', left: '25%' },  // Node 1
        { top: '35%', left: '75%' },  // Node 2
        { top: '70%', left: '12.5%' },// Node 3
        { top: '70%', left: '37.5%' },// Node 4
    ];

    const lines = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
    ].filter(line => line.from < numbers.length && line.to < numbers.length);

    return (
        <div className="relative w-full max-w-sm mx-auto h-72 sm:h-80">
            <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                {lines.map((line, i) => {
                    // Check if the destination node is a left or right child
                    // Left children have odd indices (2*i + 1)
                    const isLeftChild = line.to % 2 === 1;
                    const xOffset = isLeftChild ? '-4%' : '4%'; // Apply horizontal offset

                    return (
                        <line
                            key={i}
                            x1={`calc(${nodePositions[line.from].left} + ${xOffset})`}
                            y1={`calc(${nodePositions[line.from].top} + 56px)`} 
                            x2={nodePositions[line.to].left}
                            y2={nodePositions[line.to].top}
                            className="stroke-border"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>
            {numbers.map((n, i) => (
                <div key={i} className="absolute" style={{ ...nodePositions[i], transform: 'translateX(-50%)' }}>
                    <HeapSortBubble number={n} state={states[i]} />
                </div>
            ))}
        </div>
    );
};

const HeapSortVisualizer = () => {
    return (
        <div className="mt-8 p-4 sm:p-6 bg-card/50 border border-border rounded-xl space-y-12">
            <div>
                <p className="mb-6 text-text-secondary"><strong className="text-text-primary">Initial Array:</strong> We start with this unsorted array. Our goal is to convert it into a Max Heap.</p>
                <ArrayChunk numbers={[4, 10, 3, 5, 1]} />
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <Binary size={24} className="text-accent"/> Phase 1: Build Max Heap
            </h3>
            <p className="text-center text-text-secondary -mt-8">We start from the last parent node and "heapify" it, working our way up to the root.</p>
            
            <div className="space-y-10 bg-card/50 border border-border/50 rounded-lg p-6">
                <div>
                    <p className="mb-6 text-text-secondary"><strong className="text-text-primary">Step 1: Heapify Node at index 1 (Value 10):</strong> We check the last parent, <b className="text-purple-500">10</b>. Its children are <b className="text-blue-500">5</b> and <b className="text-blue-500">1</b>. Since 10 is larger than both, the heap property holds. No swap is needed.</p>
                    <ArrayChunk numbers={[4, 10, 3, 5, 1]} states={['default', 'root', 'default', 'child', 'child']} />
                </div>
                <div>
                    <p className="mb-6 text-text-secondary"><strong className="text-text-primary">Step 2: Heapify Node at index 0 (Value 4):</strong> Next, we check the root, <b className="text-purple-500">4</b>. Its children are <b className="text-blue-500">10</b> and <b className="text-blue-500">3</b>. The largest child is <b className="text-yellow-500">10</b>. Since 4 is smaller than 10, we <b className="text-red-400">swap</b> them.</p>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ArrayChunk numbers={[4, 10, 3, 5, 1]} states={['swap', 'swap', 'child']} />
                        <ArrowRight className="text-accent/80 text-2xl" />
                        <ArrayChunk numbers={[10, 4, 3, 5, 1]} />
                    </div>
                </div>
                <div>
                    <p className="mb-6 text-text-secondary"><strong className="text-text-primary">Step 3: Continue Heapify Down:</strong> After the swap, the value <b className="text-purple-500">4</b> is now at index 1. We must check if it satisfies the heap property in its new position. Its children are <b className="text-blue-500">5</b> and <b className="text-blue-500">1</b>. The largest is <b className="text-yellow-500">5</b>. Since 4 is smaller than 5, we must <b className="text-red-400">swap again</b>.</p>
                     <div className="flex flex-col items-center justify-center gap-4">
                        <ArrayChunk numbers={[10, 4, 3, 5, 1]} states={['root', 'swap', 'default', 'swap', 'child']} />
                        <ArrowRight className="text-accent/80 text-2xl" />
                        <ArrayChunk numbers={[10, 5, 3, 4, 1]} />
                    </div>
                </div>
                <div>
                    <p className="mb-6 text-text-secondary text-center"><strong className="text-text-primary">Max Heap is Built & Visualized:</strong> The process is complete. The array is now a valid Max Heap. Here's its tree structure, with the largest element (<b className="text-purple-500">10</b>) at the root.</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <ArrayChunk numbers={[10, 5, 3, 4, 1]} />
                        <HeapTree numbers={[10, 5, 3, 4, 1]} states={['root', 'child', 'child', 'child', 'child']} />
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-8 border-t border-border flex items-center justify-center gap-3">
                <Shuffle size={24} className="text-accent"/> Phase 2: Sort by Extraction
            </h3>
            <p className="text-center text-text-secondary -mt-8">Now, we repeatedly swap the root with the last unsorted element and re-heapify.</p>

            <div className="space-y-10 bg-card/50 border border-border/50 rounded-lg p-6">
                <div>
                    <p className="mb-6 text-text-secondary"><strong className="text-text-primary">Extract #1:</strong> First, <b className="text-red-400">swap</b> the root (<b className="text-purple-500">10</b>) with the last element (<b className="text-blue-500">1</b>). This moves <b className="text-green-500">10</b> to its final sorted position.</p>
                     <div className="flex flex-col items-center justify-center gap-4">
                        <ArrayChunk numbers={[10, 5, 3, 4, 1]} states={['swap', 'default', 'default', 'default', 'swap']} />
                        <ArrowRight className="text-accent/80 text-2xl rotate-90" />
                        <ArrayChunk numbers={[1, 5, 3, 4, 10]} states={['default', 'default', 'default', 'default', 'sorted']} />
                    </div>
                </div>
                 <div>
                    <p className="mb-6 text-text-secondary"><strong className="text-text-primary">Re-Heapify:</strong> The swap broke the heap property at the root. We now run the heapify process on the unsorted section to restore it.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
                         <div>
                            <h4 className="font-semibold text-text-primary mb-4">1. Broken Heap</h4>
                            <p className="text-text-secondary text-sm mb-4">The root (1) is smaller than its children.</p>
                            <HeapTree numbers={[1, 5, 3, 4]} states={['root', 'child', 'child', 'child']} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary mb-4">2. Restored Heap</h4>
                            <p className="text-text-secondary text-sm mb-4">After heapify, the new largest element (5) is at the root.</p>
                            <HeapTree numbers={[5, 4, 3, 1]} states={['root', 'child', 'child', 'child']} />
                        </div>
                    </div>
                    <p className="text-center mt-4 text-text-secondary">The full array is now:</p>
                    <div className="mt-2 flex justify-center">
                         <ArrayChunk numbers={[5, 4, 3, 1, 10]} states={['default', 'default', 'default', 'default', 'sorted']} />
                    </div>
                </div>
                <div>
                    <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on..</strong></p>
                    <p className="mt-2 mb-6 text-center text-text-secondary">This cycle of swapping the root and re-heapifying continues until the entire array is sorted.</p>
                </div>
            </div>
            
            <div>
                <p className="mb-6 text-text-secondary text-center"><strong className="text-text-primary">Final Sorted Array:</strong> After all elements have been extracted, the array is perfectly sorted.</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={[1, 3, 4, 5, 10]} states={['final', 'final', 'final', 'final', 'final']} />
                </div>
            </div>
        </div>
    );
};

export default function HeapSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Heap Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Heap Sort is a clever sorting algorithm that uses a data structure called a <strong className="text-text-primary">Binary Heap</strong> to do its work. Think of it as a two-phase process: first, it organizes the data into a special kind of tree called a "Max Heap," where the largest value is always at the top. Second, it repeatedly plucks that largest value off the top and places it at the end of the array, gradually building a sorted list from right to left.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <HeapSortVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-6 text-text-secondary ">
                        <li>
                            <strong>Build the Max Heap:</strong>
                            The first job is to convert the unsorted array into a Max Heap. In a Max Heap, every parent node is always greater than or equal to its children. This ensures the largest element in the collection is at the very beginning of the array (the "root" of the tree).
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li><span className="font-semibold text-text-primary">The Process (Heapify):</span> We don't start from the top. Instead, we start at the last element that has children and work our way backwards to the root. For each parent, we check:</li>
                                <li className='pl-4'> a) Is the parent smaller than one of its children?</li>
                                <li className='pl-4'> b) If yes, swap the parent with its <strong className="text-text-primary">largest</strong> child.</li>
                                <li className='pl-4'> c) After swapping, the parent might violate the heap rule further down, so we repeat this check-and-swap process down the tree until the node is in its correct place.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Sort by Extracting from the Heap:</strong>
                            Once the Max Heap is built, the first element of the array is the largest. Now we can systematically sort the array:
                             <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li><span className="font-semibold text-text-primary">Step A (Swap):</span> Swap the first element (the largest) with the very last element of the array.</li>
                                <li><span className="font-semibold text-text-primary">Step B (Lock):</span> The largest element is now in its final, sorted position at the end. We can ignore it for the rest of the sort. The "unsorted" part of our array is now one element smaller.</li>
                                <li><span className="font-semibold text-text-primary">Step C (Re-Heapify):</span> The swap in Step A put a small element at the root, breaking the Max Heap rule. We run the "heapify" process on the root again to sink this element down to its proper place, which brings the next largest element to the top.</li>
                                <li><span className="font-semibold text-text-primary">Step D (Repeat):</span> We repeat steps A, B, and C on the shrinking unsorted part of the array until all elements are in their final sorted positions.</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
                        <p>Heap Sort's performance is very consistent.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong className="text-green-500">Best Case: O(n log n)</strong></li>
                            <li><strong className="text-yellow-500">Average Case: O(n log n)</strong></li>
                            <li><strong className="text-red-500">Worst Case: O(n log n)</strong></li>
                        </ul>
                        <p>Building the initial heap takes O(n), and each of the n extractions takes O(log n) time.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Shuffle size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory required by the algorithm.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">Heap Sort is an "in-place" algorithm. It sorts the array using the array itself as storage for the heap, requiring no significant extra memory.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={heapSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Guaranteed Performance:</span> It has a worst-case time complexity of O(n log n), making it a safe choice for applications where performance consistency is critical.</li>
                            <li><span className="font-semibold text-text-primary">Memory Efficient (In-Place):</span> It requires O(1) auxiliary space, making it ideal for memory-constrained environments.</li>
                            <li><span className="font-semibold text-text-primary">No Recursion:</span> The standard implementation is iterative, avoiding stack overflow issues that can affect recursive algorithms like Quick Sort on massive datasets.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Slower in Practice:</span> While its asymptotic complexity is excellent, it tends to be slower than a well-implemented Quick Sort in typical scenarios due to poor cache locality (jumps around in memory).</li>
                            <li><span className="font-semibold text-text-primary">Not Stable:</span> It does not preserve the relative order of equal elements.</li>
                             <li><span className="font-semibold text-text-primary">Less Intuitive:</span> The heap data structure and the "heapify" process can be more complex to understand and implement correctly compared to other sorting algorithms.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}