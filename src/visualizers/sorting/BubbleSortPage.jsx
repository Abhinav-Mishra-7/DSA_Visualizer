import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import BubbleSortExplanation from '../../components/algoExplanationPage/sortingExplain/BubbleSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import BubbleSortAnnotation from '../../components/visualizers/step_annotations/sorting_annotations/BubbleSortAnnotation';
import GenerateRandomArray from '../../components/shared/GenerateRandomArray';

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

const getBubbleSortSteps = (initialArray) => {
    if (!initialArray || initialArray.length === 0) return [];
    
    const steps = [];
    const arr = deepCopy(initialArray);
    const n = arr.length;

    steps.push({
        array: deepCopy(arr),
        comparing: [], swapping: [], sorted: [],
        message: { text: "Initial array. Let's start sorting!" }
    });

    for (let i = 0; i < n - 1; i++) {
        let didSwapInPass = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Step 1: Lift elements for comparison
            steps.push({
                array: deepCopy(arr),
                comparing: [j, j + 1],
                swapping: [],
                sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                message: { text: `Is ${arr[j].value} > ${arr[j + 1].value}?`, indices: [j, j + 1] }
            });

            if (arr[j].value > arr[j + 1].value) {
                didSwapInPass = true;
                // Step 2a: Announce the swap (elements stay lifted)
                steps.push({
                    array: deepCopy(arr),
                    comparing: [],
                    swapping: [j, j + 1], // Use 'swapping' to indicate the action
                    sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                    message: { text: `Yes. Swapping elements.`, indices: [j, j + 1] }
                });

                // Perform the swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                // Step 3a: Show the result of the swap (elements stay lifted)
                steps.push({
                    array: deepCopy(arr),
                    comparing: [],
                    swapping: [j, j + 1],
                    sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                    message: { text: `Swap complete.`, indices: [j, j + 1] }
                });
            } else {
                // Step 2b: Announce no swap (elements stay lifted)
                steps.push({
                    array: deepCopy(arr),
                    comparing: [j, j + 1],
                    swapping: [],
                    sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                    message: { text: `No, continue.`, indices: [j, j + 1] }
                });
            }
            
            steps.push({
                array: deepCopy(arr),
                comparing: [], // This makes the elements go down
                swapping: [],  // This makes the elements go down
                sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                message: {text: `Going For Next Step`} 
            });
        }
        
        // After a full pass, mark the last element as sorted
        const sortedIndices = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
        steps.push({
            array: deepCopy(arr),
            comparing: [], swapping: [],
            sorted: sortedIndices,
            message: { text: `End of pass ${i + 1}. ${arr[n - 1 - i].value} is sorted.` }
        });
        
        // Optimization: if no swaps occurred, the array is sorted
        if (!didSwapInPass) {
             steps.push({
                array: deepCopy(arr),
                comparing: [], swapping: [],
                sorted: Array.from({ length: n }, (_, k) => k),
                message: { text: 'Array is sorted early!' }
            });
            break;
        }
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

export const KeyCharacteristicCard = ({ icon, title, value, valueColor, children }) => (
    <div className="bg-card border border-border rounded-xl p-6 flex-grow flex-shrink-0 basis-full md:basis-[30%] shadow-md hover:shadow-[0_0_20px_var(--glow-color)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4 mb-3">
            <div className="p-2 rounded-lg bg-[--glow-color]">{icon}</div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <p className={`text-3xl font-bold font-mono ${valueColor}`}>{value}</p>
        <p className="text-sm text-text-secondary mt-1">{children}</p>
    </div>
);

export default function BubbleSortProvider({children}) {
    const [initialArray, setInitialArray] = usePersistentState('bubbleSortInitialArray_v2', GenerateRandomArray(10));

    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const steps = useMemo(() => getBubbleSortSteps(initialArray), [initialArray]);

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
            alert('Please enter at least 2 valid, comma-separated numbers (1-100). Max 15 numbers.');
        }
    }, [userInput, setInitialArray]);

    const getElementState = useCallback((item, index, stepData) => {
        if (!stepData) return 'bg-accent/60 border-accent';
        if (stepData.sorted?.includes(index)) return 'bg-green-500/80 border-green-400';
        if (stepData.swapping?.includes(index)) return 'bg-purple-500/80 border-purple-400 shadow-lg shadow-purple-800';
        if (stepData.comparing?.includes(index)) return 'bg-yellow-500/80 border-yellow-400 shadow-lg shadow-yellow-800';
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <BubbleSortExplanation/>,
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