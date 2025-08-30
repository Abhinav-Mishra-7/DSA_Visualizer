import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Link as CopyIcon, Share2 } from 'lucide-react';
import { allAlgorithms } from '../data/algorithms';
import Navbar from '../components/shared/Navbar';
import AlgorithmProvider from '../components/visualizers/AlgorithmProvider';
import ArrayStepLog from '../components/visualizers/steplogs/ArrayStepLog';
import GenericStepLog from '../components/visualizers/steplogs/GenericStepLog';

const stepLogMap = {
    array: ArrayStepLog,
    graph: GenericStepLog,
    tree: GenericStepLog,
    default: GenericStepLog,
};

export default function VisualizerLayout() {
    const { slug } = useParams();
    const algorithm = useMemo(() => allAlgorithms.find(a => a.slug === slug), [slug]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTab, setActiveTab] = useState('visualizer');
    
    // --- NEW: State for copy button text ---
    const [copyStatus, setCopyStatus] = useState('Copy Link');

    useEffect(() => {
        setIsAnimating(false);
        setCurrentStep(0);
        setActiveTab('visualizer');
        setCopyStatus('Copy Link'); // Reset copy button on slug change
    }, [slug]);

    const visualizerType = algorithm?.visualizerType || 'default';
    const StepLog = stepLogMap[visualizerType] || stepLogMap.default;

    // --- Handler for the "Copy Link" button ---
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy Link'), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Failed to copy');
            setTimeout(() => setCopyStatus('Copy Link'), 2000);
        });
    };

    // --- Handler for the "Share" button using Web Share API ---
    const handleShare = async () => {
        const shareData = {
            title: `${algorithm?.name} Visualizer`,
            text: `Check out this interactive visualizer for the ${algorithm?.name} algorithm!`,
            url: window.location.href,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            handleCopyLink(); // Copy link as a fallback
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary">
            <Navbar />
            <main className="flex-grow flex flex-col mt-16 gap-6 lg:px-14 md:px-10 px-6 py-17">

                {/* --- HEADER SECTION --- */}
                <header className="flex flex-col items-center text-center">
                    {/* Breadcrumbs (Kept at the top left for context) */}
                    <div className="w-full flex items-center text-md text-text-secondary mb-3 gap-2.5">
                        <Link to="/" className="hover:text-accent">Home</Link>
                        <ChevronRight size={16} />
                        <Link to="/visualizers" className="hover:text-accent">Visualizers</Link>
                        <ChevronRight size={16} />
                        <span className="text-text-primary">{algorithm?.name}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="bg-accent text-white px-5 py-1 rounded-full text-lg font-semibold uppercase tracking-wider mb-5">
                        {algorithm?.category}
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                        {algorithm?.name || "Visualizer"}
                    </h1>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center gap-4">
                        <button 
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent cursor-pointer transition-colors duration-200"
                        >
                            <CopyIcon size={16} />
                            <span>{copyStatus}</span>
                        </button>
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent cursor-pointer  transition-colors duration-200"
                        >
                            <Share2 size={16} />
                            <span>Share</span>
                        </button>
                    </div>
                </header>

                <div className="h-0.5 w-full bg-text-primary/50 mt-5 mb-5"></div>

                <AlgorithmProvider slug={slug}>
                    {({ steps, ExplanationComponent, CanvasComponent, ControlsComponent, canvasProps, controlProps }) => {

                        useEffect(() => {
                            setCurrentStep(0);                            
                        }, [steps]);

                        useEffect(() => {
                            let timer;
                            if (isAnimating && steps && currentStep < steps.length - 1) {
                                timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
                            } else if (isAnimating) {
                                setIsAnimating(false);
                            }
                            return () => clearTimeout(timer);
                        }, [isAnimating, currentStep, speed, steps]);

                        const allControlProps = {
                            isAnimating, currentStep, speed,
                            totalSteps: steps ? steps.length : 0,
                            onPlayPause: () => {
                                if (currentStep >= (steps?.length || 0) - 1) {
                                    setCurrentStep(0);
                                    setIsAnimating(true);
                                } else {
                                    setIsAnimating(prev => !prev);
                                }
                            },
                            onReset: () => { setIsAnimating(false); setCurrentStep(0); },
                            onSpeedChange: (val) => setSpeed(1050 - parseInt(val, 10)),
                            onStepForward: () => !isAnimating && currentStep < (steps?.length || 0) - 1 && setCurrentStep(prev => prev + 1),
                            onStepBackward: () => !isAnimating && currentStep > 0 && setCurrentStep(prev => prev - 1),
                            onStepChange: (index) => { if (!isAnimating) setCurrentStep(index); },
                            ...controlProps
                        };

                        const allCanvasProps = {
                            stepData: steps?.[currentStep],
                            ...canvasProps
                        };

                        return (
                            <div className="flex-grow flex flex-col gap-6 min-h-0">
                                {/* --- TABS & CONTENT CONTAINER --- */}
                                <div className="flex-grow flex flex-col bg-card border border-border rounded-xl shadow-lg overflow-hidden min-h-[400px]">
                                    <div className="border-b border-border flex-shrink-0 flex">
                                        <button onClick={() => setActiveTab('visualizer')} className={`flex-1 p-3 font-semibold transition-colors duration-200 border-b-2 ${activeTab === 'visualizer' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:bg-accent/5'}`}>Visualizer</button>
                                        <button onClick={() => setActiveTab('explanation')} className={`flex-1 p-3 font-semibold transition-colors duration-200 border-b-2 ${activeTab === 'explanation' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:bg-accent/5'}`}>Explanation</button>
                                    </div>

                                    {/* Visualizer Tab Content */}
                                    {activeTab === 'visualizer' && (
                                        <div className="flex-col flex-grow lg:flex-row p-4 gap-4 overflow-hidden">
                                            <div className="flex-grow flex flex-col lg:flex-row py-6 gap-4 overflow-auto scrollbar-hide">
                                                <div className="flex-grow h-[300px] lg:h-auto bg-background rounded-lg p-2 border border-border/50">
                                                {CanvasComponent && <CanvasComponent {...allCanvasProps} />}
                                                </div>
                                                <div className="w-full lg:w-[350px] flex-shrink-0 overflow-y-auto bg-background rounded-lg border border-border/50">
                                                    {ControlsComponent && <ControlsComponent {...allControlProps} />}
                                                </div>
                                            </div>
                                            <div className="h-48 flex-shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden scrollbar-hide">
                                                <h3 className="p-3 font-bold border-b border-border text-text-primary flex-shrink-0">Detailed Steps</h3>
                                                <div className="flex-grow p-3 overflow-y-auto scrollbar-hide">
                                                    {steps && <StepLog steps={steps} currentStep={currentStep} onStepChange={allControlProps.onStepChange} />}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Explanation Tab Content */}
                                    {activeTab === 'explanation' && (
                                        <div className="flex-grow md:p-4 lg:p-8 p-2 overflow-y-auto">
                                            {ExplanationComponent && <ExplanationComponent />}
                                        </div>
                                    )}
                                </div>

                                {/* --- STEP LOG (ALWAYS VISIBLE) --- */}
                               
                            </div>
                        );
                    }}
                </AlgorithmProvider>
            </main>
        </div>
    );
}