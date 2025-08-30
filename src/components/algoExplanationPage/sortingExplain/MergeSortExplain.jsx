// MergeSortExplanation.jsx

import { CheckCircle, XCircle, Clock, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight, GitMerge, Copy } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; 
import SplitArrowSVG from '../../shared/SplitArrowSVG';

const mergeSortComplexities = [
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

// Arrow coordinates
const singleArrow1 = [ { start: { x: 60, y: 15 }, end: { x: -80, y: 60 } } , { start: { x: 90, y: 15 }, end: { x: 230, y: 60 } } ];
const singleArrow2 = [ { start: { x: 60, y: 10 }, end: { x: -20, y: 70 } } , { start: { x: 87, y: 11 }, end: { x: 155, y: 70 } } ];
const singleArrow3 = [ { start: { x: 62, y: 10 }, end: { x: 20, y: 68 } } , { start: { x: 88, y: 10 }, end: { x: 150, y: 68 } } ];
const singleArrow4 = [ { start: { x: 33, y: 10 }, end: { x: -10, y: 75 } } , { start: { x: 103, y: 15 }, end: { x: 98, y: 75 } } ];
const singleArrow5 = [ { start: { x: 38, y: 15 }, end: { x: 28, y: 75 } } , { start: { x: 115, y: 15 }, end: { x: 140, y: 75 } } ];

const MergeSortBubble = ({ number, highlight, final, plain , finalWithShadow }) => (
    <div className={`
        w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
        ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
        ${highlight ? 'border-accent bg-accent/10 text-accent border-2' : ''}
        ${final ? 'border-green-400 bg-green-500/5 text-green-500 border-2' : ''}
        ${finalWithShadow ? 'border-1 border-green-400 bg-green-500/5 text-green-500 shadow-md shadow-green-600' : ''}
    `}>
        {number}
    </div>
);


const PointerBubble = ({ number }) => (
    <div className="
        w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
        border-1 border-purple-400 bg-purple-400/5 text-purple-500 shadow-md shadow-purple-600
    ">
        {number}
    </div>
);

const ArrayChunk = ({ numbers, className, bubbleProps = {} }) => (
    <div className={`flex justify-center gap-2 ${className}`}>
        {numbers.map((n, i) => <MergeSortBubble key={i} number={n} {...bubbleProps} />)}
    </div>
);

const MergeSortVisualizer = () => {
    return (
        <div className="mt-8 p-4 sm:p-6 bg-card/50 border border-border rounded-xl space-y-12">
            
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list of numbers.</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={[8, 3, 5, 1, 9, 4]} bubbleProps={{ plain: true }} />
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <GitMerge size={24} className="text-accent rotate-90"/> Divide Phase
            </h3>
            <p className="text-center text-text-secondary -mt-8">The array is recursively split into halves, creating a tree-like structure until we have single-element arrays.</p>
            
            <div className="flex flex-col items-center">
                {/* Level 0 */}
                <ArrayChunk numbers={[8, 3, 5, 1, 9, 4]} bubbleProps={{ plain: true }} />
                {/* Connectors 0 -> 1 */}
                <div className="w-full max-w-lg h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow1} /></div>
                {/* Level 1 */}
                <div className="w-full max-w-2xl flex justify-around">
                    <ArrayChunk numbers={[8, 3, 5]} bubbleProps={{ plain: true }} />
                    <ArrayChunk numbers={[1, 9, 4]} bubbleProps={{ plain: true }} />
                </div>
                {/* Connectors 1 -> 2 */}
                <div className="w-full max-w-2xl flex justify-between">
                    <div className="w-1/2 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow2} /></div>
                    <div className="w-1/2 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow3}/></div>
                </div>
                {/* Level 2 */}
                <div className="w-full max-w-3xl flex justify-around">
                    <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[8]} bubbleProps={{ plain: true }} /></div>
                    <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[3, 5]} bubbleProps={{ plain: true }} /></div>
                    <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[1]} bubbleProps={{ plain: true }} /></div>
                    <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[9, 4]} bubbleProps={{ plain: true }} /></div>
                </div>
                {/* Connectors 2 -> 3 */}
                 <div className="w-full max-w-3xl flex justify-around">
                    <div className="w-1/4" />
                    <div className="w-1/4 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow4} /></div>
                    <div className="w-1/4" />
                    <div className="w-1/4 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow5}/></div>
                </div>
                {/* Level 3: Base Case */}
                <p className="text-center text-text-secondary pt-6 text-sm">Base Case: The array is broken down into atomic, single-element arrays. These are inherently sorted.</p>
                <div className="w-full flex justify-around pt-2">
                     <ArrayChunk numbers={[8]} bubbleProps={{ final: true }} />
                     <ArrayChunk numbers={[3]} bubbleProps={{ final: true }} />
                     <ArrayChunk numbers={[5]} bubbleProps={{ final: true }} />
                     <ArrayChunk numbers={[1]} bubbleProps={{ final: true }} />
                     <ArrayChunk numbers={[9]} bubbleProps={{ final: true }} />
                     <ArrayChunk numbers={[4]} bubbleProps={{ final: true }} />
                </div>
            </div>

            {/* --- REBUILT & EXPANDED MERGE PHASE --- */}
            <h3 className="text-2xl font-semibold text-center text-text-primary pt-8 border-t border-border flex items-center justify-center gap-3">
                <GitMerge size={24} className="text-accent"/> Merge Phase
            </h3>
            <p className="text-center text-text-secondary -mt-8">Now, we merge the smaller sorted arrays back together. This is where the core logic of the algorithm shines.</p>

            <div className="space-y-12">
                {/* --- Warm-up Merges --- */}
                <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1: Merging base cases.</strong> The single-element arrays are merged into sorted pairs.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <div className="flex items-center gap-2">
                             <ArrayChunk numbers={[3]} bubbleProps={{ highlight: true }} />
                             <ArrayChunk numbers={[5]} bubbleProps={{ highlight: true }} />
                             <ArrowRight className="text-accent/80" />
                             <ArrayChunk numbers={[3, 5]} bubbleProps={{ final: true }} />
                        </div>
                         <div className="flex items-center gap-2">
                             <ArrayChunk numbers={[9]} bubbleProps={{ highlight: true }} />
                             <ArrayChunk numbers={[4]} bubbleProps={{ highlight: true }} />
                             <ArrowRight className="text-accent/80" />
                             <ArrayChunk numbers={[4, 9]} bubbleProps={{ final: true }} />
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2: Merging pairs into larger chunks.</strong> The process continues up the tree.</p>
                    <div className="flex items-center justify-center gap-2">
                        <ArrayChunk numbers={[8]} bubbleProps={{ highlight: true }} />
                        <span className="text-2xl font-bold text-text-secondary mx-2">+</span>
                        <ArrayChunk numbers={[3, 5]} bubbleProps={{ highlight: true }} />
                        <ArrowRight className="text-accent/80 mx-2" />
                        <ArrayChunk numbers={[3, 5, 8]} bubbleProps={{ final: true }} />
                    </div>
                </div>

                {/* --- DETAILED FINAL MERGE --- */}
                <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">The Final Merge: A Step-by-Step Look</h3>
                <p className="text-center text-text-secondary -mt-8">This is the most important step. We use two "pointers" (one for each array) to compare elements one by one and build the final sorted array.</p>

                <div className="flex items-center justify-center gap-4 text-center">
                    <p className="text-lg">Merging</p>
                    <ArrayChunk numbers={[3, 5, 8]} bubbleProps={{ highlight: true }} />
                    <p className="text-lg">and</p>
                    <ArrayChunk numbers={[1, 4, 9]} bubbleProps={{ highlight: true }} />
                </div>
                
                <div className="space-y-8 bg-card/50 border border-border/50 rounded-lg p-4">
                    {/* Comparison 1 */}
                    <div>
                        <p className="mb-2 text-text-secondary">Compare the first elements of each array. <b className="text-purple-500">1</b> is less than <b className="text-purple-500">3</b>, so we add <b className="text-green-400">1</b> to our result.</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex gap-2"><PointerBubble number={3} /><MergeSortBubble number={5} plain /><MergeSortBubble number={8} plain /></div>
                            <span className="font-bold">vs.</span>
                            <div className="flex gap-2"><PointerBubble number={1} /><MergeSortBubble number={4} plain /><MergeSortBubble number={9} plain /></div>
                            <ArrowRight className="text-accent/80" />
                            <ArrayChunk numbers={[1]} bubbleProps={{ final: true }} />
                        </div>
                    </div>

                    {/* Comparison 2 */}
                    <div>
                        <p className="mb-2 text-text-secondary">Now compare <b className="text-purple-500">3</b> and <b className="text-purple-500">4</b>. <b className="text-purple-500">3</b> is smaller, so we add <b className="text-green-400">3</b>.</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex gap-2"><PointerBubble number={3} /><MergeSortBubble number={5} plain /><MergeSortBubble number={8} plain /></div>
                            <span className="font-bold">vs.</span>
                            <div className="flex gap-2"><MergeSortBubble number={1} plain /><PointerBubble number={4} /><MergeSortBubble number={9} plain /></div>
                            <ArrowRight className="text-accent/80" />
                            <ArrayChunk numbers={[1, 3]} bubbleProps={{ final: true }} />
                        </div>
                    </div>
                    
                    {/* Comparison 3 */}
                    <div>
                        <p className="mb-2 text-text-secondary">Next, compare <b className="text-purple-500">5</b> and <b className="text-purple-500">4</b>. <b className="text-purple-500">4</b> is smaller, so we add <b className="text-green-400">4</b>.</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex gap-2"><MergeSortBubble number={3} plain /><PointerBubble number={5} /><MergeSortBubble number={8} plain /></div>
                            <span className="font-bold">vs.</span>
                            <div className="flex gap-2"><MergeSortBubble number={1} plain /><PointerBubble number={4} /><MergeSortBubble number={9} plain /></div>
                            <ArrowRight className="text-accent/80" />
                            <ArrayChunk numbers={[1, 3, 4]} bubbleProps={{ final: true }} />
                        </div>
                    </div>
                    
                    {/* Comparison 4 */}
                    <div>
                        <p className="mb-2 text-text-secondary">Compare <b className="text-purple-500">5</b> and <b className="text-purple-500">9</b>. <b className="text-purple-500">5</b> is smaller, so we add <b className="text-green-400">5</b>.</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex gap-2"><MergeSortBubble number={3} plain /><PointerBubble number={5} /><MergeSortBubble number={8} plain /></div>
                            <span className="font-bold">vs.</span>
                            <div className="flex gap-2"><MergeSortBubble number={1} plain /><MergeSortBubble number={4} plain /><PointerBubble number={9} /></div>
                            <ArrowRight className="text-accent/80" />
                            <ArrayChunk numbers={[1, 3, 4, 5]} bubbleProps={{ final: true }} />
                        </div>
                    </div>
                    
                    {/* Comparison 5 */}
                    <div>
                        <p className="mb-2 text-text-secondary">Compare <b className="text-purple-500">8</b> and <b className="text-purple-500">9</b>. <b className="text-purple-500">8</b> is smaller, so we add <b className="text-green-400">8</b>.</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex gap-2"><MergeSortBubble number={3} plain /><MergeSortBubble number={5} plain /><PointerBubble number={8} /></div>
                            <span className="font-bold">vs.</span>
                            <div className="flex gap-2"><MergeSortBubble number={1} plain /><MergeSortBubble number={4} plain /><PointerBubble number={9} /></div>
                            <ArrowRight className="text-accent/80" />
                            <ArrayChunk numbers={[1, 3, 4, 5, 8]} bubbleProps={{ final: true }} />
                        </div>
                    </div>
                    
                    {/* Final Step */}
                    <div>
                        <p className="mb-2 text-text-secondary">The left array is now empty. We simply copy the remaining elements from the right array (<b className="text-green-400">9</b>).</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex gap-2 opacity-30"><MergeSortBubble number={3} plain /><MergeSortBubble number={5} plain /><MergeSortBubble number={8} plain /></div>
                            <span className="font-bold text-text-secondary">and</span>
                            <div className="flex gap-2 "><MergeSortBubble number={1} plain /><MergeSortBubble number={4} plain /><PointerBubble number={9} /></div>
                            <ArrowRight className="text-accent/80" />
                            <ArrayChunk numbers={[1, 3, 4, 5, 8, 9]} bubbleProps={{ final: true }} />
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-4 text-text-secondary text-center"><strong className="text-text-primary">Final Sorted Array:</strong> The merge is complete, resulting in a single, fully sorted array.</p>
                    <div className="flex justify-center">
                        <ArrayChunk numbers={[1, 3, 4, 5, 8, 9]} bubbleProps={{ finalWithShadow: true }} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function MergeSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Merge Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Merge Sort is a highly efficient, comparison-based sorting algorithm. It's a perfect example of the <strong className="text-text-primary">"Divide and Conquer"</strong> strategy. The algorithm divides the main array into two halves, recursively sorts them, and then merges the sorted halves back together to produce the final sorted array.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <MergeSortVisualizer />
            </section>
            
            <hr className="border-border/50" />

            {/* The rest of the component remains the same */}
            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-6 text-text-secondary">
                        <li>
                            <strong>Base Case (The Stop Condition) : </strong>
                            The entire algorithm relies on recursion. The base case is the condition that stops the recursion. For Merge Sort, this is when an array has <strong className="text-text-primary">0 or 1 element</strong>. An array with one item is, by definition, <strong className="text-text-primary">already sorted</strong>. This is the fundamental building block.
                        </li>
                        <li>
                            <strong>Divide (Split the Work) : </strong>
                            If the array has more than one element, it's divided. We find the <strong className="text-text-primary">middle index</strong> and split the array into two smaller sub-arrays: a <strong className="text-text-primary">`left` half</strong> and a <strong className="text-text-primary">`right` half</strong>. This process is repeated for each new sub-array, creating a cascade of splits.
                        </li>
                        <li>
                            <strong>Conquer (Sort the Halves) : </strong>
                            This is the recursive part. We apply the <strong className="text-text-primary">entire Merge Sort algorithm</strong> to both the `left` half and the `right` half. The function calls itself on progressively smaller pieces of the array until every piece hits the base case (becoming a single-element array).
                        </li>
                        <li>
                            <strong>Combine (The "Merge" Operation) : </strong>
                            This is where the magic happens. Once two sorted sub-arrays return from their recursive calls, we merge them into a single, sorted array. This is a careful, linear-time process:
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li><span className="font-semibold text-text-primary">Create a temporary array</span> large enough to hold all elements from both sub-arrays.</li>
                                <li><span className="font-semibold text-text-primary">Use pointers</span>, one for the start of the `left` sub-array and one for the start of the `right`.</li>
                                <li><span className="font-semibold text-text-primary">Compare the elements</span> at each pointer. Copy the <strong className="text-text-primary">smaller</strong> of the two elements into the temporary array.</li>
                                <li><span className="font-semibold text-text-primary">Advance the pointer</span> of the sub-array from which the element was taken.</li>
                                <li><span className="font-semibold text-text-primary">Repeat</span> this comparison and copying process until one of the sub-arrays is completely empty.</li>
                                <li><span className="font-semibold text-text-primary">Copy remaining elements:</span> Once a sub-array is exhausted, the other may still have elements left. Copy all of these remaining elements (which are already sorted) to the end of the temporary array.</li>
                                 <li><span className="font-semibold text-text-primary">Final copy:</span> The temporary array now holds a perfectly sorted combination of the two halves. Copy its contents back into the original array's segment.</li>
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
                        <p>The "Divide and Conquer" approach leads to very consistent performance.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong className="text-green-500">Best Case: O(n log n)</strong></li>
                            <li><strong className="text-yellow-500">Average Case: O(n log n)</strong></li>
                            <li><strong className="text-red-500">Worst Case: O(n log n)</strong></li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Copy size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(n)</p>
                            <p className="mt-1">It requires extra space proportional to the input size for the temporary arrays used during the merge step.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={mergeSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Guaranteed Efficiency:</span> Time complexity is always O(n log n), making it very predictable and reliable for large datasets.</li>
                            <li><span className="font-semibold text-text-primary">Stable Sort:</span> It preserves the relative order of equal elements, which is a crucial property for certain applications.</li>
                            <li><span className="font-semibold text-text-primary">Parallelizable:</span> The divide step can be easily parallelized, allowing for faster sorting on multi-core systems.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Space Inefficient:</span> Requires O(n) auxiliary space for merging, which can be a significant drawback in memory-limited environments.</li>
                            <li><span className="font-semibold text-text-primary">Recursive Overhead:</span> For very small arrays, the overhead of recursion can make it slightly slower than simpler algorithms like Insertion Sort.</li>
                             <li><span className="font-semibold text-text-primary">Not In-Place:</span> Unlike some other sorters (e.g., Heapsort), it cannot sort the array in place without complex implementations.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}



// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight, GitMerge, Copy } from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; 
// import SplitArrowSVG from '../shared/SplitArrowSVG';

// const mergeSortComplexities = [
//     { label: 'Best Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#22C55E' },
//     { label: 'Average Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#3B82F6' },
//     { label: 'Worst Case', complexity: 'O(n log n)', formula: n => n * Math.log2(n), color: '#EF4444' },
// ];

// const SectionHeader = ({ title, icon }) => (
//     <div className="flex items-center gap-4 animate-fade-in-from-left">
//         <div className="w-1.5 h-8 bg-accent rounded-full"></div>
//         <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
//             {icon} {title}
//         </h2>
//     </div>
// );

// const singleArrow1 = [
//     { start: { x: 60, y: 15 }, end: { x: -80, y: 60 } } ,
//     { start: { x: 90, y: 15 }, end: { x: 230, y: 60 } }
// ];

// const singleArrow2 = [
//     { start: { x: 60, y: 10 }, end: { x: -20, y: 70 } } ,
//     { start: { x: 87, y: 11 }, end: { x: 155, y: 70 } }
// ];

// const singleArrow3 = [
//     { start: { x: 62, y: 10 }, end: { x: 20, y: 68 } } ,
//     { start: { x: 88, y: 10 }, end: { x: 150, y: 68 } }
// ];

