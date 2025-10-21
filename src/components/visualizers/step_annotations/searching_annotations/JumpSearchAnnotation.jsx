import { motion } from 'framer-motion';
import { useRef } from 'react';
import MessageBox from '../../../shared/MessageBox';
import { getGroupedJumpPointers, CombinedJumpPointer, JumpSizeIndicator } from '../../../shared/Pointers';

export default function JumpSearchAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
  const messageRef = useRef(null);

  // Add safety checks for stepData
  if (!stepData) return null;

  const { 
    message, 
    checking = [], 
    found = [], 
    current = null, 
    prev = null, 
    phase = 'initial', 
    jumpSize = null 
  } = stepData;

  // Always center the message box
  const style = { left: '50%', transform: 'translateX(-50%)' };

  if (!message || !message.text) return null;

  const annotationContainerY = 50;
  const indices = message?.indices || [];
  const hasPointers = indices.length > 0;

  // Use grouped pointers logic
  const groupedPointers = getGroupedJumpPointers(checking, found, current, prev, phase, hasPointers);

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
        <CombinedJumpPointer
          key={index}
          index={parseInt(index)}
          pointers={pointers}
          elementSize={elementSize}
          gap={gap}
          annotationContainerY={annotationContainerY}
        />
      ))}
      
      {/* Jump size indicator */}
      <JumpSizeIndicator
        phase={phase}
        jumpSize={jumpSize}
        annotationContainerY={annotationContainerY}
      />
    </motion.div>
  );
}