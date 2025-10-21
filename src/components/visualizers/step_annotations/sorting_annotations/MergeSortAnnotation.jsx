import { motion } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';

const SimplePointer = ({ index, height, elementSize, gap }) => (
    <div
        className="absolute w-px bg-accent"
        style={{
            left: `${index * (elementSize + gap) + elementSize / 2}px`,
            top: '45px',
            height: `${height}px`,
            transition: 'height 0.3s ease-in-out'
        }}
    >
        <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
    </div>
);

// This component now handles Bubble Sort, Selection Sort, and other similar algorithms.
// Renaming it to AlgorithmAnnotation is recommended.
export default function BubbleSortAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition, currentStep }) {
    const { message, comparing, swapping } = stepData;
    const messageRef = useRef(null);
    const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

    // This component correctly uses `message.indices` which your SelectionSortProvider creates.
    const indices = message?.indices || [];
    const hasPointers = indices.length > 0;

    const messagePositionIndex = hasPointers ? (indices[0] + indices[indices.length - 1]) / 2 : null;
    
    // Message positioning logic is correct and remains unchanged.
    useLayoutEffect(() => {
        if (messagePositionIndex != null && messageRef.current && containerRef.current) {
            const containerStyle = window.getComputedStyle(containerRef.current);
            const paddingLeft = parseFloat(containerStyle.paddingLeft) || 10; 
            const paddingRight = parseFloat(containerStyle.paddingRight) || 10; 
            const containerWidth = containerRef.current.offsetWidth;
            const messageWidth = messageRef.current.offsetWidth;
            const pointerCenter = messagePositionIndex * (elementSize + gap) + elementSize / 2;
            const idealLeft = pointerCenter - messageWidth / 2;
            const leftBoundary = paddingLeft;
            const rightBoundary = containerWidth - paddingRight;

            let finalLeft;
            if (idealLeft < leftBoundary) {
                finalLeft = leftBoundary;
            } else if (idealLeft + messageWidth > rightBoundary) {
                finalLeft = rightBoundary - messageWidth;
            } else {
                finalLeft = idealLeft;
            }

            setStyle({ 
                left: `${finalLeft}px`,
                transform: 'translateX(0)' 
            });
        } else {
            setStyle({ left: '50%', transform: 'translateX(-50%)' });
        }
    }, [messagePositionIndex, message, containerRef, elementSize, gap]);

    if (!message || !message.text) return null;

    const annotationContainerY = -140;
    const pointerGap = 8;

    const getPointerHeight = (index, startY) => {
        const isLifted = comparing?.includes(index) || swapping?.includes(index);
        const targetY = isLifted ? bumpYPosition : 0;
        const pointerAbsoluteStartY = annotationContainerY + startY;
        const pointerAbsoluteEndY = targetY - pointerGap;
        return Math.max(0, pointerAbsoluteEndY - pointerAbsoluteStartY);
    };

    // --- REFACTORED POINTER RENDERING LOGIC ---
    const renderPointers = () => {
        if (!hasPointers) return null;

        const isMultiPointer = indices.length > 1;

        // --- Single Pointer Logic ---
        if (!isMultiPointer) {
            return (
                <SimplePointer
                    index={indices[0]}
                    height={getPointerHeight(indices[0], 45)}
                    elementSize={elementSize}
                    gap={gap}
                />
            );
        }

        // --- Multi-Pointer Logic ---
        const sortedIndices = [...indices].sort((a, b) => a - b);
        const index1 = sortedIndices[0];
        const index2 = sortedIndices[1];
        const indexDistance = Math.abs(index1 - index2);

        // Style 1: Adjacent elements (for Bubble Sort)
        if (indexDistance === 1) {
            return sortedIndices.map(index => (
                <SimplePointer
                    key={index}
                    index={index}
                    height={getPointerHeight(index, 45)}
                    elementSize={elementSize}
                    gap={gap}
                />
            ));
        }
        
        // --- THIS IS THE FIX ---
        // Style 2: Non-adjacent elements (for Selection Sort)
        const elementX1 = index1 * (elementSize + gap) + elementSize / 2;
        const elementX2 = index2 * (elementSize + gap) + elementSize / 2;
        const messageCenterX = messagePositionIndex * (elementSize + gap) + elementSize / 2;

        const messageBottomY = 40;
        const horizontalBarY = 55;
        const initialDropHeight = horizontalBarY - messageBottomY;

        return (
            <div className="absolute top-0 left-0 w-full h-full">
                {/* 1. Initial short vertical drop from message center */}
                <div
                    className="absolute w-px bg-accent"
                    style={{ left: `${messageCenterX}px`, top: `${messageBottomY}px`, height: `${initialDropHeight}px` }}
                />
                
                {/* 2. Horizontal bar (the "fork") */}
                <div
                    className="absolute h-px bg-accent"
                    style={{ left: `${elementX1}px`, top: `${horizontalBarY}px`, width: `${elementX2 - elementX1}px` }}
                />
                
                {/* 3a. Final vertical drop to the left element */}
                <div
                    className="absolute w-px bg-accent"
                    style={{ left: `${elementX1}px`, top: `${horizontalBarY}px`, height: `${getPointerHeight(index1, horizontalBarY)}px`, transition: 'height 0.3s ease-in-out' }}
                >
                    <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
                </div>
                
                {/* 3b. Final vertical drop to the right element */}
                <div
                    className="absolute w-px bg-accent"
                    style={{ left: `${elementX2}px`, top: `${horizontalBarY}px`, height: `${getPointerHeight(index2, horizontalBarY)}px`, transition: 'height 0.3s ease-in-out' }}
                >
                    <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
                </div>
            </div>
        );
    };

    return (
        <motion.div
            key={`${message.text}-${currentStep}`}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[-140px] left-0 w-full h-full pointer-events-none z-10"
        >
            <div
                ref={messageRef}
                className="absolute top-0 p-2 text-center rounded-md bg-background-tertiary border border-border shadow-md text-sm text-text-primary whitespace-nowrap"
                style={style}
            >
                {message.text}
            </div>
            
            {renderPointers()}
        </motion.div>
    );
}