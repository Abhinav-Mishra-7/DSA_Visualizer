import { motion } from 'framer-motion';
import { useRef } from 'react';
import MessageBox from '../../../shared/MessageBox';
import { getGroupedInterpolationPointers, CombinedPointer } from '../../../shared/Pointers';

export default function InterpolationSearchAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
  const messageRef = useRef(null);

  // Add safety checks for stepData
  if (!stepData) return null;

  const { 
    message, 
    checking = [], 
    found = [], 
    low = null, 
    high = null, 
    pos = null,
    phase = 'init' 
  } = stepData;

  // Always center the message box
  const style = { left: '50%', transform: 'translateX(-50%)' };

  if (!message || !message.text) return null;

  const annotationContainerY = 50;
  const indices = message?.indices || [];
  const hasPointers = indices.length > 0;

  // Use grouped pointers logic (same as Binary Search)
  const groupedPointers = getGroupedInterpolationPointers(checking, found, low, high, pos, phase, hasPointers);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute lg:top-[-150px] md:top-[-120px] top-[-105px] lg:left-0 left-0 w-full h-full pointer-events-none z-10"
    >
      {/* Message Box - Always centered */}
      <MessageBox message={message} style={style} messageRef={messageRef} />
      
      {/* Render combined pointers */}
      {Object.entries(groupedPointers).map(([index, pointers]) => (
        <CombinedPointer
          key={index}
          index={parseInt(index)}
          pointers={pointers}
          elementSize={elementSize}
          gap={gap}
          annotationContainerY={annotationContainerY}
        />
      ))}
    </motion.div>
  );
}

