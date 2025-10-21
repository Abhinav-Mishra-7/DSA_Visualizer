import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import SelectionSortExplanation from '../../components/algoExplanationPage/sortingExplain/SelectionSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import BubbleSortAnnotation from '../../components/visualizers/step_annotations/sorting_annotations/BubbleSortAnnotation';
import GenerateRandomArray from '../../components/shared/GenerateRandomArray';

const getSelectionSortSteps = (initialArray) => {
    // Add a guard clause for invalid or old data formats
    if (!initialArray || initialArray.length === 0 || typeof initialArray[0] !== 'object') {
        return [];
    }
    const steps = [];
    // Deep copy to prevent mutation issues within steps
    const arr = JSON.parse(JSON.stringify(initialArray));
    const n = arr.length;

    steps.push({ 
        array: JSON.parse(JSON.stringify(arr)), 
        comparing: [], swapping: [], sorted: [], minIndex: null,
        info: "Initial array.",
        message: { text: "Initial array. Let's start sorting!" }
    });

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        const sortedInPreviousPasses = Array.from({ length: i }, (_, k) => k);

        steps.push({
            array: JSON.parse(JSON.stringify(arr)), 
            comparing: [], swapping: [], sorted: [...sortedInPreviousPasses], minIndex: i,
            info: `Pass ${i + 1}: Finding minimum for position ${i}. Assume ${arr[i].value} is minimum.`,
            message: { text: `Start of pass ${i + 1}. Assume ${arr[i].value} is the minimum.` }
        });

        for (let j = i + 1; j < n; j++) {
            // Compare elements using the .value property
            steps.push({ 
                array: JSON.parse(JSON.stringify(arr)), 
                comparing: [j], swapping: [], sorted: [...sortedInPreviousPasses], minIndex: minIndex,
                info: `Comparing ${arr[j].value} with current minimum ${arr[minIndex].value}.`,
                message: { text: `Is ${arr[j].value} < ${arr[minIndex].value}?`, indices: [j, minIndex] } 
            });

            if (arr[j].value < arr[minIndex].value) {
                const oldMin = minIndex;
                minIndex = j;
                steps.push({ 
                    array: JSON.parse(JSON.stringify(arr)), 
                    comparing: [j], swapping: [], sorted: [...sortedInPreviousPasses], minIndex: minIndex,
                    info: `Yes, ${arr[j].value} < ${arr[oldMin].value}. New minimum is ${arr[j].value}.`,
                    message: { text: `Yes. New minimum found!`, indices: [j] } 
                });
            }
        }

        // After finding the minimum, prepare to swap
        if (minIndex !== i) {
            steps.push({
                array: JSON.parse(JSON.stringify(arr)), 
                comparing: [], swapping: [i, minIndex], sorted: [...sortedInPreviousPasses], minIndex: null,
                info: `End of pass ${i + 1}. Minimum is ${arr[minIndex].value}. Swapping with ${arr[i].value}.`,
                message: { text: `Minimum found. Swapping...`, indices: [i, minIndex] }
            });

            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Perform swap (swaps the whole objects)

            // Show the state *after* the swap
            steps.push({
                array: JSON.parse(JSON.stringify(arr)), 
                comparing: [], swapping: [i, minIndex], sorted: [...sortedInPreviousPasses, i], minIndex: null,
                info: `Swap complete. ${arr[i].value} is now sorted.`,
                message: { text: `Swap complete.`, indices: [i] }
            });
        } else {
             steps.push({
                array: JSON.parse(JSON.stringify(arr)), 
                comparing: [], swapping: [], sorted: [...sortedInPreviousPasses, i], minIndex: null,
                info: `Element ${arr[i].value} is already in correct position. No swap needed.`,
                message: { text: `Element already in correct position.`, indices: [i] }
            });
        }
    }
    
    const allSorted = Array.from({ length: n }, (_, k) => k);
    steps.push({ 
        array: JSON.parse(JSON.stringify(arr)), 
        comparing: [], swapping: [], sorted: allSorted, minIndex: null,
        info: 'Sorting complete.',
        message: { text: 'Sorting complete!' } 
    });
    return steps;
};

