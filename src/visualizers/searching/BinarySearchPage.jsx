import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import BinarySearchExplanation from '../../components/algoExplanationPage/searchingExplain/BinarySearchExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import LinearSearchControls from "../../components/visualizers/controls/LinearSearchControls" ;
import BinarySearchAnnotation from '../../components/visualizers/step_annotations/searching_annotations/BinarySearchAnnotation';

const generateRandomArray = (size = 10) => {
  const array = Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
    value: Math.floor(Math.random() * 95) + 5,
  }));
  return array.sort((a, b) => a.value - b.value);
};

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

const getBinarySearchSteps = (initialArray, target) => {
  if (!initialArray || initialArray.length === 0) return [];

  const steps = [];
  const arr = deepCopy(initialArray);
  const n = arr.length;
  
  let left = 0;
  let right = n - 1;

  // Initial step
  steps.push({
    array: deepCopy(arr),
    left: left,
    right: right,
    mid: null,
    checking: [], found: [], eliminated: [],
    message: { text: `Searching for target ${target} in sorted array. Left=${left}, Right=${right}.` }
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Step 1: Calculate and show mid
    steps.push({
      array: deepCopy(arr),
      left: left,
      right: right,
      mid: mid,
      checking: [mid],
      found: [],
      eliminated: [],
      message: { 
        text: `Mid = (${left} + ${right}) / 2 = ${mid}. Checking index ${mid}: Is ${arr[mid].value} == ${target}?`, 
        indices: [mid] 
      }
    });

    if (arr[mid].value === target) {
      // Found the target
      steps.push({
        array: deepCopy(arr),
        left: left,
        right: right,
        mid: mid,
        checking: [],
        found: [mid],
        eliminated: [],
        message: { 
          text: `Yes! Found target ${target} at index ${mid}.`, 
          indices: [mid] 
        }
      });

      steps.push({
        array: deepCopy(arr),
        left: left,
        right: right,
        mid: mid,
        checking: [],
        found: [mid],
        eliminated: [],
        message: { 
          text: `Search complete! Target ${target} found at index ${mid}.`, 
          indices: [mid] 
        }
      });

      return steps;
    } else if (arr[mid].value < target) {
      // Target is in right half
      const eliminatedIndices = Array.from({ length: mid + 1 }, (_, k) => k);
      
      steps.push({
        array: deepCopy(arr),
        left: left,
        right: right,
        mid: mid,
        checking: [mid],
        found: [],
        eliminated: eliminatedIndices,
        message: { 
          text: `${arr[mid].value} < ${target}. Target is in right half.`, 
          indices: [mid] 
        }
      });

      left = mid + 1;
      
      steps.push({
        array: deepCopy(arr),
        left: left,
        right: right,
        mid: null,
        checking: [],
        found: [],
        eliminated: eliminatedIndices,
        message: { 
          text: `Eliminate left half. New search range: Left=${left}, Right=${right}.`
        }
      });
    } else {
      // Target is in left half
      const eliminatedIndices = Array.from({ length: n - mid }, (_, k) => mid + k);
      
      steps.push({
        array: deepCopy(arr),
        left: left,
        right: right,
        mid: mid,
        checking: [mid],
        found: [],
        eliminated: eliminatedIndices,
        message: { 
          text: `${arr[mid].value} > ${target}. Target is in left half.`, 
          indices: [mid] 
        }
      });

      right = mid - 1;
      
      steps.push({
        array: deepCopy(arr),
        left: left,
        right: right,
        mid: null,
        checking: [],
        found: [],
        eliminated: eliminatedIndices,
        message: { 
          text: `Eliminate right half. New search range: Left=${left}, Right=${right}.`
        }
      });
    }
  }

  // Target not found
  const eliminatedIndices = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: deepCopy(arr),
    left: left,
    right: right,
    mid: null,
    checking: [],
    found: [],
    eliminated: eliminatedIndices,
    message: { 
      text: `Search complete. Target ${target} not found in array.` 
    }
  });

  return steps;
};

export default function BinarySearchProvider({children}) {
    const [initialArray, setInitialArray] = usePersistentState('binarySearchInitialArray_v1', generateRandomArray());
    const [searchTarget, setSearchTarget] = useState(48);

    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const [targetInput, setTargetInput] = useState(searchTarget?.toString() || '48');
    const steps = useMemo(() => getBinarySearchSteps(initialArray, searchTarget), [initialArray, searchTarget]);

    const resetArray = useCallback(() => {
        const newArray = generateRandomArray(10);
        setInitialArray(newArray);
        setUserInput(newArray.map(item => item.value).join(', '));
        const randomTarget = newArray[Math.floor(Math.random() * newArray.length)].value;
        setSearchTarget(randomTarget);
        setTargetInput(randomTarget.toString());
    }, [setInitialArray, setSearchTarget]);
    
    const applyUserInput = useCallback(() => {
        const parsedValues = userInput
            .split(',')
            .map(item => parseInt(item.trim(), 10))
            .filter(num => !isNaN(num) && num >= 1 && num <= 100)
            .slice(0, 10);

        const parsedTarget = parseInt(targetInput.trim(), 10);

        if (parsedValues.length >= 2 && !isNaN(parsedTarget)) {
            // Sort the values for binary search
            parsedValues.sort((a, b) => a - b);
            
            const newArray = parsedValues.map((val, i) => ({
                id: `user-item-${i}-${Date.now()}`,
                value: val
            }));
            setInitialArray(newArray);
            setSearchTarget(parsedTarget);
            setUserInput(parsedValues.join(', ')); // Show sorted values
        } else {
            alert('Please enter at least 2 valid, comma-separated numbers (1-100) for the array and a valid target number. Max 10 numbers for array.');
        }
    }, [userInput, targetInput, setInitialArray, setSearchTarget]);

    const onApplyTarget = useCallback(() => {
        const parsedTarget = parseInt(targetInput.trim(), 10);
        if (Number.isNaN(parsedTarget) || parsedTarget < 1 || parsedTarget > 100) {
            alert('Enter a valid target (1–100).');
            return;
        }
        setSearchTarget(parsedTarget);
    }, [targetInput, setSearchTarget]);

    const getElementState = useCallback((item, index, stepData) => {
        if (!stepData) return 'bg-accent/60 border-accent';
        if (stepData.found?.includes(index)) return 'bg-green-500/80 border-green-400 shadow-lg shadow-green-900';
        if (stepData.checking?.includes(index)) return 'bg-yellow-500/80 border-yellow-400 shadow-lg shadow-yellow-900';
        if (stepData.eliminated?.includes(index)) return 'bg-red-500/80 border-red-400';
        if (stepData.left !== undefined && stepData.right !== undefined) {
            if (index < stepData.left || index > stepData.right) {
                return 'bg-gray-500/60 border-gray-400'; // Outside current search range
            }
        }
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <BinarySearchExplanation/>,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: LinearSearchControls,
        canvasProps: { 
            getElementState: getElementState,
            AnnotationComponent: BinarySearchAnnotation,
        },
        controlProps: { 
            userInput, 
            onUserInput: (e) => setUserInput(e.target.value), 
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
            searchTarget: searchTarget,
            targetInput: targetInput,
            onTargetInput: (e) => setTargetInput(e.target.value),
            onApplyTarget: onApplyTarget,
            showSearchTarget: true,
        },
    });
}
