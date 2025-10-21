import { Search, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../../shared/SectionHeader';

const linearSearchComplexities = [
    {
        label: 'Best Case',
        complexity: 'O(1)',
        formula: n => 1,
        color: '#22C55E' // green-500
    },
    {
        label: 'Average Case',
        complexity: 'O(n)',
        formula: n => n/2,
        color: '#3B82F6' // blue-500
    },
    {
        label: 'Worst Case',
        complexity: 'O(n)',
        formula: n => n,
        color: '#EF4444' // red-500
    },
];

const SearchStepVisualizer = () => {
    // Reusable Element component
    const Element = ({ number, highlight, found, checked, plain }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-yellow-400 bg-yellow-500/10 text-yellow-500 border-2 shadow-md shadow-yellow-500/30' : ''}
            ${found ? 'border-green-400 bg-green-500/10 text-green-500 border-2 shadow-md shadow-green-500/30' : ''}
            ${checked ? 'border-red-400 bg-red-500/10 text-red-500 border-2' : ''}
        `}>
            {number}
        </div>
    );

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-8">
            {/* Initial State */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Search Target: 8</strong> - We want to find the number 8 in this array.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[3, 7, 8, 1, 9].map((n, i) => <Element key={i} number={n} plain />)}
                </div>
            </div>

            {/* Step 1 */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 1:</strong> Check the first element. Is <b className="text-yellow-500">3</b> equal to our target <b className="text-accent">8</b>?
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={3} highlight />
                    <Element number={7} plain />
                    <Element number={8} plain />
                    <Element number={1} plain />
                    <Element number={9} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">3 ≠ 8, so we continue searching.</p>
            </div>

            {/* Step 2 */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 2:</strong> Move to the next element. Is <b className="text-yellow-500">7</b> equal to <b className="text-accent">8</b>?
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={3} checked />
                    <Element number={7} highlight />
                    <Element number={8} plain />
                    <Element number={1} plain />
                    <Element number={9} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">7 ≠ 8, so we continue searching.</p>
            </div>

            {/* Step 3 */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 3:</strong> Check the third element. Is <b className="text-green-500">8</b> equal to our target <b className="text-accent">8</b>?
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={3} checked />
                    <Element number={7} checked />
                    <Element number={8} found />
                    <Element number={1} plain />
                    <Element number={9} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">8 = 8, Found it! The search is complete.</p>
            </div>

            {/* Result */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Result:</strong> We found the target <b className="text-green-500">8</b> at <b className="text-green-500">index 2</b> (0-based indexing). The search took <b className="text-accent">3 comparisons</b>.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={3} checked />
                    <Element number={7} checked />
                    <Element number={8} found />
                    <Element number={1} plain />
                    <Element number={9} plain />
                </div>
            </div>
        </div>
    );
};

const WorstCaseExample = () => {
    const Element = ({ number, highlight, checked, plain }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-yellow-400 bg-yellow-500/10 text-yellow-500 border-2 shadow-md shadow-yellow-500/30' : ''}
            ${checked ? 'border-red-400 bg-red-500/10 text-red-500 border-2' : ''}
        `}>
            {number}
        </div>
    );

    return (
        <div className="mt-6 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-6">
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Worst Case:</strong> Target <b className="text-accent">6</b> is not in the array. We must check every element.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[1, 3, 5, 7, 9].map((n, i) => <Element key={i} number={n} plain />)}
                </div>
            </div>

            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">After checking all elements:</strong> All elements have been checked and none match our target.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[1, 3, 5, 7, 9].map((n, i) => <Element key={i} number={n} checked />)}
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">
                    Target 6 not found. Required <b className="text-red-500">5 comparisons</b> (entire array length).
                </p>
            </div>
        </div>
    );
};

export default function LinearSearchExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Linear Search?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>
                        Linear Search is the simplest searching algorithm that finds a target element by checking each element in the array sequentially from the beginning until the target is found or the end of the array is reached.
                    </p>
                    <p>
                        Also known as Sequential Search, it's the most straightforward approach to searching - just like looking through a book page by page until you find what you're looking for.
                    </p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <SearchStepVisualizer />
                <WorstCaseExample />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-4 text-text-secondary">
                        <li>
                            <strong>Start from the Beginning:</strong> Begin at the first element of the array (index 0).
                        </li>
                        <li>
                            <strong>Compare with Target:</strong> Check if the current element equals the target value we're searching for.
                            <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
                                <li>If they match, <span className="font-semibold text-green-500">return the current index</span> - we found it!</li>
                                <li>If they don't match, <span className="font-semibold text-text-primary">move to the next element</span>.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Repeat Until Found or End:</strong> Continue this process element by element until either:
                            <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
                                <li>The target element is found (return its index)</li>
                                <li>You reach the end of the array (target not found)</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Return Result:</strong> Return the index where the element was found, or a special value (like -1) to indicate the element is not in the array.
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
                            <li><strong className="text-green-500">Best Case: O(1)</strong> - Target is the first element.</li>
                            <li><strong className="text-yellow-500">Average Case: O(n)</strong> - Target is in the middle on average.</li>
                            <li><strong className="text-red-500">Worst Case: O(n)</strong> - Target is the last element or not found.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                        <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">Only requires a constant amount of extra memory for the search operation.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={linearSearchComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Simple Implementation</span> - Easy to understand and code.</li>
                            <li><span className="font-semibold text-text-primary">Works on Unsorted Arrays</span> - No pre-sorting required.</li>
                            <li><span className="font-semibold text-text-primary">Space Efficient (O(1))</span> - Uses minimal extra memory.</li>
                            <li><span className="font-semibold text-text-primary">Works on Any Data Type</span> - Can search strings, objects, etc.</li>
                            <li><span className="font-semibold text-text-primary">Best for Small Arrays</span> - Optimal choice for small datasets.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Inefficient for Large Arrays</span> - O(n) time complexity makes it slow for big datasets.</li>
                            <li><span className="font-semibold text-text-primary">No Early Termination Optimization</span> - Must check every element in worst case.</li>
                            <li><span className="font-semibold text-text-primary">Not Suitable for Frequent Searches</span> - Better algorithms exist for repeated searches.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="When to Use Linear Search?" icon={<Search size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-text-primary mb-3">✅ Good Choice When:</h4>
                            <ul className="space-y-2 list-disc list-inside text-text-secondary">
                                <li>Array is small (n {'<'} 100)</li>
                                <li>Array is unsorted</li>
                                <li>You need to find all occurrences</li>
                                <li>Simple implementation is priority</li>
                                <li>Memory is very limited</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-text-primary mb-3">❌ Avoid When:</h4>
                            <ul className="space-y-2 list-disc list-inside text-text-secondary">
                                <li>Array is large (n {'>'} 1000)</li>
                                <li>Array is already sorted (use Binary Search)</li>
                                <li>Frequent searches on same data</li>
                                <li>Performance is critical</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}