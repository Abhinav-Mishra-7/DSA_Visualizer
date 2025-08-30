import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import AlgorithmCard from '../components/shared/AlgorithmCard';
import FilterControls from '../components/shared/FilterControls';
import { allAlgorithms } from '../data/algorithms';

export default function VisualizersPage() {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Memoized filtering logic remains the same
  const filteredAlgorithms = useMemo(() => {
    return allAlgorithms
      .filter(algo => activeFilter === 'All' || algo.category === activeFilter)
      .filter(algo => algo.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12 animate-[fade-in-up_0.5s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight [text-shadow:0_0_10px_var(--glow-color)]">
            All Visualizers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
            Search or filter by category to find the algorithm you want to explore.
          </p>
        </div>

        <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md py-4 mb-8 animate-[fade-in-up_0.7s_ease-out]">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for an algorithm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-text-primary focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            </div>
            <FilterControls activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>

        {filteredAlgorithms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlgorithms.map((algo, index) => (
              <div key={algo.slug} style={{ animationDelay: `${index * 50}ms` }}>
                <AlgorithmCard {...algo} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-[fade-in-up_0.5s_ease-out]">
            <p className="text-xl font-semibold text-text-primary">No algorithms found.</p>
            <p className="mt-2 text-text-secondary">Try adjusting your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}