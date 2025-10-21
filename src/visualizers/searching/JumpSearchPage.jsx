import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import JumpSearchExplanation from '../../components/algoExplanationPage/searchingExplain/JumpSearchExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import LinearSearchControls from '../../components/visualizers/controls/LinearSearchControls';
import JumpSearchAnnotation from '../../components/visualizers/step_annotations/searching_annotations/JumpSearchAnnotation';

const generateRandomArray = (size = 10) => {
  const array = Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
    value: Math.floor(Math.random() * 95) + 5,
  }));
  
  // Sort the array for jump search
  return array.sort((a, b) => a.value - b.value);
};

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

const getJumpSearchSteps = (initialArray, target) => {
  if (!initialArray || initialArray.length === 0) return [];

  const steps = [];
  const arr = deepCopy(initialArray);
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  
  let step = jumpSize;
  let prev = 0;

  // Initial step
  steps.push({
    array: deepCopy(arr),
    jumpSize: jumpSize,
    current: null,
    prev: null,
    checking: [],
    found: [],
    eliminated: [],
    phase: 'initial',
    message: { 
      text: `Jump Search for target ${target}. Array length=${n}, Jump size=√${n}=${jumpSize}.` 
    }
  });

  // Phase 1: Jumping to find the right block
  while (step < n && arr[step].value < target) {
    // Show current jump position
    steps.push({
      array: deepCopy(arr),
      jumpSize: jumpSize,
      current: step,
      prev: prev,
      checking: [step],
      found: [],
      eliminated: Array.from({ length: prev }, (_, k) => k),
      phase: 'jumping',
      message: { 
        text: `Jumping to index ${step}: Is ${arr[step].value} >= ${target}?`, 
        indices: [step] 
      }
    });

    if (arr[step].value === target) {
      // Found during jump phase
      steps.push({
        array: deepCopy(arr),
        jumpSize: jumpSize,
        current: step,
        prev: prev,
        checking: [],
        found: [step],
        eliminated: Array.from({ length: prev }, (_, k) => k),
        phase: 'found',
        message: { 
          text: `Found! Target ${target} found at index ${step} during jump phase.`, 
          indices: [step] 
        }
      });
      return steps;
    }

    // Target is larger, continue jumping
    steps.push({
      array: deepCopy(arr),
      jumpSize: jumpSize,
      current: step,
      prev: prev,
      checking: [step],
      found: [],
      eliminated: Array.from({ length: prev }, (_, k) => k),
      phase: 'jumping',
      message: { 
        text: `${arr[step].value} < ${target}. Continue jumping...`, 
        indices: [step] 
      }
    });

    prev = step;
    step += jumpSize;
  }

  // Phase 2: Linear search in the identified block
  if (step >= n) {
    step = n - 1;
  }

  // Check if target is too large
  if (arr[step].value < target) {
    steps.push({
      array: deepCopy(arr),
      jumpSize: jumpSize,
      current: step,
      prev: prev,
      checking: [],
      found: [],
      eliminated: Array.from({ length: n }, (_, k) => k),
      phase: 'not_found',
      message: { 
        text: `Target ${target} is larger than last element ${arr[step].value}. Not found.` 
      }
    });
    return steps;
  }

  // Start linear search from prev to step
  steps.push({
    array: deepCopy(arr),
    jumpSize: jumpSize,
    current: step,
    prev: prev,
    checking: [],
    found: [],
    eliminated: Array.from({ length: prev }, (_, k) => k),
    phase: 'linear_start',
    message: { 
      text: `Target is between indices ${prev} and ${step}. Starting linear search...` 
    }
  });

  // Linear search phase
  for (let i = prev; i <= Math.min(step, n - 1); i++) {
    steps.push({
      array: deepCopy(arr),
      jumpSize: jumpSize,
      current: step,
      prev: prev,
      checking: [i],
      found: [],
      eliminated: Array.from({ length: prev }, (_, k) => k),
      phase: 'linear_search',
      message: { 
        text: `Linear search at index ${i}: Is ${arr[i].value} == ${target}?`, 
        indices: [i] 
      }
    });

    if (arr[i].value === target) {
      // Found during linear search
      steps.push({
        array: deepCopy(arr),
        jumpSize: jumpSize,
        current: step,
        prev: prev,
        checking: [],
        found: [i],
        eliminated: Array.from({ length: prev }, (_, k) => k),
        phase: 'found',
        message: { 
          text: `Found! Target ${target} found at index ${i}.`, 
          indices: [i] 
        }
      });
      return steps;
    } else if (arr[i].value > target) {
      // Target not found
      steps.push({
        array: deepCopy(arr),
        jumpSize: jumpSize,
        current: step,
        prev: prev,
        checking: [i],
        found: [],
        eliminated: Array.from({ length: prev }, (_, k) => k),
        phase: 'not_found',
        message: { 
          text: `${arr[i].value} > ${target}. Target not found in array.`, 
          indices: [i] 
        }
      });
      return steps;
    }

    // Continue linear search
    steps.push({
      array: deepCopy(arr),
      jumpSize: jumpSize,
      current: step,
      prev: prev,
      checking: [i],
      found: [],
      eliminated: Array.from({ length: prev }, (_, k) => k),
      phase: 'linear_search',
      message: { 
        text: `${arr[i].value} < ${target}. Continue linear search...`, 
        indices: [i] 
      }
    });
  }

  // Not found after complete linear search
  steps.push({
    array: deepCopy(arr),
    jumpSize: jumpSize,
    current: step,
    prev: prev,
    checking: [],
    found: [],
    eliminated: Array.from({ length: n }, (_, k) => k),
    phase: 'not_found',
    message: { 
      text: `Linear search complete. Target ${target} not found in array.` 
    }
  });

  return steps;
};

export default function JumpSearchProvider({children}) {
    const [initialArray, setInitialArray] = usePersistentState('jumpSearchInitialArray_v1', generateRandomArray());
    const [searchTarget, setSearchTarget] = useState(48);

    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const [targetInput, setTargetInput] = useState(searchTarget?.toString() || '48');
    const steps = useMemo(() => getJumpSearchSteps(initialArray, searchTarget), [initialArray, searchTarget]);

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
            // Sort the values for jump search
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
        if (stepData.current === index) return 'bg-blue-500/80 border-blue-400 shadow-lg shadow-blue-900';
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <JumpSearchExplanation/>,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: LinearSearchControls,
        canvasProps: { 
            getElementState: getElementState,
            AnnotationComponent: JumpSearchAnnotation,
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