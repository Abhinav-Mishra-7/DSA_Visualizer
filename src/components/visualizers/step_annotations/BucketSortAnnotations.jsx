import { motion } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';
import InsertionSortAnnotation from './InsertionSortAnnotation';
import { BucketPointer , GroupedBucketPointer } from '../../shared/Pointers';

const GROUPED_BUCKET_LABEL_COLORS = [
  "bg-purple-400 border-purple-500 text-white",
  "bg-blue-400 border-blue-500 text-white",
  "bg-green-400 border-green-500 text-white",
  "bg-pink-400 border-pink-500 text-white",
  "bg-orange-400 border-orange-500 text-white",
  "bg-yellow-400 border-yellow-500 text-white",
  "bg-cyan-400 border-cyan-500 text-white"
];

export default function BucketSortAnnotation({stepData,elementSize,gap,containerRef}) {

  const messageRef = useRef(null);
  const [messageStyle, setMessageStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

  if (!stepData || !stepData.array) return null;
  const { message, bucketForIndex = [], sortedBuckets = [], showBucketPointers = true } = stepData;

  useLayoutEffect(() => {
    setMessageStyle({ left: '50%', transform: 'translateX(-50%)' });
  }, [containerRef, messageRef, stepData.array]);

  
  // CONDITIONAL RENDERING: Use insertion sort annotations during bucket sorting
  if (stepData.useInsertionSortAnnotations && stepData.stage === "bucketInsertion") {
    // Create a modified step data for insertion sort annotation
    const insertionStepData = {
      ...stepData,
      // Adjust indices for insertion sort annotation to work within bucket range
      keyIndex: stepData.keyIndex !== null ? stepData.keyIndex - stepData.insertionSortBucketStart : null,
      comparing: stepData.comparing?.map(idx => idx - stepData.insertionSortBucketStart) || [],
      sorted: stepData.sorted?.map(idx => idx - stepData.insertionSortBucketStart) || [],
      overwriting: stepData.overwriting !== null ? stepData.overwriting - stepData.insertionSortBucketStart : null,
    };

    return (
      <div
        className="absolute left-0 w-full h-full pointer-events-none z-10"
        style={{ 
          top: "-140px",
          // Offset the annotation to align with the bucket being sorted
          transform: `translateX(${stepData.insertionSortBucketStart * (elementSize + gap)}px)`
        }}
      >
        <InsertionSortAnnotation
          stepData={insertionStepData}
          elementSize={elementSize}
          gap={gap}
          containerRef={containerRef}
        />
      </div>
    );
  }

  // Regular bucket sort annotations for other stages
  const messageParts = message?.text?.split(' ') ?? [];
  const firstWord = messageParts.shift();
  const restOfMessage = messageParts.join(' ');

  // Which indices are in a sorted bucket (for hiding their per-element pointer only)
  const indicesInSortedBuckets = new Set();
  if (sortedBuckets && sortedBuckets.length > 0) {
    sortedBuckets.forEach(sb => {
      for (let i = sb.start; i <= sb.end; i++) indicesInSortedBuckets.add(i);
    });
  }

  // Per-element pointers (for elements not yet in any sorted bucket)
  const elementPointers = [];
  if (showBucketPointers && bucketForIndex.length) {
    stepData.array.forEach((item, i) => {
      if (
        bucketForIndex[i] !== null &&
        bucketForIndex[i] !== undefined &&
        !indicesInSortedBuckets.has(i)
      ) {
        elementPointers.push(
          <BucketPointer
            key={`p-${i}`}
            index={i}
            bucketIdx={bucketForIndex[i]}
            elementSize={elementSize}
            gap={gap}
          />
        );
      }
    });
  }

  // Grouped pointers for each sorted bucket (can be more than one at a time)
  const groupedPointers = [];
  if (sortedBuckets && sortedBuckets.length > 0) {
    sortedBuckets.forEach(sb => {
      groupedPointers.push(
        <GroupedBucketPointer
          key={`g-${sb.bucket}-${sb.start}-${sb.end}`}
          start={sb.start}
          end={sb.end}
          bucketIdx={sb.bucket}
          elementSize={elementSize}
          gap={gap}
        />
      );
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="absolute left-0 w-full h-full pointer-events-none z-10"
      style={{ top: "-140px" }}
    >
      {/* Message Box */}
      <div
        ref={messageRef}
        className="absolute p-2 text-center rounded-md bg-background-tertiary border border-border shadow-md text-sm text-text-primary whitespace-nowrap flex items-start justify-center"
        style={{ ...messageStyle, top: "-15px" }}
      >
        <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {firstWord && <strong className="font-bold mr-1">{firstWord}</strong>}
        {restOfMessage}
      </div>
      {/* All pointers */}
      {elementPointers}
      {groupedPointers}
    </motion.div>
  );
}