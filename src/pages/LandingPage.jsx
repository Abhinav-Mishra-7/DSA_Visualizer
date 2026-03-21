import {
  ArrowDownUp,
  Spline,
  Timer,
  Code2,
  Brain,
  BookOpen,
  PlayCircle,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import { Link } from 'react-router';
import Footer from "../components/shared/Footer" ;

const HeroSection = () => (
  <section className="pt-32 pb-20 text-center animate-[fade-in-up_1s_ease-out]">
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4">
      {/* keep your original animation / styling for this text */}
      <span className="text-nebula px-1">
        DSA VISUALIZER
      </span>
    </h1>

    <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-text-secondary">
      Visualize algorithms, understand their intuition, read clean code in four languages,
      and solidify concepts with quizzes.
    </p>

    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Link
        to="/visualizers"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-accent-foreground bg-accent hover:opacity-90 transition-opacity shadow-lg shadow-accent/20 neon:shadow-[0_0_20px_var(--accent)]"
      >
        <PlayCircle size={18} />
        Start Visualizing
      </Link>

      <Link
        to="/visualizers/bubble-sort"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold border border-border text-text-primary bg-card/60 hover:bg-card/90 hover:border-accent/70 transition-all"
      >
        <Sparkles size={18} />
        Open Bubble Sort Page
      </Link>
    </div>

    {/* small badges row */}
    <div className="mt-10 flex flex-wrap justify-center gap-3 text-[11px] md:text-xs text-text-secondary/80 font-mono">
      <span className="px-3 py-1 rounded-full border border-border/60 bg-card/50">
        Tabs: Visualizer • Explanation • Code • Quiz
      </span>
      <span className="px-3 py-1 rounded-full border border-border/60 bg-card/50">
        Languages: C · C++ · Java · Python
      </span>
      <span className="px-3 py-1 rounded-full border border-border/60 bg-card/50">
        Sorting & Graph Algorithms
      </span>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description, badge, delay }) => (
  <div
    className="bg-card border border-border rounded-xl p-6 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10 neon:hover:shadow-[0_0_20px_var(--glow-color)]"
    style={{ animation: `fade-in-up 0.8s ease-out ${delay}s both` }}
  >
    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
      {icon}
    </div>
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      {badge && (
        <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
          {badge}
        </span>
      )}
    </div>
    <p className="text-text-secondary text-sm md:text-base">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <ArrowDownUp size={28} />,
      title: 'Interactive Visualizations',
      badge: 'Core',
      description:
        'Control each step of sorting and graph algorithms with play, pause, speed, and step‑through controls.'
    },
    {
      icon: <BookOpen size={28} />,
      title: 'Clear Explanations',
      badge: 'Explain',
      description:
        'Use the Explanation tab to understand intuition, dry runs, and time–space complexity for every algorithm.'
    },
    {
      icon: <Code2 size={28} />,
      title: 'Code Snippets (4 Languages)',
      badge: 'New',
      description:
        'View implementations in C, C++, Java, and Python with syntax highlighting, comment toggle, copy, and download.'
    },
    {
      icon: <Brain size={28} />,
      title: 'Per‑Algorithm Quizzes',
      badge: 'Practice',
      description:
        'Each algorithm has its own quiz section with 5 targeted MCQs and detailed explanations for every answer.'
    },
    {
      icon: <Spline size={28} />,
      title: 'Sorting & Graph Focus',
      description:
        'Learn core interview‑focused algorithms like Bubble Sort, Selection Sort, Insertion Sort, BFS, DFS, and more.'
    },
    {
      icon: <Timer size={28} />,
      title: 'Built for Deep Understanding',
      description:
        'Move smoothly from animation → explanation → code → quiz so concepts stick and mistakes are easy to debug.'
    }
  ];

  return (
    <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
          Everything you need to master DSA
        </h2>
        <p className="max-w-xl mx-auto mt-4 text-text-secondary">
          ALGO Vision brings visual traces, multi‑language code, and quizzes together in a single, clean interface.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} {...feature} delay={index * 0.15} />
        ))}
      </div>
    </section>
  );
};

const WorkflowSection = () => (
  <section className="py-16 border-t border-border/60 bg-gradient-to-b from-background to-card/40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
          One consistent learning flow on every page
        </h2>
        <p className="max-w-xl mx-auto mt-3 text-text-secondary">
          Each visualizer page uses the same four tabs so you always know what to do next.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-4 text-sm md:text-[15px]">
        <div className="bg-card/70 border border-border/60 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono text-text-secondary/70">TAB 1</span>
          <h3 className="font-semibold text-text-primary">Visualizer</h3>
          <p className="text-text-secondary">
            Watch the algorithm step through the data with animations and controls.
          </p>
        </div>
        <div className="bg-card/70 border border-border/60 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono text-text-secondary/70">TAB 2</span>
          <h3 className="font-semibold text-text-primary">Explanation</h3>
          <p className="text-text-secondary">
            Read the intuition, pseudo‑code, and complexity breakdown tailored to the visualization.
          </p>
        </div>
        <div className="bg-card/70 border border-border/60 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono text-text-secondary/70">TAB 3</span>
          <h3 className="font-semibold text-text-primary">Code Snippets</h3>
          <p className="text-text-secondary">
            Toggle between C, C++, Java, and Python implementations and copy or download instantly.
          </p>
        </div>
        <div className="bg-card/70 border border-border/60 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono text-text-secondary/70">TAB 4</span>
          <h3 className="font-semibold text-text-primary">Quiz Practice</h3>
          <p className="text-text-secondary">
            Answer algorithm‑specific MCQs with explanations to verify that you truly understand the topic.
          </p>
        </div>
      </div>
    </div>
  </section>
);


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
      </main>
      <Footer />
    </div>
  );
}