// const singleArrow4 = [
//     { start: { x: 33, y: 10 }, end: { x: -10, y: 75 } } ,
//     { start: { x: 103, y: 15 }, end: { x: 98, y: 75 } }
// ];

// const singleArrow5 = [
//     { start: { x: 38, y: 15 }, end: { x: 28, y: 75 } } ,
//     { start: { x: 115, y: 15 }, end: { x: 140, y: 75 } }
// ];

// const MergeSortBubble = ({ number, highlight, final, plain }) => (
//     <div className={`
//         w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//         border-2
//         ${plain ? 'bg-card border-border text-text-primary' : ''}
//         ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//         ${final ? 'border-green-500 bg-green-500/5 text-green-500' : ''}
//     `}>
//         {number}
//     </div>
// );

// const ArrayChunk = ({ numbers, className, bubbleProps = {} }) => (
//     <div className={`flex justify-center gap-2 ${className}`}>
//         {numbers.map((n, i) => <MergeSortBubble key={i} number={n} {...bubbleProps} />)}
//     </div>
// );

// const MergeSortVisualizer = () => {
//     return (
//         <div className="mt-8 p-4 sm:p-6 bg-card/50 border border-border rounded-xl space-y-12">
            
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list of numbers.</p>
//                 <div className="flex justify-center">
//                     <ArrayChunk numbers={[8, 3, 5, 1, 9, 4]} bubbleProps={{ plain: true }} />
//                 </div>
//             </div>

