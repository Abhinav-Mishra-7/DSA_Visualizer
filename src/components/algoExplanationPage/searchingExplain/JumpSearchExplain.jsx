import { CheckCircle, XCircle, Clock, Database, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../../shared/SectionHeader';

const jumpSearchComplexities = [
    {
        label: 'Best Case',
        complexity: 'O(1)',
        formula: n => 1,
        color: '#22C55E' // green-500
    },
    {
        label: 'Average Case',
        complexity: 'O(√n)',
        formula: n => Math.sqrt(n),
        color: '#3B82F6' // blue-500
    },
    {
        label: 'Worst Case',
        complexity: 'O(√n)',
        formula: n => Math.sqrt(n),
        color: '#EF4444' // red-500
    },
];

const SearchStepVisualizer = () => {
    // Reusable Element component
    const Element = ({ number, highlight, found, plain, eliminated, jump }) => (
        <div className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center text-lg font-bold transition-all duration-300
            ${plain ? 'bg-card border-border text-text-primary border-2' : ''}
            ${highlight ? 'border-yellow-400 bg-yellow-500/10 text-yellow-500 border-2' : ''}
            ${found ? 'border-green-400 bg-green-500/10 text-green-500 border-2' : ''}
            ${eliminated ? 'border-red-400 bg-red-500/10 text-red-500 border-2' : ''}
            ${jump ? 'border-blue-400 bg-blue-500/10 text-blue-500 border-2' : ''}
        `}>
            {number}
        </div>
    );

    const JumpPointer = ({ label, color = 'text-accent' }) => (
        <div className={`text-xs font-bold ${color} flex flex-col items-center`}>
            <span>{label}</span>
            <div className="w-px h-4 bg-current"></div>
        </div>
    );

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-10">
            {/* Initial State */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Sorted Array:</strong> Jump Search requires a sorted array. Jump size = √10 = 3.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => <Element key={i} number={n} plain />)}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="text-xs text-text-secondary w-12 sm:w-14 text-center">{i}</div>
                    ))}
                </div>
                <p className="mt-4 text-center text-text-secondary text-sm">Target: <strong className="text-accent">48</strong></p>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Phase 1: Jumping</h3>

            {/* Jump Step 1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Jump 1:</strong> Jump to index 3, check if 25 ≥ 48. Since <b className="text-blue-500">25</b> {'<'} <b className="text-accent">48</b>, continue jumping.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} jump={i === 3} eliminated={i < 3} plain={i > 3} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="w-12 sm:w-14 flex justify-center">
                            {i === 3 && <JumpPointer label="J" color="text-blue-500" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Jump Step 2 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Jump 2:</strong> Jump to index 6, check if 48 ≥ 48. Since <b className="text-blue-500">48</b> {'='} <b className="text-accent">48</b>, we found our target!</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} found={i === 6} eliminated={i < 3} plain={i === 3 || i === 4 || i === 5 || i > 6} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="w-12 sm:w-14 flex justify-center">
                            {i === 6 && <JumpPointer label="FOUND!" color="text-green-500" />}
                        </div>
                    ))}
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Alternative Scenario: Linear Search Phase</h3>

            {/* Alternative scenario where target is not at jump position */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Alternative Target: 44</strong> Let's see what happens when target is not at a jump position.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => <Element key={i} number={n} plain />)}
                </div>
                <p className="mt-2 text-center text-text-secondary text-sm">Target: <strong className="text-accent">44</strong></p>
            </div>

            {/* Jump to find block */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Jump Phase:</strong> Jump to index 6, check if 48 ≥ 44. Since <b className="text-blue-500">48</b> {'>'} <b className="text-accent">44</b>, target is in block [3-6].</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} jump={i === 6} eliminated={i < 3 || i > 6} plain={i >= 3 && i <= 5} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="w-12 sm:w-14 flex justify-center">
                            {i === 3 && <JumpPointer label="P" color="text-blue-500" />}
                            {i === 6 && <JumpPointer label="N" color="text-purple-500" />}
                        </div>
                    ))}
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-text-primary pt-4 border-t border-border">Phase 2: Linear Search</h3>

            {/* Linear Search Step 1 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Linear Step 1:</strong> Check index 3: Is 25 = 44? No, continue.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} highlight={i === 3} eliminated={i < 3 || i > 6} plain={i > 3 && i <= 6} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="w-12 sm:w-14 flex justify-center">
                            {i === 3 && <JumpPointer label="C" color="text-yellow-500" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Linear Search Step 2 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Linear Step 2:</strong> Check index 4: Is 31 = 44? No, continue.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} highlight={i === 4} eliminated={i < 3 || i > 6} plain={i === 3 || i > 4 && i <= 6} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="w-12 sm:w-14 flex justify-center">
                            {i === 4 && <JumpPointer label="C" color="text-yellow-500" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Linear Search Step 3 */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Linear Step 3:</strong> Check index 5: Is 42 = 44? No, continue.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} highlight={i === 5} eliminated={i < 3 || i > 6} plain={i === 3 || i === 4 || i === 6} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    {Array.from({length: 10}, (_, i) => (
                        <div key={i} className="w-12 sm:w-14 flex justify-center">
                            {i === 5 && <JumpPointer label="C" color="text-yellow-500" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Linear Search Step 4 - Not Found */}
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Linear Step 4:</strong> Check index 6: Is 48 = 44? No. Since 48 {'>'} 44, target doesn't exist.</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                    {[5, 12, 18, 25, 31, 42, 48, 56, 63, 71].map((n, i) => (
                        <Element key={i} number={n} eliminated={true} />
                    ))}
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 mt-2">
                    <p className="text-center text-red-500 font-bold">Target 44 NOT FOUND</p>
                </div>
            </div>
        </div>
    );
};

export default function JumpSearchExplanation() {
    return (
        <div className="max-w-5xl mx-1 md:p-4 lg:p-8 p-1 space-y-13 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Jump Search?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Jump Search is an efficient searching algorithm for sorted arrays. It works by jumping ahead in fixed steps (typically √n) to quickly locate the block where the target might exist, then performing a linear search within that specific block.</p>
                    <p>This approach combines the simplicity of linear search with the efficiency of block-wise jumping, making it faster than linear search while being easier to implement than binary search.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <SearchStepVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-5 text-text-secondary">
                    <li>
                        <span className="text-text-primary font-semibold">Idea:</span> Jump ahead in fixed steps to find the block where the target can lie, then do a short linear search in that block.
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Setup:</span> Array must be sorted. Compute jump size as √n. Start with prev = 0 and step = jumpSize.
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Jump forward (block finding):</span> Move to indices jumpSize, 2×jumpSize, 3×jumpSize, … until stopping condition.
                        <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Compare array[step] with target.</li>
                        <li>If array[step] &lt; target, set prev = step and step += jumpSize.</li>
                        <li>If array[step] ≥ target or step ≥ n, stop jumping.</li>
                        </ul>
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Early match:</span> If array[step] == target at a jump position, return step.
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Define the block:</span> Clamp step to n − 1 if needed. The candidate block is [prev, step].
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Linear search (within block):</span> Scan i from prev to min(step, n − 1).
                        <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>If array[i] == target, return i.</li>
                        <li>If array[i] &gt; target, stop early (target cannot be further).</li>
                        </ul>
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Result:</span> If not found in the block, return −1.
                    </li>

                    <li>
                        <span className="text-text-primary font-semibold">Notes:</span> √n gives a good balance between number of jumps and block scan; extra space is O(1).
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
                            <li><strong className="text-green-500">Best Case: O(1)</strong> - Target is found at the first jump position.</li>
                            <li><strong className="text-yellow-500">Average Case: O(√n)</strong> - Target requires both jumping and linear search phases.</li>
                            <li><strong className="text-red-500">Worst Case: O(√n)</strong> - Target is at the end of the identified block or doesn't exist.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Database size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(1)</p>
                            <p className="mt-1">Uses only a constant amount of extra memory for variables like jump size, indices, and comparison results.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={jumpSearchComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Better than Linear Search</span> with O(√n) time complexity instead of O(n).</li>
                            <li><span className="font-semibold text-text-primary">Simple to Implement</span> compared to more complex algorithms like binary search.</li>
                            <li><span className="font-semibold text-text-primary">Space Efficient</span> with O(1) space complexity.</li>
                            <li><span className="font-semibold text-text-primary">Works on Any Data Structure</span> that supports indexing, not just arrays.</li>
                            <li><span className="font-semibold text-text-primary">Optimal Jump Size</span> can be calculated mathematically (√n) for best performance.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Slower than Binary Search</span> which has O(log n) time complexity.</li>
                            <li><span className="font-semibold text-text-primary">Requires Sorted Array</span> like binary search, limiting its applicability.</li>
                            <li><span className="font-semibold text-text-primary">Not Suitable for Linked Lists</span> because it needs random access to elements.</li>
                            <li><span className="font-semibold text-text-primary">Still Performs Linear Search</span> in the identified block, which can be inefficient for large blocks.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}