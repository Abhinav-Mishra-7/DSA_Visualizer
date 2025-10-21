import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import BucketSortExplanation from '../../components/algoExplanationPage/sortingExplain/BucketSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import BucketSortAnnotation from '../../components/visualizers/step_annotations/sorting_annotations/BucketSortAnnotations';
import { getInsertionSortSteps } from './InsertionSortPage';
import GenerateRandomArray from "../../components/shared/GenerateRandomArray" ;

function getBucketSortSteps(initialArray, bucketCount = 5) {
  if (!initialArray || initialArray.length <= 1) return [];

  const arr = initialArray.map(x => ({ ...x }));
  const n = arr.length;
  const steps = [];

  const min = Math.min(...arr.map(x => x.value));
  const max = Math.max(...arr.map(x => x.value));
  const range = max - min + 1;

  const getBucketIndex = (val) =>
    Math.min(bucketCount - 1, Math.floor(((val - min) / range) * bucketCount));

  let bucketForIndex = Array(arr.length).fill(null);
  let sortedBuckets = [];

  // Choose distinct colors for buckets after sorting
  const uniqueSortedBucketColors = [
    "bg-purple-400 border-purple-500", // bucket 0
    "bg-blue-400 border-blue-500",     // bucket 1
    "bg-green-400 border-green-500",   // bucket 2
    "bg-pink-400 border-pink-500",     // bucket 3
    "bg-orange-400 border-orange-500", // bucket 4 (etc)
    "bg-yellow-400 border-yellow-500",
    "bg-cyan-400 border-cyan-500"
  ];

  // Step 1: Initial state
  steps.push({
    array: arr.map(x => ({ ...x })),
    bucketForIndex: [...bucketForIndex],
    sortedBuckets: [],
    showBucketPointers: true,
    message: { text: "Initial unsorted array." },
    stage: "initial"
  });

  // Step 2: Assign to buckets
  let buckets = Array.from({ length: bucketCount }, () => []);
  arr.forEach((item, i) => {
    const bucketIdx = getBucketIndex(item.value);
    bucketForIndex[i] = bucketIdx;
    buckets[bucketIdx].push(i);

    steps.push({
      array: arr.map(x => ({ ...x })),
      bucketForIndex: [...bucketForIndex],
      sortedBuckets: [],
      currentPlacing: i,
      showBucketPointers: true,
      message: { text: `Placing value ${item.value} into bucket ${bucketIdx}.` },
      stage: "placing"
    });
  });

  // Step 3: Group elements by buckets with animated transitions
  let groupedOrder = [];
  buckets.forEach(idxArr => groupedOrder.push(...idxArr));
  let lastOrder = arr.map((_, idx) => idx);
  let workingArr = arr.slice();

  for (let o = 0; o < groupedOrder.length; o++) {
    const desiredIdx = groupedOrder[o];
    const prevIdx = lastOrder.indexOf(desiredIdx);
    if (prevIdx !== o) {
      [lastOrder[o], lastOrder[prevIdx]] = [lastOrder[prevIdx], lastOrder[o]];
      [workingArr[o], workingArr[prevIdx]] = [workingArr[prevIdx], workingArr[o]];
      [bucketForIndex[o], bucketForIndex[prevIdx]] = [bucketForIndex[prevIdx], bucketForIndex[o]];
    }
    steps.push({
      array: workingArr.map(x => ({ ...x })),
      bucketForIndex: [...bucketForIndex],
      sortedBuckets: [],
      showBucketPointers: true,
      message: { text: `Grouping elements into buckets for Bucket Sort.` },
      bucketsGrouped: true,
      stage: "grouping"
    });
  }

  // Step 4: Sort and mark each bucket
  let startIdx = 0;
  for (let b = 0; b < buckets.length; b++) {
    const idxArr = buckets[b];
    if (idxArr.length === 0) continue;

    // Show message that we're about to sort this bucket
    steps.push({
      array: workingArr.map(x => ({ ...x })),
      bucketForIndex: [...bucketForIndex],
      sortedBuckets: [...sortedBuckets],
      showBucketPointers: true, // Hide bucket labels during sorting
      message: { text: `Now sorting bucket ${b} using insertion sort...` },
      bucketsGrouped: true,
      currentSortingBucket: b,
      bucketRange: { start: startIdx, end: startIdx + idxArr.length - 1 },
      stage: "preBucketSort"
    });

       // Extract the bucket elements for insertion sort
    const bucketElements = workingArr.slice(startIdx, startIdx + idxArr.length);
    
    // Get insertion sort steps for this bucket
    const bucketSortSteps = getInsertionSortSteps(bucketElements);
    
    // Add each insertion sort step, but map it back to the full array
    bucketSortSteps.forEach((sortStep, stepIdx) => {
      // Skip the initial and final steps of insertion sort
      if (stepIdx === 0 || stepIdx === bucketSortSteps.length - 1) return;
      
      // Create a copy of the working array
      const stepArray = workingArr.map(x => ({ ...x }));
      
      // Update the bucket portion with the sorted step
      sortStep.array.forEach((element, localIdx) => {
        stepArray[startIdx + localIdx] = { ...element };
      });
      
      // Map insertion sort indices to global array indices
      const mapLocalToGlobal = (localIndices) => 
        localIndices ? localIndices.map(idx => startIdx + idx) : [];

      steps.push({
        array: stepArray,
        bucketForIndex: [...bucketForIndex],
        sortedBuckets: [...sortedBuckets],
        showBucketPointers: true,
        message: { 
          text: `Bucket ${b}: ${sortStep.message.text}` 
        },
        bucketsGrouped: true,
        currentSortingBucket: b,
        bucketRange: { start: startIdx, end: startIdx + idxArr.length - 1 },
        
        // Map insertion sort states to global indices
        keyIndex: sortStep.keyIndex !== null ? startIdx + sortStep.keyIndex : null,
        comparing: mapLocalToGlobal(sortStep.comparing),
        sorted: mapLocalToGlobal(sortStep.sorted),
        overwriting: sortStep.overwriting !== null ? startIdx + sortStep.overwriting : null,
        keyValueForComparison: sortStep.keyValueForComparison,
        
        stage: "bucketInsertion"
      });
    });

    // Update the working array with the sorted bucket
    const finalSortedBucket = bucketSortSteps[bucketSortSteps.length - 1].array;
    finalSortedBucket.forEach((element, localIdx) => {
      workingArr[startIdx + localIdx] = { ...element };
    });

    // // insertion sort with animations
    // for (let j = 1; j < idxArr.length; j++) {
    //   let k = j;
    //   while (k > 0 && workingArr[startIdx + k].value < workingArr[startIdx + k - 1].value) {
    //     const i1 = startIdx + k;
    //     const i2 = startIdx + k - 1;
    //     [workingArr[i1], workingArr[i2]] = [workingArr[i2], workingArr[i1]];
    //     [bucketForIndex[i1], bucketForIndex[i2]] = [bucketForIndex[i2], bucketForIndex[i1]];
    //     steps.push({
    //       array: workingArr.map(x => ({ ...x })),
    //       bucketForIndex: [...bucketForIndex],
    //       sortedBuckets: [...sortedBuckets],
    //       showBucketPointers: true,
    //       message: {
    //         text: `Sorting bucket ${b}: Swapping ${workingArr[i2].value} and ${workingArr[i1].value}.`
    //       },
    //       bucketsGrouped: true,
    //       bucketSorting: true,
    //       bucketSortingBucket: b,
    //       bucketSortingActive: [i1, i2],
    //       bucketSortedIndices: Array.from({ length: k }, (_, d) => startIdx + d),
    //       stage: "sorting"
    //     });
    //     k--;
    //   }
    //   if (k < j) {
    //     const i1 = startIdx + k;
    //     const i2 = startIdx + k - 1;
    //     steps.push({
    //       array: workingArr.map(x => ({ ...x })),
    //       bucketForIndex: [...bucketForIndex],
    //       sortedBuckets: [...sortedBuckets],
    //       showBucketPointers: true,
    //       message: {
    //         text: `Sorting bucket ${b}: ${workingArr[i2]?.value ?? '?'} ≤ ${workingArr[i1].value}, done.`
    //       },
    //       bucketsGrouped: true,
    //       bucketSorting: true,
    //       bucketSortingBucket: b,
    //       bucketSortingActive: [i1, i2].filter(x => x >= startIdx && x < startIdx + idxArr.length),
    //       bucketSortedIndices: Array.from({ length: j + 1 }, (_, d) => startIdx + d),
    //       stage: "sorting"
    //     });
    //   }
    // }
    
    // When done, mark all as sorted and clear bucketForIndex for these indices
    for (let j = 0; j < idxArr.length; j++) {
      bucketForIndex[startIdx + j] = null;
    }
    sortedBuckets = [
      ...sortedBuckets,
      {
        bucket: b,
        start: startIdx,
        end: startIdx + idxArr.length - 1,
        colorClass: uniqueSortedBucketColors[b % uniqueSortedBucketColors.length]
      }
    ];
    steps.push({
      array: workingArr.map(x => ({ ...x })),
      bucketForIndex: [...bucketForIndex],
      sortedBuckets: [...sortedBuckets],
      justSortedBucket: b,
      showBucketPointers: true, 
      message: {
        text: `Bucket ${b} sorted!`
      },
      bucketsGrouped: true,
      stage: "bucketSorted"
    });
    startIdx += idxArr.length;
  }

  // Step 5: FIXED MERGING - Keep array structure, just highlight merge progress
  const finalSortedArray = workingArr.map(x => ({ ...x }));
  
  // Show transition message before merging
  steps.push({
    array: finalSortedArray.map(x => ({ ...x })),
    bucketForIndex: Array(finalSortedArray.length).fill(null),
    sortedBuckets: [], // Clear sorted bucket labels
    showBucketPointers: false,
    message: { text: "All buckets sorted! Ready to merge into final array." },
    stage: "preMerging"
  });

  // Merge step by step - highlight each element as it's "merged"
  for (let m = 0; m < finalSortedArray.length; m++) {
    steps.push({
      array: finalSortedArray.map(x => ({ ...x })), // Keep same array structure
      bucketForIndex: Array(finalSortedArray.length).fill(null),
      sortedBuckets: [],
      showBucketPointers: false,
      merging: true,
      mergingIndex: m, // Current element being merged
      mergedIndices: Array.from({ length: m }, (_, i) => i), // Previously merged elements
      message: { text: `Merging buckets: Adding ${finalSortedArray[m].value} to sorted array.` },
      stage: "merging"
    });
  }

  // Step 6: Final completion
  steps.push({
    array: finalSortedArray.map(x => ({ ...x })),
    bucketForIndex: Array(finalSortedArray.length).fill(null),
    sortedBuckets: [],
    showBucketPointers: false,
    allMerged: true,
    message: { text: "Sorting complete!" },
    stage: "done"
  });

  return steps;
}

