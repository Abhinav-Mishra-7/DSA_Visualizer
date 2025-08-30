import { motion, AnimatePresence } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';
import MessageBox from "../../shared/MessageBox"
import { SimplePointer , SteppedDualPointers } from '../../shared/Pointers';

const PivotLabel = ({ index, elementSize, gap }) => {
    const leftPos = index * (elementSize + gap) + elementSize / 2;
    return (
        <>
            {/* Pivot label */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: -80 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                style={{ left: `${leftPos - 25}px`, top: -8 }}
                className="absolute w-12 h-6 z-20 rounded flex items-center justify-center font-semibold text-sm  border-2 border-purple-400 text-text-primary shadow-lg"
            >
                Pivot
            </motion.div>
            
            {/* Pivot pointer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute w-px bg-purple-400"
                style={{
                    left: `${leftPos-2}px`,
                    top: '-61px',
                    height: '33px'
                }}
            >
                <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-purple-400 transform -translate-x-1/2 rotate-45" />
            </motion.div>
        </>
    );
};

export default function QuickSortAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition}) {
    const { message,pivot,i,j,swapping,array} = stepData;
    
    const messageRef = useRef(null);
    const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

    // Build indices array - NEVER include pivot (it has its own label)
    const indices = [];
    
    // Priority 1: Swapping elements (filter out pivot if present)
    if (swapping && swapping.length >= 2 && array) {
        // Filter out pivot from swapping elements
        const nonPivotSwapping = swapping.filter(idx => idx !== pivot);
        
        if (nonPivotSwapping.length >= 2) {
            const firstElement = array[nonPivotSwapping[0]];
            const secondElement = array[nonPivotSwapping[1]];
            
            // If swapping elements have the same value, use single pointer
            if (firstElement && secondElement && firstElement.value === secondElement.value) {
                const middleIndex = (nonPivotSwapping[0] + nonPivotSwapping[1]) / 2;
                indices.push(Math.round(middleIndex));
            } else {
                // Different values, use dual pointers
                indices.push(...nonPivotSwapping.slice(0, 2));
            }
        } else if (nonPivotSwapping.length === 1) {
            // Only one non-pivot element in swap
            indices.push(nonPivotSwapping[0]);
        }
        // If all swapping elements are pivot, indices remains empty (only pivot label will show)
    }
    // Priority 2: Comparison - ONLY point to j if it's not the pivot
    else if (j !== null && j !== undefined && j >= 0 && j !== pivot) {
        indices.push(j);
    }
    // Priority 3: Message indices (filter out pivot)
    else if (message?.indices && message.indices.length > 0) {
        const filteredIndices = message.indices.filter(idx => idx !== pivot);
        indices.push(...filteredIndices);
    }

    const hasPointers = indices.length > 0;
    const messagePositionIndex = hasPointers ? (indices[0] + indices[indices.length - 1]) / 2 : null;

    useLayoutEffect(() => {
        if (messagePositionIndex != null && messageRef.current && containerRef.current && array) {
            const messageWidth = messageRef.current.offsetWidth;
            
            // Calculate array element boundaries instead of container boundaries
            const leftmostIndex = 0;
            const rightmostIndex = array.length - 1;
            
            // Left boundary: left edge of leftmost element
            const leftBoundary = leftmostIndex * (elementSize + gap);
            
            // Right boundary: right edge of rightmost element  
            const rightBoundary = rightmostIndex * (elementSize + gap) + elementSize;
            
            // Calculate the ideal centered position for the message box
            const pointerCenter = messagePositionIndex * (elementSize + gap) + elementSize / 2;
            const idealLeft = pointerCenter - messageWidth / 2;
            
            // Calculate the final left position, ensuring it's within the array boundaries
            let finalLeft;
            if (idealLeft < leftBoundary) {
                // Pin to the left boundary (left edge of first element)
                finalLeft = leftBoundary;
            } else if (idealLeft + messageWidth > rightBoundary) {
                // Pin to the right boundary (right edge of last element)
                finalLeft = rightBoundary - messageWidth;
            } else {
                // Position is fine, use the ideal centered position
                finalLeft = idealLeft;
            }

            const newStyle = { 
                left: `${finalLeft}px`,
                transform: 'translateX(0)' 
            };
            
            setStyle(newStyle);
        } else {
            // Default style for messages without pointers (center of the container)
            setStyle({ left: '50%', transform: 'translateX(-50%)' });
        }
    }, [messagePositionIndex, message, containerRef, elementSize, gap, array]);

    if (!message || !message.text) return null;

    const annotationContainerY = -140;
    const pointerGap = 8;
    const isMultiPointer = indices.length > 1;

    const getPointerHeight = (index, startY) => {
        const isLifted = swapping?.includes(index) || 
                        (i !== null && i === index) || 
                        (j !== null && j === index);
        const targetY = isLifted ? bumpYPosition : 0;
        const pointerAbsoluteStartY = annotationContainerY + startY;
        const pointerAbsoluteEndY = targetY - pointerGap;
        return Math.max(0, pointerAbsoluteEndY - pointerAbsoluteStartY);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-[-140px] left-0 w-full h-full pointer-events-none z-10"
            >
                <MessageBox message={message} style={style} messageRef={messageRef} />
                
                {/* Conditional Pointer Rendering - Never points to pivot */}
                {hasPointers && (
                    isMultiPointer ? (
                        (() => {
                            const indexDistance = Math.abs(indices[0] - indices[1]);
                            if (indexDistance === 1) {
                                // Adjacent elements - use simple pointers
                                return indices.map(index => (
                                    <SimplePointer
                                        key={index}
                                        index={index}
                                        height={getPointerHeight(index, 45)}
                                        elementSize={elementSize}
                                        gap={gap}
                                    />
                                ));
                            }
                            
                            // Distant elements - use stepped dual pointers
                            return (
                                <SteppedDualPointers
                                    indices={indices}
                                    messagePositionIndex={messagePositionIndex}
                                    getPointerHeight={getPointerHeight}
                                    elementSize={elementSize}
                                    gap={gap}
                                />
                            );
                        })()
                    ) : (
                        // Single pointer (never points to pivot)
                        <SimplePointer
                            index={indices[0]}
                            height={getPointerHeight(indices[0], 45)}
                            elementSize={elementSize}
                            gap={gap}
                        />
                    )
                )}
            </motion.div>

            {/* Pivot Label - the ONLY way to point to pivot */}
            <AnimatePresence>
                {pivot !== null && pivot !== undefined && (
                    <PivotLabel 
                        index={pivot}
                        elementSize={elementSize}
                        gap={gap}
                    />
                )}
            </AnimatePresence>
        </>
    );
}