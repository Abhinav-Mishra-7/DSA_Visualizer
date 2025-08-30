import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight, ScanSearch } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

const selectionSortComplexities = [
    {
        label: 'Best Case',
        complexity: 'O(n²)',
        formula: n => n * n,
        color: '#22C55E' // green-500
    },
    {
        label: 'Average Case',
        complexity: 'O(n²)',
        formula: n => n * n,
        color: '#3B82F6' // blue-500
    },
    {
        label: 'Worst Case',
        complexity: 'O(n²)',
        formula: n => n * n,
        color: '#EF4444' // red-500
    },
];

const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-4 animate-fade-in-from-left">
        <div className="w-1.5 h-8 bg-accent rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            {icon} {title}
        </h2>
    </div>
);

const SortStepVisualizer = () => {
    // Reusable Bubble component
    const Bubble = ({ number, highlight, final, plain, minEl , finalWithShadow }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-accent bg-accent/10 text-accent border-2' : ''}
            ${final ? 'border-green-400 bg-green-500/10 text-green-500 border-2' : ''}
            ${minEl ? 'border-purple-400 bg-purple-500/10 text-purple-500 shadow-md shadow-purple-600' : ''}
            ${finalWithShadow ? 'border-green-400 border-1 bg-green-500/5 text-green-500 shadow-md shadow-green-600' : ''}
        `}>
            {number}
        </div>
    );

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-10">
            {/* Initial State */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We begin with a completely unsorted list of numbers.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[6, 4, 9, 2, 5].map((n, i) => <Bubble key={i} number={n} plain />)}
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1: Find minimum for index 0</h3>
            
            {/* Step 1.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Start at the first element (<b className="text-accent">6</b>). Scan the entire unsorted part of the array to find the absolute minimum value.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={6} highlight />
                    <Bubble number={4} plain />
                    <Bubble number={9} plain />
                    <Bubble number={2} minEl />
                    <Bubble number={5} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">The minimum value found is <b className="text-purple-500">2</b>.</p>
            </div>

            {/* End of Pass 1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> Swap the found minimum (<b className="text-purple-500">2</b>) with the element at the current starting position (<b className="text-accent">6</b>). The first element is now sorted.</p>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={6} highlight />
                    <Bubble number={2} minEl />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <Bubble number={2} final />
                    <Bubble number={4} plain />
                    <Bubble number={9} plain />
                    <Bubble number={6} plain />
                    <Bubble number={5} plain />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2: Find minimum for index 1</h3>

            {/* Step 2.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> Move to the next position. Scan the remaining unsorted part (<b className="text-accent">4</b>, 9, 6, 5) to find the next minimum.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={4} highlight />
                    <Bubble number={9} plain />
                    <Bubble number={6} plain />
                    <Bubble number={5} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">In this case, <b className="text-accent">4</b> is already the minimum in the unsorted portion.</p>
            </div>
            
             {/* End of Pass 2 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> Since the minimum is already in the correct place, no swap is needed. The sorted portion of the array grows.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={4} final />
                    <Bubble number={9} plain />
                    <Bubble number={6} plain />
                    <Bubble number={5} plain />
                </div>
            </div>

            {/* And so on... */}
            <div>
                <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on..</strong></p>
                <p className="mt-2 mb-4 text-center text-text-secondary">The process continues. Here is the state of the array before the next pass, where we will find the minimum in the remaining unsorted part (9, 6, 5).</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={4} final />
                    <Bubble number={9} plain />
                    <Bubble number={6} plain />
                    <Bubble number={5} plain />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Pass</h3>
            
            <div>
                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.1 : </strong> Scan the list [9, 6, 5]. The minimum element is found to be <b className="text-purple-500">5</b>.</p>
                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.2 : </strong> Swap the minimum (<b className="text-purple-500">5</b>) with the first element of this unsorted section (<b className="text-accent">9</b>).</p>
                 <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={9} highlight />
                    <Bubble number={5} minEl />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <Bubble number={5} final />
                    <Bubble number={6} plain />
                    <Bubble number={9} plain />
                </div>
            </div>

            {/* Final Sorted Array */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> After the final pass (swapping 9 and 6), the array is fully sorted.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[2, 4, 5, 6, 9].map((n, i) => <Bubble key={i} number={n} finalWithShadow />)}
                </div>
            </div>
        </div>
    );
};


export default function SelectionSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto md:p-3 lg:p-6 p-1 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Selection Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Selection Sort is an in-place comparison sorting algorithm. The main idea is to divide the list into two parts: a sorted sublist which is built up from left to right, and an unsorted sublist that occupies the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire list.</p>
                    <p>The algorithm proceeds by finding the smallest element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element, and moving the sublist boundaries one element to the right.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <SortStepVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                    <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <ol className="list-decimal list-outside pl-6 space-y-4 text-text-secondary">
                            <li>
                                <strong>Divide and Conquer (Conceptually):</strong> Think of the array as two parts: a sorted part on the left (initially empty) and an unsorted part on the right (initially the whole array).
                            </li>
                            <li>
                                <strong>The Main Loop (Outer Loop):</strong> Start a <span className="font-semibold text-text-primary">outer loop</span> that goes from the first element to the second-to-last. The purpose of this loop is to place one correct element into the sorted part during each pass.
                            </li>
                            <li>
                                <strong>Find the Minimum:</strong> In each pass, your goal is to find the <span className="font-semibold text-text-primary">absolute smallest element</span>  remaining in the <span className="font-semibold text-text-primary">unsorted</span> part.
                                <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
                                    <li>Assume the first element of the unsorted section is the <span className="font-semibold text-text-primary">minimum</span>  for now.</li>
                                    <li>Use a second, <span className="font-semibold text-text-primary">nested loop</span> (the "inner loop") to <span className="font-semibold text-text-primary">scan</span> through the rest of the unsorted elements.</li>
                                    <li>If you find a <span className="font-semibold text-text-primary">smaller element</span>, update your record of what the <span className="font-semibold text-text-primary">minimum</span> is and where it's located.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Perform the Swap:</strong> Once the inner loop is finished, you've found the <span className="font-semibold text-text-primary">true minimum</span>. Now, <span className="font-semibold text-text-primary">Swap</span> it with the first element of the unsorted section.
                            </li>
                            <li>
                                <strong>Grow the Sorted Part:</strong> The element you just swapped is now in its final, correct position. The boundary of the sorted part moves one place to the right.
                            </li>
                            <li>
                                <strong>Repeat:</strong> Continue this process until the unsorted part is empty and the entire array is <span className="font-semibold text-text-primary">sorted</span>.
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
                        <p>Measures how runtime scales with input size (n).</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong className="text-green-500">Best Case: O(n²)</strong> - Still must scan the entire list on each pass, even if sorted.</li>
                            <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Performance is consistent regardless of initial order.</li>
                            <li><strong className="text-red-500">Worst Case: O(n²)</strong> - A reverse-sorted list doesn't change the number of comparisons.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory for tracking the minimum index and for swaps.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={selectionSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Simple & Intuitive:</span> Easy to understand and implement.</li>
                            <li><span className="font-semibold text-text-primary">Space Efficient:</span> Requires only O(1) extra memory.</li>
                            <li><span className="font-semibold text-text-primary">Minimal Swaps:</span> Performs at most n-1 swaps, which can be useful if write operations are expensive.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                             <li><span className="font-semibold text-text-primary">Inefficient (O(n²)):</span> One of the slowest sorting algorithms, impractical for large datasets.</li>
                            <li><span className="font-semibold text-text-primary">Not Adaptive:</span> The runtime is O(n²) regardless of whether the input list is already sorted.</li>
                            <li><span className="font-semibold text-text-primary">Unstable:</span> It can change the relative order of equal elements.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}


// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight} from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

// const selectionSortComplexities = [
//     {
//         label: 'Best Case',
//         complexity: 'O(n²)',
//         formula: n => n * n,
//         color: '#22C55E' // green-500
//     },
//     {
//         label: 'Average Case',
//         complexity: 'O(n²)',
//         formula: n => n * n,
//         color: '#3B82F6' // blue-500
//     },
//     {
//         label: 'Worst Case',
//         complexity: 'O(n²)',
//         formula: n => n * n,
//         color: '#EF4444' // red-500
//     },
// ];

// const SectionHeader = ({ title, icon }) => (
//     <div className="flex items-center gap-4 animate-fade-in-from-left">
//         <div className="w-1.5 h-8 bg-accent rounded-full"></div>
//         <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
//             {icon} {title}
//         </h2>
//     </div>
// );

// const SortStepVisualizer = () => {
//     // Reusable Bubble component
//     const Bubble = ({ number, highlight, final, plain, minEl }) => (
//         <div className={`
//             w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             border-2
//             ${plain ? 'bg-card border-border text-text-primary' : ''}
//             ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//             ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
//             {/* Changed from yellow to purple for the minimum element highlight */}
//             ${minEl ? 'border-purple-500 bg-purple-500/10 text-purple-400' : ''}
//         `}>
//             {number}
//         </div>
//     );

//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-10">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We begin with a completely unsorted list of numbers.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[6, 4, 9, 2, 5].map((n, i) => <Bubble key={i} number={n} plain />)}
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1: Find minimum for index 0</h3>
            
//             {/* Step 1.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Start at the first element (<b className="text-accent">6</b>). Scan the entire unsorted part of the array to find the absolute minimum value.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={6} highlight />
//                     <Bubble number={4} plain />
//                     <Bubble number={9} plain />
//                     <Bubble number={2} minEl />
//                     <Bubble number={5} plain />
//                 </div>
//                 {/* Changed text color from yellow to purple */}
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">The minimum value found is <b className="text-purple-400">2</b>.</p>
//             </div>

//             {/* End of Pass 1 */}
//             <div>
//                  {/* Changed text color from yellow to purple */}
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> Swap the found minimum (<b className="text-purple-400">2</b>) with the element at the current starting position (<b className="text-accent">6</b>). The first element is now sorted.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={6} highlight />
//                     <Bubble number={2} minEl />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={2} final />
//                     <Bubble number={4} plain />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2: Find minimum for index 1</h3>

//             {/* Step 2.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> Move to the next position. Scan the remaining unsorted part (<b className="text-accent">4</b>, 9, 6, 5) to find the next minimum.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={2} final />
//                     <Bubble number={4} highlight />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">In this case, <b className="text-accent">4</b> is already the minimum in the unsorted portion.</p>
//             </div>
            
//              {/* End of Pass 2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> Since the minimum is already in the correct place, no swap is needed. The sorted portion of the array grows.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={2} final />
//                     <Bubble number={4} final />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//             </div>

//             {/* And so on... */}
//             <div>
//                 <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on..</strong></p>
//                 <p className="mt-2 mb-4 text-center text-text-secondary">The process continues. Here is the state of the array before the next pass, where we will find the minimum in the remaining unsorted part (9, 6, 5).</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={2} final />
//                     <Bubble number={4} final />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Pass</h3>
            
//             <div>
//                  {/* Changed text color from yellow to purple */}
//                  <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.1 : </strong> Scan the list [9, 6, 5]. The minimum element is found to be <b className="text-purple-400">5</b>.</p>
//                  <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.2 : </strong> Swap the minimum (<b className="text-purple-400">5</b>) with the first element of this unsorted section (<b className="text-accent">9</b>).</p>
//                  <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={9} highlight />
//                     <Bubble number={5} minEl />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={5} final />
//                     <Bubble number={6} plain />
//                     <Bubble number={9} plain />
//                 </div>
//             </div>

//             {/* Final Sorted Array */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> After the final pass no need to swap 6 and 9 , so the array is fully sorted , and algorithm terminates.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[2, 4, 5, 6, 9].map((n, i) => <Bubble key={i} number={n} final />)}
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function SelectionSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Selection Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Selection Sort is an in-place comparison sorting algorithm. The main idea is to divide the list into two parts: a sorted sublist which is built up from left to right, and an unsorted sublist that occupies the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire list.</p>
//                     <p>The algorithm proceeds by finding the smallest element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element, and moving the sublist boundaries one element to the right.</p>
//                 </div>
//             </section>

//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
//                 <SortStepVisualizer />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                // <div className="mt-6 bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                //     <ol className="list-decimal list-outside pl-6 space-y-4 text-text-secondary">
                //         <li>Start with an outer loop that iterates from the first element of the array to the second-to-last. This loop's counter (`i`) marks the boundary between the sorted and unsorted sections.</li>
                //         <li>Within this loop, assume the first element of the unsorted section (at index `i`) is the minimum. Store its index in a variable, let's say `minIndex`.</li>
                //         <li>Start an inner loop that <span className="font-semibold text-text-primary">scans</span> from the next element (`i + 1`) to the end of the array.</li>
                //         <li>Inside the inner loop, compare each element with the current minimum. If you find an element that is smaller, update `minIndex` to the index of this new minimum.</li>
                //         <li>After the inner loop completes, `minIndex` will hold the index of the smallest element in the entire unsorted section.</li>
                //         <li><span className="font-semibold text-text-primary">Swap</span> the element at the current position (`i`) with the element at `minIndex`.</li>
                //         <li>The outer loop continues, and the boundary of the sorted section grows by one element. Repeat until the entire array is sorted.</li>
                //     </ol>
                // </div>
//             </section>

//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
//                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
//                         <p>Measures how runtime scales with input size (n).</p>
//                         <ul className="list-none space-y-2 pt-2">
//                             <li><strong className="text-green-500">Best Case: O(n²)</strong> - Still must scan the entire list on each pass, even if sorted.</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Performance is consistent regardless of initial order.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - A reverse-sorted list doesn't change the number of comparisons.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory for tracking the minimum index and for swaps.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph complexities={selectionSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple & Intuitive:</span> Easy to understand and implement.</li>
//                             <li><span className="font-semibold text-text-primary">Space Efficient:</span> Requires only O(1) extra memory.</li>
//                             <li><span className="font-semibold text-text-primary">Minimal Swaps:</span> Performs at most n-1 swaps, which can be useful if write operations are expensive.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                              <li><span className="font-semibold text-text-primary">Inefficient (O(n²)):</span> One of the slowest sorting algorithms, impractical for large datasets.</li>
//                             <li><span className="font-semibold text-text-primary">Not Adaptive:</span> The runtime is O(n²) regardless of whether the input list is already sorted.</li>
//                             <li><span className="font-semibold text-text-primary">Unstable:</span> It can change the relative order of equal elements.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }


// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight} from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

// const selectionSortComplexities = [
//     {
//         label: 'Best Case',
//         complexity: 'O(n²)',
//         formula: n => n * n,
//         color: '#22C55E' // green-500
//     },
//     {
//         label: 'Average Case',
//         complexity: 'O(n²)',
//         formula: n => n * n,
//         color: '#3B82F6' // blue-500
//     },
//     {
//         label: 'Worst Case',
//         complexity: 'O(n²)',
//         formula: n => n * n,
//         color: '#EF4444' // red-500
//     },
// ];

// const SectionHeader = ({ title, icon }) => (
//     <div className="flex items-center gap-4 animate-fade-in-from-left">
//         <div className="w-1.5 h-8 bg-accent rounded-full"></div>
//         <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
//             {icon} {title}
//         </h2>
//     </div>
// );

// const SortStepVisualizer = () => {
//     // Reusable Bubble component
//     const Bubble = ({ number, highlight, final, plain, minEl }) => (
//         <div className={`
//             w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             border-2
//             ${plain ? 'bg-card border-border text-text-primary' : ''}
//             ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//             ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
//             ${minEl ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : ''}
//         `}>
//             {number}
//         </div>
//     );

//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-10">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We begin with a completely unsorted list of numbers.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[6, 4, 9, 2, 5].map((n, i) => <Bubble key={i} number={n} plain />)}
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1: Find minimum for index 0</h3>
            
//             {/* Step 1.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Start at the first element (<b className="text-accent">6</b>). Scan the entire unsorted part of the array to find the absolute minimum value.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={6} highlight />
//                     <Bubble number={4} plain />
//                     <Bubble number={9} plain />
//                     <Bubble number={2} minEl />
//                     <Bubble number={5} plain />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">The minimum value found is <b className="text-yellow-400">2</b>.</p>
//             </div>

//             {/* End of Pass 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> Swap the found minimum (<b className="text-yellow-400">2</b>) with the element at the current starting position (<b className="text-accent">6</b>). The first element is now sorted.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={6} highlight />
//                     <Bubble number={2} minEl />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={2} final />
//                     <Bubble number={4} plain />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2: Find minimum for index 1</h3>

//             {/* Step 2.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> Move to the next position. Scan the remaining unsorted part (<b className="text-accent">4</b>, 9, 6, 5) to find the next minimum.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={2} final />
//                     <Bubble number={4} highlight />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">In this case, <b className="text-accent">4</b> is already the minimum in the unsorted portion.</p>
//             </div>
            
//              {/* End of Pass 2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> Since the minimum is already in the correct place, no swap is needed. The sorted portion of the array grows.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={2} final />
//                     <Bubble number={4} final />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//             </div>

//             {/* And so on... */}
//             <div>
//                 <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on..</strong></p>
//                 <p className="mt-2 mb-4 text-center text-text-secondary">The process continues. Here is the state of the array before the next pass, where we will find the minimum in the remaining unsorted part (9, 6, 5).</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={2} final />
//                     <Bubble number={4} final />
//                     <Bubble number={9} plain />
//                     <Bubble number={6} plain />
//                     <Bubble number={5} plain />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Pass</h3>
            
//             <div>
//                  <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.1 : </strong> Scan the list [9, 6, 5]. The minimum element is found to be <b className="text-yellow-400">5</b>.</p>
//                  <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.2 : </strong> Swap the minimum (<b className="text-yellow-400">5</b>) with the first element of this unsorted section (<b className="text-accent">9</b>).</p>
//                  <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={9} highlight />
//                     <Bubble number={5} minEl />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={5} final />
//                     <Bubble number={6} plain />
//                     <Bubble number={9} plain />
//                 </div>
//             </div>

//             {/* Final Sorted Array */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> After the final pass (swapping 9 and 6), the array is fully sorted.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[2, 4, 5, 6, 9].map((n, i) => <Bubble key={i} number={n} final />)}
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function SelectionSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Selection Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Selection Sort is an in-place comparison sorting algorithm. The main idea is to divide the list into two parts: a sorted sublist which is built up from left to right, and an unsorted sublist that occupies the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire list.</p>
//                     <p>The algorithm proceeds by finding the smallest element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element, and moving the sublist boundaries one element to the right.</p>
//                 </div>
//             </section>

//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
//                 <SortStepVisualizer />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
//                 <div className="mt-6 bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                     <ol className="list-decimal list-outside pl-6 space-y-4 text-text-secondary">
//                         <li>Start with an outer loop that iterates from the first element of the array to the second-to-last. This loop's counter (`i`) marks the boundary between the sorted and unsorted sections.</li>
//                         <li>Within this loop, assume the first element of the unsorted section (at index `i`) is the minimum. Store its index in a variable, let's say `minIndex`.</li>
//                         <li>Start an inner loop that <span className="font-semibold text-text-primary">scans</span> from the next element (`i + 1`) to the end of the array.</li>
//                         <li>Inside the inner loop, compare each element with the current minimum. If you find an element that is smaller, update `minIndex` to the index of this new minimum.</li>
//                         <li>After the inner loop completes, `minIndex` will hold the index of the smallest element in the entire unsorted section.</li>
//                         <li><span className="font-semibold text-text-primary">Swap</span> the element at the current position (`i`) with the element at `minIndex`.</li>
//                         <li>The outer loop continues, and the boundary of the sorted section grows by one element. Repeat until the entire array is sorted.</li>
//                     </ol>
//                 </div>
//             </section>

//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
//                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
//                         <p>Measures how runtime scales with input size (n).</p>
//                         <ul className="list-none space-y-2 pt-2">
//                             <li><strong className="text-green-500">Best Case: O(n²)</strong> - Still must scan the entire list on each pass, even if sorted.</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Performance is consistent regardless of initial order.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - A reverse-sorted list doesn't change the number of comparisons.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory for tracking the minimum index and for swaps.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph complexities={selectionSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple & Intuitive:</span> Easy to understand and implement.</li>
//                             <li><span className="font-semibold text-text-primary">Space Efficient:</span> Requires only O(1) extra memory.</li>
//                             <li><span className="font-semibold text-text-primary">Minimal Swaps:</span> Performs at most n-1 swaps, which can be useful if write operations are expensive.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                              <li><span className="font-semibold text-text-primary">Inefficient (O(n²)):</span> One of the slowest sorting algorithms, impractical for large datasets.</li>
//                             <li><span className="font-semibold text-text-primary">Not Adaptive:</span> The runtime is O(n²) regardless of whether the input list is already sorted.</li>
//                             <li><span className="font-semibold text-text-primary">Unstable:</span> It can change the relative order of equal elements.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }