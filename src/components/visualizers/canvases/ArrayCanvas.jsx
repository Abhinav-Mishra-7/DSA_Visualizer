import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';
import { useRef } from 'react';

const AlgorithmStatus = ({ isAnimating, isComplete, currentStep, finalArray }) => {
    let statusText; let icon; let colorClass;
    const finalValues = finalArray.map(item => item.value);
    if (isComplete) {
        statusText = `Algorithm Complete! Final Array: [${finalValues.join(', ')}]`; icon = <CheckCircle size={20} />; colorClass = 'text-green-400';
    } else if (isAnimating) {
        statusText = 'Algorithm Running...'; icon = <Zap size={20} className="animate-pulse" />; colorClass = 'text-accent';
    } else if (currentStep > 0) {
        statusText = 'Paused'; icon = null; colorClass = 'text-text-secondary';
    } else {
        statusText = 'Ready to Visualize'; icon = null; colorClass = 'text-text-secondary';
    }
    return (
        <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap px-4 py-2 rounded-lg bg-background-tertiary border border-border shadow-lg shadow-text-primary/15 text-sm md:text-base z-30">
            <div className={`flex items-center gap-2 ${colorClass}`}>{icon}<span className='text-text-primary'>{statusText}</span></div>
        </div>
    );
};

export default function ArrayCanvas({
    stepData,
    getElementState,
    isAnimating,
    currentStep,
    totalSteps,
    AnnotationComponent
}) {
    const canvasContainerRef = useRef(null);

    if (!stepData || !stepData.array) {
        return <div className="flex h-full w-full items-center justify-center"><p className="text-text-secondary">Loading visualization...</p></div>;
    }

    const { array } = stepData;
    const isComplete = currentStep >= totalSteps - 1;

    // Standardized layout constants
    const elementSize = 56;
    const gap = 16;
    const bumpYPosition = -25;
    const containerWidth = array.length * (elementSize + gap) - gap;

    return (
        <div ref={canvasContainerRef} className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-4">
            <AlgorithmStatus isAnimating={isAnimating} isComplete={isComplete} currentStep={currentStep} finalArray={array} />
            
            <div className="relative mt-24 w-full flex items-center justify-center" style={{ height: '150px' }}>
                {/* It creates a centered coordinate system for the AnnotationComponent. */}
                <div className="absolute" style={{ width: `${containerWidth}px`, height: '100%' }}>
                    <AnimatePresence>
                        {AnnotationComponent && (
                            <AnnotationComponent
                                key={`anno-${currentStep}`}
                                stepData={stepData}
                                elementSize={elementSize}
                                gap={gap}
                                containerRef={canvasContainerRef}
                                bumpYPosition={bumpYPosition}
                                currentStep={currentStep}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <motion.div layout className="flex items-end justify-center gap-4">
                    {array.map((item, index) => {
                         const isComparing = stepData.comparing?.includes(index);
                         const isSwapping = stepData.swapping?.includes(index);
                         
                         return (
                            <motion.div
                                key={item.id}
                                layoutId={`array-item-${item.id}`}
                                layout="position"
                                animate={{
                                    y: (isComparing || isSwapping) ? bumpYPosition : 0,
                                    scale: isComparing ? 1.05 : 1,
                                }}
                                transition={{
                                    layout: { type: 'spring', stiffness: 100, damping: 30 },
                                    default: { duration: 0.5 }
                                }}
                                className={`relative w-14 h-14 shrink-0 rounded-md flex items-center justify-center border-2 font-bold text-xl transition-colors duration-300 ${getElementState(item, index, stepData)}`}
                            >
                                <span className="text-white select-none">{item.value}</span>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    );
}