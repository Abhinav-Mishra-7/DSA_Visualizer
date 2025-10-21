
// export default function AlgorithmCard({ category, name, description, slug, ...props }) {
//   return (
//     <div className="bg-card border border-border rounded-lg p-3 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer shadow-sm">
//       <div className="mb-1.5">
//         <span className="inline-block px-1.5 py-0.5 bg-accent/10 text-accent text-xs font-medium uppercase tracking-wide rounded text-[10px]">
//           {category}
//         </span>
//       </div>
//       <h3 className="font-semibold text-text-primary text-sm mb-1.5 leading-tight">
//         {name}
//       </h3>
//       <p className="text-text-secondary text-xs leading-relaxed">
//         {description}
//       </p>
//     </div>
//   );
// }


import { Link } from 'react-router';

const AlgorithmCard = ({ name, category, description, slug }) => {
  return (
    <Link 
      to={`/visualizers/${slug}`}
      className="group block bg-card border border-border rounded-xl px-6 py-3 transition-all duration-300 hover:!border-accent hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 animate-[fade-in-up_0.5s_ease-out_forwards]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">{category}</p>
          <h3 className="text-md font-bold text-text-primary mb-2">{name}</h3>
          <p className="text-text-secondary text-xs">{description}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Visualize &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AlgorithmCard ;