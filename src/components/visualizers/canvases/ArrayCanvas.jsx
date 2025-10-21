import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';
import { useRef , useLayoutEffect , useState} from 'react';

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
        <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap px-4 py-2.5 lg:py-2 rounded-lg bg-background-tertiary border border-border shadow-lg shadow-text-primary/10 lg:text-sm md:text-xs text-xs/2  z-30">
            <div className={`flex items-center gap-2 ${colorClass}`}>{icon}<span className='text-text-primary'>{statusText}</span></div>
        </div>
    );
};

export default function ArrayCanvas({stepData,getElementState,isAnimating,currentStep,totalSteps,AnnotationComponent}) {

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
            
            <div className="relative lg:mt-65 md:mt-55 mt-48 w-full flex items-center justify-center px-2" style={{ height: '240px' }}>
                {/* Annotation container */}
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

                <motion.div layout className="flex items-end justify-center lg:gap-4 gap-1.5">
                    {array.map((item, index) => {
                         // Bubble Sort conditions (keep existing)
                         const isComparing = stepData.comparing?.includes(index);
                         const isSwapping = stepData.swapping?.includes(index);
                         
                         // Linear Search conditions
                         const isChecking = stepData.checking?.includes(index);
                         const isFound = stepData.found?.includes(index);
                         
                         // Combined lift condition
                         const shouldLift = isComparing || isSwapping || isChecking || isFound;
                         
                         return (
                            <div key={item.id} className="flex flex-col items-center">
                                {/* Array Element */}
                                <motion.div
                                    layoutId={`array-item-${item.id}`}
                                    layout="position"
                                    animate={{
                                        y: shouldLift ? bumpYPosition : 0,
                                        scale: (isComparing || isChecking) ? 1.05 : 1,
                                    }}
                                    transition={{
                                        layout: { type: 'spring', stiffness: 100, damping: 30 },
                                        default: { duration: 0.5 }
                                    }}
                                    className={`relative lg:w-14 lg:h-14 md:w-11 md:h-11 w-8 h-8 shrink-0 rounded-md flex items-center justify-center border-2 lg:font-bold font-semibold lg:text-xl md:text-lg text-md transition-colors duration-300 ${getElementState(item, index, stepData)}`}
                                >
                                    <span className="text-white select-none">{item.value}</span>
                                </motion.div>
                                
                                {/* Index Label */}
                                <div className="mt-2 lg:text-sm md:text-xs text-xs text-text-primary bg-background-secondary px-2 py-1 rounded font-medium">
                                    {index}
                                </div>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    );
}


// import { motion, AnimatePresence } from 'framer-motion';
// import { CheckCircle, Zap } from 'lucide-react';
// import { useRef , useLayoutEffect , useState} from 'react';

// const AlgorithmStatus = ({ isAnimating, isComplete, currentStep, finalArray }) => {
//     let statusText; let icon; let colorClass;
//     const finalValues = finalArray.map(item => item.value);
//     if (isComplete) {
//         statusText = `Algorithm Complete! Final Array: [${finalValues.join(', ')}]`; icon = <CheckCircle size={20} />; colorClass = 'text-green-400';
//     } else if (isAnimating) {
//         statusText = 'Algorithm Running...'; icon = <Zap size={20} className="animate-pulse" />; colorClass = 'text-accent';
//     } else if (currentStep > 0) {
//         statusText = 'Paused'; icon = null; colorClass = 'text-text-secondary';
//     } else {
//         statusText = 'Ready to Visualize'; icon = null; colorClass = 'text-text-secondary';
//     }
//     return (
//         <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap px-4 py-2.5 lg:py-2 rounded-lg bg-background-tertiary border border-border shadow-lg shadow-text-primary/10 lg:text-sm md:text-xs text-xs/2  z-30">
//             <div className={`flex items-center gap-2 ${colorClass}`}>{icon}<span className='text-text-primary'>{statusText}</span></div>
//         </div>
//     );
// };

// export default function ArrayCanvas({stepData,getElementState,isAnimating,currentStep,totalSteps,AnnotationComponent
//     }) {

//     const canvasContainerRef = useRef(null);

//     if (!stepData || !stepData.array) {
//         return <div className="flex h-full w-full items-center justify-center"><p className="text-text-secondary">Loading visualization...</p></div>;
//     }

//     const { array } = stepData;
//     const isComplete = currentStep >= totalSteps - 1;

//     // // Standardized layout constants
//     const elementSize = 56 ;
//     const gap = 16;
//     const bumpYPosition = -25;

//     const containerWidth = array.length * (elementSize + gap) - gap;

//     return (
//         <div ref={canvasContainerRef} className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-4">
//             <AlgorithmStatus isAnimating={isAnimating} isComplete={isComplete} currentStep={currentStep} finalArray={array} />
            
//             <div className="relative lg:mt-65 md:mt-55 mt-48 w-full flex items-center justify-center px-2" style={{ height: '200px' }}>
//                 {/* It creates a centered coordinate system for the AnnotationComponent. */}
//                 <div className="absolute" style={{ width: `${containerWidth}px`, height: '100%' }}>
//                     <AnimatePresence>
//                         {AnnotationComponent && (
//                             <AnnotationComponent
//                                 key={`anno-${currentStep}`}
//                                 stepData={stepData}
//                                 elementSize={elementSize}
//                                 gap={gap}
//                                 containerRef={canvasContainerRef}
//                                 bumpYPosition={bumpYPosition}
//                                 currentStep={currentStep}
//                             />
//                         )}
//                     </AnimatePresence>
//                 </div>

//                 <motion.div layout className="flex items-end justify-center lg:gap-4 gap-1.5">
//                     {array.map((item, index) => {
//                          const isComparing = stepData.comparing?.includes(index);
//                          const isSwapping = stepData.swapping?.includes(index);
                         
//                          return (
//                             <motion.div
//                                 key={item.id}
//                                 layoutId={`array-item-${item.id}`}
//                                 layout="position"
//                                 animate={{
//                                     y: (isComparing || isSwapping) ? bumpYPosition : 0,
//                                     scale: isComparing ? 1.05 : 1,
//                                 }}
//                                 transition={{
//                                     layout: { type: 'spring', stiffness: 100, damping: 30 },
//                                     default: { duration: 0.5 }
//                                 }}
//                                 className={`relative lg:w-14 lg:h-14 md:w-11 md:h-11 w-8 h-8 shrink-0 rounded-md flex items-center justify-center border-2 lg:font-bold font-semibold lg:text-xl md:text-lg text-md transition-colors duration-300 ${getElementState(item, index, stepData)}`}
//                             >
//                                 <span className="text-white select-none">{item.value}</span>
//                             </motion.div>
//                         )
//                     })}
//                 </motion.div>
//             </div>
//         </div>
//     );
// }