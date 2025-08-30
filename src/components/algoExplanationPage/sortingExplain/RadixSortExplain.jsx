import { CheckCircle, XCircle, Clock, BrainCircuit, Zap, Workflow, ListChecks, Scale, Filter, Copy } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph';
import SectionHeader from '../../shared/SectionHeader';

const radixSortComplexities = [
    { label: 'Best Case', complexity: 'O(d*(n+k))', formula: n => n * 1.5, color: '#22C55E' }, // Simplified for visualization
    { label: 'Average Case', complexity: 'O(d*(n+k))', formula: n => n * 1.5, color: '#3B82F6' },
    { label: 'Worst Case', complexity: 'O(d*(n+k))', formula: n => n * 1.5, color: '#EF4444' },
];

const DataBubble = ({ number, highlight, final, plain, finalWithShadow }) => (
    <div className={`
        w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-300
        border-2 shrink-0
        ${plain ? 'bg-card border-border text-text-primary' : ''}
        ${highlight ? 'border-accent bg-accent/10 text-accent' : ''}
        ${final ? 'border-green-400 bg-green-500/5 text-green-500' : ''}
        ${finalWithShadow ? 'border-green-400 bg-green-500/5 text-green-500 shadow-md shadow-green-600' : ''}
    `}>
        {number}
    </div>
);

const ArrayChunk = ({ numbers, className, bubbleProps = {} }) => (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
        {numbers.map((n, i) => <DataBubble key={i} number={n} {...bubbleProps} />)}
    </div>
);

