import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import QuickSortExplanation from '../../components/algoExplanationPage/sortingExplain/QuickSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import QuickSortAnnotation from '../../components/visualizers/step_annotations/QuickSortAnnotation';

const generateRandomArray = (size = 10) => {
  return Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
    value: Math.floor(Math.random() * 95) + 5,
  }));
};

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

// --- Core Quick Sort Step Generation Logic ---
const getQuickSortSteps = (initialArray) => {
    if (!initialArray || initialArray.length <= 1) return [];
    
    const steps = [];
    let arr = deepCopy(initialArray);
    let sortedIndices = [];
    
    steps.push({
        array: deepCopy(arr),
        pivot: null, i: null, j: null, low: null, high: null, swapping: [], sortedInRange: [],
        message: { text: "Initial unsorted array." }
    });

    function quickSortRecursive(low, high) {
        if (low < high) {
            const partitionIndex = partition(low, high);
            
            // Mark the pivot as sorted
            sortedIndices.push(partitionIndex);
            steps.push({
                array: deepCopy(arr),
                pivot: null, i: null, j: null, low: null, high: null, swapping: [],
                sortedInRange: [...sortedIndices],
                message: { text: `Element ${arr[partitionIndex].value} is now in its final sorted position.` }
            });

            // Recursively sort elements before and after partition
            quickSortRecursive(low, partitionIndex - 1);
            quickSortRecursive(partitionIndex + 1, high);
        } else if (low === high) {
            // Base case for single-element sub-arrays
            sortedIndices.push(low);
            steps.push({
                array: deepCopy(arr),
                pivot: null, i: null, j: null, low: null, high: null, swapping: [],
                sortedInRange: [...sortedIndices],
                message: { text: `Base case: [${arr[low].value}] is sorted.` }
            });
        }
    }

    function partition(low, high) {
        const pivotValue = arr[high].value;
        const pivotId = arr[high].id;
        
        steps.push({
            array: deepCopy(arr),
            pivot: high, i: null, j: null, low, high, swapping: [], sortedInRange: [...sortedIndices],
            message: { text: `Partitioning sub-array. Pivot is ${pivotValue}.` }
        });

        let i = low - 1; // pointer for greater element

        for (let j = low; j < high; j++) {
            // Highlight elements being compared with the pivot
            steps.push({
                array: deepCopy(arr),
                pivot: high, i, j, low, high, swapping: [], sortedInRange: [...sortedIndices],
                message: { text: `Comparing ${arr[j].value} with pivot ${pivotValue}.` }
            });

            if (arr[j].value <= pivotValue) {
                i++;
                // Swap arr[i] and arr[j]
                steps.push({
                    array: deepCopy(arr),
                    pivot: high, i, j, low, high,
                    swapping: [i, j], sortedInRange: [...sortedIndices],
                    message: { text: `${arr[j].value} <= ${pivotValue}. Swapping ${arr[i].value} and ${arr[j].value}.` }
                });
                [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
            } else {
                 steps.push({
                    array: deepCopy(arr),
                    pivot: high, i, j, low, high, swapping: [], sortedInRange: [...sortedIndices],
                    message: { text: `${arr[j].value} > ${pivotValue}. No swap needed.` }
                });
            }
        }

        // Final swap to place the pivot in its correct position
        const pivotNewIndex = i + 1;
        steps.push({
            array: deepCopy(arr),
            pivot: high, i, j: null, low, high,
            swapping: [pivotNewIndex, high], sortedInRange: [...sortedIndices],
            message: { text: `Partitioning complete. Placing pivot ${pivotValue} at its correct sorted position.` }
        });
        
        [arr[pivotNewIndex], arr[high]] = [arr[high], arr[pivotNewIndex]]; // Swap
        
        return pivotNewIndex;
    }

    quickSortRecursive(0, arr.length - 1);
    
    steps.push({
        array: deepCopy(arr),
        pivot: null, i: null, j: null, low: null, high: null, swapping: [],
        sortedInRange: Array.from({ length: arr.length }, (_, k) => k),
        message: { text: 'Sorting complete!' }
    });
    
    return steps;
};


// --- The React Provider Component ---
export default function QuickSortProvider({ children }) {
    const [initialArray, setInitialArray] = usePersistentState('quickSortInitialArray_v1', generateRandomArray());
    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const steps = useMemo(() => getQuickSortSteps(initialArray), [initialArray]);

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
            .slice(0, 15); // Quick sort is visually complex, keep it smaller

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
        
        const isSorted = stepData.sortedInRange?.includes(index);
        const isPivot = stepData.pivot === index;
        const isSwapping = stepData.swapping?.includes(index);
        const isI = stepData.i === index;
        const isJ = stepData.j === index;
        const isInRange = stepData.low !== null && index >= stepData.low && index <= stepData.high;

        if (isSorted) return 'bg-green-500/80 border-green-400';
        if (isSwapping) return 'bg-red-500/80 border-red-400 shadow-md shadow-red-500/50';
        if (isPivot) return 'bg-purple-500/80 border-purple-400';
        if (isI) return 'bg-yellow-500/80 border-yellow-400'; // "i" pointer
        if (isJ) return 'bg-orange-500/80 border-orange-400'; // "j" pointer
        if (isInRange) return 'bg-blue-500/30 border-blue-400';
        
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <QuickSortExplanation />,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: ArrayControls,
        canvasProps: { 
            getElementState: getElementState,
            AnnotationComponent: QuickSortAnnotation,
        },
        controlProps: { 
            userInput, 
            onUserInput: (e) => setUserInput(e.target.value), 
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
        },
    });
}