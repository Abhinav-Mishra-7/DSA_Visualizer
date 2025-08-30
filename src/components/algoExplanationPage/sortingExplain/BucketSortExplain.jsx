import { CheckCircle, XCircle, Clock, BrainCircuit, Zap, Workflow, ListChecks, Scale, ArrowRight, Archive, Layers, Filter } from 'lucide-react';
import TimeComplexityGraph from '../../time_space_compexity/TimeComplexityGraph'; 
import SectionHeader from '../../shared/SectionHeader';

const bucketSortComplexities = [
    { label: 'Best Case', complexity: 'O(n + k)', formula: n => n + 10, color: '#22C55E' }, // k is num buckets
    { label: 'Average Case', complexity: 'O(n + k)', formula: n => n + 10, color: '#3B82F6' },
    { label: 'Worst Case', complexity: 'O(n²)', formula: n => n * n, color: '#EF4444' },
];

const ValueBubble = ({ number, highlight, final, plain, finalWithShadow }) => (
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

const ArrayChunk = ({ numbers, className, bubbleProps = {} }) => (
    <div className={`flex justify-center flex-wrap gap-2 ${className}`}>
        {numbers.map((n, i) => <ValueBubble key={i} number={n} {...bubbleProps} />)}
    </div>
);

const Bucket = ({ index, items, isSorted }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-full min-h-[80px] sm:min-h-[90px] bg-card border-2 border-border rounded-lg p-2 flex flex-wrap justify-center items-center gap-2">
            {items.length > 0 ? (
                items.map((item, i) => <ValueBubble key={i} number={item} {...(isSorted ? { final: true } : { highlight: true })} />)
            ) : (
                <span className="text-text-secondary/50 text-sm">Empty</span>
            )}
        </div>
        <p className="text-sm font-semibold text-text-secondary">Bucket {index}</p>
    </div>
);

const BucketSortVisualizer = () => {
    const initialArray = [43, 28, 11, 48, 7, 39, 22];
    // Distribution based on: floor(5 * value / 50) where max is assumed ~50
    const buckets_distributed = [ [7], [11], [28, 22], [39], [43, 48] ];
    const buckets_sorted = [ [7], [11], [22, 28], [39], [43, 48] ];
    const finalArray = [7, 11, 22, 28, 39, 43, 48];

    return (
        <div className="mt-8 md:p-3 lg:p-6 p-2 bg-card/50 border border-border rounded-xl space-y-12">
            
            <div>
                <p className="mb-4 text-text-secondary"><strong className="text-text-primary">Initial Array:</strong> We begin with an unsorted list of numbers.</p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={initialArray} bubbleProps={{ plain: true }} />
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <Layers size={24} className="text-accent"/> Step 1: Create Buckets
            </h3>
            <p className="text-center text-text-secondary -mt-8">First, we set up a series of empty containers, or "buckets". The number of buckets is our choice, but a common approach is to have roughly one bucket per range of values (e.g., 0-9, 10-19, etc.). Here, we'll use 5 buckets.</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <Bucket key={i} index={i} items={[]} />)}
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <Filter size={24} className="text-accent"/> Step 2: Distribute (Scatter)
            </h3>
            <p className="text-center text-text-secondary -mt-8">Next, we iterate through our initial array and place each number into its corresponding bucket based on its value. A simple formula helps decide where each number goes.</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                 {buckets_distributed.map((items, i) => <Bucket key={i} index={i} items={items} />)}
            </div>

            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <Zap size={24} className="text-accent"/> Step 3: Sort Individual Buckets
            </h3>
            <p className="text-center text-text-secondary -mt-8">Now we treat each bucket as its own small sorting problem. We sort the numbers within each bucket. A simple algorithm like Insertion Sort is often used for this step because the buckets are usually small.</p>
            <div className="flex flex-col items-center gap-6">
                <p className="text-text-secondary">Most buckets are already sorted or have one element. Let's focus on Bucket 2:</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Before:</span>
                        <ArrayChunk numbers={[28, 22]} bubbleProps={{ highlight: true }}/>
                    </div>
                    <ArrowRight className="text-accent/80" />
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">After:</span>
                        <ArrayChunk numbers={[22, 28]} bubbleProps={{ final: true }}/>
                    </div>
                </div>
                <p className="text-text-secondary pt-4">After sorting all buckets, they look like this:</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 w-full">
                    {buckets_sorted.map((items, i) => <Bucket key={i} index={i} items={items} isSorted />)}
                </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-center text-text-primary pt-6 border-t border-border flex items-center justify-center gap-3">
                <Archive size={24} className="text-accent"/> Step 4: Concatenate (Gather)
            </h3>
            <p className="text-center text-text-secondary -mt-8">Finally, we go through the buckets in order (from Bucket 0 to 4) and simply collect all the elements into a single list. The result is our fully sorted array.</p>
            <div>
                <p className="mb-4 text-text-secondary text-center"><strong className="text-text-primary">Final Sorted Array:</strong></p>
                <div className="flex justify-center">
                    <ArrayChunk numbers={finalArray} bubbleProps={{ finalWithShadow: true }} />
                </div>
            </div>

        </div>
    );
};

export default function BucketSortExplanation() {
    return (
        <div className="max-w-5xl mx-auto md:p-3 lg:p-6 p-1 space-y-12 animate-fade-in-up">
            
            <section>
                <SectionHeader title="What is Bucket Sort?" icon={<BrainCircuit size={28} />} />
                <div className="mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                    <p>Bucket Sort is a <strong className="text-text-primary">distribution sorting</strong> algorithm. Instead of comparing elements directly, it distributes them into a number of "buckets". Each bucket is then sorted individually, either using a different sorting algorithm or by recursively applying the bucket sort algorithm. Finally, the sorted buckets are concatenated to form the final sorted array.</p>
                    <p>It's particularly efficient when the input data is uniformly distributed over a range.</p>
                </div>
            </section>

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="How Does It Work?" icon={<Workflow size={28} />} />
                <BucketSortVisualizer />
            </section>
            
            <hr className="border-border/50" />

            {/* --- NEW DESCRIPTIVE ALGORITHM STEPS SECTION --- */}
            <section>
                <SectionHeader title="Algorithm Steps" icon={<ListChecks size={28} />} />
                <div className="mt-6 bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <ol className="list-decimal list-outside pl-6 space-y-8 text-text-secondary">
                        <li>
                            <strong>Prepare the Buckets (Create a Filing System)</strong>
                            <p className="mt-2">
                                The first thing we do is set up our "filing system". Imagine you have a set of empty containers or folders. You decide how many you need. For example, if you're sorting numbers from 1 to 100, you might create 10 buckets: one for 1-10, one for 11-20, and so on. This initial setup creates a structure for us to organize our unsorted numbers.
                            </p>
                        </li>
                        <li>
                            <strong>Scatter the Elements (The Distribution)</strong>
                            <p className="mt-2">
                                This is the core idea of Bucket Sort. Think of it like sorting mail into different zip code bins. We go through our main, unsorted array one number at a time. For each number, we have a simple rule (a formula) that tells us exactly which bucket it belongs in. We then drop that number into its designated bucket.
                            </p>
                            <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li>
                                    <span className="font-semibold text-text-primary">The Goal:</span> Group similar-sized numbers together. Smaller numbers will end up in the first few buckets, and larger numbers in the later buckets.
                                </li>
                                <li>
                                    <span className="font-semibold text-text-primary">The Formula:</span> A common way to do this is to scale the number's value to the number of buckets. For instance, a small number like 7 (in a 0-100 range with 10 buckets) would go into bucket 0, while a larger number like 85 would go into bucket 8.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Sort the Individual Buckets (Conquer the Small Piles)</strong>
                            <p className="mt-2">
                                We've successfully broken down one big, messy sorting problem into several smaller, more manageable ones. Now, we look inside each bucket.
                            </p>
                             <ul className="list-disc list-inside mt-3 pl-4 space-y-3">
                                <li>If a bucket has zero or one number, it's already sorted! We do nothing.</li>
                                <li>If a bucket has multiple numbers, we sort just that small collection. Since these lists are usually very short, we can use a simple, fast algorithm like <strong className="text-text-primary">Insertion Sort</strong>. Using a complex algorithm like Merge Sort here would be overkill.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Concatenate the Buckets (Gather the Results)</strong>
                            <p className="mt-2">
                                This is the final and easiest step. All the hard work is done. We now have a series of buckets, each containing a sorted list of numbers. To get our final, fully sorted array, we simply go through the buckets in order (from Bucket 0, to Bucket 1, to Bucket 2, etc.) and collect all the numbers into a single list. Because we organized them into buckets first, this final list will be perfectly sorted.
                            </p>
                        </li>
                    </ol>
                </div>
            </section>
            
            {/* The rest of the component remains the same */}

            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Complexity Analysis" icon={<Zap size={28} />} />
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary text-base">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Clock size={22}/> Time Complexity</h3>
                        <p>Performance heavily depends on data distribution.</p>
                        <ul className="list-none space-y-2 pt-2">
                            <li><strong className="text-green-500">Best Case: O(n + k)</strong><br />Occurs when elements are perfectly distributed among buckets.</li>
                            <li><strong className="text-yellow-500">Average Case: O(n + k)</strong><br />Also assumes a uniform distribution of elements.</li>
                            <li><strong className="text-red-500">Worst Case: O(n²)</strong><br />Occurs when all elements fall into a single bucket. The complexity then becomes that of the inner sorting algorithm (e.g., Insertion Sort).</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2"><Archive size={22}/> Space Complexity</h3>
                        <p>Measures the extra memory needed for the buckets.</p>
                         <div className="pt-2">
                            <p className="text-3xl font-bold font-mono text-indigo-400">O(n + k)</p>
                            <p className="mt-1">Requires space for the `k` buckets plus space for all `n` elements that are distributed among them.</p>
                        </div>
                    </div>
                </div>
                <TimeComplexityGraph complexities={bucketSortComplexities} />
            </section>
            
            <hr className="border-border/50" />

            <section>
                <SectionHeader title="Pros & Cons" icon={<Scale size={28} />} />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-green-500 flex items-center gap-3 mb-4"><CheckCircle /> Pros</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Very Fast (On Average):</span> When data is uniformly distributed, it achieves linear time complexity O(n+k), which is faster than comparison-based sorts like Merge Sort or Quicksort.</li>
                             <li><span className="font-semibold text-text-primary">Simple Logic:</span> The core concept of distributing and gathering is easy to understand.</li>
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-xl md:p-3 lg:p-6 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-3 mb-4"><XCircle /> Cons</h3>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li><span className="font-semibold text-text-primary">Dependent on Data Distribution:</span> Performance degrades badly (to O(n²)) if the data is clustered, causing all elements to fall into one bucket.</li>
                            <li><span className="font-semibold text-text-primary">Extra Space Required:</span> Requires O(n+k) auxiliary space, which can be significant.</li>
                            <li><span className="font-semibold text-text-primary">Floating Point Errors:</span> Can be tricky to implement correctly with floating-point numbers due to precision issues in bucket calculations.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}