export default function SelectionSortProvider({children}) {
    const [initialArray, setInitialArray] = usePersistentState('selectionSortInitialArray_v2', GenerateRandomArray(10));
    
    // UPDATED: User input should reflect the values, not the objects
    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray)) 
            ? initialArray.map(item => item.value).join(', ') 
            : ''
    );
    
    const steps = useMemo(() => getSelectionSortSteps(initialArray), [initialArray]);

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
            // UPDATED: Convert numbers to the {id, value} structure
            const newArray = parsedValues.map((val, i) => ({
                id: `user-item-${i}-${Date.now()}`,
                value: val
            }));
            setInitialArray(newArray);
        } else {
            alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 15 numbers.');
        }
    }, [userInput, setInitialArray]);

    // // This function determines the color and style of each box based on the current step's state.
    // const getElementState = useCallback((index, step) => {
    //     if (!step) return 'bg-accent/60 border-accent';
    //     if (step.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
    //     // Changed to purple for consistency and a better "swapping" visual
    //     if (step.swapping?.includes(index)) return 'bg-purple-500/80 border-purple-400 shadow-lg shadow-purple-500/50';
    //     // This state is unique to Selection Sort and provides a great visual cue
    //     if (step.minIndex === index) return 'bg-pink-500/80 border-pink-400';
    //     if (step.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400';
    //     return 'bg-accent/60 border-accent'; 
    // }, []);

    const getElementState = useCallback((item, index, stepData) => {
        if (!stepData) return 'bg-accent/60 border-accent';
        if (stepData.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
        if (stepData.swapping?.includes(index)) return 'bg-purple-500/80 border-purple-400 shadow-lg shadow-purple-500/50';
        if (stepData.minIndex === index) return 'bg-pink-500/80 border-pink-400';
        if (stepData.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400';
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <SelectionSortExplanation/>,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: ArrayControls,
        canvasProps: { 
            getElementState: getElementState ,
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
// import SelectionSortExplanation from '../../components/algoExplanationPage/SelectionSortExplain';
// import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
// import ArrayControls from '../../components/visualizers/controls/ArrayControls';

// const generateRandomArray = (size = 10) => {
//   return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
// };

// const getSelectionSortSteps = (initialArray) => {
//     const steps = [];
//     const arr = [...initialArray];
//     const n = arr.length;

//     steps.push({ 
//         array: [...arr], comparing: [], swapping: [], sorted: [], minIndex: null,
//         info: "Initial array.",
//         message: { text: "Initial array. Let's start sorting!" }
//     });

//     for (let i = 0; i < n - 1; i++) {
//         let minIndex = i;
//         const sortedInPreviousPasses = Array.from({ length: i }, (_, k) => k);

//         steps.push({
//             array: [...arr], comparing: [], swapping: [], sorted: [...sortedInPreviousPasses], minIndex: i,
//             info: `Pass ${i + 1}: Finding minimum for position ${i}. Assume ${arr[i]} is minimum.`,
//             message: { text: `Start of pass ${i + 1}. Assume ${arr[i]} is the minimum.` }
//         });

//         for (let j = i + 1; j < n; j++) {
//             // Step 1: Compare elements to find the minimum
//             steps.push({ 
//                 array: [...arr], comparing: [j], swapping: [], sorted: [...sortedInPreviousPasses], minIndex: minIndex,
//                 info: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}.`,
//                 message: { text: `Is ${arr[j]} < ${arr[minIndex]}?`, indices: [j, minIndex] } 
//             });

//             if (arr[j] < arr[minIndex]) {
//                 const oldMin = minIndex;
//                 minIndex = j;
//                 steps.push({ 
//                     array: [...arr], comparing: [j], swapping: [], sorted: [...sortedInPreviousPasses], minIndex: minIndex,
//                     info: `Yes, ${arr[j]} < ${arr[oldMin]}. New minimum is ${arr[j]}.`,
//                     message: { text: `Yes. New minimum found!`, indices: [j] } 
//                 });
//             }
//         }

//         // After finding the minimum, prepare to swap
//         if (minIndex !== i) {
//             steps.push({
//                 array: [...arr], comparing: [], swapping: [i, minIndex], sorted: [...sortedInPreviousPasses], minIndex: null,
//                 info: `End of pass ${i + 1}. Minimum is ${arr[minIndex]}. Swapping with ${arr[i]}.`,
//                 message: { text: `Minimum found. Swapping with first unsorted element.`, indices: [i, minIndex] }
//             });

//             [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Perform swap

//             steps.push({
//                 array: [...arr], comparing: [], swapping: [i, minIndex], sorted: [...sortedInPreviousPasses, i], minIndex: null,
//                 info: `Swap complete. ${arr[i]} is now sorted.`,
//                 message: { text: `Swap complete.`, indices: [i, minIndex] }
//             });
//         } else {
//              steps.push({
//                 array: [...arr], comparing: [], swapping: [], sorted: [...sortedInPreviousPasses, i], minIndex: null,
//                 info: `Element ${arr[i]} is already in correct position. No swap needed.`,
//                 message: { text: `Element already in correct position.`, indices: [i] }
//             });
//         }
//     }
    
//     const allSorted = Array.from({ length: n }, (_, k) => k);
//     steps.push({ 
//         array: [...arr], comparing: [], swapping: [], sorted: allSorted, minIndex: null,
//         info: 'Sorting complete.',
//         message: { text: 'Sorting complete!' } 
//     });
//     return steps;
// };

// export const KeyCharacteristicCard = ({ icon, title, value, valueColor, children }) => (
//     <div className="bg-card border border-border rounded-xl p-6 flex-grow flex-shrink-0 basis-full md:basis-[30%] shadow-md hover:shadow-[0_0_20px_var(--glow-color)] hover:-translate-y-1 transition-all duration-300">
//         <div className="flex items-center gap-4 mb-3">
//             <div className="p-2 rounded-lg bg-[--glow-color]">{icon}</div>
//             <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
//         </div>
//         <p className={`text-3xl font-bold font-mono ${valueColor}`}>{value}</p>
//         <p className="text-sm text-text-secondary mt-1">{children}</p>
//     </div>
// );

// export default function SelectionSortProvider({children}) {
//     const [initialArray, setInitialArray] = usePersistentState('selectionSortInitialArray', generateRandomArray());
//     const [userInput, setUserInput] = useState(initialArray.join(', '));
    
//     // useMemo recalculates steps only when the initialArray changes
//     const steps = useMemo(() => getSelectionSortSteps(initialArray), [initialArray]);

//     const resetArray = useCallback(() => {
//         const newArray = generateRandomArray();
//         setInitialArray(newArray);
//         setUserInput(newArray.join(', '));
//     }, [setInitialArray]);
    
//     const applyUserInput = useCallback(() => {
//         const parsedArray = userInput
//             .split(',')
//             .map(item => parseInt(item.trim(), 10))
//             .filter(num => !isNaN(num) && num >= 1 && num <= 100)
//             .slice(0, 10);

//         if (parsedArray.length >= 2) {
//             setInitialArray(parsedArray);
//         } else {
//             alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 10 numbers.');
//         }
//     }, [userInput, setInitialArray]);

//     // This function determines the color and style of each box based on the current step's state.
//     const getElementState = useCallback((index, step) => {
//         if (!step) return 'bg-accent/60 border-accent';
//         if (step.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
//         if (step.swapping?.includes(index)) return 'bg-red-400 border-white';
//         if (step.minIndex === index) return 'bg-pink-500/80 border-pink-400';
//         if (step.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400';
//         return 'bg-accent/60 border-accent'; 
//     }, []);

//     // VisualizerLayout handles all the state management for playback (currentStep, isAnimating, etc.)
//     return children({
//         steps,
//         ExplanationComponent: () => <SelectionSortExplanation/>,
//         CanvasComponent: ArrayCanvas,
//         ControlsComponent: ArrayControls,
//         canvasProps: { 
//             getElementState,
//         },
//         controlProps: { 
//             userInput, 
//             onUserInput: (e) => setUserInput(e.target.value), 
//             onApplyUserInput: applyUserInput,
//             onResetRequest: resetArray,
//         },
//     });
// }