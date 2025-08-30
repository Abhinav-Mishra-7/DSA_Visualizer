import { motion, AnimatePresence } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';
import MessageBox from '../../shared/MessageBox';
import {AnnotationPointer} from "../../shared/Pointers" ;

const FloatingDigit = ({ value, digitPlace, elementSize, gap, index }) => {
  const digit = Math.floor(value / digitPlace) % 10;
  const leftPos = index * (elementSize + gap);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: -50 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      style={{ left: `${leftPos}px`, top: 0 }}
      className="absolute w-14 h-14 z-20 rounded-md flex items-center justify-center border-2 font-bold text-xl bg-blue-500 border-blue-300 text-white shadow-lg"
    >
      {digit}
    </motion.div>
  );
};

export default function RadixSortAnnotation({ 
  stepData, 
  elementSize, 
  gap, 
  containerRef, 
  bumpYPosition 
}) {
  const { 
    message,
    distributingIndex,
    array,
    digitPlace,
    stage
  } = stepData;
  
  const messageRef = useRef(null);
  const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });
  const [messageHeight, setMessageHeight] = useState(40);
  
  // Simple focus calculation with proper null checking
  const focusIndex = (() => {
    if (message?.indices && message.indices.length > 0) {
      return message.indices[0];
    }
    if (distributingIndex !== null && distributingIndex !== undefined) {
      return distributingIndex;
    }
    return null;
  })();

  useLayoutEffect(() => {
    if (messageRef.current) {
      setMessageHeight(messageRef.current.offsetHeight);
    }

    // If there's no focus index, center the message
    if (focusIndex === null) {
      setStyle({ left: '50%', transform: 'translateX(-50%)' });
    } 
    // Otherwise, position message relative to focused element
    else if (messageRef.current && containerRef.current && array && array.length > 0) {
      const messageWidth = messageRef.current.offsetWidth;
      
      // Calculate array element boundaries instead of container boundaries
      const leftmostIndex = 0;
      const rightmostIndex = array.length - 1;
      
      // Left boundary: left edge of leftmost element
      const leftBoundary = leftmostIndex * (elementSize + gap);
      
      // Right boundary: right edge of rightmost element  
      const rightBoundary = rightmostIndex * (elementSize + gap) + elementSize;
      
      const pointerCenter = focusIndex * (elementSize + gap) + elementSize / 2;
      let left = pointerCenter - messageWidth / 2;
      let right = pointerCenter + messageWidth / 2;
      const newStyle = { transform: 'translateX(0)' };
      
      // Use array element boundaries instead of container boundaries
      if (left < leftBoundary) { 
        newStyle.left = `${leftBoundary}px`; 
      } else if (right > rightBoundary) { 
        newStyle.left = `${rightBoundary - messageWidth}px`; 
      } else { 
        newStyle.left = `${left}px`; 
      }
      setStyle(newStyle);
    }
  }, [focusIndex, message, containerRef, elementSize, gap, array]);

  if (!message || !message.text) return null;

  const annotationContainerY = -140;
  const pointerGap = 8;
  
  // Calculate pointer properties only if there's a focus index
  let pointer = null;
  if (focusIndex !== null && Number.isInteger(focusIndex)) {
    let targetY = 0;
    if (distributingIndex === focusIndex) targetY = bumpYPosition;
    
    const pointerStartY = messageHeight + pointerGap;
    const pointerHeight = Math.abs(targetY - (annotationContainerY + pointerStartY)) - 25;
    
    pointer = { index: focusIndex, height: Math.max(20, pointerHeight)};
  }

  // Show floating digit during examination
  const showFloatingDigit = stage === "examining" && distributingIndex !== null && distributingIndex !== undefined && 
    array && array[distributingIndex] && digitPlace;

  return (
    <>
      {/* Main annotation message and pointer */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        transition={{ duration: 0.3 }}
        className="absolute left-0 w-full h-full pointer-events-none z-10"
        style={{ top: `${annotationContainerY}px` }}
      >
        <MessageBox message={message} style={style} messageRef={messageRef} />
        
        {/* Show pointer only when there's a focus index */}
        {pointer && (
          <div style={{ top: `${messageHeight + pointerGap}px` }}>
            <AnnotationPointer {...pointer} elementSize={elementSize} gap={gap} />
          </div>
        )}
      </motion.div>

      {/* Floating digit during examination */}
      <AnimatePresence>
        {showFloatingDigit && (
          <FloatingDigit
            value={array[distributingIndex].value}
            digitPlace={digitPlace}
            elementSize={elementSize}
            gap={gap}
            index={distributingIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}