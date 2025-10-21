import { useState, useMemo, useCallback } from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import InterpolationSearchExplanation from '../../components/algoExplanationPage/searchingExplain/InterpolationSearchExplain';
import ArrayCanvas from '../../components/visualizers/canvases/ArrayCanvas';
import LinearSearchControls from '../../components/visualizers/controls/LinearSearchControls';
import InterpolationSearchAnnotation from '../../components/visualizers/step_annotations/searching_annotations/InterpolationSearchAnnotation';

const generateRandomArray = (size = 10) => {
  const array = Array.from({ length: size }, () => ({
    id: `item-${Math.random().toString(36).slice(2)}`,
    value: Math.floor(Math.random() * 95) + 5,
  }));
  return array.sort((a, b) => a.value - b.value);
};

const deepCopy = (a) => JSON.parse(JSON.stringify(a));

const getInterpolationSteps = (initialArray, target) => {
  const steps = [];
  if (!initialArray?.length) return steps;

  const arr = deepCopy(initialArray);
  let low = 0, high = arr.length - 1;

  steps.push({
    array: deepCopy(arr),
    low, high, pos: null,
    checking: [], found: [], eliminated: [],
    phase: 'init',
    message: { text: `Interpolation Search for target ${target}. Array is sorted. Low=${low}, High=${high}.` }
  });

  // Guard for equal values to avoid divide by zero
  const valueAt = (i) => arr[i].value;

  while (low <= high && target >= valueAt(low) && target <= valueAt(high)) {
    if (low === high) {
      steps.push({
        array: deepCopy(arr),
        low, high, pos: low,
        checking: [low], found: [], eliminated: [],
        phase: 'check',
        message: { text: `Only one element left at index ${low}. Is ${valueAt(low)} == ${target}?`, indices: [low] }
      });

      if (valueAt(low) === target) {
        steps.push({
          array: deepCopy(arr),
          low, high, pos: low,
          checking: [], found: [low], eliminated: [],
          phase: 'found',
          message: { text: `Found target ${target} at index ${low}.`, indices: [low] }
        });
      } else {
        steps.push({
          array: deepCopy(arr),
          low, high, pos: null,
          checking: [], found: [], eliminated: [],
          phase: 'not_found',
          message: { text: `Target ${target} not found.` }
        });
      }
      return steps;
    }

    // pos formula (floored)
    const denom = valueAt(high) - valueAt(low);
    const ratio = denom === 0 ? 0 : (target - valueAt(low)) / denom;
    const pos = low + Math.floor(ratio * (high - low));

    // Show estimation step
    steps.push({
      array: deepCopy(arr),
      low, high, pos,
      checking: [pos], found: [], eliminated: [],
      phase: 'estimate',
      message: { 
        text: `Estimate pos = low + ((target - A[low]) / (A[high] - A[low])) × (high - low) = ${pos}. Check index ${pos}: Is ${valueAt(pos)} == ${target}?`,
        indices: [pos]
      }
    });

    if (valueAt(pos) === target) {
      steps.push({
        array: deepCopy(arr),
        low, high, pos,
        checking: [], found: [pos], eliminated: [],
        phase: 'found',
        message: { text: `Found target ${target} at index ${pos}.`, indices: [pos] }
      });
      return steps;
    }

    if (valueAt(pos) < target) {
      // eliminate left side
      const eliminated = Array.from({ length: pos - low + 1 }, (_, i) => low + i);
      steps.push({
        array: deepCopy(arr),
        low, high, pos,
        checking: [pos], found: [], eliminated,
        phase: 'shrink',
        message: { text: `${valueAt(pos)} < ${target}. Move low to pos + 1. New range will be [${pos + 1}, ${high}].`, indices: [pos] }
      });
      low = pos + 1;
      steps.push({
        array: deepCopy(arr),
        low, high, pos: null,
        checking: [], found: [], eliminated,
        phase: 'range',
        message: { text: `New search range: Low=${low}, High=${high}.` }
      });
    } else {
      // valueAt(pos) > target, eliminate right side
      const eliminated = Array.from({ length: high - pos + 1 }, (_, i) => pos + i);
      steps.push({
        array: deepCopy(arr),
        low, high, pos,
        checking: [pos], found: [], eliminated,
        phase: 'shrink',
        message: { text: `${valueAt(pos)} > ${target}. Move high to pos - 1. New range will be [${low}, ${pos - 1}].`, indices: [pos] }
      });
      high = pos - 1;
      steps.push({
        array: deepCopy(arr),
        low, high, pos: null,
        checking: [], found: [], eliminated,
        phase: 'range',
        message: { text: `New search range: Low=${low}, High=${high}.` }
      });
    }
  }

  steps.push({
    array: deepCopy(arr),
    low, high, pos: null,
    checking: [], found: [], eliminated: Array.from({ length: arr.length }, (_, i) => i),
    phase: 'not_found',
    message: { text: `Target ${target} not in range or not found.` }
  });

  return steps;
};

