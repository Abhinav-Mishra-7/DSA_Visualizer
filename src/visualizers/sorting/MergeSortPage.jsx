import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import MergeSortExplanation from '../../components/algoExplanationPage/sortingExplain/MergeSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import BubbleSortAnnotation from '../../components/visualizers/step_annotations/BubbleSortAnnotation'; 

const generateRandomArray = (size = 8) => {
  return Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
    value: Math.floor(Math.random() * 95) + 5,
  }));
};

// This function generates steps compatible with BubbleSortAnnotation
const getMergeSortSteps = (initialArray) => {
    if (!initialArray || initialArray.length <= 1) return [];
    
    const steps = [];
    let arr = JSON.parse(JSON.stringify(initialArray));
    
    steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [], sorted: [],
        message: { text: "Initial unsorted array." }
    });

    function mergeSortRecursive(startIndex, endIndex) {
        if (startIndex >= endIndex) {
            steps.push({
                array: JSON.parse(JSON.stringify(arr)),
                comparing: [], sorted: [startIndex],
                message: { text: `Base case: [${arr[startIndex].value}] is sorted.`, indices: [startIndex] }
            });
            return;
        }

        const midIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);

        // Show the division step
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparing: [], sorted: [],
            message: { text: `Divide the sub-array.`, indices: [startIndex, endIndex] }
        });

        mergeSortRecursive(startIndex, midIndex);
        mergeSortRecursive(midIndex + 1, endIndex);
        
        merge(startIndex, midIndex, endIndex);
    }

    function merge(start, mid, end) {
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparing: [], sorted: [],
            message: { text: `Merging sub-arrays.`, indices: [start, end] }
        });

        const leftHalf = arr.slice(start, mid + 1);
        const rightHalf = arr.slice(mid + 1, end + 1);

        let i = 0, j = 0;
        const mergedItems = [];

        // This loop generates the comparison steps
        while (i < leftHalf.length && j < rightHalf.length) {
            const leftOriginalIndex = start + i;
            const rightOriginalIndex = mid + 1 + j;

            // Create step with correct `comparing` and `message.indices`
            steps.push({
                array: JSON.parse(JSON.stringify(arr)),
                comparing: [leftOriginalIndex, rightOriginalIndex],
                sorted: [],
                message: { 
                    text: `Comparing ${leftHalf[i].value} and ${rightHalf[j].value}.`,
                    indices: [leftOriginalIndex, rightOriginalIndex]
                }
            });

            if (leftHalf[i].value <= rightHalf[j].value) {
                mergedItems.push(leftHalf[i]);
                i++;
            } else {
                mergedItems.push(rightHalf[j]);
                j++;
            }
        }
        
        // Add remaining items
        while (i < leftHalf.length) mergedItems.push(leftHalf[i++]);
        while (j < rightHalf.length) mergedItems.push(rightHalf[j++]);
        
        // IMPORTANT: Reorder the original array segment to avoid visual glitches
        for (let k = 0; k < mergedItems.length; k++) {
            arr[start + k] = mergedItems[k];
        }

        // Show the result of the merge
        const sortedRange = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparing: [],
            sorted: sortedRange,
            message: { text: `Sub-array is now sorted.`, indices: [start, end] }
        });
    }

    mergeSortRecursive(0, arr.length - 1);
    
    steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [], 
        sorted: Array.from({ length: arr.length }, (_, k) => k),
        message: { text: 'Sorting complete!' }
    });
    
    return steps;
};


