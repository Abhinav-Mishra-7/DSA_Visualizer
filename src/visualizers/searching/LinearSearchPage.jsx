import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import LinearSearchExplanation from '../../components/algoExplanationPage/searchingExplain/LinearSearchExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import LinearSearchControls from '../../components/visualizers/controls/LinearSearchControls';
import LinearSearchAnnotation from '../../components/visualizers/step_annotations/searching_annotations/LinearSearchAnnotation';
import GenerateRandomArray from '../../components/shared/GenerateRandomArray';

const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));

const getLinearSearchSteps = (initialArray, target) => {
  if (!initialArray || initialArray.length === 0) return [];

  const steps = [];
  const arr = deepCopy(initialArray);
  const n = arr.length;

  // Initial step with better context
  steps.push({
    array: deepCopy(arr),
    checking: [], found: [], notFound: [],
    message: { text: `Searching for target ${target} in array of ${n} elements. Starting from index 0.` }
  });

  for (let i = 0; i < n; i++) {
    // Step 1: Lift element and ask question with index info
    steps.push({
      array: deepCopy(arr),
      checking: [i],
      found: [],
      notFound: Array.from({ length: i }, (_, k) => k),
      message: { 
        text: `Checking index ${i}: Is ${arr[i].value} == ${target}?`, 
        indices: [i] 
      }
    });

    if (arr[i].value === target) {
      // Step 2a: Found - announce with index
      steps.push({
        array: deepCopy(arr),
        checking: [i],
        found: [],
        notFound: Array.from({ length: i }, (_, k) => k),
        message: { 
          text: `Yes! Found target ${target} at index ${i}.`, 
          indices: [i] 
        }
      });

      // Step 3a: Final highlight
      steps.push({
        array: deepCopy(arr),
        checking: [],
        found: [i],
        notFound: Array.from({ length: i }, (_, k) => k),
        message: { 
          text: `Search complete! Target ${target} found at index ${i}.`, 
          indices: [i] 
        }
      });

      return steps;
    } else {
      // Step 2b: Not found - explain with index
      steps.push({
        array: deepCopy(arr),
        checking: [i],
        found: [],
        notFound: Array.from({ length: i }, (_, k) => k),
        message: { 
          text: `No. ${arr[i].value} ≠ ${target}. Continue to next index.`, 
          indices: [i] 
        }
      });

      // Step 3b: Drop and move on
      steps.push({
        array: deepCopy(arr),
        checking: [],
        found: [],
        notFound: Array.from({ length: i + 1 }, (_, k) => k),
        message: { 
          text: i < n - 1 ? `Moving to index ${i + 1}...` : `Checked all indices.`
        }
      });
    }
  }

  // Not found in entire array
  steps.push({
    array: deepCopy(arr),
    checking: [],
    found: [],
    notFound: Array.from({ length: n }, (_, k) => k),
    message: { 
      text: `Search complete. Target ${target} not found in array (checked indices 0 to ${n-1}).` 
    }
  });

  return steps;
};

export default function LinearSearchProvider({children}) {
    const [initialArray, setInitialArray] = usePersistentState('linearSearchInitialArray_v1', GenerateRandomArray(10));
    const [searchTarget, setSearchTarget] = useState(48);

    const [userInput, setUserInput] = useState(
        (initialArray && Array.isArray(initialArray) && initialArray.length > 0)
            ? initialArray.map(item => item.value).join(', ')
            : ''
    );
    
    const [targetInput, setTargetInput] = useState(searchTarget?.toString() || '48');
    const steps = useMemo(() => getLinearSearchSteps(initialArray, searchTarget), [initialArray, searchTarget]);

    const resetArray = useCallback(() => {
        const newArray = GenerateRandomArray(10); 
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
            const newArray = parsedValues.map((val, i) => ({
                id: `user-item-${i}-${Date.now()}`,
                value: val
            }));
            setInitialArray(newArray);
            setSearchTarget(parsedTarget);
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
        if (stepData.found?.includes(index)) return 'bg-green-500/80 border-green-400 shadow-lg shadow-green-800';
        if (stepData.checking?.includes(index)) return 'bg-yellow-500/80 border-yellow-400 shadow-lg shadow-yellow-800';
        if (stepData.notFound?.includes(index)) return 'bg-red-500/80 border-red-400';
        return 'bg-accent/60 border-accent'; 
    }, []);

    return children({
        steps,
        ExplanationComponent: () => <LinearSearchExplanation/>,
        CanvasComponent: ArrayCanvas,
        ControlsComponent: LinearSearchControls,
        canvasProps: { 
            getElementState: getElementState,
            AnnotationComponent: LinearSearchAnnotation,
        },
        controlProps: { 
            userInput, 
            onUserInput: (e) => setUserInput(e.target.value), 
            onApplyUserInput: applyUserInput,
            onResetRequest: resetArray,
            // Additional props for search target
            searchTarget: searchTarget,
            targetInput: targetInput,
            onTargetInput: (e) => setTargetInput(e.target.value),
            onApplyTarget: onApplyTarget, 
            showSearchTarget: true,
        },
    });
}
