import { allAlgorithms } from '../../data/algorithms';

const allCategories = ['All', ...new Set(allAlgorithms.map(algo => algo.category))];

export default function FilterControls({ activeFilter, setActiveFilter }) {
  const categories = [
    'All',
    'Sorting', 
    'Searching',
    'Graph Algorithms',
    'Data Structures',
    'Tree Algorithms',
    'Dynamic Programming',
    'String Algorithms',
    'Miscellaneous'
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-3 py-1.75 text-xs font-medium rounded-full cursor-pointer shadow-xs transition-all hover:!border-accent duration-200 ${
            activeFilter === category
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}



// import { allAlgorithms } from '../../data/algorithms';

// const allCategories = ['All', ...new Set(allAlgorithms.map(algo => algo.category))];

// const FilterControls = ({ activeFilter, setActiveFilter }) => (
//     <div className="mt-4 flex flex-wrap justify-center gap-2">
//         {allCategories.map(category => (
//             <button
//                 key={category}
//                 onClick={() => setActiveFilter(category)}
//                 className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
//                     activeFilter === category
//                         ? 'bg-accent text-accent-foreground shadow-md'
//                         : 'bg-card text-text-secondary border border-border hover:border-accent/50 hover:bg-accent/10 hover:text-accent'
//                 }`}
//             >
//                 {category}
//             </button>
//         ))}
//     </div>
// );

// export default FilterControls ;