import { Search, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../../shared/SectionHeader';

const interpolationSearchComplexities = [
    {
        label: 'Best Case',
        complexity: 'O(1)',
        formula: n => 1,
        color: '#22C55E' // green-500
    },
    {
        label: 'Average Case',
        complexity: 'O(log log n)',
        formula: n => Math.log2(Math.log2(Math.max(n, 2))),
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
    const Element = ({ number, highlight, found, checked, plain, pos }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-yellow-400 bg-yellow-500/10 text-yellow-500 border-2 shadow-md shadow-yellow-500/30' : ''}
            ${found ? 'border-green-400 bg-green-500/10 text-green-500 border-2 shadow-md shadow-green-500/30' : ''}
            ${checked ? 'border-red-400 bg-red-500/10 text-red-500 border-2' : ''}
            ${pos ? 'border-purple-400 bg-purple-500/10 text-purple-500 border-2 shadow-md shadow-purple-500/30' : ''}
        `}>
            {number}
        </div>
    );

    const Pointer = ({ label, color = 'text-accent' }) => (
        <div className={`text-xs font-bold ${color} flex flex-col items-center`}>
            <span>{label}</span>
            <div className="w-px h-4 bg-current"></div>
        </div>
    );

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-8">
            {/* Initial State */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Search Target: 42</strong> - We want to find 42 in this sorted array. Low=0, High=4.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[10, 20, 30, 40, 50].map((n, i) => <Element key={i} number={n} plain />)}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    <div className="w-12 sm:w-14 flex justify-center"><Pointer label="L" color="text-blue-500" /></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14 flex justify-center"><Pointer label="H" color="text-red-500" /></div>
                </div>
            </div>

            {/* Step 1 */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 1:</strong> Calculate position using interpolation formula: pos = 0 + ((42-10)/(50-10)) × (4-0) = 3.2 → 3
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={10} plain />
                    <Element number={20} plain />
                    <Element number={30} plain />
                    <Element number={40} highlight />
                    <Element number={50} plain />
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    <div className="w-12 sm:w-14 flex justify-center"><Pointer label="L" color="text-blue-500" /></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14 flex justify-center"><Pointer label="POS" color="text-yellow-500" /></div>
                    <div className="w-12 sm:w-14 flex justify-center"><Pointer label="H" color="text-red-500" /></div>
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Check index 3: 40 {'<'} 42, so search in right half.</p>
            </div>

            {/* Step 2 */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Step 2:</strong> Update Low=4, High=4. Calculate new pos = 4 + ((42-50)/(50-50)) × (4-4) = 4
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={10} checked />
                    <Element number={20} checked />
                    <Element number={30} checked />
                    <Element number={40} checked />
                    <Element number={50} highlight />
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14"></div>
                    <div className="w-12 sm:w-14 flex justify-center"><Pointer label="L,H,POS" color="text-purple-500" /></div>
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">Check index 4: 50 {'>'} 42, target not found.</p>
            </div>

            {/* Result */}
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Result:</strong> Target <b className="text-red-500">42</b> is not in the array. The search took <b className="text-accent">2 comparisons</b>.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={10} checked />
                    <Element number={20} checked />
                    <Element number={30} checked />
                    <Element number={40} checked />
                    <Element number={50} checked />
                </div>
            </div>
        </div>
    );
};

const BestCaseExample = () => {
    const Element = ({ number, highlight, found, plain }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-yellow-400 bg-yellow-500/10 text-yellow-500 border-2 shadow-md shadow-yellow-500/30' : ''}
            ${found ? 'border-green-400 bg-green-500/10 text-green-500 border-2 shadow-md shadow-green-500/30' : ''}
        `}>
            {number}
        </div>
    );

    return (
        <div className="mt-6 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-6">
            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">Best Case:</strong> Target <b className="text-accent">30</b> found on first estimation in uniformly distributed data.
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[10, 20, 30, 40, 50].map((n, i) => <Element key={i} number={n} plain />)}
                </div>
            </div>

            <div>
                <p className="mb-4 text-text-secondary">
                    <strong className="text-text-primary">First estimation:</strong> pos = 0 + ((30-10)/(50-10)) × (4-0) = 2. Found immediately!
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <Element number={10} plain />
                    <Element number={20} plain />
                    <Element number={30} found />
                    <Element number={40} plain />
                    <Element number={50} plain />
                </div>
                <p className="mt-4 text-center text-text-secondary/80 text-sm">
                    Target 30 found at index 2. Required only <b className="text-green-500">1 comparison</b> - O(1) time!
                </p>
            </div>
        </div>
    );
};

