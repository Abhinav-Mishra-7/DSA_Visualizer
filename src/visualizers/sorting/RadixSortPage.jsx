import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import RadixSortExplanation from '../../components/algoExplanationPage/sortingExplain/RadixSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import RadixSortAnnotation from '../../components/visualizers/step_annotations/sorting_annotations/RadixSortAnnotation';
import GenerateRandomArray from '../../components/shared/GenerateRandomArray';

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

const getRadixSortSteps = (initialArray) => {
    if (!initialArray || initialArray.length <= 1) return [];

    const steps = [];
    let arr = deepCopy(initialArray);
    
    // Ensure all elements have proper IDs and preserve them throughout
    arr = arr.map((item, index) => ({
        ...item,
        originalId: item.id || `radix-${index}-${Date.now()}`
    }));
    
    steps.push({
        array: deepCopy(arr),
        distributingIndex: null,
        digitPlace: null,
        stage: "initial",
        message: { text: "Initial unsorted array." }
    });
    
    const maxNum = Math.max(...arr.map(item => item.value));
    
    let exp = 1;
    let passNumber = 1;
    
    while (Math.floor(maxNum / exp) > 0) {
        const placeValue = exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds";
        
        // Pass start
        steps.push({
            array: deepCopy(arr),
            distributingIndex: null,
            digitPlace: exp,
            stage: "passStart",
            message: { text: `Pass ${passNumber}: Examining ${placeValue} digits.` }
        });
        
        // Show digit extraction for each element (array stays unchanged)
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const digit = Math.floor(item.value / exp) % 10;
            
            steps.push({
                array: deepCopy(arr), // Array never changes during examination
                distributingIndex: i,
                digitPlace: exp,
                stage: "examining",
                currentDigit: digit,
                message: { text: `${item.value}: ${placeValue} digit is ${digit} putting into bucket ${digit}`, indices: [i] }
            });
        }
        
        // Perform the sorting (behind the scenes, no intermediate steps)
        const buckets = Array.from({ length: 10 }, () => []);
        
        // Distribute to buckets
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const digit = Math.floor(item.value / exp) % 10;
            buckets[digit].push(deepCopy(item));
        }
        
        // Collect from buckets in order
        let sortedArray = [];
        for (let b = 0; b < buckets.length; b++) {
            for (let i = 0; i < buckets[b].length; i++) {
                sortedArray.push(buckets[b][i]);
            }
        }
        
        // CRITICAL: Ensure the sorted array has exactly the same length
        if (sortedArray.length !== arr.length) {
            console.error('Array length mismatch:', arr.length, 'vs', sortedArray.length);
            // Fallback: keep original array if something went wrong
            sortedArray = deepCopy(arr);
        }
        
        // Show the result after redistribution (single step, no voids possible)
        arr = sortedArray;
        
        steps.push({
            array: deepCopy(arr), // Complete sorted array for this pass
            distributingIndex: null,
            digitPlace: exp,
            stage: "passComplete",
            message: { text: `Pass ${passNumber} complete! Array sorted by ${placeValue} digit.` }
        });

        exp *= 10;
        passNumber++;
    }
    
    steps.push({
        array: deepCopy(arr),
        distributingIndex: null,
        digitPlace: null,
        sortedInRange: Array.from({ length: arr.length }, (_, k) => k),
        stage: "complete",
        message: { text: 'Radix Sort complete! Array is fully sorted.' }
    });
    
    return steps;
};

export default function RadixSortProvider({ children }) {
    const [initialArray, setInitialArray] = usePersistentState('radixSortInitialArray_v2', GenerateRandomArray(10));
    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const steps = useMemo(() => getRadixSortSteps(initialArray), [initialArray]);

    const resetArray = useCallback(() => {
        const newArray = GenerateRandomArray(10);
        setInitialArray(newArray);
        setUserInput(newArray.map(item => item.value).join(', '));
    }, [setInitialArray]);
    
    const applyUserInput = useCallback(() => {
        const parsedValues = userInput
            .split(',')
            .map(item => parseInt(item.trim(), 10))
            .filter(num => !isNaN(num) && num >= 10 && num <= 999)
            .slice(0, 10); 

        if (parsedValues.length >= 2) {
            const newArray = parsedValues.map((val, i) => ({
                id: `user-item-${i}-${Date.now()}`,
                value: val
            }));
            setInitialArray(newArray);
        } else {
            alert('Please enter at least 2 valid, comma-separated numbers (10-999). Max 15 numbers.');
        }
    }, [userInput, setInitialArray]);

    const getElementState = useCallback((item, index, stepData) => {
        if (!stepData) return 'bg-accent/60 border-accent';
        
        const { stage, sortedInRange, distributingIndex } = stepData;
        
        // Handle completion
        if (stage === "complete" || (sortedInRange && sortedInRange.includes(index))) {
            return 'bg-green-500/80 border-green-400 shadow-md';
        }
        
        // Handle examination phase - highlight current element being examined
        if (stage === "examining" && distributingIndex === index) {
            return 'bg-yellow-500/80 border-yellow-400 shadow-md';
        }
        
        // Handle pass completion - briefly highlight all elements
        if (stage === "passComplete") {
            return 'bg-blue-500/60 border-blue-400';
        }
        
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <RadixSortExplanation />,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: ArrayControls,
        canvasProps: { 
            getElementState: getElementState,
            AnnotationComponent: RadixSortAnnotation,
        },
        controlProps: { 
            userInput, 
            onUserInput: (e) => setUserInput(e.target.value), 
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
        },
    });
}