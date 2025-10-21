import { motion } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';
import { ElementPointer } from '../../../shared/Pointers';

export default function HeapSortAnnotation({ stepData, elementSize, gap, containerRef}) {
    const { message, root, largest, comparing, swapping } = stepData;
    const messageRef = useRef(null);
    const [messageStyle, setMessageStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

    useLayoutEffect(() => {
        if (messageRef.current && containerRef.current) {
            const containerStyle = window.getComputedStyle(containerRef.current);
            const paddingLeft = parseFloat(containerStyle.paddingLeft) || 10; 
            const paddingRight = parseFloat(containerStyle.paddingRight) || 10; 

            const containerWidth = containerRef.current.offsetWidth;
            const messageWidth = messageRef.current.offsetWidth;
            
            const messagePositionIndex = message.targetIndex !== undefined ? message.targetIndex : null;

            if (messagePositionIndex != null) {
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

                setMessageStyle({ 
                    left: `${finalLeft}px`,
                    transform: 'translateX(0)' 
                });
            } else {
                setMessageStyle({ left: '50%', transform: 'translateX(-50%)' });
            }
        }
    }, [message.targetIndex, messageRef, containerRef, elementSize, gap, stepData.array]);


    if (!message || !message.text) return null;

    const pointers = [];
    const n = stepData.array ? stepData.array.length : 0;

    const annotationContainerY = -140; 

    const MESSAGE_Y_OFFSET = -15; 
    const PARENT_Y_OFFSET = 45; 
    const CHILD_Y_OFFSET = 60; 
    const LARGEST_Y_OFFSET = 75; 
    const SWAPPING_Y_OFFSET = 45; 

    if (root != null) {
        pointers.push({
            index: root,
            label: 'Parent',
            color: 'var(--color-purple-400)',
            yOffset: PARENT_Y_OFFSET,
        });

        const leftChild = 2 * root + 1;
        const rightChild = 2 * root + 2;

        const isLargestLeftChild = largest != null && largest === leftChild;
        const isLargestRightChild = largest != null && largest === rightChild;

        if (leftChild < n && comparing?.includes(leftChild) && !isLargestLeftChild) {
            pointers.push({
                index: leftChild,
                label: 'Left Child',
                color: 'var(--color-blue-400)',
                yOffset: CHILD_Y_OFFSET,
            });
        }

        if (rightChild < n && comparing?.includes(rightChild) && !isLargestRightChild) {
            pointers.push({
                index: rightChild,
                label: 'Right Child',
                color: 'var(--color-blue-400)',
                yOffset: CHILD_Y_OFFSET,
            });
        }

        if (largest != null && largest !== root) {
            pointers.push({
                index: largest,
                label: 'Largest',
                color: 'var(--color-yellow-400)',
                yOffset: LARGEST_Y_OFFSET,
            });
        }
    }

    if (swapping && swapping.length > 0) {
        swapping.forEach(idx => {
            const hasOtherLabel = pointers.some(p => p.index === idx);
            if (!hasOtherLabel) {
                 pointers.push({
                    index: idx,
                    label: 'Swapping',
                    color: 'var(--color-red-400)',
                    yOffset: SWAPPING_Y_OFFSET, 
                });
            }
        });
    }

    // Split the message to bold the first word
    const messageParts = message.text.split(' ');
    const firstWord = messageParts.shift();
    const restOfMessage = messageParts.join(' ');

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 w-full h-full pointer-events-none z-10"
            style={{ top: `${annotationContainerY}px` }}
        >
            {/* Message Box */}
            <div
                ref={messageRef}
                className="absolute p-2 text-center rounded-md bg-background-tertiary border border-border shadow-md text-sm text-text-primary whitespace-nowrap flex items-start justify-center" // Added flex for icon alignment
                style={{ ...messageStyle, top: `${MESSAGE_Y_OFFSET}px` }}
            >
                {/* Example: Info icon */}
                <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                
                {/* Example: Bold first word */}
                {firstWord && <strong className="font-bold mr-1">{firstWord}</strong>}
                {restOfMessage}
            </div>
            
            {/* Render Pointers */}
            {pointers.map((pointer, idx) => (
                <ElementPointer
                    key={idx}
                    index={pointer.index}
                    label={pointer.label}
                    elementSize={elementSize}
                    gap={gap}
                    color={pointer.color}
                    yOffset={pointer.yOffset}
                />
            ))}
        </motion.div>
    );
}