export default function InterpolationSearchExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Interpolation Search?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>
                        Interpolation Search is an improved variant of Binary Search that works on sorted arrays. Instead of always checking the middle element, it estimates where the target is likely to be based on the values at the current low and high positions.
                    </p>
                    <p>
                        It's like looking up a word in a dictionary - if you're searching for "zebra", you don't start in the middle, you jump closer to the end because you know "z" comes near the end of the alphabet.
                    </p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <SearchStepVisualizer />
                <BestCaseExample />
            </section>
            
            <hr className="border-border/50" />

            <section>
    <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
    <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <ol className="list-decimal list-outside pl-6 space-y-5 text-text-secondary">
            <li>
                <strong className="text-text-primary">Initialize and Validate:</strong> Start by setting up the search boundaries and ensuring the array meets the requirements for interpolation search.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>Set low = 0 and high = array length - 1 to define the initial search range</li>
                    <li>Verify that the array is sorted in ascending order</li>
                    <li>Check that the target value lies within the range [array[low], array[high]]</li>
                    <li>If target is outside this range, immediately return "not found"</li>
                </ul>
            </li>
            
            <li>
                <strong className="text-text-primary">Apply Interpolation Formula:</strong> Use the mathematical interpolation formula to estimate where the target element is most likely to be located.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>Calculate: pos = low + ((target - array[low]) / (array[high] - array[low])) × (high - low)</li>
                    <li>This formula assumes the data is uniformly distributed across the array</li>
                    <li>The result gives us an estimated index where the target should be</li>
                    <li>Round down the result to get a valid integer index position</li>
                    <li>Handle the special case where array[high] equals array[low] to avoid division by zero</li>
                </ul>
            </li>
            
            <li>
                <strong className="text-text-primary">Compare and Determine Direction:</strong> Examine the element at the calculated position and decide how to adjust the search range.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>If array[pos] equals the target, return pos as the successful result</li>
                    <li>If array[pos] is less than the target, the target must be in the right portion</li>
                    <li>Update low = pos + 1 to search only the right half of the current range</li>
                    <li>If array[pos] is greater than the target, the target must be in the left portion</li>
                    <li>Update high = pos - 1 to search only the left half of the current range</li>
                </ul>
            </li>
            
            <li>
                <strong className="text-text-primary">Validate Search Boundaries:</strong> Before continuing the search, ensure that the updated boundaries are still valid.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>Check that low is still less than or equal to high</li>
                    <li>Verify that the target still lies within [array[low], array[high]]</li>
                    <li>If either condition fails, the target does not exist in the array</li>
                    <li>This prevents infinite loops and unnecessary computations</li>
                </ul>
            </li>
            
            <li>
                <strong className="text-text-primary">Iterate Until Resolution:</strong> Repeat the interpolation process with the updated boundaries until the target is found or search space is exhausted.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>Continue looping through steps 2-4 with the new low and high values</li>
                    <li>Each iteration should reduce the search space significantly</li>
                    <li>On uniformly distributed data, each step eliminates a large portion</li>
                    <li>The algorithm terminates when target is found or boundaries become invalid</li>
                </ul>
            </li>
            
            <li>
                <strong className="text-text-primary">Handle Edge Cases and Return Result:</strong> Deal with special situations and provide the appropriate return value.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>Return the index if the target element is successfully located</li>
                    <li>Return -1 or appropriate "not found" indicator if target doesn't exist</li>
                    <li>Handle arrays with duplicate values by checking adjacent elements if needed</li>
                    <li>Ensure proper behavior for single-element arrays and empty arrays</li>
                    <li>Consider fallback to linear search if interpolation performs poorly</li>
                </ul>
            </li>
            
            <li>
                <strong className="text-text-primary">Performance Considerations:</strong> Understand the factors that affect the algorithm's efficiency and when to use alternatives.
                <ul className="list-disc list-inside mt-3 pl-4 space-y-2">
                    <li>Best performance occurs when data is uniformly distributed across the range</li>
                    <li>Performance degrades with skewed data distributions or many duplicate values</li>
                    <li>Consider switching to binary search if interpolation estimates are consistently poor</li>
                    <li>Monitor the number of iterations to detect worst-case scenarios early</li>
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
                        <p>Performance depends heavily on data distribution.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong className="text-green-500">Best Case: O(1)</strong> - Direct hit on first estimation.</li>
                            <li><strong className="text-yellow-500">Average Case: O(log log n)</strong> - On uniformly distributed data.</li>
                            <li><strong className="text-red-500">Worst Case: O(n)</strong> - When data is not uniformly distributed.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                        <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">Only requires a constant amount of extra memory for variables like low, high, and pos.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={interpolationSearchComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Superior to Binary Search</span> - O(log log n) average case on uniform data.</li>
                            <li><span className="font-semibold text-text-primary">Intelligent Positioning</span> - Estimates likely location instead of always checking middle.</li>
                            <li><span className="font-semibold text-text-primary">Space Efficient (O(1))</span> - Uses minimal extra memory.</li>
                            <li><span className="font-semibold text-text-primary">Better for Large Datasets</span> - More efficient than binary search on uniformly distributed data.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Requires Sorted Array</span> - Data must be sorted beforehand.</li>
                            <li><span className="font-semibold text-text-primary">Poor on Non-Uniform Data</span> - Can degrade to O(n) with skewed distributions.</li>
                            <li><span className="font-semibold text-text-primary">Complex Implementation</span> - More complex than linear or binary search.</li>
                            <li><span className="font-semibold text-text-primary">Division by Zero Risk</span> - Needs special handling for duplicate values.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}