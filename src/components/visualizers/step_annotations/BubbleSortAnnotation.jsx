import { motion } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';
import MessageBox from '../../shared/MessageBox';
import { SimplePointer } from '../../shared/Pointers';

export default function BubbleSortAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
    const { message, comparing, swapping } = stepData;
    const messageRef = useRef(null);
    const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

    const indices = message?.indices || [];
    const hasPointers = indices.length > 0;

    const messagePositionIndex = hasPointers ? (indices[0] + indices[indices.length - 1]) / 2 : null;
    
    useLayoutEffect(() => {
        if (messagePositionIndex != null && messageRef.current && containerRef.current) {
            const containerStyle = window.getComputedStyle(containerRef.current);
            const paddingLeft = parseFloat(containerStyle.paddingLeft) || 10; 
            const paddingRight = parseFloat(containerStyle.paddingRight) || 10; 

            const containerWidth = containerRef.current.offsetWidth;
            const messageWidth = messageRef.current.offsetWidth;
            
            // Calculate the ideal centered position for the message box
            const pointerCenter = messagePositionIndex * (elementSize + gap) + elementSize / 2;
            const idealLeft = pointerCenter - messageWidth / 2;
            
            // Define the boundaries based on the container's actual padding
            const leftBoundary = paddingLeft;
            const rightBoundary = containerWidth - paddingRight;

            // Calculate the final left position, ensuring it's within the boundaries
            let finalLeft;
            if (idealLeft < leftBoundary) {
                // Pin to the left boundary
                finalLeft = leftBoundary;
            } else if (idealLeft + messageWidth > rightBoundary) {
                // Pin to the right boundary
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
    }, [messagePositionIndex, message, containerRef, elementSize, gap]);

    if (!message || !message.text) return null;

    const annotationContainerY = -140;
    const pointerGap = 8;
    const isMultiPointer = indices.length > 1;

    const getPointerHeight = (index, startY) => {
        const isLifted = comparing?.includes(index) || swapping?.includes(index);
        const targetY = isLifted ? bumpYPosition : 0;
        const pointerAbsoluteStartY = annotationContainerY + startY;
        const pointerAbsoluteEndY = targetY - pointerGap;
        return Math.max(0, pointerAbsoluteEndY - pointerAbsoluteStartY);
    };

    // Split the message to bold the first word
    const messageParts = message.text.split(' ');
    const firstWord = messageParts.shift();
    const restOfMessage = messageParts.join(' ');

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[-140px] left-0 w-full h-full pointer-events-none z-10"
        >
           
            <MessageBox message={message} style={style} messageRef={messageRef}></MessageBox>
            
            {/* Conditional Pointer Rendering */}
            {hasPointers && (
                isMultiPointer ? (
                    (() => {
                        const indexDistance = Math.abs(indices[0] - indices[1]);
                        if (indexDistance === 1) {
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
                        
                        const initialDropTop = 47;
                        const horizontalBarTop = 60;
                        const initialSeparation = 20;
                        const messageCenterX = messagePositionIndex * (elementSize + gap) + elementSize / 2;
                        const sortedIndices = [...indices].sort((a, b) => a - b);
                        const initialXPositions = {
                            [sortedIndices[0]]: messageCenterX - initialSeparation / 2,
                            [sortedIndices[1]]: messageCenterX + initialSeparation / 2,
                        };

                        return (
                            <div className="relative w-full h-full">
                                {sortedIndices.map(index => {
                                    const initialX = initialXPositions[index];
                                    const elementX = index * (elementSize + gap) + elementSize / 2;
                                    return (
                                        <div key={index}>
                                            {/* 1. Initial short vertical drop */}
                                            <div className="absolute w-px bg-accent" style={{
                                                left: `${initialX}px`, top: `${initialDropTop}px`, height: `${horizontalBarTop - initialDropTop}px`,
                                            }} />
                                            {/* 2. Horizontal line */}
                                            <div className="absolute h-px bg-accent" style={{
                                                left: `${Math.min(initialX, elementX)}px`, width: `${Math.abs(elementX - initialX)}px`, top: `${horizontalBarTop}px`,
                                            }} />
                                            {/* 3. Final vertical drop */}
                                            <div className="absolute w-px bg-accent" style={{
                                                left: `${elementX}px`, top: `${horizontalBarTop}px`, height: `${getPointerHeight(index, horizontalBarTop)}px`, transition: 'height 0.3s ease-in-out'
                                            }}>
                                                <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()
                ) : (
                    // --- Fallback: Simple Pointer for a Single Target ---
                    <SimplePointer
                        index={indices[0]}
                        height={getPointerHeight(indices[0], 45)}
                        elementSize={elementSize}
                        gap={gap}
                    />
                )
            )}
        </motion.div>
    );
}