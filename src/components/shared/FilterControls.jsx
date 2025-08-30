import { allAlgorithms } from '../../data/algorithms';

const allCategories = ['All', ...new Set(allAlgorithms.map(algo => algo.category))];

const FilterControls = ({ activeFilter, setActiveFilter }) => (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
        {allCategories.map(category => (
            <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                    activeFilter === category
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'bg-card text-text-secondary border border-border hover:border-accent/50 hover:bg-accent/10 hover:text-accent'
                }`}
            >
                {category}
            </button>
        ))}
    </div>
);

export default FilterControls ;