//             <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
//                 <GitMerge size={24} className="text-accent rotate-90"/> Divide Phase
//             </h3>
//             <p className="text-center text-text-secondary -mt-8">The array is recursively split into halves, creating a tree-like structure until we have single-element arrays.</p>
            
//             <div className="flex flex-col items-center">
//                 {/* Level 0 */}
//                 <ArrayChunk numbers={[8, 3, 5, 1, 9, 4]} bubbleProps={{ plain: true }} />

//                 {/* Connectors 0 -> 1 */}
//                 <div className="w-full max-w-lg h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow1} /></div>
                
//                 {/* Level 1 */}
//                 <div className="w-full max-w-2xl flex justify-around">
//                     <ArrayChunk numbers={[8, 3, 5]} bubbleProps={{ plain: true }} />
//                     <ArrayChunk numbers={[1, 9, 4]} bubbleProps={{ plain: true }} />
//                 </div>

//                 {/* Connectors 1 -> 2 */}
//                 <div className="w-full max-w-2xl flex justify-between">
//                     <div className="w-1/2 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow2} /></div>
//                     <div className="w-1/2 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow3}/></div>
//                 </div>

//                 {/* Level 2 */}
//                 <div className="w-full max-w-3xl flex justify-around">
//                     <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[8]} bubbleProps={{ plain: true }} /></div>
//                     <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[3, 5]} bubbleProps={{ plain: true }} /></div>
//                     <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[1]} bubbleProps={{ plain: true }} /></div>
//                     <div className="w-1/4 flex justify-center"><ArrayChunk numbers={[9, 4]} bubbleProps={{ plain: true }} /></div>
//                 </div>
                 
