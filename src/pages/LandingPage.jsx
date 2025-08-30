import { ArrowDownUp, Spline, Timer } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import { Link } from 'react-router';

// const HeroSection = () => (
//     <section className="pt-32 pb-20 text-center animate-[fade-in-up_1s_ease-out]">
//       <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4">
//         <span 
//           className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-pink-500 to-orange-500 animate-[gradient-pan_4s_linear_infinite]"
//           style={{ backgroundSize: '200% auto' }}
//         >
//           DSA VISUALIZER
//         </span>
//       </h1>
//       <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-text-secondary">
//         An interactive platform to understand complex data structures and algorithms through seamless visualization.
//       </p>
//       <div className="mt-8 flex justify-center gap-4">
//         <Link to="/visualizers" className="inline-block px-8 py-3 rounded-md font-semibold text-accent-foreground bg-accent hover:opacity-90 transition-opacity shadow-lg shadow-accent/20 neon:shadow-[0_0_20px_var(--accent)]">
//           Start Visualizing
//         </Link>
//       </div>
//     </section>
// );

const HeroSection = () => (
    <section className="pt-32 pb-20 text-center animate-[fade-in-up_1s_ease-out]">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4">
        <span className="text-nebula px-1">
          DSA VISUALIZER
        </span>
      </h1>
      <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-text-secondary">
        An interactive platform to understand complex data structures and algorithms through seamless visualization.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/visualizers" className="inline-block px-8 py-3 rounded-md font-semibold text-accent-foreground bg-accent hover:opacity-90 transition-opacity shadow-lg shadow-accent/20 neon:shadow-[0_0_20px_var(--accent)]">
          Start Visualizing
        </Link>
      </div>
    </section>
);

const FeatureCard = ({ icon, title, description, delay }) => (
    <div
      className="bg-card border border-border rounded-xl p-6 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10 neon:hover:shadow-[0_0_20px_var(--glow-color)]"
      style={{ animation: `fade-in-up 0.8s ease-out ${delay}s both` }}
    >
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
);

const FeaturesSection = () => {
    const features = [
        { icon: <ArrowDownUp size={28} />, title: "Interactive Sorting", description: "Watch sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort in action, step by step." },
        { icon: <Spline size={28} />, title: "Pathfinding Algorithms", description: "Visualize Dijkstra's and A* search algorithms finding the shortest path on a dynamic grid." },
        { icon: <Timer size={28} />, title: "Real-time Control", description: "Control the animation speed, pause, step forward, or reset the visualization at any time." },
    ];
    return (
        <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Features</h2>
            <p className="max-w-xl mx-auto mt-4 text-text-secondary">Everything you need to master data structures and algorithms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <FeatureCard key={feature.title} {...feature} delay={index * 0.2} />)}
          </div>
        </section>
    );
};

const Footer = () => (
    <footer className="border-t border-border mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} AlgoZen. Built with React, Redux & Tailwind CSS.</p>
      </div>
    </footer>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />      
            <main className="flex-grow">
                <HeroSection />
                <FeaturesSection />
            </main>
            <Footer />
        </div>
    );
}