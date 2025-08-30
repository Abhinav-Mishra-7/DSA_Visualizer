import { Link } from 'react-router';

const AlgorithmCard = ({ name, category, description, slug }) => {
  return (
    <Link 
      to={`/visualizers/${slug}`}
      className="group block bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:!border-accent hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 neon:hover:shadow-[0_0_20px_var(--glow-color)] animate-[fade-in-up_0.5s_ease-out_forwards]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">{category}</p>
          <h3 className="text-xl font-bold text-text-primary mb-2">{name}</h3>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <span className="text-sm font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Visualize &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AlgorithmCard ;