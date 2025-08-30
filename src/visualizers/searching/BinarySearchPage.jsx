import { useState, useMemo, useCallback } from 'react';
import ArrayCanvasSearch from '../../components/visualizers/canvases/ArrayCanvasBS';
import ArrayControlsSearch from '../../components/visualizers/controls/ArrayControlsBS';
import BinarySearchExplain from '../../components/algoExplanationPage/BinarySearchExplain';

const generateSortedArray = () => {
    const size = 10;
    const maxVal = 100;
    const arr = new Set();
    while (arr.size < size) { arr.add(Math.floor(Math.random() * maxVal)); }
    return Array.from(arr).sort((a, b) => a - b);
};

const getBinarySearchSteps = (array, target) => {
    const steps = [];
    let left = 0;
    let right = array.length - 1;
    let foundIndex = -1;
    steps.push({ array, left, right, mid: null, foundIndex: -1, activeRange: [left, right], isFinished: false, message: `Starting Search for ${target}. Range is [${left}, ${right}].` });
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        steps.push({ array, left, right, mid, foundIndex: -1, activeRange: [left, right], isFinished: false, message: `Calculate Mid: floor((${left}+${right})/2) = ${mid}. Check A[${mid}] (${array[mid]}).` });
        if (array[mid] === target) {
            foundIndex = mid;
            break;
        }
        if (array[mid] < target) {
            steps.push({ array, left, right, mid, foundIndex: -1, activeRange: [left, right], isFinished: false, message: `${array[mid]} < ${target}. Search right half.` });
            left = mid + 1;
        } else {
            steps.push({ array, left, right, mid, foundIndex: -1, activeRange: [left, right], isFinished: false, message: `${array[mid]} > ${target}. Search left half.` });
            right = mid - 1;
        }
    }
    steps.push({ array, left, right, mid: foundIndex !== -1 ? foundIndex : null, foundIndex, activeRange: foundIndex !== -1 ? [foundIndex, foundIndex] : [-1,-1], isFinished: true, message: foundIndex !== -1 ? `Target ${target} found at index ${foundIndex}!` : `Target ${target} not found.` });
    return steps;
};

export default function BinarySearchProvider({ children }) {
    const [array, setArray] = useState(generateSortedArray);
    const [target, setTarget] = useState(() => String(array[Math.floor(Math.random() * array.length)]));
    const [userInput, setUserInput] = useState(array.join(', '));
    
    const steps = useMemo(() => getBinarySearchSteps(array, parseInt(target, 10)), [array, target]);

    const handleGenerateArray = useCallback(() => {
        const newArray = generateSortedArray();
        setArray(newArray);
        setUserInput(newArray.join(', '));
        setTarget(String(newArray[Math.floor(Math.random() * newArray.length)]));
    }, []);

    const handleApplyUserInput = useCallback(() => {
        const processed = userInput.split(',').map(s => parseInt(s.trim(),10)).filter(n => !isNaN(n) && n >= 0 && n <= 100).slice(0, 15);
        const unique = Array.from(new Set(processed));
        unique.sort((a,b) => a - b);
        setArray(unique);
        setUserInput(unique.join(', '));
        if (unique.length > 0 && !unique.includes(parseInt(target, 10))) {
            setTarget(String(unique[Math.floor(unique.length / 2)]));
        }
    }, [userInput, target]);

    const getBarState = useCallback((index, step) => {
        if (!step) return 'default';
        const { foundIndex, mid, activeRange } = step;
        if (foundIndex === index) return 'found';
        if (mid === index) return 'checking';
        if (index < activeRange[0] || index > activeRange[1]) return 'inactive';
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
        ExplanationComponent: BinarySearchExplain,
        CanvasComponent: ArrayCanvasSearch,
        ControlsComponent: ArrayControlsSearch,
        canvasProps,
        controlProps
    });
}