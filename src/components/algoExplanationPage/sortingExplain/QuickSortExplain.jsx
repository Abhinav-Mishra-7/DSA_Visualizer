import { CheckCircle, XCircle, Clock, BrainCircuit, Zap, Workflow, ListChecks, Scale, Shuffle, GitCommitHorizontal, ArrowRight } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph';

const quickSortComplexities = [
    { label: 'Best Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#22C55E' },
    { label: 'Average Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#3B82F6' },
    { label: 'Worst Case', complexity: 'O(n²)', formula: n => n * n, color: '#EF4444' },
];

const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-4 animate-fade-in-from-left">
        <div className="w-1.5 h-8 bg-accent rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            {icon} {title}
        </h2>
    </div>
);

const QuickSortBubble = ({ number, state = 'default' }) => {
    const styles = {
        default: 'bg-card border-border text-text-primary border-2',
        pivot: 'border-purple-400 bg-purple-500/10 text-purple-500 border-1 shadow-md shadow-purple-600',
        i: 'border-yellow-400 bg-yellow-500/10 text-yellow-400 border-2',
        j: 'border-orange-400 bg-orange-500/10 text-orange-400 border-2',
        swap: 'border-red-400 bg-red-500/10 text-red-400 border-2 animate-pulse',
        sorted: 'border-green-400 bg-green-500/10 text-green-500 border-2 shadow-md shadow-green-500/20',
        final: 'border-green-400 bg-green-500/10 text-green-500 border-1 shadow-md shadow-green-600',
        range: 'border-blue-400 bg-blue-500/10 text-blue-400 border-2'
    };
    return (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${styles[state]}
        `}>
            {number}
        </div>
    );
};

const ArrayChunk = ({ numbers, states = [], pointers = {} }) => (
    <div className="flex justify-center flex-wrap gap-2">
        {numbers.map((n, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[50px]">
                <QuickSortBubble number={n} state={states[i] || 'default'} />
                {pointers[i] && (
                    <div className={`text-center font-mono font-bold ${pointers[i].color}`}>
                        ↑<br/>{pointers[i].label}
                    </div>
                )}
            </div>
        ))}
    </div>
);


const QuickSortVisualizer = () => {
    const initialArray = [5, 2, 8, 1];
    const pivot = [4];

    return (
        <div className="mt-8 p-4 sm:p-6 bg-card/50 border border-border rounded-xl space-y-12">
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array:</strong> Our goal is to sort this list. Quick Sort starts by choosing one element to be the "pivot". Let's pick the last element, <b className="text-purple-500">{pivot}</b>, as our pivot.</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={initialArray} states={['default']} />
                    <div className='ml-2'><ArrayChunk numbers={pivot} states={['pivot']} /></div>
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <GitCommitHorizontal size={24} className="text-accent"/> The Partition Phase
            </h3>
            <p className="text-center text-text-secondary -mt-8">This is the heart of Quick Sort. The goal is simple: rearrange the array so the pivot ends up in its final sorted position. To do this, we move every element smaller than the pivot to its left, and every element larger to its right.</p>
            
            <div className="space-y-10 bg-card/50 border border-border/50 rounded-lg p-6">
                <div className="text-center">
                    <p className="mb-4 text-text-secondary">We use two pointers: <b className="text-orange-400">`j` (The Inspector)</b>, which scans the array looking for small elements, and <b className="text-yellow-400">`i` (The Wall)</b>, which marks the boundary of the "smaller-than-pivot" section. The Wall starts just before the array.</p>
                </div>
                
                {/* Step 1 */}
                <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1:</strong> The Inspector (<b className="text-orange-400">j</b>) looks at the first number, 5. It asks: "Is 5 smaller than or equal to our pivot (4)?" The answer is <b className="text-red-500">No</b>. Since it's larger, it can stay where it is for now. The Inspector simply moves on.</p>
                    <div className="flex justify-center">
                        <ArrayChunk 
                            numbers={[5, 2, 8, 1, 4]} 
                            states={['range', 'range', 'range', 'range', 'pivot']}
                            pointers={{ 0: { label: 'j', color: 'text-orange-400' } }}
                        />
                    </div>
                </div>

                {/* Step 2 */}
                <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2:</strong> The Inspector (<b className="text-orange-400">j</b>) moves to 2. Is 2 ≤ pivot (4)? <b className="text-green-500">Yes!</b> This element belongs in the "smaller" section. It's on the wrong side of the wall.</p>
                     <p className="mb-4 text-text-secondary -mt-2">To fix this, we perform a two-step action: First, move the Wall (<b className="text-yellow-400">i</b>) one step to the right to make room. Second, <b className="text-red-400">swap</b> the element at the Inspector's position (2) with the element now at the Wall's position (5).</p>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ArrayChunk 
                            numbers={[5, 2, 8, 1, 4]} 
                            states={['swap', 'swap', 'range', 'range', 'pivot']}
                            pointers={{ 0: { label: 'i', color: 'text-yellow-400' }, 1: { label: 'j', color: 'text-orange-400' } }}
                        />
                        <ArrowRight className="text-accent/80 text-2xl" />
                        <ArrayChunk 
                            numbers={[2, 5, 8, 1, 4]} 
                            states={['range', 'range', 'range', 'range', 'pivot']}
                            pointers={{ 0: { label: 'i', color: 'text-yellow-400' }, 1: { label: 'j', color: 'text-orange-400' } }}
                        />
                    </div>
                </div>
                 
                {/* Step 3 */}
                 <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 3:</strong> The Inspector (<b className="text-orange-400">j</b>) moves to 8. Is 8 ≤ pivot (4)? <b className="text-red-500">No</b>. Again, we do nothing but move the Inspector along.</p>
                     <div className="flex justify-center">
                         <ArrayChunk 
                            numbers={[2, 5, 8, 1, 4]} 
                            states={['range', 'range', 'range', 'range', 'pivot']}
                            pointers={{ 0: { label: 'i', color: 'text-yellow-400' }, 2: { label: 'j', color: 'text-orange-400' } }}
                        />
                    </div>
                </div>
                 
                {/* Step 4 */}
                 <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 4:</strong> The Inspector (<b className="text-orange-400">j</b>) moves to 1. Is 1 ≤ pivot (4)? <b className="text-green-500">Yes!</b> Time to act again.</p>
                    <p className="mb-4 text-text-secondary -mt-2">We repeat the process: move the Wall (<b className="text-yellow-400">i</b>) to the right, then <b className="text-red-400">swap</b> the Inspector's element (1) with the element at the Wall's new position (5).</p>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ArrayChunk 
                            numbers={[2, 5, 8, 1, 4]} 
                            states={['range', 'swap', 'range', 'swap', 'pivot']}
                            pointers={{ 1: { label: 'i', color: 'text-yellow-400' }, 3: { label: 'j', color: 'text-orange-400' } }}
                        />
                        <ArrowRight className="text-accent/80 text-2xl" />
                        <ArrayChunk 
                            numbers={[2, 1, 8, 5, 4]} 
                            states={['range', 'range', 'range', 'range', 'pivot']}
                            pointers={{ 1: { label: 'i', color: 'text-yellow-400' }, 3: { label: 'j', color: 'text-orange-400' } }}
                        />
                    </div>
                </div>

                {/* Final Step of Partition */}
                 <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">The Grand Finale of Partition:</strong> The Inspector has finished its scan. Everything to the left of the Wall is smaller than the pivot. For the final move, we <b className="text-red-400">swap</b> the pivot with the element that's just one step to the right of the Wall. This places the pivot perfectly in the middle.</p>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ArrayChunk 
                            numbers={[2, 1, 8, 5, 4]} 
                            states={['default', 'default', 'swap', 'default', 'swap']}
                            pointers={{ 1: { label: 'i', color: 'text-yellow-400' } }}
                        />
                        <ArrowRight className="text-accent/80 text-2xl" />
                        <p className="text-text-primary">The pivot is now in its final sorted position!</p>
                        <ArrayChunk numbers={[2, 1, 4, 5, 8]} states={['default', 'default', 'sorted', 'default', 'default']} />
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-8 border-t border-border flex items-center justify-center gap-3">
                <Shuffle size={24} className="text-accent"/> The Recurse Phase
            </h3>
            <p className="text-center text-text-secondary -mt-8">The pivot <b className="text-green-500">4</b> is now locked in place. The array is now split into two smaller, independent problems. We run the exact same Quick Sort process (pick a pivot, partition) on these sub-arrays.</p>

            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="p-4 bg-card rounded-lg border border-border">
                        <p className="text-lg mb-2">Sort Left Sub-array:</p>
                        <ArrayChunk numbers={[2, 1]} />
                    </div>
                    <div className=" bg-green-500/60 rounded-full text-card mx-2">
                       <QuickSortBubble number={4} state="sorted"/>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border">
                         <p className="text-lg mb-2">Sort Right Sub-array:</p>
                        <ArrayChunk numbers={[5, 8]} />
                    </div>
                </div>

                <ArrowRight className="text-accent/80 text-2xl rotate-90 sm:rotate-0" />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <div className="p-4 bg-card rounded-lg border border-border">
                        <ArrayChunk numbers={[1, 2]} states={['sorted', 'sorted']} />
                    </div>
                    <div className=" bg-green-500/60 rounded-full text-card mx-2">
                       <QuickSortBubble number={4} state="sorted"/>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border">
                        <ArrayChunk numbers={[5, 8]} states={['sorted', 'sorted']} />
                    </div>
                </div>
            </div>

            <div>
                <p className="mb-4 text-text-secondary text-center"><strong className="text-text-primary">Final Sorted Array:</strong> This "divide and conquer" process continues until every sub-array is sorted. Once all the pieces are sorted and put back together, the entire array is beautifully ordered.</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={[1, 2, 4, 5, 8]} states={['final', 'final', 'final', 'final', 'final']} />
                </div>
            </div>
        </div>
    );
};


export default function QuickSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Quick Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Quick Sort is a highly efficient sorting algorithm that follows the <strong className="text-text-primary">"Divide and Conquer"</strong> strategy. Imagine you have a deck of cards to sort. Instead of sorting the whole deck at once, you pick one card (the "pivot"), and quickly make two piles: one with cards smaller than the pivot, and one with cards larger. You then do the same thing for each of those smaller piles. By repeating this process, the entire deck gets sorted.</p>
                    <p>Its main advantage is that it sorts <strong className="text-text-primary">"in-place"</strong>, meaning it doesn't need to create large temporary copies of the array, making it very memory-efficient.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <QuickSortVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-6 text-text-secondary ">
                        <li>
                            <strong> Pick a Pivot : </strong>
                            The first step is to choose a reference point. This element, the "pivot," will be used to split the array. While there are many ways to choose a pivot, a simple and common method is to just pick the <strong className="text-text-primary">last element</strong> of the section you're currently sorting.
                        </li>
                        <li>
                            <strong> Partition the Array : </strong>
                            This is the most important part. The mission is to put the pivot in its correct, final sorted position. To do this, we rearrange all the other elements around it:
                             <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li><span className="font-semibold text-text-primary">The Goal:</span> Move all elements smaller than the pivot to its left, and all elements larger to its right.</li>
                                <li><span className="font-semibold text-text-primary">The Method:</span> We use two pointers. An <strong className="text-text-primary">"Inspector" (`j`)</strong>  scans through the array, and a <strong className="text-text-primary">"Wall" (`i`)</strong>  marks the boundary of the "smaller-than-pivot" zone.</li>
                                <li><span className="font-semibold text-text-primary">The Logic:</span> As the Inspector scans the array, if it finds an element smaller than the pivot, it tells the Wall to move one step to the right and then swaps its element with the one at the Wall's new location. This effectively grows the "smaller" zone. If the Inspector finds a larger element, it does nothing.</li>
                                <li><span className="font-semibold text-text-primary">The Final Move:</span> After the Inspector has checked all elements, we swap the pivot with the element located just to the right of the Wall. This locks the pivot into its perfect, final position.</li>
                            </ul>
                        </li>
                        <li>
                            <strong> Recurse (Divide and Conquer) : </strong>
                            With the pivot now sorted and locked in place, we are left with two smaller, independent sub-arrays: one to the <strong className="text-text-primary">left of the pivot</strong>, and one to the <strong className="text-text-primary">right</strong>. Now, we simply repeat the entire process (Steps 1, 2, and 3) on each of these smaller sub-arrays. It's like giving the same set of instructions to two new teams for smaller tasks.
                        </li>
                         <li>
                            <strong> Base Case (When to Stop) : </strong>
                             How does the algorithm know when to stop splitting the array into smaller pieces? When it receives a sub-array that has <strong className="text-text-primary">only one element (or zero)</strong>. An array with one item is already sorted by definition, so there's no more work to do on that piece. This is the "base case" that prevents the recursion from going on forever.
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
                        <p>Performance depends heavily on picking good pivots.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong className="text-green-500">Best Case: O(n log n)</strong> (When the pivot always splits the array into two equal halves).</li>
                            <li><strong className="text-yellow-500">Average Case: O(n log n)</strong> (Most real-world scenarios with random data).</li>
                            <li><strong className="text-red-500">Worst Case: O(n²)</strong> (When the pivot is always the smallest or largest element, creating very unbalanced splits, e.g., on an already sorted array).</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Shuffle size={22}/> Space Complexity</h3>
                        <p>Measures extra memory for the function call stack.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(log n)</p>
                            <p className="mt-1">Quick Sort is an "in-place" sort. It only needs a small amount of extra memory to keep track of the recursive function calls, which is logarithmic on average.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={quickSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Extremely Fast in Practice:</span> On average, it's one of the fastest sorting algorithms due to its low overhead and efficient use of computer memory (cache-friendly).</li>
                            <li><span className="font-semibold text-text-primary">Memory Efficient (In-Place):</span> It sorts the array without needing to create a full copy, requiring only a small O(log n) amount of extra space for managing recursion.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Worst-Case is Terrible:</span> If you get unlucky with pivots (like on an already sorted list), performance can degrade to O(n²), which is very slow for large datasets.</li>
                            <li><span className="font-semibold text-text-primary">Not Stable:</span> It doesn't preserve the original order of equal elements. If you sort a list of people by city, two people from the same city might swap places.</li>
                             <li><span className="font-semibold text-text-primary">Recursive:</span> The logic can be slightly more complex to grasp initially compared to simpler algorithms like Bubble Sort.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}