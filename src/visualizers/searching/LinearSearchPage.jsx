import { useState, useMemo, useCallback } from 'react';
import ArrayCanvasSearch from '../../components/visualizers/canvases/ArrayCanvasSearch';
import ArrayControlsSearch from '../../components/visualizers/controls/ArrayControlsSearch';
import LinearSearchExplain from '../../components/algoExplanationPage/LinearSearchExplain';

// Helper to generate a random array (sorting is not needed for Linear Search)
const generateArray = () => Array.from({length: 10}, () => Math.floor(Math.random() * 100));

// The core algorithm logic for Linear Search
const getLinearSearchSteps = (array, target) => {
    const steps = [];
    let foundIndex = -1;
    steps.push({ array: [...array], currentIndex: -1, foundIndex, isFinished: false, message: `Starting Linear Search for target: ${target}.` });
    
    for (let i = 0; i < array.length; i++) {
        steps.push({ array: [...array], currentIndex: i, foundIndex, isFinished: false, message: `Checking index ${i}. Is ${array[i]} === ${target}?` });
        if (array[i] === target) {
            foundIndex = i;
            // Add a final "found" step and break the loop
            steps.push({ array: [...array], currentIndex: i, foundIndex, isFinished: true, message: `Target ${target} found at index ${i}!` });
            break;
        }
    }
    
    // If the loop finishes without finding the element, add a "not found" step
    if (foundIndex === -1) {
        steps.push({ array: [...array], currentIndex: array.length - 1, foundIndex, isFinished: true, message: `Target ${target} not found in the array.` });
    }
    
    return steps;
};

export default function LinearSearchProvider({ children }) {
    const [array, setArray] = useState(generateArray);
    const [target, setTarget] = useState(() => String(array[Math.floor(Math.random() * array.length)]));
    const [userInput, setUserInput] = useState(array.join(', '));
    
    const steps = useMemo(() => getLinearSearchSteps(array, parseInt(target, 10)), [array, target]);

    const handleGenerateArray = useCallback(() => {
        const newArray = generateArray();
        setArray(newArray);
        setUserInput(newArray.join(', '));
        // Set a new random target from the new array for a fresh start
        setTarget(String(newArray[Math.floor(Math.random() * newArray.length)]));
    }, []);

    const handleApplyUserInput = useCallback(() => {
        // 1. Parse the user's string input into an array of numbers.
        const processedInput = userInput
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            // 2. Filter out any invalid entries (non-numbers, out of range).
            .filter(n => !isNaN(n) && n >= 0 && n <= 100)
            // 3. Enforce a maximum size for the visualizer.
            .slice(0, 15);
        
        const uniqueValues = Array.from(new Set(processedInput));
        // 4. Update the main array state. NOTE: We do NOT sort for Linear Search.
        setArray(uniqueValues);
        // 5. Update the text area to show the cleaned-up version.
        setUserInput(uniqueValues.join(', '));

        // 6. If the old target isn't in the new array, pick a sensible new one.
        if (uniqueValues.length > 0 && !uniqueValues.includes(parseInt(target, 10))) {
            setTarget(String(uniqueValues[0]));
        }
    }, [userInput, target]);
    
    const getBarState = useCallback((index, step) => {
        if (!step) return 'default';
        const { foundIndex, currentIndex } = step;
        if (foundIndex === index) return 'found';
        if (currentIndex === index) return 'checking';
        return 'default';
    }, []);

    const canvasProps = { getBarState };
    
    const controlProps = {
        target,
        onTargetChange: (e) => setTarget(e.target.value),
        userInput,
        onUserInput: (e) => setUserInput(e.target.value),
        onApplyUserInput: handleApplyUserInput,
        onGenerateArray: handleGenerateArray,
    };

    return children({
        steps,
        ExplanationComponent: LinearSearchExplain,
        CanvasComponent: ArrayCanvasSearch, // Reuses the canvas from Binary Search
        ControlsComponent: ArrayControlsSearch, // Reuses the controls from Binary Search
        canvasProps,
        controlProps
    });
}