// --- The React Provider Component ---
export default function MergeSortProvider({ children }) {
    const [initialArray, setInitialArray] = usePersistentState('mergeSortInitialArray_v3', generateRandomArray());
    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const steps = useMemo(() => getMergeSortSteps(initialArray), [initialArray]);

    const resetArray = useCallback(() => {
        const newArray = generateRandomArray();
        setInitialArray(newArray);
        setUserInput(newArray.map(item => item.value).join(', '));
    }, [setInitialArray]);
    
    const applyUserInput = useCallback(() => {
        const parsedValues = userInput
            .split(',')
            .map(item => parseInt(item.trim(), 10))
            .filter(num => !isNaN(num) && num >= 1 && num <= 100)
            .slice(0, 20);

        if (parsedValues.length >= 2) {
            const newArray = parsedValues.map((val, i) => ({
                id: `user-item-${i}-${Date.now()}`,
                value: val
            }));
            setInitialArray(newArray);
        } else {
            alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 20 numbers.');
        }
    }, [userInput, setInitialArray]);

    const getElementState = useCallback((item, index, stepData) => {
        if (!stepData) return 'bg-accent/60 border-accent';
        
        if (stepData.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
        if (stepData.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400';
        
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <MergeSortExplanation />,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: ArrayControls,
        canvasProps: { 
            getElementState: getElementState,
            // Pass the BubbleSortAnnotation component here
            AnnotationComponent: BubbleSortAnnotation,
        },
        controlProps: { 
            userInput, 
            onUserInput: (e) => setUserInput(e.target.value), 
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
        },
    });
}



// import { useState, useMemo, useCallback } from 'react';
// import usePersistentState from '../../hooks/usePersistentState';
// import MergeSortExplanation from '../../components/algoExplanationPage/sortingExplain/MergeSortExplain';
// import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
// import ArrayControls from '../../components/visualizers/controls/ArrayControls';
// import MergeSortAnnotation from '../../components/visualizers/step_annotations/MergeSortAnnotation';

// const generateRandomArray = (size = 10) => {
//   return Array.from({ length: size }, (_, i) => ({
//     id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
//     value: Math.floor(Math.random() * 95) + 5,
//   }));
// };

// const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

// // --- Core Merge Sort Step Generation Logic ---
// const getMergeSortSteps = (initialArray) => {
//     if (!initialArray || initialArray.length <= 1) return [];
    
//     const steps = [];
//     let arr = deepCopy(initialArray);
    
//     steps.push({
//         array: deepCopy(arr),
//         highlightRange: [], comparing: [], overwriting: null, sortedInRange: [],
//         message: { text: "Initial unsorted array." }
//     });

//     // We use a recursive helper that populates the shared 'steps' array.
//     function mergeSortRecursive(startIndex, endIndex) {
//         if (startIndex >= endIndex) {
//             // Base case: array of size 1 is already sorted.
//             steps.push({
//                 array: deepCopy(arr),
//                 highlightRange: [], comparing: [], overwriting: null,
//                 sortedInRange: [startIndex],
//                 message: { text: `Base case: [${arr[startIndex].value}] is sorted.` }
//             });
//             return;
//         }

//         const midIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);

//         // Announce the split
//         steps.push({
//             array: deepCopy(arr),
//             highlightRange: [startIndex, endIndex], comparing: [], overwriting: null, sortedInRange: [],
//             message: { text: `Dividing sub-array.` }
//         });

//         // Recursive calls for both halves
//         mergeSortRecursive(startIndex, midIndex);
//         mergeSortRecursive(midIndex + 1, endIndex);
        
//         // --- Merge the two sorted halves ---
//         merge(startIndex, midIndex, endIndex);
//     }

//     function merge(start, mid, end) {
//         steps.push({
//             array: deepCopy(arr),
//             highlightRange: [start, end], comparing: [], overwriting: null, sortedInRange: [],
//             message: { text: `Merging two sorted sub-arrays.` }
//         });

//         const leftHalf = arr.slice(start, mid + 1);
//         const rightHalf = arr.slice(mid + 1, end + 1);

//         let i = 0; // Pointer for leftHalf
//         let j = 0; // Pointer for rightHalf
//         let k = start; // Pointer for the main array 'arr'

//         while (i < leftHalf.length && j < rightHalf.length) {
//             // Highlight elements being compared
//             steps.push({
//                 array: deepCopy(arr),
//                 highlightRange: [start, end],
//                 comparing: [start + i, mid + 1 + j], // Map sub-array indices back to main array indices
//                 overwriting: null, sortedInRange: [],
//                 message: { text: `Comparing ${leftHalf[i].value} and ${rightHalf[j].value}.` }
//             });

//             if (leftHalf[i].value <= rightHalf[j].value) {
//                 // Announce which element is being placed
//                  steps.push({
//                     array: deepCopy(arr),
//                     highlightRange: [start, end], comparing: [],
//                     overwriting: { index: k, item: leftHalf[i] },
//                     sortedInRange: [],
//                     message: { text: `Placing ${leftHalf[i].value} into the array.` }
//                 });
//                 arr[k] = leftHalf[i];
//                 i++;
//             } else {
//                  steps.push({
//                     array: deepCopy(arr),
//                     highlightRange: [start, end], comparing: [],
//                     overwriting: { index: k, item: rightHalf[j] },
//                     sortedInRange: [],
//                     message: { text: `Placing ${rightHalf[j].value} into the array.` }
//                 });
//                 arr[k] = rightHalf[j];
//                 j++;
//             }
//             k++;
//         }
        
//         // Copy remaining elements of leftHalf, if any
//         while (i < leftHalf.length) {
//             steps.push({
//                 array: deepCopy(arr),
//                 highlightRange: [start, end], comparing: [],
//                 overwriting: { index: k, item: leftHalf[i] },
//                 sortedInRange: [],
//                 message: { text: `Copying remaining element ${leftHalf[i].value}.` }
//             });
//             arr[k] = leftHalf[i];
//             i++;
//             k++;
//         }
        
//         // Copy remaining elements of rightHalf, if any
//         while (j < rightHalf.length) {
//             steps.push({
//                 array: deepCopy(arr),
//                 highlightRange: [start, end], comparing: [],
//                 overwriting: { index: k, item: rightHalf[j] },
//                 sortedInRange: [],
//                 message: { text: `Copying remaining element ${rightHalf[j].value}.` }
//             });
//             arr[k] = rightHalf[j];
//             j++;
//             k++;
//         }
        
//         // Announce the sub-array is now sorted
//         steps.push({
//             array: deepCopy(arr),
//             highlightRange: [], comparing: [], overwriting: null,
//             sortedInRange: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
//             message: { text: `Sub-array is now sorted.` }
//         });
//     }

//     mergeSortRecursive(0, arr.length - 1);
    
//     steps.push({
//         array: deepCopy(arr),
//         highlightRange: [], comparing: [], overwriting: null,
//         sortedInRange: Array.from({ length: arr.length }, (_, k) => k),
//         message: { text: 'Sorting complete!' }
//     });
    
//     return steps;
// };


// // --- The React Provider Component ---
// export default function MergeSortProvider({ children }) {
//     const [initialArray, setInitialArray] = usePersistentState('mergeSortInitialArray_v1', generateRandomArray());
//     const [userInput, setUserInput] = useState(
//         (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
//             ? initialArray.map(item => item.value).join(', ')
//             : ''
//     );
    
//     const steps = useMemo(() => getMergeSortSteps(initialArray), [initialArray]);

//     const resetArray = useCallback(() => {
//         const newArray = generateRandomArray();
//         setInitialArray(newArray);
//         setUserInput(newArray.map(item => item.value).join(', '));
//     }, [setInitialArray]);
    
//     const applyUserInput = useCallback(() => {
//         const parsedValues = userInput
//             .split(',')
//             .map(item => parseInt(item.trim(), 10))
//             .filter(num => !isNaN(num) && num >= 1 && num <= 100)
//             .slice(0, 20); // Merge sort can handle a few more elements

//         if (parsedValues.length >= 2) {
//             const newArray = parsedValues.map((val, i) => ({
//                 id: `user-item-${i}-${Date.now()}`,
//                 value: val
//             }));
//             setInitialArray(newArray);
//         } else {
//             alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 20 numbers.');
//         }
//     }, [userInput, setInitialArray]);

//     const getElementState = useCallback((item, index, stepData) => {
//         if (!stepData) return 'bg-accent/60 border-accent';
        
//         const isSorted = stepData.sortedInRange?.includes(index);
//         const isComparing = stepData.comparing?.includes(index);
//         const isOverwriting = stepData.overwriting?.index === index;
//         const isInHighlightRange = stepData.highlightRange && index >= stepData.highlightRange[0] && index <= stepData.highlightRange[1];

//         if (isSorted) return 'bg-green-500/80 border-green-400';
//         if (isOverwriting) return 'bg-purple-500/80 border-purple-400 shadow-lg shadow-purple-500/50';
//         if (isComparing) return 'bg-yellow-500/80 border-yellow-400';
//         if (isInHighlightRange) return 'bg-blue-500/30 border-blue-400';
        
//         return 'bg-accent/60 border-accent'; 
//     }, []);

//     return children({
//         steps,
//         ExplanationComponent: () => <MergeSortExplanation />,
//         CanvasComponent: ArrayCanvas,
//         ControlsComponent: ArrayControls,
//         canvasProps: { 
//             getElementState: getElementState,
//             AnnotationComponent: MergeSortAnnotation,
//         },
//         controlProps: { 
//             userInput, 
//             onUserInput: (e) => setUserInput(e.target.value), 
//             onApplyUserInput: applyUserInput,
//             onResetRequest: resetArray,
//         },
//     });
// }