export default function BucketSortProvider({ children }) {
  const [initialArray, setInitialArray] = usePersistentState(
    'bucketSortInitialArray_v1', GenerateRandomArray(10)
  );
  const [userInput, setUserInput] = useState(
    (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
      ? initialArray.map(item => item.value).join(', ')
      : ''
  );

  const steps = useMemo(() => getBucketSortSteps(initialArray, 5), [initialArray]);
  const resetArray = useCallback(() => {
    const newArray = GenerateRandomArray(10);
    setInitialArray(newArray);
    setUserInput(newArray.map(item => item.value).join(', '));
  }, [setInitialArray]);

  const applyUserInput = useCallback(() => {
    const parsedValues = userInput
      .split(',')
      .map(item => parseInt(item.trim(), 10))
      .filter(num => !isNaN(num) && num >= 1 && num <= 100)
      .slice(0, 10);

    if (parsedValues.length >= 2) {
      const newArray = parsedValues.map((val, i) => ({
        id: `user-item-${i}-${Date.now()}`,
        value: val
      }));
      setInitialArray(newArray);
    } else {
      alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 10 numbers.');
    }
  }, [userInput, setInitialArray]);

  const getBucketElementState = useCallback((item, index, stepData) => {
    if (!stepData) return 'bg-accent/60 border-accent';
    
    const { stage, mergedIndices, mergingIndex } = stepData;
    
    // Handle merging phase colors
    if (stage === "merging" || stage === "preMerging") {
      // Currently merging element - bright green with animation
      if (index === mergingIndex) {
        return 'bg-green-500 border-green-400 shadow-md';
      }
      
      // Already merged elements - simple solid green
      if (mergedIndices && mergedIndices.includes(index)) {
        return 'bg-green-500 border-green-400';
      }
      
      // Not yet merged - dimmed gray
      return 'bg-gray-500/60 border-gray-400';
    }
    
    // Handle final completion - simple solid green
    if (stepData.allMerged) {
      return 'bg-green-500 border-green-400 shadow-lg';
    }
    
    // Handle bucket insertion sort phase
    if (stage === "bucketInsertion") {
      if (index === stepData.keyIndex) return 'bg-blue-500/80 border-blue-400';
      if (index === stepData.overwriting) return 'bg-purple-500/80 border-purple-400';
      if (stepData.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400';
      if (stepData.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
      
      // Elements in current bucket but not involved in current step
      if (stepData.bucketRange && index >= stepData.bucketRange.start && index <= stepData.bucketRange.end) {
        return 'bg-accent/60 border-accent';
      }
      
      // Dim elements outside current bucket during insertion sort
      return 'bg-gray-400/40 border-gray-400';
    }
    
    // Handle placement phase
    if (stage === "placing" && index === stepData.currentPlacing) {
      return 'bg-yellow-500 border-yellow-400 shadow-lg';
    }
    
    // Handle grouping phase - show bucket colors
    if (stage === "grouping" && stepData.bucketForIndex) {
      const bucketIdx = stepData.bucketForIndex[index];
      if (bucketIdx !== null) {
        const bucketColors = [
          'bg-purple-400/80 border-purple-500',  // Bucket 0
          'bg-blue-400/80 border-blue-500',      // Bucket 1
          'bg-green-400/80 border-green-500',    // Bucket 2
          'bg-pink-400/80 border-pink-500',      // Bucket 3
          'bg-orange-400/80 border-orange-500',  // Bucket 4
          'bg-yellow-400/80 border-yellow-500',  // Bucket 5
          'bg-cyan-400/80 border-cyan-500'       // Bucket 6
        ];
        return bucketColors[bucketIdx % bucketColors.length];
      }
    }
    
    // Handle post-bucket sort phase - show sorted bucket colors
    if (stage === "bucketSorted" && stepData.sortedBuckets) {
      for (const bucket of stepData.sortedBuckets) {
        if (index >= bucket.start && index <= bucket.end) {
          // Use the sorted bucket color class but with different opacity
          return bucket.colorClass.replace('bg-', 'bg-').replace('border-', 'border-') + '/90';
        }
      }
    }
    
    // Default state
    return 'bg-accent/60 border-accent';
  }, []);

  return children({
    steps,
    ExplanationComponent: () => <BucketSortExplanation />,
    CanvasComponent: ArrayCanvas,
    ControlsComponent: ArrayControls,
    canvasProps: {
      getElementState: getBucketElementState,
      AnnotationComponent: BucketSortAnnotation,
    },
    controlProps: {
      userInput,
      onUserInput: (e) => setUserInput(e.target.value),
      onApplyUserInput: applyUserInput,
      onResetRequest: resetArray,
    },
  });
}