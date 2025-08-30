import { motion } from 'framer-motion';


// Simple pointer 
export const SimplePointer = ({ index, height, elementSize, gap }) => (
    <div
        className="absolute w-px bg-accent"
        style={{
            left: `${index * (elementSize + gap) + elementSize / 2}px`,
            top: '50px',
            height: `${height}px`,
            transition: 'height 0.3s ease-in-out'
        }}
    >
        <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
    </div>
);

// Dual pointer
export const SteppedDualPointers = ({ indices, messagePositionIndex, getPointerHeight, elementSize, gap }) => {
    const initialDropTop = 47;
    const horizontalBarTop = 60;
    const initialSeparation = 20;
    const messageCenterX = messagePositionIndex * (elementSize + gap) + elementSize / 2;
    const sortedIndices = [...indices].sort((a, b) => a - b);
    const initialXPositions = {
        [sortedIndices[0]]: messageCenterX - initialSeparation / 2,
        [sortedIndices[1]]: messageCenterX + initialSeparation / 2,
    };

    return (
        <div className="relative w-full h-full">
            {sortedIndices.map(index => {
                const initialX = initialXPositions[index];
                const elementX = index * (elementSize + gap) + elementSize / 2;
                return (
                    <div key={index}>
                        {/* 1. Initial short vertical drop */}
                        <div className="absolute w-px bg-accent" style={{
                            left: `${initialX}px`, top: `${initialDropTop}px`, height: `${horizontalBarTop - initialDropTop}px`,
                        }} />
                        {/* 2. Horizontal line */}
                        <div className="absolute h-px bg-accent" style={{
                            left: `${Math.min(initialX, elementX)}px`, width: `${Math.abs(elementX - initialX)}px`, top: `${horizontalBarTop}px`,
                        }} />
                        {/* 3. Final vertical drop */}
                        <div className="absolute w-px bg-accent" style={{
                            left: `${elementX}px`, top: `${horizontalBarTop}px`, height: `${getPointerHeight(index, horizontalBarTop)}px`, transition: 'height 0.3s ease-in-out'
                        }}>
                            <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Special bucket sort pointers
const POINTER_COLORS = ['#a78bfa', '#60a5fa', '#4ade80', '#f472b6', '#fb923c', '#fde047', '#22d3ee'];

export const BucketPointer = ({ index, bucketIdx, elementSize, gap }) => {
  const pointerX = index * (elementSize + gap) + elementSize / 2;
  const pointerY = 60;
  const color = POINTER_COLORS[bucketIdx % POINTER_COLORS.length];
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{
        left: `${pointerX}px`, top: `${pointerY}px`,
        transform: 'translateX(-50%)', zIndex: 10,
      }}
    >
      <div
        className={`text-xs font-semibold px-2 py-0.5 rounded border whitespace-nowrap shadow`}
        style={{
          backgroundColor: 'var(--color-background-tertiary, #181825)',
          borderColor: color, color: color, marginBottom: '4px'
        }}
      >
        {`Bucket ${bucketIdx}`}
      </div>
      {/* Line and Diamond */}
      <svg width="20" height="50" className="overflow-visible">
        {/* Straight Line */}
        <line x1="10" y1="0" x2="10" y2="50" stroke={color} strokeWidth="1.2"/>
        {/* Diamond Shape */}
        <polygon points="10,35 14,39 10,43 6,39" transform={`translate(-3,-2) scale(1.3)`} fill={color}/>
      </svg>
    </div>
  );
};

export const GroupedBucketPointer = ({ start, end, bucketIdx, elementSize, gap }) => {
  const color = POINTER_COLORS[bucketIdx % POINTER_COLORS.length];
  const colorClass = GROUPED_BUCKET_LABEL_COLORS[bucketIdx % GROUPED_BUCKET_LABEL_COLORS.length];
  const centerX = ((start + end) / 2) * (elementSize + gap) + elementSize / 2;
  const labelY = 60;
  const arrowY = labelY + 60;
  const diamondSize = 8;
  const startX = start * (elementSize + gap) + elementSize / 2;
  const endX   = end   * (elementSize + gap) + elementSize / 2;
  return (
    <>
      {/* Centered label */}
      <div
        className="absolute flex flex-col items-center pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${labelY}px`,
          transform: 'translateX(-50%)',
          zIndex: 20
        }}
      >
        <div
          className={`text-xs font-bold px-1.5 py-1 rounded border whitespace-nowrap shadow ${colorClass} `}
          style={{ marginBottom: '4px' }}
        >
          <span className="block">{`Bucket ${bucketIdx}`}</span>
          <span className="block text-xs opacity-90">Sorted</span>
        </div>
      </div>
      {/* Two diamond-ended polyline arrows */}
      <svg
        className="absolute pointer-events-none"
        style={{
          left: 0, top: 2, width: '100%',
          height: `${arrowY + diamondSize + 30}px`, zIndex: 15
        }}
      >
        {/* Left arrow */}
        <polyline
          points={`${centerX},${labelY+6} ${centerX},${arrowY} ${startX},${arrowY} ${startX},${arrowY+diamondSize+20}`}
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
        <rect
          x={startX - diamondSize/2+15}
          y={arrowY + diamondSize - diamondSize/2 +15}
          width={diamondSize}
          height={diamondSize}
          fill={color}
          transform={`rotate(45 ${startX} ${arrowY + diamondSize})`}
        />
        {/* Right arrow */}
        <polyline
          points={`${centerX},${labelY+6} ${centerX},${arrowY} ${endX},${arrowY} ${endX},${arrowY+diamondSize+20}`}
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
        <rect
          x={endX - diamondSize/2+15}
          y={arrowY + diamondSize - diamondSize/2+15}
          width={diamondSize}
          height={diamondSize}
          fill={color}
          transform={`rotate(45 ${endX} ${arrowY + diamondSize})`}
        />
      </svg>
    </>
  );
};

// Element pointer Heap sort
export const ElementPointer = ({ index, label, elementSize, gap, yOffset = -30, color = 'var(--color-text-primary)' }) => {
    const pointerX = index * (elementSize + gap) + elementSize / 2;
    return (
        <div
            className="absolute flex flex-col items-center justify-end pointer-events-none"
            style={{
                left: `${pointerX}px`,
                top: `${yOffset}px`, // Use the passed yOffset
                transform: 'translateX(-50%)',
                height: 'auto', // Adjust height dynamically
            }}
        >
            <div
                className="text-xs font-semibold px-1 py-0.5 rounded-sm border whitespace-nowrap" 
                style={{
                    backgroundColor: 'var(--color-background-tertiary)',
                    borderColor: color,
                    color: color,
                    marginBottom: '4px', 
                }}
            >
                {label}
            </div>
            <div
                className="w-px h-13 bg-current" // Small vertical line
                style={{ backgroundColor: color }}
            >
                <div
                    className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-current transform -translate-x-1/2 rotate-45"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
};

// For Radix sort
export const AnnotationPointer = ({ index, height, elementSize, gap }) => (
  <div
    className="absolute w-px bg-accent"
    style={{
      left: `${index * (elementSize + gap) + elementSize / 2}px`,
      top: '48px',
      height: `${height}px`
    }}
  >
    <div className="absolute bottom-[-1px] left-1/2 w-2 h-2 bg-accent transform -translate-x-1/2 rotate-45" />
  </div>
);