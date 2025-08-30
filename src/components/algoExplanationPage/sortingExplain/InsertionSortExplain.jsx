import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

const insertionSortComplexities = [
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
    const Bubble = ({ number, highlight, final, plain, keyEl }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            border-2
            ${plain ? 'bg-card border-border text-text-primary' : ''}
            ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
            ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
            ${keyEl ? 'border-purple-500 bg-purple-500/10 text-purple-400' : ''}
        `}>
            {number}
        </div>
    );

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-10">
            {/* Initial State */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list. The first element is considered a "sorted" sub-array of one.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={7} final />
                    <Bubble number={2} plain />
                    <Bubble number={5} plain />
                    <Bubble number={4} plain />
                    <Bubble number={9} plain />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1: Insert 2</h3>

            {/* Step 1.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1.1 : </strong> Take the next element, <b className="text-purple-400">2</b>, as the key. Compare it with the sorted sub-array (<b className="text-green-400">7</b>). Since 2 {'<'} 7, we shift 7 to the right.</p>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Bubble number={7} highlight />
                    <Bubble number={2} keyEl />
                    <ArrowRight className="text-accent/80 mx-2" size={24} />
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-dashed border-border rounded-full"></div> {/* Placeholder */}
                        <Bubble number={7} highlight />
                    </div>
                </div>
            </div>
            
            {/* End of Pass 1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 1 : </strong> Insert the key <b className="text-purple-400">2</b> into the created gap. The sorted sub-array is now [2, 7].</p>
                 <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={7} final />
                    <Bubble number={5} plain />
                    <Bubble number={4} plain />
                    <Bubble number={9} plain />
                </div>
            </div>
            
            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2: Insert 5</h3>
            
            {/* Step 2.1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 2.1 : </strong> The next key is <b className="text-purple-400">5</b>. Compare it with <b className="text-green-400">7</b>. Since 5 {'<'} 7, we shift 7 to the right.</p>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                     <Bubble number={2} final />
                     <Bubble number={7} highlight />
                     <Bubble number={5} keyEl />
                     <ArrowRight className="text-accent/80 mx-2" size={24} />
                     <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14"></div> {/* Spacer */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-dashed border-border rounded-full"></div> {/* Placeholder */}
                        <Bubble number={7} highlight />
                    </div>
                </div>
            </div>
            
            {/* End of Pass 2 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">End of Pass 2 : </strong> Next, compare <b className="text-purple-400">5</b> with <b className="text-green-400">2</b>. Since 5 {'>'} 2, we stop and insert 5 into the gap. The sorted sub-array is now [2, 5, 7].</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={5} final />
                    <Bubble number={7} final />
                    <Bubble number={4} plain />
                    <Bubble number={9} plain />
                </div>
            </div>
            
            {/* And so on... */}
            <div>
                <p className="text-center text-text-secondary font-bold pt-4 border-t border-border"><strong className="text-text-primary">And so on..</strong></p>
                <p className="mt-2 mb-4 text-center text-text-secondary">The process continues. Here is the state of the array before the next pass begins, where we will insert the key <b className="text-purple-400">4</b>.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={5} final />
                    <Bubble number={7} final />
                    <Bubble number={4} plain />
                    <Bubble number={9} plain />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Final Pass: Insert 4</h3>
            
            <div>
                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.1 : </strong> The key is <b className="text-purple-400">4</b>. Compare with <b className="text-green-400">7</b> and <b className="text-green-400">5</b>. Since 4 is smaller than both, shift them to the right.</p>
                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step Final.2 : </strong> Compare <b className="text-purple-400">4</b> with <b className="text-green-400">2</b>. Since 4 {'>'} 2, we stop and insert 4 in the gap after 2.</p>
                 <div className="flex justify-center gap-2 sm:gap-4">
                    <Bubble number={2} final />
                    <Bubble number={4} final />
                    <Bubble number={5} final />
                    <Bubble number={7} final />
                    <Bubble number={9} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Sorted sub-array is now: [2, 4, 5, 7]</p>
            </div>
            
            {/* Final Sorted Array */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Sorted Array : </strong> The last element, <b className="text-purple-400">9</b>, is already greater than the largest sorted element (<b className="text-green-400">7</b>), so it stays in place. The array is now fully sorted , and algorithm terminates.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                     <Bubble number={2} final />
                     <Bubble number={4} final />
                     <Bubble number={5} final />
                     <Bubble number={7} final />
                     <Bubble number={9} final />
                </div>
            </div>
        </div>
    );
};

export default function InsertionSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto md:p-3 lg:p-6 p-1 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Insertion Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It's much like sorting a hand of playing cards: you start with an empty left hand (the sorted part) and the cards on the table (the unsorted part). You then take one card at a time from the table and insert it into the correct position in your hand.</p>
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
                            <strong>Build a Sorted Sub-array:</strong> Think of the array as two parts: a sorted part on the left (which starts with just the first element) and an unsorted part on the right.
                        </li>
                        <li>
                            <strong>Pick the Next Element (The 'Key'):</strong> Start a loop from the second element of the array to the end. In each step, this element is the "key" that you will insert into its correct place in the sorted part.
                        </li>
                        <li>
                            <strong>Find the Correct Spot:</strong> Now, look backwards through the sorted sub-array (from right to left) to find where the key belongs.
                            <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
                                <li>Compare the key with each element in the sorted part.</li>
                                <li>If a sorted element is larger than the key, <span className="font-semibold text-text-primary">shift</span> it one position to the right to make space.</li>
                                <li>Continue this shifting process until you either find an element smaller than the key or you reach the beginning of the array.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Insert the Key:</strong> Once you've stopped shifting, you will have created an empty spot or "hole". <span className="font-semibold text-text-primary">Insert</span> the key into this spot.
                        </li>
                        <li>
                            <strong>Repeat:</strong> The sorted sub-array has now grown by one element. Continue this process, picking the next unsorted element and inserting it, until the entire array is sorted.
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
                            <li><strong className="text-green-500">Best Case: O(n)</strong> - Array is already sorted. Only one comparison per element.</li>
                            <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Elements are in random order.</li>
                            <li><strong className="text-red-500">Worst Case: O(n²)</strong> - Array is sorted in reverse.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory for the key.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={insertionSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Simple & Intuitive</span> to implement and understand.</li>
                            <li><span className="font-semibold text-text-primary">Efficient for small datasets</span> and nearly sorted datasets.</li>
                            <li><span className="font-semibold text-text-primary">Adaptive:</span> Its speed increases if the array is partially sorted.</li>
                            <li><span className="font-semibold text-text-primary">Stable Sort:</span> Doesn't change the relative order of equal elements.</li>
                             <li><span className="font-semibold text-text-primary">Space Efficient:</span> Requires O(1) extra space.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                             <li><span className="font-semibold text-text-primary">Inefficient for large datasets</span> due to its O(n²) complexity.</li>
                            <li><span className="font-semibold text-text-primary">Slower</span> than more advanced algorithms like Quick Sort or Merge Sort.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}



// import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
// import TimeComplexityGraph from '../time_space_compexity/TimeComplexityGraph'; // Make sure path is correct

// const insertionSortComplexities = [
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
//     const Bubble = ({ number, highlight, final, plain, keyEl }) => (
//         <div className={`
//             w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
//             border-2
//             ${plain ? 'bg-card border-border text-text-primary' : ''}
//             ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
//             ${final ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
//             ${keyEl ? 'border-purple-500 bg-purple-500/10 text-purple-400' : ''}
//         `}>
//             {number}
//         </div>
//     );

//     return (
//         <div className="mt-8 p-6 bg-card/50 border border-border rounded-xl space-y-10">
//             {/* Initial State */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array : </strong> We start with an unsorted list. The first element is considered a "sorted" sub-array of one.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} final />
//                     <Bubble number={3} plain />
//                     <Bubble number={8} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={9} plain />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 1: Insert 3</h3>

//             {/* Step 1 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 1 : </strong> Take the next element, <b className="text-purple-400">3</b>, as the key. Compare it with elements in the sorted sub-array (just <b className="text-green-400">5</b>). Since 3 {'<'} 5, shift 5 to the right.</p>
//                 <div className="flex items-center justify-center gap-2 sm:gap-4">
//                     <Bubble number={5} final />
//                     <Bubble number={3} keyEl />
//                     <ArrowRight className="text-accent/80 mx-2" size={24} />
//                     <div className="flex items-center gap-2 sm:gap-4">
//                         <div className="w-12 h-12 sm:w-14 sm:h-14"></div> {/* Placeholder */}
//                         <Bubble number={5} highlight />
//                     </div>
//                 </div>
//                 <p className="mt-4 text-text-secondary"><strong className="text-text-primary">Step 2 : </strong> Insert the key <b className="text-purple-400">3</b> into the created gap.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4 mt-4">
//                     <Bubble number={3} final />
//                     <Bubble number={5} final />
//                     <Bubble number={8} plain />
//                     <Bubble number={1} plain />
//                     <Bubble number={9} plain />
//                 </div>
//                  <p className="mt-4 text-center text-text-secondary/80 text-sm">Sorted sub-array is now: [3, 5]</p>
//             </div>
            
//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 2: Insert 8</h3>

//             {/* Step 2 */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 3 : </strong> Key is <b className="text-purple-400">8</b>. Compare with <b className="text-green-400">5</b>. Since 8 {'>'} 5, it's already in the correct position. No shifts needed.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={3} final />
//                     <Bubble number={5} final />
//                     <Bubble number={8} keyEl />
//                     <Bubble number={1} plain />
//                     <Bubble number={9} plain />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Sorted sub-array is now: [3, 5, 8]</p>
//             </div>
            
//             <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Pass 3: Insert 1</h3>
//             <div>
//                  <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Step 4 : </strong> Key is <b className="text-purple-400">1</b>. Compare with <b className="text-green-400">8</b>, <b className="text-green-400">5</b>, and <b className="text-green-400">3</b>. Since 1 is smaller than all of them, shift them all one position to the right and insert <b className="text-purple-400">1</b> at the beginning.</p>
//                  <div className="flex justify-center gap-2 sm:gap-4">
//                     <Bubble number={1} final />
//                     <Bubble number={3} final />
//                     <Bubble number={5} final />
//                     <Bubble number={8} final />
//                     <Bubble number={9} plain />
//                 </div>
//                 <p className="mt-4 text-center text-text-secondary/80 text-sm">Sorted sub-array is now: [1, 3, 5, 8]</p>
//             </div>

//             {/* End */}
//             <div>
//                 <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Final Pass : </strong> The final key, <b className="text-purple-400">9</b>, is compared with <b className="text-green-400">8</b> and is already in place. The array is now fully sorted.</p>
//                 <div className="flex justify-center gap-2 sm:gap-4">
//                      <Bubble number={1} final />
//                      <Bubble number={3} final />
//                      <Bubble number={5} final />
//                      <Bubble number={8} final />
//                      <Bubble number={9} final />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default function InsertionSortExplanation() {
//     return (
//         <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in-up">
            
//             <section>
//                 <SectionHeader title="What is Insertion Sort?" icon={<BrainCircuit size={28} />} />
//                 <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
//                     <p>Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It's much like sorting a hand of playing cards: you start with an empty left hand (the sorted part) and the cards on the table (the unsorted part). You then take one card at a time from the table and insert it into the correct position in your hand.</p>
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
//                         <li>Consider the first element of the array to be a sorted sub-array of size 1.</li>
//                         <li>Start an outer loop from the second element (index 1) to the end of the array.</li>
//                         <li>Store the current element as a <span className="font-semibold text-text-primary">"key"</span>. This is the value to be inserted into the sorted sub-array.</li>
//                         <li>Compare the key with the elements in the sorted sub-array, moving from right to left.</li>
//                         <li>If an element in the sorted sub-array is greater than the key, <span className="font-semibold text-text-primary">shift it one position to the right</span> to make space.</li>
//                         <li>Continue shifting until you find an element smaller than or equal to the key, or you reach the beginning of the array.</li>
//                         <li><span className="font-semibold text-text-primary">Insert the key</span> into the "hole" you've created.</li>
//                         <li>Repeat until the entire array is sorted.</li>
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
//                             <li><strong className="text-green-500">Best Case: O(n)</strong> - Array is already sorted. Only one comparison per element.</li>
//                             <li><strong className="text-yellow-500">Average Case: O(n²)</strong> - Elements are in random order.</li>
//                             <li><strong className="text-red-500">Worst Case: O(n²)</strong> - Array is sorted in reverse.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
//                         <p>Measures the extra memory needed.</p>
//                          <div className="pt-2">
//                             <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
//                             <p className="mt-1">It's an "in-place" algorithm requiring only a constant amount of extra memory for the key.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <TimeComplexityGraph complexities={insertionSortComplexities} />
//             </section>
            
//             <hr className="border-border/50" />

//             <section>
//                 <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
//                 <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                             <li><span className="font-semibold text-text-primary">Simple & Intuitive</span> to implement and understand.</li>
//                             <li><span className="font-semibold text-text-primary">Efficient for small datasets</span> and nearly sorted datasets.</li>
//                             <li><span className="font-semibold text-text-primary">Adaptive:</span> Its speed increases if the array is partially sorted.</li>
//                             <li><span className="font-semibold text-text-primary">Stable Sort:</span> Doesn't change the relative order of equal elements.</li>
//                              <li><span className="font-semibold text-text-primary">Space Efficient:</span> Requires O(1) extra space.</li>
//                         </ul>
//                     </div>
//                     <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                         <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
//                         <ul className="space-y-3 list-disc list-inside text-text-secondary">
//                              <li><span className="font-semibold text-text-primary">Inefficient for large datasets</span> due to its O(n²) complexity.</li>
//                             <li><span className="font-semibold text-text-primary">Slower</span> than more advanced algorithms like Quick Sort or Merge Sort.</li>
//                         </ul>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }