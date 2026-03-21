import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Link as CopyIcon, Share2 , Bot, Zap, BookOpen, Code2, Brain } from 'lucide-react';
import { allAlgorithms } from '../data/algorithms';
import Navbar from '../components/shared/Navbar';
import AlgorithmProvider from '../components/visualizers/AlgorithmProvider';
import ArrayStepLog from '../components/visualizers/steplogs/ArrayStepLog';
import GenericStepLog from '../components/visualizers/steplogs/GenericStepLog';
import CodeSnippets from '../components/codes/CodeSnippets';
import QuizComponent from '../components/quiz/QuizComponent';
import ChatWithAI from '../components/chat/ChatWithAI';

const stepLogMap = {
  array: ArrayStepLog,
  graph: GenericStepLog,
  tree: GenericStepLog,
  default: GenericStepLog
};

export default function VisualizerLayout() {
  const { slug } = useParams();
  const algorithm = useMemo(
    () => allAlgorithms.find(a => a.slug === slug),
    [slug]
  );

  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('visualizer');
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  const [navbarTranslate, setNavbarTranslate] = useState(0);
  const [navbarOpacity, setNavbarOpacity] = useState(1);
  const mainRef = useRef(null);
  const tabsRef = useRef(null);
  const scrollRafRef = useRef(null);
  const navStateRef = useRef({ translate: 0, opacity: 1 });

  useEffect(() => {
    setIsAnimating(false);
    setCurrentStep(0);
    setActiveTab('visualizer');
    setCopyStatus('Copy Link');
    setNavbarTranslate(0);
    setNavbarOpacity(1);
    navStateRef.current = { translate: 0, opacity: 1 };
  }, [slug]);

  // Handle navbar scroll up with tabs component
  useEffect(() => {
    const easeInOutCubic = (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const updateNavbarFromScroll = () => {
      scrollRafRef.current = null;
      if (!tabsRef.current) return;

      const navbarHeight = 72; // navbar + margin envelope
      const tabsRect = tabsRef.current.getBoundingClientRect();
      const tabsDistanceFromTop = tabsRect.top;

      // When tabs reaches navbar bottom, start moving navbar up
      const moveStartDistance = navbarHeight + 100;
      const moveEndDistance = navbarHeight;

      const rawProgress =
        (moveStartDistance - tabsDistanceFromTop) /
        (moveStartDistance - moveEndDistance);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      const progress = easeInOutCubic(clampedProgress);

      const targetTranslate = -navbarHeight * progress;
      const targetOpacity = 1 - progress;

      const prev = navStateRef.current;
      const deltaTranslate = Math.abs(prev.translate - targetTranslate);
      const deltaOpacity = Math.abs(prev.opacity - targetOpacity);

      // Dead-zone to avoid jittery state updates on tiny scroll deltas.
      if (deltaTranslate < 0.35 && deltaOpacity < 0.008) return;

      navStateRef.current = {
        translate: targetTranslate,
        opacity: targetOpacity
      };
      setNavbarTranslate(targetTranslate);
      setNavbarOpacity(targetOpacity);
    };

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = window.requestAnimationFrame(updateNavbarFromScroll);
    };

    updateNavbarFromScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const visualizerType = algorithm?.visualizerType || 'default';
  const StepLog = stepLogMap[visualizerType] || stepLogMap.default;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Link'), 1000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopyStatus('Failed to copy');
        setTimeout(() => setCopyStatus('Copy Link'), 1000);
      });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${algorithm?.name || 'Algorithm'} Visualizer`,
      text: `Check out this interactive visualizer for the ${
        algorithm?.name || 'algorithm'
      } algorithm!`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const tabs = [
    {
      id: 'visualizer',
      label: 'Visualizer',
      icon: Zap,
      description: 'See the algorithm in action'
    },
    {
      id: 'explanation',
      label: 'Explanation',
      icon: BookOpen,
      description: 'Learn how it works'
    },
    {
      id: 'code',
      label: 'Code Snippets',
      icon: Code2,
      description: 'View implementations'
    },
    {
      id: 'quiz',
      label: 'Quiz Practice',
      icon: Brain,
      description: 'Test your algorithm knowledge'
    },
    {
      id: 'chat',
      label: 'Chat with AI',
      icon: Bot,
      description: 'Get AI guidance'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar
        style={{
          transform: `translateY(${navbarTranslate}px)`,
          opacity: navbarOpacity,
          pointerEvents: navbarOpacity < 0.2 ? 'none' : 'auto'
        }}
      />
      <main
        ref={mainRef}
        className="flex-grow flex flex-col mt-11 gap-4 lg:gap-6 lg:px-12 md:px-8 px-3 sm:px-5 py-8 sm:py-10 lg:py-12 min-h-0"
      >
        {/* HEADER */}
        <header className="flex flex-col items-center text-center">
          <div className="w-full flex items-center text-sm text-text-secondary mb-6 gap-2 ">
            <Link
              to="/"
              className="hover:text-accent transition-colors duration-200 flex items-center gap-1"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <ChevronRight size={16} className="text-border" />
            <Link
              to="/visualizers"
              className="hover:text-accent transition-colors duration-200 flex items-center gap-1"
            >
              <span>🎯</span>
              <span>Visualizer</span>
            </Link>
            <ChevronRight size={16} className="text-border" />
            <span className="text-accent font-semibold">{algorithm?.name}</span>
          </div>

          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/5 rounded-full blur-lg" />
            <div className="relative bg-gradient-to-r from-accent to-accent/80 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105">
              {algorithm?.category}
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-accent">
              {algorithm?.name || 'Visualizer'}
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={handleCopyLink}
              className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-card to-card/50 border border-accent/30 rounded-lg text-text-primary hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <CopyIcon size={16} className="group-hover:text-accent transition-colors" />
              <span className="text-sm font-medium">{copyStatus}</span>
            </button>
            <button
              onClick={handleShare}
              className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-card to-card/50 border border-accent/30 rounded-lg text-text-primary hover:border-accent hover:shadow-lg hover:shadow-accent/20 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <Share2 size={16} className="group-hover:text-accent transition-colors" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </header>

        <div className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <AlgorithmProvider slug={slug}>
          {({
            steps,
            ExplanationComponent,
            CanvasComponent,
            ControlsComponent,
            canvasProps,
            controlProps
          }) => {
            useEffect(() => {
              setCurrentStep(0);
            }, [steps]);

            useEffect(() => {
              let timer;
              if (isAnimating && steps && currentStep < steps.length - 1) {
                timer = setTimeout(
                  () => setCurrentStep(prev => prev + 1),
                  speed
                );
              } else if (isAnimating) {
                setIsAnimating(false);
              }
              return () => clearTimeout(timer);
            }, [isAnimating, currentStep, speed, steps]);

            const allControlProps = {
              isAnimating,
              currentStep,
              speed,
              totalSteps: steps ? steps.length : 0,
              onPlayPause: () => {
                if (currentStep >= (steps?.length || 0) - 1) {
                  setCurrentStep(0);
                  setIsAnimating(true);
                } else {
                  setIsAnimating(prev => !prev);
                }
              },
              onReset: () => {
                setIsAnimating(false);
                setCurrentStep(0);
              },
              onSpeedChange: val =>
                setSpeed(1050 - parseInt(val, 10) || 500),
              onStepForward: () => {
                if (!isAnimating && currentStep < (steps?.length || 0) - 1) {
                  setCurrentStep(prev => prev + 1);
                }
              },
              onStepBackward: () => {
                if (!isAnimating && currentStep > 0) {
                  setCurrentStep(prev => prev - 1);
                }
              },
              onStepChange: index => {
                if (!isAnimating) setCurrentStep(index);
              },
              ...controlProps
            };

            const allCanvasProps = {
              stepData: steps?.[currentStep],
              ...canvasProps
            };

            return (
              <div className="flex-grow flex flex-col gap-4 min-h-0">
                <div className="flex-grow min-h-0 flex flex-col bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                  {/* TABS */}
                  <div
                    ref={tabsRef}
                    className="border-b border-border/50 flex-shrink-0 flex overflow-x-auto scrollbar-hide bg-gradient-to-r from-background/50 to-card/50 p-1.5 gap-1 z-40"
                  >
                    {tabs.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative group shrink-0 min-w-[112px] sm:min-w-[132px] md:flex-1 px-2 sm:px-3 py-2 font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-lg cursor-pointer ${
                            isActive
                              ? 'text-accent'
                              : 'text-text-primary/70 hover:text-text-primary'
                          }`}
                        >
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg -z-10 animate-pulse" />
                          )}

                          <Icon
                            size={20}
                            className={`transition-all duration-300 ${
                              isActive ? 'scale-110' : 'group-hover:scale-105'
                            }`}
                          />

                          <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                            {tab.label}
                          </span>

                          <span
                            className={`hidden lg:block text-[11px] text-center transition-all duration-300 ${
                              isActive
                                ? 'text-accent/70 opacity-100'
                                : 'text-text-secondary/50 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {tab.description}
                          </span>

                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
                              isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* VISUALIZER TAB */}
                  {activeTab === 'visualizer' && (
                    <div className="flex-grow flex-col lg:flex-row py-6 px-3 gap-3 overflow-auto scrollbar-hide w-full animate-fade-in">
                      <div className="flex-grow flex flex-col lg:flex-row gap-3.5 overflow-auto scrollbar-hide">
                        <div className="flex-grow h-[300px] lg:h-auto bg-gradient-to-br from-background/50 to-background rounded-xl p-3 border border-border/30 transition-all duration-300 shadow-inner">
                          {CanvasComponent && (
                            <CanvasComponent {...allCanvasProps} />
                          )}
                        </div>

                        <div className="w-full lg:w-[330px] flex-shrink-0 overflow-y-auto bg-gradient-to-br from-background/50 to-background rounded-xl border border-border/30 transition-all duration-300">
                          {ControlsComponent && (
                            <ControlsComponent {...allControlProps} />
                          )}
                        </div>
                      </div>

                      <div className="h-48 mt-5 lg:h-auto flex-shrink-0 bg-card border border-border/30 rounded-xl flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="p-4 font-bold border-b border-border/30 text-text-primary flex-shrink-0 bg-gradient-to-r from-card to-card/50 flex items-center gap-2">
                          <Zap size={16} className="text-accent" />
                          Detailed Steps
                        </h3>
                        <div className="flex-grow p-3 overflow-y-auto scrollbar-hide">
                          {steps && (
                            <StepLog
                              steps={steps}
                              currentStep={currentStep}
                              onStepChange={allControlProps.onStepChange}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EXPLANATION TAB */}
                  {/* {activeTab === 'explanation' && (
                    <div className="flex-grow flex justify-center md:p-6 lg:p-8 p-1 overflow-y-auto animate-fade-in">
                      <div className="max-w-10xl w-full">
                        {ExplanationComponent && (
                          <div className="prose prose-invert max-w-none">
                            <ExplanationComponent />
                          </div>
                        )}
                      </div>
                      <ExplanationComponent />
                    </div>
                  )} */}
                  {activeTab === 'explanation' && (
                    <div className="flex-grow min-h-0 flex justify-center md:p-4 lg:p-8 p-2 overflow-y-auto">
                      {ExplanationComponent && <ExplanationComponent />}
                    </div>
                  )}

                  {/* CODE TAB */}
                  {activeTab === 'code' && (
                    <CodeSnippets algorithm={algorithm} />
                  )}

                  {/* Quiz Tab */}
                  <div
                    className={activeTab === 'quiz' ? 'flex-grow min-h-0 flex' : 'hidden'}
                  >
                    <QuizComponent algorithm={algorithm} isActive={activeTab === 'quiz'} />
                  </div>

                 {/* Chat with AI */}
                  {activeTab === 'chat' && (
                    <div className="flex-grow flex flex-col p-3 overflow-hidden h-[calc(100vh-64px)]">
                      <ChatWithAI
                        algorithm={algorithm}
                        userEmail={null}  
                        userName={null}   
                        isPremium={false}
                      />
                    </div>
                  )}

                </div>
              </div>
            );
          }}
        </AlgorithmProvider>
      </main>
    </div>
  );
}