//                 {/* Connectors 2 -> 3 */}
//                  <div className="w-full max-w-3xl flex justify-around">
//                     <div className="w-1/4" />
//                     <div className="w-1/4 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow4} /></div>
//                     <div className="w-1/4" />
//                     <div className="w-1/4 h-24 -mt-2 -mb-2"><SplitArrowSVG arrows={singleArrow5}/></div>
//                 </div>

//                 {/* Level 3: Base Case */}
//                 <p className="text-center text-text-secondary pt-6 text-sm">Base Case: The array is broken down into atomic, single-element arrays. These are inherently sorted.</p>
//                 <div className="w-full flex justify-around pt-2">
//                      <ArrayChunk numbers={[8]} bubbleProps={{ final: true }} />
//                      <ArrayChunk numbers={[3]} bubbleProps={{ final: true }} />
//                      <ArrayChunk numbers={[5]} bubbleProps={{ final: true }} />
//                      <ArrayChunk numbers={[1]} bubbleProps={{ final: true }} />
//                      <ArrayChunk numbers={[9]} bubbleProps={{ final: true }} />
//                      <ArrayChunk numbers={[4]} bubbleProps={{ final: true }} />
//                 </div>
//             </div>

//             {/* --- MERGE PHASE --- */}
//             <h3 className="text-2xl font-semibold text-center text-text-primary pt-8 border-t border-border flex items-center justify-center gap-3">
//                 <GitMerge size={24} className="text-accent"/> Merge Phase
//             </h3>
//             <p className="text-center text-text-secondary -mt-8">Now, we merge the smaller sorted arrays back together, maintaining the sorted order.</p>

