import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import InsertionSortExplain from '../../components/algoExplanationPage/sortingExplain/InsertionSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import InsertionSortAnnotation from '../../components/visualizers/step_annotations/sorting_annotations/InsertionSortAnnotation';
import GenerateRandomArray from "../../components/shared/GenerateRandomArray"

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

export const getInsertionSortSteps = (initialArray) => {
    if (!initialArray || initialArray.length === 0) return [];
    
    const steps = [];
    const arr = deepCopy(initialArray);
    const n = arr.length;

    steps.push({
        array: deepCopy(arr),
        keyIndex: null, comparing: [], sorted: [], overwriting: null,
        message: { text: "Initial array. Let's start sorting!" }
    });

    for (let i = 1; i < n; i++) {
        const keyValue = arr[i].value;
        const sortedInPreviousPasses = Array.from({ length: i }, (_, k) => k);

        steps.push({
            array: deepCopy(arr),
            keyIndex: i,
            comparing: [], sorted: [...sortedInPreviousPasses], overwriting: null,
            message: { text: `Store value ${keyValue} as the key.`, indices: [i] }
        });

        let j = i - 1;
        
        while (j >= 0 && arr[j].value > keyValue) {
            steps.push({
                array: deepCopy(arr),
                keyIndex: null,
                comparing: [j],
                sorted: [...sortedInPreviousPasses], overwriting: null,
                keyValueForComparison: keyValue, // ADDED: Provide key value for visual
                message: { text: `Is ${arr[j].value} > ${keyValue}? Yes.`, indices: [j] }
            });

            arr[j + 1].value = arr[j].value;
            
            steps.push({
                array: deepCopy(arr),
                keyIndex: null,
                comparing: [j],
                sorted: [...sortedInPreviousPasses],
                overwriting: j + 1,
                keyValueForComparison: keyValue, // ADDED: Keep visual present during overwrite
                message: { text: `Overwrite right slot with value ${arr[j+1].value}.`, indices: [j, j + 1] }
            });

            steps.push({
                array: deepCopy(arr),
                keyIndex: null,
                comparing: [],
                sorted: [...sortedInPreviousPasses],
                overwriting: null,
                message: { text: `Shift complete. Check next element.`, indices: [j] }
            });

            j = j - 1;
        }

        if (j >= 0) {
            steps.push({
                array: deepCopy(arr),
                keyIndex: null,
                comparing: [j], 
                sorted: [...sortedInPreviousPasses], overwriting: null,
                keyValueForComparison: keyValue, // ADDED: Show for the final "No" comparison
                message: { text: `Is ${arr[j].value} > ${keyValue}? No. Stop.`, indices: [j] }
            });
             steps.push({
                array: deepCopy(arr),
                keyIndex: null, comparing: [], sorted: [...sortedInPreviousPasses], overwriting: null,
                message: { text: `Found correct spot for key ${keyValue} at next position.`, indices: [j+1] }
            });
        } else {
             steps.push({
                array: deepCopy(arr),
                keyIndex: null, comparing: [], sorted: [...sortedInPreviousPasses], overwriting: null,
                message: { text: `Reached the start. Insert key ${keyValue}.`, indices: [0] }
            });
        }

        arr[j + 1].value = keyValue; 
        const currentSorted = Array.from({ length: i + 1 }, (_, k) => k);

        steps.push({
            array: deepCopy(arr),
            keyIndex: null,
            comparing: [],
            sorted: currentSorted,
            overwriting: j + 1,
            message: { text: `Placed value ${keyValue} in its sorted position.`, indices: [j + 1] }
        });
    }

    steps.push({
        array: deepCopy(arr),
        keyIndex: null, comparing: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        overwriting: null,
        message: { text: 'Sorting complete!' }
    });
    return steps;
};

// The rest of the provider component is unchanged.
export default function InsertionSortProvider({ children }) {
    const [initialArray, setInitialArray] = usePersistentState('insertionSortInitialArray_v8', GenerateRandomArray(10));
    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray)) ? initialArray.map(item => item.value).join(', ') : ''
    );
    const steps = useMemo(() => getInsertionSortSteps(initialArray), [initialArray]);

    const resetArray = useCallback(() => {
        const newArray = GenerateRandomArray(10);
        setInitialArray(newArray);
        setUserInput(newArray.map(item => item.value).join(', '));
    }, [setInitialArray]);

    const applyUserInput = useCallback(() => {
        const parsedValues = userInput.split(',').map(item => parseInt(item.trim(), 10))
            .filter(num => !isNaN(num) && num >= 1 && num <= 100).slice(0, 10);
        if (parsedValues.length >= 2) {
            const newArray = parsedValues.map((val, i) => ({
                id: `user-item-${i}-${Date.now()}`, value: val
            }));
            setInitialArray(newArray);
        } else {
            alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 15 numbers.');
        }
    }, [userInput, setInitialArray]);

    const getElementState = useCallback((element, index, step) => {
        if (!step) return 'bg-accent/60 border-accent';

        if (index === step.keyIndex) return 'bg-blue-500/80 border-blue-400';
        if (index === step.overwriting) return 'bg-purple-500/80 border-purple-400';
        if (step.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400';
        if (step.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
        
        return 'bg-accent/60 border-accent';
    }, []);

    return children({
        steps,
        ExplanationComponent: InsertionSortExplain,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: ArrayControls,
        canvasProps: {
            getElementState : getElementState ,
            AnnotationComponent: InsertionSortAnnotation,
        },
        controlProps: {
            userInput,
            onUserInput: (e) => setUserInput(e.target.value),
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
        },
    });
}