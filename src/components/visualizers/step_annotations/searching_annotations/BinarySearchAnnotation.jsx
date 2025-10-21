import { motion } from 'framer-motion';
import { useRef } from 'react';
import MessageBox from '../../../shared/MessageBox';
import { getGroupedPointers, CombinedPointer } from '../../../shared/Pointers';

export default function BinarySearchAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
  const { message, checking, found, left, right, mid } = stepData;
  const messageRef = useRef(null);

  // Always center the message box
  const style = { left: '50%', transform: 'translateX(-50%)' };

  if (!message || !message.text) return null;

  const annotationContainerY = 50;
  const indices = message?.indices || [];
  const hasPointers = indices.length > 0;

  // Use the separated function
  const groupedPointers = getGroupedPointers(left, right, mid, hasPointers);

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