//             <div className="space-y-10">
//                  <div>
//                     <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1: </strong> Merging pairs. Compare <b className="text-accent">3</b> and <b className="text-accent">5</b> (no swap needed) and <b className="text-accent">9</b> and <b className="text-accent">4</b> (swap order).</p>
//                     <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
//                         <div className="flex items-center gap-2">
//                              <ArrayChunk numbers={[3]} bubbleProps={{ highlight: true }} />
//                              <ArrayChunk numbers={[5]} bubbleProps={{ highlight: true }} />
//                              <ArrowRight className="text-accent/80" />
//                              <ArrayChunk numbers={[3, 5]} bubbleProps={{ final: true }} />
//                         </div>
//                          <div className="flex items-center gap-2">
//                              <ArrayChunk numbers={[9]} bubbleProps={{ highlight: true }} />
//                              <ArrayChunk numbers={[4]} bubbleProps={{ highlight: true }} />
//                              <ArrowRight className="text-accent/80" />
//                              <ArrayChunk numbers={[4, 9]} bubbleProps={{ final: true }} />
//                         </div>
//                     </div>
//                 </div>

//                 <div>
//                     <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2: </strong> Merge the next level. We merge <b className="text-accent">[8]</b> with the sorted <b className="text-accent">[3, 5]</b>.</p>
//                     <div className="flex items-center justify-center gap-2">
//                         <ArrayChunk numbers={[8]} bubbleProps={{ highlight: true }} />
//                         <span className="text-2xl font-bold text-text-secondary mx-2">+</span>
//                         <ArrayChunk numbers={[3, 5]} bubbleProps={{ highlight: true }} />
//                         <ArrowRight className="text-accent/80 mx-2" />
//                         <ArrayChunk numbers={[3, 5, 8]} bubbleProps={{ final: true }} />
//                     </div>
//                 </div>

//                 <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Merge</h3>
//                 <div>
//                      <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Step: </strong> The two final sorted halves <b className="text-accent">[3, 5, 8]</b> and <b className="text-accent">[1, 4, 9]</b> are merged together.</p>
//                      <div className="flex items-center justify-center gap-2">
//                         <ArrayChunk numbers={[3, 5, 8]} bubbleProps={{ highlight: true }} />
//                         <span className="text-2xl font-bold text-text-secondary mx-2">+</span>
//                         <ArrayChunk numbers={[1, 4, 9]} bubbleProps={{ highlight: true }} />
//                     </div>
//                 </div>
//                 <div>
//                     <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> The result is a single, fully sorted array.</p>
//                     <div className="flex justify-center">
//                         <ArrayChunk numbers={[1, 3, 4, 5, 8, 9]} bubbleProps={{ final: true }} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default function MergeSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Merge Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Merge Sort is a highly efficient, comparison-based sorting algorithm. It's a perfect example of the <strong className="text-text-primary">"Divide and Conquer"</strong> strategy. The algorithm divides the main array into two halves, recursively sorts them, and then merges the sorted halves back together to produce the final sorted array.</p>
//                 </div>
//             </section>

