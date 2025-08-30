import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../../shared/SectionHeader';

const bubbleSortComplexities = [
    {
        label: 'Best Case',
        complexity: 'O(n)',
        formula: n => n,
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

const SortStepVisualizer = () => {
    // Reusable Bubble component
    const Bubble = ({ number, highlight, final, plain , finalWithShadow }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-accent bg-accent/10 text-accent border-2' : ''}
            ${final ? 'border-green-400 bg-green-500/10 text-green-500 border-2' : ''}
            ${finalWithShadow ? 'border-green-400 border-1 bg-green-500/5 text-green-500 shadow-md shadow-green-600' : ''}
        `}>
            {number}
        </div>
    );

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-10">
            {/* Initial State */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list of numbers.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 3, 8, 1, 9].map((n, i) => <Bubble key={i} number={n} plain />)}
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1</h3>

            {/* Step 1.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Compare the first two elements: <b className="text-accent">5</b> and <b className="text-accent">3</b>. Since 5 {'>'} 3, we swap them.</p>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={5} highlight />
                    <Bubble number={3} highlight />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <Bubble number={3} highlight />
                    <Bubble number={5} highlight />
                </div>
                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 5, 8, 1, 9]</p>
            </div>

            {/* Step 1.2 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.2 : </strong> Compare the next pair: <b className="text-accent">5</b> and <b className="text-accent">8</b>. Since 5 {'<'} 8, no swap is needed.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={3} plain />
                    <Bubble number={5} highlight />
                    <Bubble number={8} highlight />
                    <Bubble number={1} plain />
                    <Bubble number={9} plain />
                </div>
            </div>

            {/* Step 1.3 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.3 : </strong> Compare <b className="text-accent">8</b> and <b className="text-accent">1</b>. Since 8 {'>'} 1, we swap them.</p>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={8} highlight />
                    <Bubble number={1} highlight />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <Bubble number={1} highlight />
                    <Bubble number={8} highlight />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 5, 1, 8, 9]</p>
            </div>

            {/* Step 1.4 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.4 : </strong> Compare the last pair: <b className="text-accent">8</b> and <b className="text-accent">9</b>. Since 8 {'<'} 9, no swap is needed.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={3} plain />
                    <Bubble number={5} plain />
                    <Bubble number={1} plain />
                    <Bubble number={8} highlight />
                    <Bubble number={9} highlight />
                </div>
            </div>

            {/* End of Pass 1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> The largest element (<b className="text-green-500">9</b>) has "bubbled up" to its correct final position.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[3, 5, 1, 8].map((n, i) => <Bubble key={i} number={n} plain />)}
                    <Bubble number={9} final />
                </div>
            </div>
            
            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2</h3>

            {/* Step 2.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> We repeat the process on the unsorted part. Compare <b className="text-accent">3</b> and <b className="text-accent">5</b>. No swap needed.</p>
                 <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={3} highlight />
                    <Bubble number={5} highlight />
                    <Bubble number={1} plain />
                    <Bubble number={8} plain />
                    <Bubble number={9} final />
                </div>
            </div>

            {/* Step 2.2 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.2 : </strong> Next, compare <b className="text-accent">5</b> and <b className="text-accent">1</b>. Since 5 {'>'} 1, we swap them.</p>
                 <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={5} highlight />
                    <Bubble number={1} highlight />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <Bubble number={1} highlight />
                    <Bubble number={5} highlight />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 1, 5, 8, 9]</p>
            </div>

            {/* Step 2.3 */}
             <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.3 : </strong> Compare the last unsorted pair: <b className="text-accent">5</b> and <b className="text-accent">8</b>. No swap needed.</p>
                 <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={3} plain />
                    <Bubble number={1} plain />
                    <Bubble number={5} highlight />
                    <Bubble number={8} highlight />
                    <Bubble number={9} final />
                </div>
            </div>

            {/* End of Pass 2 */}
             <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> The next largest element (<b className="text-green-500">8</b>) is now in its final position. The sorted portion of the array grows from the right.</p>
                 <div className="flex justify-center gap-2 sm:gap-4">
                    {[3, 1, 5].map((n, i) => <Bubble key={i} number={n} plain />)}
                    <Bubble number={8} final />
                    <Bubble number={9} final />
                </div>
            </div>

            {/* And so on... */}
            <div>
                <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on ..</strong></p>
                <p className="mt-2 mb-4 text-center text-text-secondary">The process continues. Here is the state of the array before the next pass begins:</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={3} plain />
                    <Bubble number={1} plain />
                    <Bubble number={5} plain />
                    <Bubble number={8} final />
                    <Bubble number={9} final />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Pass</h3>

            {/* Step 3.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.1 : </strong> Compare <b className="text-accent">3</b> and <b className="text-accent">1</b>. Since 3 {'>'} 1, we swap them.</p>
                 <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={3} highlight />
                    <Bubble number={1} highlight />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <Bubble number={1} highlight />
                    <Bubble number={3} highlight />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [1, 3, 5, 8, 9]</p>
            </div>
             {/* Step 3.2 */}
             <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.2 : </strong> Compare <b className="text-accent">3</b> and <b className="text-accent">5</b>. No swap needed.</p>
                 <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={1} plain />
                    <Bubble number={3} highlight />
                    <Bubble number={5} highlight />
                    <Bubble number={8} final />
                    <Bubble number={9} final />
                </div>
            </div>

            {/* Final Sorted Array */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> After this pass, the array is now fully sorted. A final check would confirm no more swaps are needed, and the algorithm terminates.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[1, 3, 5, 8, 9].map((n, i) => <Bubble key={i} number={n} finalWithShadow />)}
                </div>
            </div>
        </div>
    );
};

export default function BubbleSortExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Bubble Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Bubble Sort is a simple sorting algorithm where the largest values "bubble" to the top. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
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
                            <strong>The "Bubbling" Concept:</strong> The main idea is to make multiple passes through the array. In each pass, the next largest unsorted element will "bubble up" to its correct position at the end of the array.
                        </li>
                        <li>
                            <strong>Start a Pass (Outer Loop):</strong> Begin a loop that will control how many passes are made. After each full pass, one more element will be in its final sorted place, so the next pass can be shorter.
                        </li>
                        <li>
                            <strong>Compare and Swap Adjacent Elements (Inner Loop):</strong> Within each pass, start another loop that steps through the unsorted part of the array.
                            <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
                                <li><span className="font-semibold text-text-primary">Compare</span> an element with the one directly to its right.</li>
                                <li>If the left element is greater than the right element, <span className="font-semibold text-text-primary">swap</span> them.</li>
                                <li>Move one position to the right and repeat this comparison and potential swap until you reach the end of the unsorted section.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>End of the Pass:</strong> After the inner loop completes, the largest element for that pass is now at the end of the unsorted section. The sorted portion (at the end of the array) has now grown by one.
                        </li>
                        <li>
                            <strong>Repeat Until Sorted:</strong> Continue making passes until no more passes are needed. The array is sorted when a full pass can be completed with zero swaps.
                        </li>
                        <li>
                            <strong>The Optimization:</strong> To implement the step above, use a tracker (like a boolean flag). If a full pass completes and the flag indicates no swaps were made, the array is fully sorted and the algorithm can stop early.
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
                            <li><strong className="text-green-500">Best Case: O(n)</strong> - Array is already sorted (with optimization).</li>
                            <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Elements are in random order.</li>
                            <li><strong className="text-red-500">Worst Case: O(n²)</strong> - Array is sorted in reverse.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={bubbleSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Simple & Intuitive</span> to understand and implement, making it a good educational tool.</li>
                            <li><span className="font-semibold text-text-primary">Space Efficient (O(1))</span> as it only requires a single temporary variable for swaps.</li>
                            <li><span className="font-semibold text-text-primary">Stable Sort</span> which means it preserves the relative order of equal elements.</li>
                             <li><span className="font-semibold text-text-primary">Can be Optimized</span> by stopping early if a pass completes with no swaps.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Highly Inefficient (O(n²))</span> for most cases, making it one of the slowest sorting algorithms.</li>
                            <li><span className="font-semibold text-text-primary">Not Practical for Large Data</span> because the runtime grows quadratically with the number of items.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}



// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

// const bubbleSortComplexities = [
//     {
//         label: 'Best Case',
//         complexity: 'O(n)',
//         formula: n => n,
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
//     const Bubble = ({ number, highlight, final, plain }) => (
//         <div className={`
//             w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             border-2
//             ${plain ? 'bg-card border-border text-text-primary' : ''}
//             ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//             ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
//         `}>
//             {number}
//         </div>
//     );

//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-10">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list of numbers.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[5, 3, 8, 1, 9].map((n, i) => <Bubble key={i} number={n} plain />)}
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1</h3>

//             {/* Step 1.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Compare the first two elements: <b className="text-accent">5</b> and <b className="text-accent">3</b>. Since 5 {'>'} 3, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} highlight />
//                     <Bubble number={3} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                 </div>
//                  <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 5, 8, 1, 9]</p>
//             </div>

//             {/* Step 1.2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.2 : </strong> Compare the next pair: <b className="text-accent">5</b> and <b className="text-accent">8</b>. Since 5 {'<'} 8, no swap is needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={5} highlight />
//                     <Bubble number={8} highlight />
//                     <Bubble number={1} plain />
//                     <Bubble number={9} plain />
//                 </div>
//             </div>

//             {/* Step 1.3 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.3 : </strong> Compare <b className="text-accent">8</b> and <b className="text-accent">1</b>. Since 8 {'>'} 1, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={8} highlight />
//                     <Bubble number={1} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={1} highlight />
//                     <Bubble number={8} highlight />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 5, 1, 8, 9]</p>
//             </div>

//             {/* Step 1.4 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.4 : </strong> Compare the last pair: <b className="text-accent">8</b> and <b className="text-accent">9</b>. Since 8 {'<'} 9, no swap is needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={5} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={8} highlight />
//                     <Bubble number={9} highlight />
//                 </div>
//             </div>

//             {/* End of Pass 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> The largest element (<b className="text-green-400">9</b>) has "bubbled up" to its correct final position.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[3, 5, 1, 8].map((n, i) => <Bubble key={i} number={n} plain />)}
//                     <Bubble number={9} final />
//                 </div>
//             </div>
            
//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2</h3>

//             {/* Step 2.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> We repeat the process on the unsorted part. Compare <b className="text-accent">3</b> and <b className="text-accent">5</b>. No swap needed.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                     <Bubble number={1} plain />
//                     <Bubble number={8} plain />
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             {/* Step 2.2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.2 : </strong> Next, compare <b className="text-accent">5</b> and <b className="text-accent">1</b>. Since 5 {'>'} 1, we swap them.</p>
//                  <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} highlight />
//                     <Bubble number={1} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={1} highlight />
//                     <Bubble number={5} highlight />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 1, 5, 8, 9]</p>
//             </div>

//             {/* Step 2.3 */}
//              <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.3 : </strong> Compare the last unsorted pair: <b className="text-accent">5</b> and <b className="text-accent">8</b>. No swap needed.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={5} highlight />
//                     <Bubble number={8} highlight />
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             {/* End of Pass 2 */}
//              <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> The next largest element (<b className="text-green-400">8</b>) is now in its final position. The sorted portion of the array grows from the right.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     {[3, 1, 5].map((n, i) => <Bubble key={i} number={n} plain />)}
//                     <Bubble number={8} final />
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             {/* And so on... */}
//             <div>
//                 <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on ..</strong></p>
//                 <p className="mt-2 mb-4 text-center text-text-secondary">The process continues. Here is the state of the array before the next pass begins:</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={5} plain />
//                     <Bubble number={8} final />
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Pass</h3>

//             {/* Step 3.1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.1 : </strong> Compare <b className="text-accent">3</b> and <b className="text-accent">1</b>. Since 3 {'>'} 1, we swap them.</p>
//                  <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} highlight />
//                     <Bubble number={1} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={1} highlight />
//                     <Bubble number={3} highlight />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [1, 3, 5, 8, 9]</p>
//             </div>
//              {/* Step 3.2 */}
//              <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.2 : </strong> Compare <b className="text-accent">3</b> and <b className="text-accent">5</b>. No swap needed.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={1} plain />
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                     <Bubble number={8} final />
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             {/* Final Sorted Array */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> After this pass, the array is now fully sorted. A final check would confirm no more swaps are needed, and the algorithm terminates.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[1, 3, 5, 8, 9].map((n, i) => <Bubble key={i} number={n} final />)}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default function BubbleSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Bubble Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Bubble Sort is a simple sorting algorithm where the largest values "bubble" to the top. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
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
//                         <li>Start an outer loop to control the number of passes through the array.</li>
//                         <li>Start an inner loop to perform comparisons. This loop's range shrinks by one after each pass, as the largest elements are already sorted at the end.</li>
//                         <li>In the inner loop, <span className="font-semibold text-text-primary">compare the current element with the next one.</span></li>
//                         <li>If the current element is greater, <span className="font-semibold text-text-primary">swap them.</span></li>
//                         <li><span className="font-semibold text-text-primary">Optimization:</span> If a full pass completes with zero swaps, the array is sorted, and the algorithm can stop early.</li>
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
//                             <li><strong className="text-green-500">Best Case: O(n)</strong> - Array is already sorted (with optimization).</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Elements are in random order.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - Array is sorted in reverse.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph complexities={bubbleSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple & Intuitive</span> to understand and implement, making it a good educational tool.</li>
//                             <li><span className="font-semibold text-text-primary">Space Efficient (O(1))</span> as it only requires a single temporary variable for swaps.</li>
//                             <li><span className="font-semibold text-text-primary">Stable Sort</span> which means it preserves the relative order of equal elements.</li>
//                              <li><span className="font-semibold text-text-primary">Can be Optimized</span> by stopping early if a pass completes with no swaps.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Highly Inefficient (O(n²))</span> for most cases, making it one of the slowest sorting algorithms.</li>
//                             <li><span className="font-semibold text-text-primary">Not Practical for Large Data</span> because the runtime grows quadratically with the number of items.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }



// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

// const bubbleSortComplexities = [
//     {
//         label: 'Best Case',
//         complexity: 'O(n)',
//         formula: n => n,
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
//     const Bubble = ({ number, highlight, final, plain }) => (
//         <div className={`
//             w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             border-2
//             ${plain ? 'bg-card border-border text-text-primary' : ''}
//             ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//             ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
//         `}>
//             {number}
//         </div>
//     );

//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-10">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list of numbers.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[5, 3, 8, 1, 9].map((n, i) => <Bubble key={i} number={n} plain />)}
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1</h3>

//             {/* Step 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Compare the first two elements: <b className="text-accent">5</b> and <b className="text-accent">3</b>. Since 5 {'>'} 3, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} highlight />
//                     <Bubble number={3} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                 </div>
//                  <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 5, 8, 1, 9]</p>
//             </div>

//             {/* Step 2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.2 : </strong> Compare the next pair: <b className="text-accent">5</b> and <b className="text-accent">8</b>. Since 5 {'<'} 8, no swap is needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={5} highlight />
//                     <Bubble number={8} highlight />
//                     <Bubble number={1} plain />
//                     <Bubble number={9} plain />
//                 </div>
//             </div>

//             {/* Step 3 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.3 : </strong> Compare <b className="text-accent">8</b> and <b className="text-accent">1</b>. Since 8 {'>'} 1, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={8} highlight />
//                     <Bubble number={1} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={1} highlight />
//                     <Bubble number={8} highlight />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 5, 1, 8, 9]</p>
//             </div>

//             {/* Step 4 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.4 : </strong> Compare the last pair: <b className="text-accent">8</b> and <b className="text-accent">9</b>. Since 8 {'<'} 9, no swap is needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={5} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={8} highlight />
//                     <Bubble number={9} highlight />
//                 </div>
//             </div>

//             {/* End of Pass 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> The largest element (<b className="text-green-400">9</b>) has "bubbled up" to its correct final position.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {[3, 5, 1, 8].map((n, i) => <Bubble key={i} number={n} plain />)}
//                     <Bubble number={9} final />
//                 </div>
//             </div>
            
//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2</h3>

//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> We repeat the process, but now we only need to check up to the last unsorted element. First, compare <b className="text-accent">3</b> and <b className="text-accent">5</b>. No swap needed.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                     <Bubble number={1} plain />
//                     <Bubble number={8} plain />
//                     <Bubble number={9} final />
//                 </div>
//             </div>
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.2 : </strong> Next, compare <b className="text-accent">5</b> and <b className="text-accent">1</b>. Since 5 {'>'} 1, we swap them.</p>
//                  <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} highlight />
//                     <Bubble number={1} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={1} highlight />
//                     <Bubble number={5} highlight />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [3, 1, 5, 8, 9]</p>
//             </div>
//              <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> The next largest element (<b className="text-green-400">8</b>) is now in its final position. The sorted portion of the array grows from the right.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     {[3, 1, 5].map((n, i) => <Bubble key={i} number={n} plain />)}
//                     <Bubble number={8} final />
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             {/* Conclusion */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">And so on... : </strong> This process continues. Each pass places the next largest element in its correct spot. The algorithm stops when a full pass is completed with zero swaps, indicating the array is fully sorted.</p>
//             </div>
//         </div>
//     );
// };

// export default function BubbleSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Bubble Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Bubble Sort is a simple sorting algorithm where the largest values "bubble" to the top. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
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
//                         <li>Start an outer loop to control the number of passes through the array.</li>
//                         <li>Start an inner loop to perform comparisons. This loop's range shrinks by one after each pass, as the largest elements are already sorted at the end.</li>
//                         <li>In the inner loop, <span className="font-semibold text-text-primary">compare the current element with the next one.</span></li>
//                         <li>If the current element is greater, <span className="font-semibold text-text-primary">swap them.</span></li>
//                         <li><span className="font-semibold text-text-primary">Optimization:</span> If a full pass completes with zero swaps, the array is sorted, and the algorithm can stop early.</li>
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
//                             <li><strong className="text-green-500">Best Case: O(n)</strong> - Array is already sorted (with optimization).</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Elements are in random order.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - Array is sorted in reverse.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph complexities={bubbleSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple & Intuitive</span> to understand and implement, making it a good educational tool.</li>
//                             <li><span className="font-semibold text-text-primary">Space Efficient (O(1))</span> as it only requires a single temporary variable for swaps.</li>
//                             <li><span className="font-semibold text-text-primary">Stable Sort</span> which means it preserves the relative order of equal elements.</li>
//                              <li><span className="font-semibold text-text-primary">Can be Optimized</span> by stopping early if a pass completes with no swaps.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Highly Inefficient (O(n²))</span> for most cases, making it one of the slowest sorting algorithms.</li>
//                             <li><span className="font-semibold text-text-primary">Not Practical for Large Data</span> because the runtime grows quadratically with the number of items.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }



// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

// const bubbleSortComplexities = [
//     {
//         label: 'Best Case',
//         complexity: 'O(n)',
//         formula: n => n,
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
//     // Define the state of the array at various points for clarity
//     const initialState = [5, 3, 8, 1, 9];
//     const stateAfterStep1 = [3, 5, 8, 1, 9];
//     const stateAfterStep3 = [3, 5, 1, 8, 9];
//     const afterPass1 = [3, 5, 1, 8, 9];

//     // Reusable Bubble component
//     const Bubble = ({ number, highlight, final, plain }) => (
//         <div className={`
//             w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             border-2
//             ${plain ? 'bg-card border-border text-text-primary' : ''}
//             ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//             ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
//         `}>
//             {number}
//         </div>
//     );

//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-10">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with this unsorted list.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {initialState.map((n, i) => <Bubble key={i} number={n} plain />)}
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1</h3>

//             {/* Step 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1 : </strong> Compare <b className="text-accent">5</b> and <b className="text-accent">3</b>. Since 5 {'>'} 3, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} highlight />
//                     <Bubble number={3} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                 </div>
//                  <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [{stateAfterStep1.join(', ')}]</p>
//             </div>

//             {/* Step 2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2 : </strong> Next, compare <b className="text-accent">5</b> and <b className="text-accent">8</b>. Since 5 {'<'} 8, no swap is needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={5} highlight />
//                     <Bubble number={8} highlight />
//                     <Bubble number={1} plain />
//                     <Bubble number={9} plain />
//                 </div>
//             </div>

//             {/* Step 3 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 3 : </strong> Now, compare <b className="text-accent">8</b> and <b className="text-accent">1</b>. Since 8 {'>'} 1, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={8} highlight />
//                     <Bubble number={1} highlight />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <Bubble number={1} highlight />
//                     <Bubble number={8} highlight />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Array is now: [{stateAfterStep3.join(', ')}]</p>
//             </div>

//             {/* Step 4 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 4 : </strong> Finally, compare <b className="text-accent">8</b> and <b className="text-accent">9</b>. Since 8 {'<'} 9, no swap is needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} plain />
//                     <Bubble number={5} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={8} highlight />
//                     <Bubble number={9} highlight />
//                 </div>
//             </div>


//             {/* End of Pass 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> After a full pass, the largest element (<b className="text-green-400">9</b>) has "bubbled up" to its final position.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     {afterPass1.slice(0, 4).map((n, i) => <Bubble key={i} number={n} plain />)}
//                     <Bubble number={9} final />
//                 </div>
//             </div>

//             {/* End of Pass 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Next : </strong> Repeat the above steps until the array is not sorted . </p>
//             </div>
//         </div>
//     );
// };

// export default function BubbleSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Bubble Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Bubble Sort is a simple sorting algorithm where the largest values "bubble" to the top. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
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
//                         <li>Start an outer loop to control the number of passes through the array.</li>
//                         <li>Start an inner loop to perform comparisons. This loop's range shrinks by one after each pass, as the largest elements are already sorted at the end.</li>
//                         <li>In the inner loop, <span className="font-semibold text-text-primary">compare the current element with the next one.</span></li>
//                         <li>If the current element is greater, <span className="font-semibold text-text-primary">swap them.</span></li>
//                         <li><span className="font-semibold text-text-primary">Optimization:</span> If a full pass completes with zero swaps, the array is sorted, and the algorithm can stop early.</li>
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
//                             <li><strong className="text-green-500">Best Case: O(n)</strong> - Array is already sorted.</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Elements are in random order.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - Array is sorted in reverse.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory.</p>
//                         </div>
//                     </div>
//                 </div>
//                  {/* --- GRAPH MOVED HERE, BELOW THE EXPLANATIONS --- */}
//                 <TimeComplexityGraph complexities={bubbleSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple & Intuitive</span></li>
//                             <li><span className="font-semibold text-text-primary">Space Efficient (O(1))</span></li>
//                             <li><span className="font-semibold text-text-primary">Stable Sort</span></li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Highly Inefficient (O(n²))</span></li>
//                             <li><span className="font-semibold text-text-primary">Not Practical for Large Data</span></li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Assuming it's in the same folder

// // A more vibrant and consistent SectionHeader
// const SectionHeader = ({ title, icon }) => (
//     <div className="flex items-center gap-4 animate-fade-in-from-left">
//         <div className="w-1.5 h-8 bg-accent rounded-full"></div>
//         <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
//             {icon} {title}
//         </h2>
//     </div>
// );

// // A visual component for the "How it Works" section
// const SortStepVisualizer = () => {
//     const initialState = [5, 3, 8, 1, 9];
//     const afterFirstSwap = [3, 5, 8, 1, 9];
//     const afterSecondSwap = [3, 5, 1, 8, 9];

//     const Bubble = ({ number, highlight, final }) => (
//         <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             ${highlight ? 'bg-accent/20 border-2 border-accent text-accent-foreground' : 'bg-card border border-border'}
//             ${final ? 'bg-green-500/20 border-2 border-green-500 text-green-300' : ''}
//         `}>
//             {number}
//         </div>
//     );
    
//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-8">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-3 text-text-secondary"><span className="font-bold text-text-primary">Initial Array:</span> We start with an unsorted list of numbers.</p>
//                 <div className="flex justify-center gap-2">
//                     {initialState.map((n, i) => <Bubble key={i} number={n} />)}
//                 </div>
//             </div>

//             {/* Step 1 */}
//             <div>
//                 <p className="mb-3 text-text-secondary"><span className="font-bold text-text-primary">Step 1:</span> Compare the first two elements (5 and 3). Since 5 {">"} 3, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2">
//                     <Bubble number={5} highlight />
//                     <Bubble number={3} highlight />
//                     <span className="text-accent font-bold mx-2 text-2xl">→</span>
//                     <Bubble number={3} highlight />
//                     <Bubble number={5} highlight />
//                 </div>
//                 <p className="text-center mt-2 font-mono text-sm text-accent">Array becomes: [3, 5, 8, 1, 9]</p>
//             </div>

//              {/* Step 2 */}
//             <div>
//                 <p className="mb-3 text-text-secondary"><span className="font-bold text-text-primary">Step 2:</span> Compare the next pair (8 and 1). Since 8 {'>'} 1, we swap them.</p>
//                 <div className="flex items-center justify-center gap-2">
//                      <Bubble number={8} highlight />
//                      <Bubble number={1} highlight />
//                     <span className="text-accent font-bold mx-2 text-2xl">→</span>
//                      <Bubble number={1} highlight />
//                      <Bubble number={8} highlight />
//                 </div>
//                 <p className="text-center mt-2 font-mono text-sm text-accent">Array becomes: [3, 5, 1, 8, 9]</p>
//             </div>

//             {/* Final State after Pass 1 */}
//             <div>
//                 <p className="mb-3 text-text-secondary"><span className="font-bold text-text-primary">End of Pass 1:</span> The largest element (9) has "bubbled up" to its correct final position.</p>
//                 <div className="flex justify-center gap-2">
//                     {afterSecondSwap.slice(0, 4).map((n, i) => <Bubble key={i} number={n} />)}
//                     <Bubble number={9} final />
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function BubbleSortExplanation() {
//     return (
//         // The main container now inherits the theme background and has padding.
//         // The `animate-fade-in-up` class provides a nice entry animation.
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-16 animate-fade-in-up">
            
//             {/* --- Hero Section --- */}
//             <header className="text-center space-y-4">
//                 <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to animate-gradient-pan">
//                     Bubble Sort
//                 </h1>
//                 <p className="text-lg text-text-secondary max-w-2xl mx-auto">
//                     The simplest sorting algorithm, perfect for understanding the basics of how sorting works. Let's dive in!
//                 </p>
//             </header>

//             {/* --- Section: What is Bubble Sort? --- */}
//             <section>
//                 <SectionHeader title="What is Bubble Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Bubble Sort is a simple, comparison-based sorting algorithm. Think of it like bubbles in water—the biggest "bubbles" (numbers) rise to the top (the end of the list) with each pass.</p>
//                     <p>It repeatedly steps through the list, compares each pair of adjacent items, and swaps them if they are in the wrong order. This process is repeated until the list is sorted and no more swaps are needed.</p>
//                 </div>
//             </section>

//             {/* --- Section: How Does It Work? --- */}
//             <section>
//                 <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Let's visualize the first few steps with an example array: <code className="font-mono bg-card border border-border px-2 py-1 rounded-md text-accent text-sm">[5, 3, 8, 1, 9]</code>.</p>
//                     <SortStepVisualizer />
//                     <p className="mt-6">This process continues, with each pass getting shorter by one element, until the entire array is sorted. It's simple but involves many comparisons and swaps!</p>
//                 </div>
//             </section>
            
//             {/* --- Section: Algorithm Steps --- */}
//             <section>
//                 <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
//                 <div className="mt-6 text-text-secondary text-base leading-relaxed bg-card/50 border border-border rounded-xl p-6">
//                     <ol className="list-decimal list-outside pl-6 space-y-3">
//                         <li><span className="font-semibold text-text-primary">Iterate through the array</span> from the first element to the last unsorted element.</li>
//                         <li>For each element, <span className="font-semibold text-text-primary">compare it with the next one.</span></li>
//                         <li>If the current element is greater than the next element, <span className="font-semibold text-text-primary">swap them.</span></li>
//                         <li>After one full pass, the largest element will be at the very end.</li>
//                         <li><span className="font-semibold text-text-primary">Repeat the process</span> for the remaining (n-1) elements, then (n-2), and so on, until the array is fully sorted.</li>
//                     </ol>
//                 </div>
//             </section>

//             {/* --- Section: Complexity Analysis --- */}
//             <section>
//                 <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
//                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
//                         <p>This measures how the algorithm's runtime scales with the input size (n).</p>
//                         <ul className="list-none space-y-2 pt-2">
//                             <li><strong className="text-green-500">Best Case: O(n)</strong> - When the array is already sorted. A single pass is enough to confirm it.</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - For randomly ordered arrays.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - When the array is sorted in reverse order.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>This measures the extra memory the algorithm needs to run.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">Bubble sort is an "in-place" algorithm, meaning it sorts the list without needing to create a copy, requiring only a constant amount of extra space.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph />
//             </section>
            
//             {/* --- Section: Pros & Cons --- */}
//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border-border rounded-xl p-6">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple to Understand:</span> Its logic is straightforward, making it a great first algorithm to learn.</li>
//                             <li><span className="font-semibold text-text-primary">Space Efficient:</span> Requires no extra memory (O(1) space complexity).</li>
//                             <li><span className="font-semibold text-text-primary">Stable Sort:</span> It preserves the relative order of equal elements.</li>
//                             <li><span className="font-semibold text-text-primary">Optimized for Sorted Data:</span> Can detect a sorted list early and stop, achieving O(n) in the best case.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border-border rounded-xl p-6">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Very Inefficient:</span> Its O(n²) time complexity makes it extremely slow for even moderately large datasets.</li>
//                             <li><span className="font-semibold text-text-primary">Not Practical:</span> In real-world scenarios, it is almost always outperformed by algorithms like Merge Sort or Quick Sort.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }






// import { CheckCircle, XCircle, Clock, Database, BarChartHorizontal, BrainCircuit, Zap } from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph';

// const SectionHeader = ({ title, icon }) => (
//     <div className="flex items-center gap-4">
//         <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
//             {icon} {title}
//         </h2>
//     </div>
// );

// export const KeyCharacteristicCard = ({ icon, title, value, valueColor, children }) => (
//     <div className="bg-card border border-border rounded-xl p-6 flex-grow flex-shrink-0 basis-full md:basis-[30%] shadow-md hover:shadow-[0_0_20px_var(--glow-color)] hover:-translate-y-1 transition-all duration-300">
//         <div className="flex items-center gap-4 mb-3">
//             <div className="p-2 rounded-lg bg-[--glow-color]">{icon}</div>
//             <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
//         </div>
//         <p className={`text-3xl font-bold font-mono ${valueColor}`}>{value}</p>
//         <p className="text-sm text-text-secondary mt-1">{children}</p>
//     </div>
// );

// export default function BubbleSortExplanation() {
//     return (
//         <div className="bg-white dark:bg-gray-900">
//             <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
                
//                 {/* Section: What is Bubble Sort? */}
//                 <section>
//                     <SectionHeader title="What is Bubble Sort?" icon={<BrainCircuit size={28} />} />
//                     <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
//                         <p>Bubble Sort is a simple, comparison-based sorting algorithm. It works by repeatedly stepping through the list, comparing each pair of adjacent items, and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
//                         <p>Although the algorithm is simple, it is too slow and impractical for most problems. It is mainly used as an educational tool to introduce sorting concepts.</p>
//                     </div>
//                 </section>

//                 <hr className="border-gray-200 dark:border-gray-700" />

//                 {/* Section: How Does It Work? */}
//                 <section>
//                     <SectionHeader title="How Does It Work?" />
//                     <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
//                          <p>Imagine a list of numbers: <code className="font-mono bg-gray-100 dark:bg-gray-700/80 px-2 py-1 rounded-md text-blue-600 dark:text-blue-400 text-sm">[5, 3, 8, 1, 9]</code>. Bubble sort performs multiple passes to sort it.</p>
//                         <div className="mt-4 pl-4 border-l-4 border-blue-200 dark:border-blue-700">
//                             <h4 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-2">Pass 1:</h4>
//                             <ol className="list-decimal list-inside space-y-2">
//                                 <li>Compare <strong>5</strong> and <strong>3</strong>. Since 5 {'>'} 3, swap. Array: <code className="font-mono text-sm">[3, 5, 8, 1, 9]</code></li>
//                                 <li>Compare <strong>5</strong> and <strong>8</strong>. Since 5 {'<'} 8, do nothing.</li>
//                                 <li>Compare <strong>8</strong> and <strong>1</strong>. Since 8 {'>'} 1, swap. Array: <code className="font-mono text-sm">[3, 5, 1, 8, 9]</code></li>
//                                 <li>Compare <strong>8</strong> and <strong>9</strong>. Since 8 {'<'} 9, do nothing.</li>
//                             </ol>
//                             <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">After Pass 1, the largest element (9) is in its final position.</p>
//                         </div>
//                     </div>
//                 </section>
                
//                 <hr className="border-gray-200 dark:border-gray-700" />

//                 {/* Section: Algorithm Steps */}
//                 <section>
//                     <SectionHeader title="Algorithm Steps" icon={<BarChartHorizontal size={28} />} />
//                     <div className="mt-6 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
//                         <ol className="list-decimal list-outside pl-6 space-y-2">
//                             <li>Start at the beginning of the array.</li>
//                             <li>Compare the current element with the next one.</li>
//                             <li>If the current element is greater, swap them.</li>
//                             <li>Move to the next pair and repeat until the end of the array.</li>
//                             <li>The largest element is now at the end. Repeat the process for the rest of the array.</li>
//                         </ol>
//                     </div>
//                 </section>

//                 <hr className="border-gray-200 dark:border-gray-700" />

//                 {/* Section: Complexity Analysis */}
//                 <section>
//                     <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
//                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 dark:text-gray-300 text-base">
//                         <div className="space-y-3">
//                             <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
//                             <ul className="list-disc list-outside pl-5 space-y-1">
//                                 <li><strong>Best Case:</strong> <code className="font-mono text-green-600 dark:text-green-400">O(n)</code></li>
//                                 <li><strong>Average Case:</strong> <code className="font-mono text-yellow-600 dark:text-yellow-400">O(n²)</code></li>
//                                 <li><strong>Worst Case:</strong> <code className="font-mono text-red-600 dark:text-red-400">O(n²)</code></li>
//                             </ul>
//                         </div>
//                         <div className="space-y-3">
//                             <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                             <p>The space complexity is <code className="font-mono text-indigo-600 dark:text-indigo-400">O(1)</code> because it only requires a constant amount of extra memory.</p>
//                         </div>
//                     </div>
//                     <TimeComplexityGraph />
//                 </section>
                
//                 <hr className="border-gray-200 dark:border-gray-700" />

//                 {/* Section: Pros & Cons */}
//                 <section>
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <div>
//                             <h3 className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                             <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
//                                 <li>Very simple to understand and implement.</li>
//                                 <li>Space efficient (O(1) space complexity).</li>
//                                 <li>Stable sort (preserves order of equal elements).</li>
//                                 <li>Can be optimized to detect a sorted list early.</li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                             <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
//                                 <li>Highly inefficient time complexity of O(n²).</li>
//                                 <li>Not suitable for large datasets.</li>
//                                 <li>Generally outperformed by most other sorting algorithms.</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }


// import { BarChart3 , Scale , CheckCircle2 ,  XCircle} from "lucide-react";


// export const KeyCharacteristicCard = ({ icon, title, value, valueColor, children }) => (
//     <div className="bg-card border border-border rounded-xl p-6 flex-grow flex-shrink-0 basis-full md:basis-[30%] shadow-md hover:shadow-[0_0_20px_var(--glow-color)] hover:-translate-y-1 transition-all duration-300">
//         <div className="flex items-center gap-4 mb-3">
//             <div className="p-2 rounded-lg bg-[--glow-color]">{icon}</div>
//             <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
//         </div>
//         <p className={`text-3xl font-bold font-mono ${valueColor}`}>{value}</p>
//         <p className="text-sm text-text-secondary mt-1">{children}</p>
//     </div>
// );

// // Diagram built with Divs
// export const Diagram = ({ before, after, label, labelColor, question }) => (
//     <div>
//         <h3 className="font-semibold text-text-primary text-center mb-2">{question}</h3>
//         <div className="flex items-center justify-center gap-2 h-[150px] p-4 rounded-lg bg-background">
//             {/* "Before" State */}
//             <div className="flex items-end gap-1">
//                 {before.map((val, i) => (
//                     <div key={`before-${i}`} className="w-12 rounded-t-sm bg-yellow-500/80 text-center text-white font-bold text-lg pt-1" style={{ height: `${val * 1.2}px` }}>
//                         {val}
//                     </div>
//                 ))}
//             </div>
            
//             {/* Arrow and Label */}
//             <div className="flex flex-col items-center w-24 text-center">
//                 <p className={`font-bold text-lg ${labelColor}`}>{label}</p>
//                 <div className={`w-12 h-0.5 ${labelColor.replace('text-', 'bg-')}`}></div>
//             </div>
            
//             {/* "After" State */}
//             <div className="flex items-end gap-1">
//                 {after.map((val, i) => (
//                     <div key={`after-${i}`} className="w-12 rounded-t-sm bg-accent/80 text-center text-white font-bold text-lg pt-1" style={{ height: `${val * 1.2}px` }}>
//                         {val}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

// const BubbleSortExplanation = ({ info }) => {
//     return (
//         <div className="space-y-16">
//             <p className="text-center text-lg text-text-secondary max-w-3xl mx-auto">{info.summary}</p>
//             <div>
//                 <h2 className="text-2xl font-bold text-text-primary text-center mb-6 [text-shadow:0_0_10px_var(--glow-color)]">Key Characteristics</h2>
//                 <div className="flex flex-wrap justify-center gap-6">
//                     <KeyCharacteristicCard icon={<BarChart3 size={24} className="text-accent"/>} title="Time Complexity" value={info.characteristics.timeComplexity.value} valueColor="text-red-500">{info.characteristics.timeComplexity.description}</KeyCharacteristicCard>
//                     <KeyCharacteristicCard icon={<Scale size={24} className="text-accent"/>} title="Space Complexity" value={info.characteristics.spaceComplexity.value} valueColor="text-green-500">{info.characteristics.spaceComplexity.description}</KeyCharacteristicCard>
//                     <KeyCharacteristicCard icon={<CheckCircle2 size={24} className="text-accent"/>} title="Stability" value={info.characteristics.stability.value} valueColor="text-blue-500">{info.characteristics.stability.description}</KeyCharacteristicCard>
//                 </div>
//             </div>
            
//             <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-lg animate-[pulse-glow_4s_ease-in-out_infinite]">
//                 <h2 className="text-2xl font-bold text-text-primary text-center mb-4 [text-shadow:0_0_10px_var(--glow-color)]">How It Works: The Core Logic</h2>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//                     <div className="text-text-secondary space-y-3">
//                         <p>The algorithm's logic boils down to one simple question for each pair of adjacent elements:</p>
//                         <ol className="list-decimal list-inside space-y-2 pl-2">
//                            {info.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
//                         </ol>
//                     </div>
//                     <div className="space-y-6">
//                         <Diagram before={[80, 40]} after={[40, 80]} label="SWAP" labelColor="text-red-500" question={<>Is 80 &gt; 40? <span className="text-green-500 font-bold">Yes.</span></>} />
//                         <Diagram before={[30, 90]} after={[30, 90]} label="KEEP" labelColor="text-blue-500" question={<>Is 30 &gt; 90? <span className="text-red-500 font-bold">No.</span></>} />
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Pros</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{info.pros.map((pro, index) => <li key={index}>{pro}</li>)}</ul></div>
//                 <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><XCircle className="text-red-500"/> Cons</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{info.cons.map((con, index) => <li key={index}>{con}</li>)}</ul></div>
//             </div>
//         </div>
//     );
// };

// export default BubbleSortExplanation ;