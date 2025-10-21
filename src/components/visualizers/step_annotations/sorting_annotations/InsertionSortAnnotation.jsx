import { motion, AnimatePresence } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';

const AnnotationPointer = ({ index, height, elementSize, gap }) => (
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

export default function InsertionSortAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
    const { message, comparing, keyValueForComparison } = stepData;
    const messageRef = useRef(null);
    const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });
    
    const focusIndex = message?.indices?.length > 0
        ? (message.indices[0] + message.indices[message.indices.length - 1]) / 2
        : null;

    useLayoutEffect(() => {
        if (focusIndex != null && messageRef.current && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const messageWidth = messageRef.current.offsetWidth;
            const pointerCenter = focusIndex * (elementSize + gap) + elementSize / 2;
            let left = pointerCenter - messageWidth / 2;
            let right = pointerCenter + messageWidth / 2;
            const newStyle = { transform: 'translateX(0)' };
            if (left < 10) { newStyle.left = '10px'; } 
            else if (right > containerWidth - 10) { newStyle.left = `${containerWidth - messageWidth - 10}px`; } 
            else { newStyle.left = `${left}px`; }
            setStyle(newStyle);
        }
        else {
            setStyle({ left: '50%', transform: 'translateX(-50%)' });
        }
    }, [focusIndex, message, containerRef, elementSize, gap]);

    if (!message || !message.text) return null;

    const annotationContainerY = -140;
    const pointerStartYInsideAnnotation = 45;
    const pointerGap = 8;
    const keyYPosition = -50;
    
    let pointer = null;
    if (focusIndex !== null && Number.isInteger(focusIndex)) {
        const isTargetTheFloatingKey = keyValueForComparison !== undefined && comparing?.includes(focusIndex);
        const isTargetLifted = comparing?.includes(focusIndex) && !isTargetTheFloatingKey;
        let targetY = 0;
        if (isTargetTheFloatingKey) targetY = keyYPosition;
        else if (isTargetLifted) targetY = bumpYPosition;
        const pointerHeight = (targetY - pointerGap) - (annotationContainerY + pointerStartYInsideAnnotation);
        pointer = { index: focusIndex, height: Math.max(0, pointerHeight) };
    }

    const isKeyVisible = keyValueForComparison !== undefined && comparing?.length > 0;
    const keyXPosition = isKeyVisible ? comparing[0] * (elementSize + gap) : 0;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="absolute top-[-140px] left-0 w-full h-full pointer-events-none z-10"
            >
                {/* FIX: Added 'whitespace-nowrap' to prevent text wrapping */}
                <div
                    ref={messageRef}
                    className="absolute top-0 p-2 text-center rounded-md bg-background-tertiary border border-border shadow-md text-sm text-text-primary whitespace-nowrap"
                    style={style}
                >
                    {message.text}
                </div>
                {pointer && <AnnotationPointer {...pointer} elementSize={elementSize} gap={gap} />}
            </motion.div>

            <AnimatePresence>
                {isKeyVisible && (
                    <motion.div
                        key="comparison-key-box"
                        initial={{ opacity: 0, y: keyYPosition, scale: 0.8, x: keyXPosition }}
                        animate={{ opacity: 1, y: keyYPosition, scale: 1, x: keyXPosition }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        style={{ top: 0, left: 0 }}
                        className="absolute w-14 h-14 z-20 rounded-md flex items-center justify-center border-2 font-bold text-xl bg-blue-500 border-blue-300 text-white shadow-lg"
                    >
                        {keyValueForComparison}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}