//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
//                 <MergeSortVisualizer />
//             </section>
            
//             <hr className="border-border/50" />

//             {/* The rest of the component remains the same */}
//             <section>
//                 <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
//                 <div className="mt-6 bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                     <ol className="list-decimal list-outside pl-6 space-y-6 text-text-secondary">
//                         <li>
//                             <strong>Base Case: The Stop Condition</strong>
//                             The entire algorithm relies on recursion. The base case is the condition that stops the recursion. For Merge Sort, this is when an array has <strong className="text-text-primary">0 or 1 element</strong>. An array with one item is, by definition, <strong className="text-text-primary">already sorted</strong>. This is the fundamental building block.
//                         </li>
//                         <li>
//                             <strong>Divide: Split the Work</strong>
//                             If the array has more than one element, it's divided. We find the <strong className="text-text-primary">middle index</strong> and split the array into two smaller sub-arrays: a <strong className="text-text-primary">`left` half</strong> and a <strong className="text-text-primary">`right` half</strong>. This process is repeated for each new sub-array, creating a cascade of splits.
//                         </li>
//                         <li>
//                             <strong>Conquer: Sort the Halves</strong>
//                             This is the recursive part. We apply the <strong className="text-text-primary">entire Merge Sort algorithm</strong> to both the `left` half and the `right` half. The function calls itself on progressively smaller pieces of the array until every piece hits the base case (becoming a single-element array).
//                         </li>
//                         <li>
//                             <strong>Combine: The "Merge" Operation</strong>
//                             This is where the magic happens. Once two sorted sub-arrays return from their recursive calls, we merge them into a single, sorted array. This is a careful, linear-time process:
//                             <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
//                                 <li><span className="font-semibold text-text-primary">Create a temporary array</span> large enough to hold all elements from both sub-arrays.</li>
//                                 <li><span className="font-semibold text-text-primary">Use pointers</span>, one for the start of the `left` sub-array and one for the start of the `right`.</li>
//                                 <li><span className="font-semibold text-text-primary">Compare the elements</span> at each pointer. Copy the <strong className="text-text-primary">smaller</strong> of the two elements into the temporary array.</li>
//                                 <li><span className="font-semibold text-text-primary">Advance the pointer</span> of the sub-array from which the element was taken.</li>
//                                 <li><span className="font-semibold text-text-primary">Repeat</span> this comparison and copying process until one of the sub-arrays is completely empty.</li>
//                                 <li><span className="font-semibold text-text-primary">Copy remaining elements:</span> Once a sub-array is exhausted, the other may still have elements left. Copy all of these remaining elements (which are already sorted) to the end of the temporary array.</li>
//                                  <li><span className="font-semibold text-text-primary">Final copy:</span> The temporary array now holds a perfectly sorted combination of the two halves. Copy its contents back into the original array's segment.</li>
//                             </ul>
//                         </li>
//                     </ol>
//                 </div>
//             </section>

//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
//                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
//                         <p>The "Divide and Conquer" approach leads to very consistent performance.</p>
//                         <ul className="list-none space-y-2 pt-2">
//                             <li><strong className="text-green-500">Best Case: O(n log n)</strong></li>
//                             <li><strong className="text-yellow-500">Average Case: O(n log n)</strong></li>
//                             <li><strong className="text-red-500">Worst Case: O(n log n)</strong></li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Copy size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(n)</p>
//                             <p className="mt-1">It requires extra space proportional to the input size for the temporary arrays used during the merge step.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph complexities={mergeSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Guaranteed Efficiency:</span> Time complexity is always O(n log n), making it very predictable and reliable for large datasets.</li>
//                             <li><span className="font-semibold text-text-primary">Stable Sort:</span> It preserves the relative order of equal elements, which is a crucial property for certain applications.</li>
//                             <li><span className="font-semibold text-text-primary">Parallelizable:</span> The divide step can be easily parallelized, allowing for faster sorting on multi-core systems.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Space Inefficient:</span> Requires O(n) auxiliary space for merging, which can be a significant drawback in memory-limited environments.</li>
//                             <li><span className="font-semibold text-text-primary">Recursive Overhead:</span> For very small arrays, the overhead of recursion can make it slightly slower than simpler algorithms like Insertion Sort.</li>
//                              <li><span className="font-semibold text-text-primary">Not In-Place:</span> Unlike some other sorters (e.g., Heapsort), it cannot sort the array in place without complex implementations.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }