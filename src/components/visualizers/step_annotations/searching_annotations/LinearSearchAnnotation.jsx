import { motion } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';
import MessageBox from '../../../shared/MessageBox';
import { SimplePointer } from '../../../shared/Pointers';

export default function LinearSearchAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
  const { message, checking, found } = stepData;
  const messageRef = useRef(null);
  const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

  const indices = message?.indices || [];
  const hasPointers = indices.length > 0;

  const messagePositionIndex = hasPointers ? indices[0] : null;

  useLayoutEffect(() => {
    if (messagePositionIndex != null && messageRef.current && containerRef.current) {
      const containerStyle = window.getComputedStyle(containerRef.current);
      const containerRect = containerRef.current.getBoundingClientRect();
      const messageWidth = messageRef.current.offsetWidth;

      // Calculate array boundaries based on actual array elements
      const arrayLength = stepData?.array?.length || 1;
      const totalArrayWidth = arrayLength * (elementSize + gap) - gap;
      
      // Find the actual array container position
      const arrayContainer = containerRef.current.querySelector('.flex.items-end.justify-center');
      
      let leftBoundary, rightBoundary;
      
      if (arrayContainer) {
        const arrayRect = arrayContainer.getBoundingClientRect();
        const containerOffset = containerRect.left;
        leftBoundary = arrayRect.left - containerOffset;
        rightBoundary = arrayRect.right - containerOffset;
      } else {
        // Fallback: calculate based on container center
        const containerWidth = containerRect.width;
        const containerCenter = containerWidth / 2;
        leftBoundary = containerCenter - (totalArrayWidth / 2);
        rightBoundary = containerCenter + (totalArrayWidth / 2);
      }

      // Calculate ideal position for the message (centered on the target element)
      const elementPosition = leftBoundary + (messagePositionIndex * (elementSize + gap)) + (elementSize / 2);
      const idealLeft = elementPosition - (messageWidth / 2);

      // Constrain the message box within array boundaries
      let finalLeft;
      if (idealLeft < leftBoundary) {
        finalLeft = leftBoundary;
      } else if (idealLeft + messageWidth > rightBoundary) {
        finalLeft = rightBoundary - messageWidth;
      } else {
        finalLeft = idealLeft;
      }

      const newStyle = { 
        left: `${finalLeft-100}px`,
        transform: 'translateX(0)' 
      };
      
      setStyle(newStyle);
    } else {
      // Default style for messages without pointers (center of the container)
      setStyle({ left: '50%', transform: 'translateX(-50%)' });
    }
  }, [messagePositionIndex, message, containerRef, elementSize, gap, stepData?.array?.length]);

  if (!message || !message.text) return null;

  const annotationContainerY = -140;
  const pointerGap = 8;

  const getPointerHeight = (index, startY) => {
    const isLifted = checking?.includes(index) || found?.includes(index);
    const targetY = isLifted ? bumpYPosition : 0;
    const pointerAbsoluteStartY = annotationContainerY + startY;
    const pointerAbsoluteEndY = targetY - pointerGap;
    return Math.max(0, pointerAbsoluteEndY - pointerAbsoluteStartY);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute lg:top-[-150px] md:top-[-120px] top-[-105px] lg:left-0 left-0 w-full h-full pointer-events-none z-10"
    >
      <MessageBox message={message} style={style} messageRef={messageRef} />
      {hasPointers && (
        <SimplePointer
          index={indices[0]}
          height={getPointerHeight(indices[0], 45)}
          elementSize={elementSize}
          gap={gap}
        />
      )}
    </motion.div>
  );
}




// import { motion } from 'framer-motion';
// import { useState, useLayoutEffect, useRef } from 'react';
// import MessageBox from '../../shared/MessageBox';
// import { SimplePointer } from '../../shared/Pointers';

// export default function LinearSearchAnnotation({ stepData, elementSize, gap, containerRef, bumpYPosition }) {
//   const { message, checking, found } = stepData;
//   const messageRef = useRef(null);
//   const [style, setStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

//   const indices = message?.indices || [];
//   const hasPointers = indices.length > 0;

//   const messagePositionIndex = hasPointers ? indices[0] : null;

//   useLayoutEffect(() => {
//     if (messagePositionIndex != null && messageRef.current && containerRef.current) {
//       const containerStyle = window.getComputedStyle(containerRef.current);
//       const paddingLeft = parseFloat(containerStyle.paddingLeft) || 10;
//       const paddingRight = parseFloat(containerStyle.paddingRight) || 10;

//       const containerWidth = containerRef.current.offsetWidth;
//       const messageWidth = messageRef.current.offsetWidth;

//       const pointerCenter = messagePositionIndex * (elementSize + gap) + elementSize / 2;
//       const idealLeft = pointerCenter - messageWidth / 2;

//       const leftBoundary = paddingLeft;
//       const rightBoundary = containerWidth - paddingRight;

//       let finalLeft;
//       if (idealLeft < leftBoundary) finalLeft = leftBoundary;
//       else if (idealLeft + messageWidth > rightBoundary) finalLeft = rightBoundary - messageWidth;
//       else finalLeft = idealLeft;

//       setStyle({ left: `${finalLeft}px`, transform: 'translateX(0)' });
//     } else {
//       setStyle({ left: '50%', transform: 'translateX(-50%)' });
//     }
//   }, [messagePositionIndex, message, containerRef, elementSize, gap]);

//   if (!message || !message.text) return null;

//   const annotationContainerY = -140;
//   const pointerGap = 8;

//   const getPointerHeight = (index, startY) => {
//     const isLifted = checking?.includes(index) || found?.includes(index);
//     const targetY = isLifted ? bumpYPosition : 0;
//     const pointerAbsoluteStartY = annotationContainerY + startY;
//     const pointerAbsoluteEndY = targetY - pointerGap;
//     return Math.max(0, pointerAbsoluteEndY - pointerAbsoluteStartY);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//       className="absolute lg:top-[-150px] md:top-[-120px] top-[-105px] lg:left-0 left-0 w-full h-full pointer-events-none z-10"
//     >
//       <MessageBox message={message} style={style} messageRef={messageRef} />
//       {hasPointers && (
//         <SimplePointer
//           index={indices[0]}
//           height={getPointerHeight(indices[0], 45)}
//           elementSize={elementSize}
//           gap={gap}
//         />
//       )}
//     </motion.div>
//   );
// }