export default function InterpolationSearchProvider({ children }) {
  const [initialArray, setInitialArray] = usePersistentState('interpolationInitialArray_v1', generateRandomArray(10));
  const [searchTarget, setSearchTarget] = useState(() => {
    const a = initialArray;
    return a?.length ? a[Math.floor(Math.random() * a.length)].value : 50;
  });

  const [userInput, setUserInput] = useState(
    initialArray?.length ? initialArray.map(x => x.value).join(', ') : ''
  );
  const [targetInput, setTargetInput] = useState(String(searchTarget));

  const steps = useMemo(() => getInterpolationSteps(initialArray, searchTarget), [initialArray, searchTarget]);

  const resetArray = useCallback(() => {
    const arr = generateRandomArray(10);
    setInitialArray(arr);
    setUserInput(arr.map(x => x.value).join(', '));
    const t = arr[Math.floor(Math.random() * arr.length)].value;
    setSearchTarget(t);
    setTargetInput(String(t));
  }, [setInitialArray]);

  const applyUserInput = useCallback(() => {
    const vals = userInput
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 100)
      .slice(0, 10)
      .sort((a, b) => a - b);

    const t = parseInt(targetInput.trim(), 10);

    if (vals.length >= 2 && !isNaN(t)) {
      const arr = vals.map((v, i) => ({ id: `user-${i}-${Date.now()}`, value: v }));
      setInitialArray(arr);
      setUserInput(vals.join(', '));
      setSearchTarget(t);
    } else {
      alert('Enter ≥2 numbers (1–100), comma‑separated, and a valid target. Max 10 numbers.');
    }
  }, [userInput, targetInput, setInitialArray]);

  const onApplyTarget = useCallback(() => {
    const t = parseInt(targetInput.trim(), 10);
    if (Number.isNaN(t) || t < 1 || t > 100) {
      alert('Enter a valid target (1–100).');
      return;
    }
    setSearchTarget(t);
  }, [targetInput]);

  const getElementState = useCallback((item, index, stepData) => {
    if (!stepData) return 'bg-accent/60 border-accent';
    if (stepData.found?.includes(index)) return 'bg-green-500/80 border-green-400 shadow-lg shadow-green-800' ;
    if (stepData.checking?.includes(index)) return 'bg-yellow-500/80 border-yellow-400 shadow-lg shadow-yellow-800';
    if (stepData.eliminated?.includes(index)) return 'bg-red-500/80 border-red-400';
    if (index < stepData.low || index > stepData.high) return 'bg-gray-500/60 border-gray-400';
    return 'bg-accent/60 border-accent';
  }, []);

  return children({
    steps,
    ExplanationComponent: () => <InterpolationSearchExplanation />,
    CanvasComponent: ArrayCanvas,
    ControlsComponent: LinearSearchControls,
    canvasProps: {
      getElementState,
      AnnotationComponent: InterpolationSearchAnnotation,
    },
    controlProps: {
      userInput,
      onUserInput: (e) => setUserInput(e.target.value),
      onApplyUserInput: applyUserInput,
      onResetRequest: resetArray,
      searchTarget,
      targetInput,
      onTargetInput: (e) => setTargetInput(e.target.value),
      onApplyTarget,
      showSearchTarget: true,
    },
  });
}