const Bucket = ({ digit, numbers = [], isHighlighted }) => (
    <div className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${isHighlighted ? 'bg-accent/10' : ''}`}>
        <div className="w-10 h-10 bg-card border-2 border-border rounded-md flex items-center justify-center font-mono font-bold text-accent">
            {digit}
        </div>
        <div className="min-h-[4rem] w-full flex flex-col items-center gap-2 p-1 border-t-2 border-border/50">
            {numbers.map((n, i) => (
                <DataBubble key={i} number={n} highlight={isHighlighted} />
            ))}
        </div>
    </div>
);

const RadixSortVisualizer = () => {
    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-12">
            
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array:</strong> We start with an unsorted list of integers.</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={[170, 45, 75, 90, 802, 24, 2, 66]} bubbleProps={{ plain: true }} />
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <Filter size={24} className="text-accent"/> Sorting Passes
            </h3>
            <p className="text-center text-text-secondary -mt-8">The algorithm sorts the array digit by digit, from least significant (ones) to most significant (hundreds).</p>
            
            {/* --- PASS 1: ONES DIGIT --- */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold text-text-primary text-center">Pass 1: Sorting by the Ones Digit</h4>
                <p className="text-center text-text-secondary">Numbers are placed into "buckets" based on their last digit (e.g., <b className="text-accent">170</b> goes into bucket <b className="text-accent">0</b>, <b className="text-accent">802</b> goes into bucket <b className="text-accent">2</b>).</p>
                
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4 bg-card/50 border border-border/50 rounded-lg">
                    <Bucket digit={0} numbers={[170, 90]} isHighlighted />
                    <Bucket digit={1} />
                    <Bucket digit={2} numbers={[802, 2]} isHighlighted />
                    <Bucket digit={3} />
                    <Bucket digit={4} numbers={[24]} isHighlighted />
                    <Bucket digit={5} numbers={[45, 75]} isHighlighted />
                    <Bucket digit={6} numbers={[66]} isHighlighted />
                    <Bucket digit={7} />
                    <Bucket digit={8} />
                    <Bucket digit={9} />
                </div>
                
                <p className="text-text-secondary text-center pt-2">After collecting from the buckets in order (0 to 9), the array becomes:</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={[170, 90, 802, 2, 24, 45, 75, 66]} bubbleProps={{ highlight: true }} />
                </div>
            </div>
            
            {/* --- PASS 2: TENS DIGIT --- */}
            <div className="space-y-4 pt-6 border-t border-border">
                <h4 className="text-xl font-semibold text-text-primary text-center">Pass 2: Sorting by the Tens Digit</h4>
                <p className="text-center text-text-secondary">Now we use the result from Pass 1. Numbers are bucketed by their tens digit (e.g., <b className="text-accent">802</b> goes into bucket <b className="text-accent">0</b>, <b className="text-accent">24</b> goes into bucket <b className="text-accent">2</b>).</p>
                
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4 bg-card/50 border border-border/50 rounded-lg">
                    <Bucket digit={0} numbers={[802, 2]} isHighlighted />
                    <Bucket digit={1} />
                    <Bucket digit={2} numbers={[24]} isHighlighted />
                    <Bucket digit={3} />
                    <Bucket digit={4} numbers={[45]} isHighlighted />
                    <Bucket digit={5} />
                    <Bucket digit={6} numbers={[66]} isHighlighted />
                    <Bucket digit={7} numbers={[170, 75]} isHighlighted />
                    <Bucket digit={8} />
                    <Bucket digit={9} numbers={[90]} isHighlighted />
                </div>
                
                <p className="text-text-secondary text-center pt-2">After collecting from the buckets, the array is now sorted by the first two digits:</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={[802, 2, 24, 45, 66, 170, 75, 90]} bubbleProps={{ highlight: true }} />
                </div>
            </div>

            {/* --- PASS 3: HUNDREDS DIGIT --- */}
            <div className="space-y-4 pt-6 border-t border-border">
                <h4 className="text-xl font-semibold text-text-primary text-center">Pass 3: Sorting by the Hundreds Digit</h4>
                <p className="text-center text-text-secondary">For the final pass, we use the hundreds digit. Numbers with no hundreds digit (like <b className="text-accent">24</b>) are treated as <b className="text-accent">0</b>.</p>
                
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4 bg-card/50 border border-border/50 rounded-lg">
                    <Bucket digit={0} numbers={[2, 24, 45, 66, 75, 90]} isHighlighted />
                    <Bucket digit={1} numbers={[170]} isHighlighted />
                    <Bucket digit={2} />
                    <Bucket digit={3} />
                    <Bucket digit={4} />
                    <Bucket digit={5} />
                    <Bucket digit={6} />
                    <Bucket digit={7} />
                    <Bucket digit={8} numbers={[802]} isHighlighted />
                    <Bucket digit={9} />
                </div>
                
                 <p className="text-text-secondary text-center pt-2"><strong className="text-text-primary">Final Sorted Array:</strong> After collecting from the buckets one last time, the array is fully sorted.</p>
                <div className="flex justify-center">
                     <ArrayChunk numbers={[2, 24, 45, 66, 75, 90, 170, 802]} bubbleProps={{ finalWithShadow: true }} />
                </div>
            </div>
        </div>
    );
};

export default function RadixSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto md:p-3 lg:p-6 p-1 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Radix Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Radix Sort is a clever, non-comparison based sorting algorithm that works on integers. Instead of comparing elements to each other, it sorts them based on their individual digits. It groups numbers by their digit values at each position (ones, tens, hundreds, etc.), starting from the <strong className="text-text-primary">least significant digit (LSD)</strong>. By iterating through each digit place, it methodically organizes the entire list.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <RadixSortVisualizer />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-6 text-text-secondary">
                        <li>
                            <strong>Find the Maximum Value:</strong>
                            First, we need to find the largest number in the array. This tells us the maximum number of digits we'll need to process. For example, if the max number is <strong className="text-text-primary">802</strong>, we know we need to perform <strong className="text-text-primary">3 passes</strong> (for the ones, tens, and hundreds places).
                        </li>
                        <li>
                            <strong>Loop Through Digits:</strong>
                            Create a loop that runs for each digit place, starting with the least significant digit (LSD). The loop continues for as many digits as the maximum number has.
                        </li>
                        <li>
                            <strong>The "Bucket" Process (for each pass):</strong>
                            This is the core of the algorithm for each digit pass:
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li><span className="font-semibold text-text-primary">Create Buckets:</span> Create ten empty buckets, one for each possible digit (0 through 9).</li>
                                <li><span className="font-semibold text-text-primary">Distribute Elements:</span> Go through each number in the current array. Examine the relevant digit for the current pass (e.g., the ones digit in the first pass). Place the entire number into the corresponding bucket. For example, <strong className="text-text-primary">170</strong> goes into bucket <strong className="text-text-primary">0</strong> on the first pass.</li>
                                <li><span className="font-semibold text-text-primary">Collect Elements:</span> After all numbers have been distributed, reconstruct the array by taking the numbers out of the buckets in order, from bucket 0 to bucket 9. The order of elements within a single bucket must be preserved (this is why it's a <strong className="text-text-primary">stable</strong> sort).</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Repeat:</strong>
                            Repeat the bucketing process for the next digit place (tens, then hundreds, and so on). Each pass uses the newly ordered array from the previous pass. After the final pass (for the most significant digit), the array will be fully sorted.
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
                        <p>Performance depends on the number of digits and elements, not on comparisons.</p>
                        <ul className="list-none space-y-2 pt-2">
                             <li><strong className="text-green-500">All Cases: O(d * (n + k))</strong></li>
                        </ul>
                        <p className="text-sm pt-2">Where <b className="text-text-primary">d</b> is the number of digits in the max number, <b className="text-text-primary">n</b> is the number of elements, and <b className="text-text-primary">k</b> is the base (usually 10).</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Copy size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(n + k)</p>
                            <p className="mt-1">It requires space for the buckets (<b className="text-text-primary">k</b>) and to store the array elements within those buckets (<b className="text-text-primary">n</b>).</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={radixSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Extremely Fast:</span> When the number of digits is small, Radix Sort can be faster than comparison-based sorts, achieving linear time complexity.</li>
                            <li><span className="font-semibold text-text-primary">Stable Sort:</span> Preserves the relative order of elements with equal keys, which is important for sorting complex objects.</li>
                            <li><span className="font-semibold text-text-primary">Simple Logic:</span> The core concept of bucketing is straightforward to understand and implement.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Limited Use Cases:</span> Works best on fixed-size data like integers or strings. It's not easily adaptable for floating-point numbers or complex objects without a clear key.</li>
                            <li><span className="font-semibold text-text-primary">Space Inefficient:</span> Requires significant extra space (O(n+k)) for the buckets, which can be a problem for large datasets with memory constraints.</li>
                            <li><span className="font-semibold text-text-primary">Performance varies with `d`:</span> The time complexity is dependent on the number of digits (`d`). For numbers with very large digits, `d` can become a significant factor, making the sort slower.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}