import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import HeapSortExplanation from '../../components/algoExplanationPage/sortingExplain/HeapSortExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import ArrayControls from '../../components/visualizers/controls/ArrayControls';
import HeapSortAnnotation from '../../components/visualizers/step_annotations/HeapSortAnnotation';


const generateRandomArray = (size = 10) => {
  return Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
    value: Math.floor(Math.random() * 95) + 5,
  }));
};

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

const getHeapSortSteps = (initialArray) => {
    if (!initialArray || initialArray.length <= 1) return [];

    const steps = [];
    let arr = deepCopy(initialArray);
    const n = arr.length;
    let sortedIndices = [];

    steps.push({
        array: deepCopy(arr),
        root: null, largest: null, comparing: [], swapping: [], sortedInRange: [],
        message: { text: "Initial unsorted array." }
    });
    
    // --- Helper function for heapifying a subtree ---
    function heapify(heapSize, i) {
        let largest = i; // Initialize largest as root
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        steps.push({
            array: deepCopy(arr),
            root: i, largest: i, comparing: [i, left, right].filter(idx => idx < heapSize), 
            swapping: [], sortedInRange: [...sortedIndices],
            message: { text: `Heapifying subtree rooted at index ${i} (${arr[i].value}).` }
        });

        // If left child is larger than root
        if (left < heapSize && arr[left].value > arr[largest].value) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < heapSize && arr[right].value > arr[largest].value) {
            largest = right;
        }

        steps.push({
            array: deepCopy(arr),
            root: i, largest: largest, comparing: [i, left, right].filter(idx => idx < heapSize), 
            swapping: [], sortedInRange: [...sortedIndices],
            message: { text: `Largest among parent and children is ${arr[largest].value}.` }
        });

        // If largest is not root
        if (largest !== i) {
            steps.push({
                array: deepCopy(arr),
                root: i, largest: largest, comparing: [],
                swapping: [i, largest], sortedInRange: [...sortedIndices],
                message: { text: `Swapping parent ${arr[i].value} with largest child ${arr[largest].value}.` }
            });

            [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap

            steps.push({
                array: deepCopy(arr),
                root: largest, largest: null, comparing: [], swapping: [], sortedInRange: [...sortedIndices],
                message: { text: `Recursively heapify the affected subtree.` }
            });
            
            // Recursively heapify the affected sub-tree
            heapify(heapSize, largest);
        }
    }

    // --- Phase 1: Build max heap ---
    steps.push({
        array: deepCopy(arr),
        root: null, largest: null, comparing: [], swapping: [], sortedInRange: [],
        message: { text: "Phase 1: Build Max Heap from the bottom up." }
    });
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }
    
    steps.push({
        array: deepCopy(arr),
        root: null, largest: null, comparing: [], swapping: [], sortedInRange: [],
        message: { text: "Max Heap built. The largest element is at the root." }
    });

    // --- Phase 2: One by one extract an element from heap ---
    steps.push({
        array: deepCopy(arr),
        root: null, largest: null, comparing: [], swapping: [], sortedInRange: [],
        message: { text: "Phase 2: Extract max element and place it at the end." }
    });
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        steps.push({
            array: deepCopy(arr),
            root: null, largest: null, comparing: [],
            swapping: [0, i], sortedInRange: [...sortedIndices],
            message: { text: `Swap root (${arr[0].value}) with last element (${arr[i].value}).` }
        });

        [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
        
        sortedIndices.push(i);
        
        steps.push({
            array: deepCopy(arr),
            root: null, largest: null, comparing: [], swapping: [],
            sortedInRange: [...sortedIndices],
            message: { text: `${arr[i].value} is now in its final sorted position.` }
        });

        // call max heapify on the reduced heap
        heapify(i, 0);
    }
    
    sortedIndices.push(0); // Add the last remaining element
    steps.push({
        array: deepCopy(arr),
        root: null, largest: null, comparing: [], swapping: [],
        sortedInRange: [...sortedIndices],
        message: { text: 'Sorting complete!' }
    });
    
    return steps;
};

export default function HeapSortProvider({ children }) {
    const [initialArray, setInitialArray] = usePersistentState('heapSortInitialArray_v1', generateRandomArray());
    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const steps = useMemo(() => getHeapSortSteps(initialArray), [initialArray]);

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
            .slice(0, 15);

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
        const isSwapping = stepData.swapping?.includes(index);
        const isRoot = stepData.root === index;
        const isLargest = stepData.largest === index && stepData.largest !== stepData.root;
        const isComparing = stepData.comparing?.includes(index);
        
        if (isSorted) return 'bg-green-500/80 border-green-400';
        if (isSwapping) return 'bg-red-500/80 border-red-400 shadow-lg shadow-red-500/50';
        if (isRoot) return 'bg-purple-500/80 border-purple-400';
        if (isLargest) return 'bg-yellow-500/80 border-yellow-400';
        if (isComparing) return 'bg-blue-500/60 border-blue-400';
        
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <HeapSortExplanation />,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: ArrayControls,
        canvasProps: { 
            getElementState: getElementState,
            AnnotationComponent: HeapSortAnnotation,
        },
        controlProps: { 
            userInput, 
            onUserInput: (e) => setUserInput(e.target.value), 
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
        },
    });
}