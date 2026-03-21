export default function ArrayStepLog({ steps, currentStep, onStepChange }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-xs text-text-secondary px-2 py-1">
        Steps will appear here as the animation runs.
      </div>
    );
  }

  // Extract a primitive value from array item (number or object)
  const getItemValue = (item) => {
    if (item == null) return '';
    if (typeof item === 'number' || typeof item === 'string') return item;
    if (typeof item === 'object') {
      if ('value' in item) return item.value;
      if ('val' in item) return item.val;
      if ('key' in item) return item.key;
    }
    return JSON.stringify(item);
  };

  const buildExplanation = (step) => {
    const array = step.array || [];
    const i = step.i;
    const j = step.j;
    const swapping = step.swapping || [];
    const comparing = step.comparing || [];
    const sorted = step.sorted || [];

    const hasI = typeof i === 'number';
    const hasJ = typeof j === 'number';

    if (swapping.length === 2) {
      const aIdx = swapping[0];
      const bIdx = swapping[1];
      const aVal = getItemValue(array[aIdx]);
      const bVal = getItemValue(array[bIdx]);
      return (
        <>
          We are swapping the values at positions{' '}
          <span className="font-semibold"> {aIdx} </span> and{' '}
          <span className="font-semibold"> {bIdx} </span>. So the numbers{' '}
          <span className="font-semibold">{aVal}</span> and{' '}
          <span className="font-semibold">{bVal}</span> exchange their places in
          the array.
        </>
      );
    }

    if (comparing.length === 2) {
      const aIdx = comparing[0];
      const bIdx = comparing[1];
      const aVal = getItemValue(array[aIdx]);
      const bVal = getItemValue(array[bIdx]);
      return (
        <>
          We are comparing the values at positions{' '}
          <span className="font-semibold"> {aIdx} </span> and{' '}
          <span className="font-semibold"> {bIdx} </span>, which are{' '}
          <span className="font-semibold">{aVal}</span> and{' '}
          <span className="font-semibold">{bVal}</span>. We check if they are in
          the correct order.
        </>
      );
    }

    if (sorted.length > 0) {
      const lastIdx = sorted[sorted.length - 1];
      const lastVal = getItemValue(array[lastIdx]);
      return (
        <>
          The element at position{' '}
          <span className="font-semibold">{lastIdx}</span> (value{' '}
          <span className="font-semibold">{lastVal}</span>) is now in its final
          sorted place and will not move again.
        </>
      );
    }

    if (hasI && hasJ) {
      return (
        <>
          Pointer <span className="font-semibold">i = {i}</span> and pointer{' '}
          <span className="font-semibold">j = {j}</span> are scanning the array
          to find the next element that should move.
        </>
      );
    }

    if (hasI && !hasJ) {
      const valI = getItemValue(array[i]);
      return (
        <>
          Pointer <span className="font-semibold">i = {i}</span> is on value{' '}
          <span className="font-semibold">{valI}</span>. This is the current
          element the algorithm is focusing on.
        </>
      );
    }

    if (!hasI && hasJ) {
      const valJ = getItemValue(array[j]);
      return (
        <>
          Pointer <span className="font-semibold">j = {j}</span> is scanning the
          array and currently sees value{' '}
          <span className="font-semibold">{valJ}</span>.
        </>
      );
    }

    return <>We are doing a helper step in the algorithm.</>;
  };

  return (
    <ul className="space-y-3 text-[13px]">
      {steps.map((step, index) => {
        const isCurrent = index === currentStep;

        let colorClass = 'text-text-secondary';
        let chipLabel = 'Step';

        if (step.swapping && step.swapping.length) {
          colorClass = 'text-red-400';
          chipLabel = 'Swap';
        } else if (step.comparing && step.comparing.length) {
          colorClass = 'text-yellow-600';
          chipLabel = 'Compare';
        } else if (step.sorted && step.sorted.length) {
          colorClass = 'text-green-400';
          chipLabel = 'Sorted';
        } else if (isCurrent) {
          colorClass = 'text-accent';
        }

        const focusIndexes = [];
        if (Array.isArray(step.comparing))
          focusIndexes.push(...step.comparing);
        if (Array.isArray(step.swapping)) focusIndexes.push(...step.swapping);

        const sortedIndexes = Array.isArray(step.sorted) ? step.sorted : [];

        const array = step.array || [];

        return (
          <li
            key={index}
            className={`px-3 py-2 rounded-md border border-border/40 bg-background/60
                        transition-colors duration-200 cursor-pointer
                        ${
                          isCurrent
                            ? 'bg-accent/10 border-accent/40 shadow-sm'
                            : 'hover:bg-card/60'
                        }`}
            onClick={() => {
              if (onStepChange) onStepChange(index);
            }}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                            text-[11px] font-semibold uppercase tracking-wide ${colorClass}
                            ${isCurrent ? 'bg-black/10' : 'bg-black/5'}`}
              >
                {chipLabel}
                <span className="text-[10px] text-text-secondary/80">
                  #{index}
                </span>
              </span>

              {(typeof step.i === 'number' || typeof step.j === 'number') && (
                <span className="text-[11px] text-text-secondary/80">
                  {typeof step.i === 'number' && <>i = {step.i}</>}
                  {typeof step.i === 'number' &&
                    typeof step.j === 'number' &&
                    ', '}
                  {typeof step.j === 'number' && <>j = {step.j}</>}
                </span>
              )}
            </div>

            {/* array snapshot as boxes */}
            <div className="mb-2">
              <p className="text-[12px] text-text-secondary mb-1 font-semibold">
                Array now:
              </p>
              <div className="flex flex-wrap gap-1">
                {array.map((item, idx) => {
                  const val = getItemValue(item);
                  const isFocused = focusIndexes.includes(idx);
                  const isSorted = sortedIndexes.includes(idx);

                  let boxClasses =
                    'w-8 h-8 flex items-center justify-center rounded-md border text-xs font-semibold';

                  if (isFocused) {
                    boxClasses += ' bg-violet-500 border-white text-white';
                  } else if (isSorted) {
                    boxClasses += ' bg-green-500 border-white text-white';
                  } else {
                    boxClasses +=
                      ' bg-card/70 border-border/60 text-text-primary';
                  }

                  return (
                    <div key={idx} className={boxClasses}>
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* explanation */}
            <p
              className={`${
                isCurrent ? 'text-text-primary' : 'text-text-secondary'
              } text-[12px] leading-relaxed`}
            >
              {buildExplanation(step)}
            </p>

            {/* extra note from step.info */}
            {step.info && (
              <p className="mt-1 text-[11px] text-text-secondary/80">
                Extra note: {step.info}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}