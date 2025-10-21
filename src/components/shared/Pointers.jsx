// Simple pointer 
export const SimplePointer = ({ index, height, elementSize, gap }) => (
    <div
        className="absolute w-px bg-accent lg:h-22 lg:top-13 md:h-16 md:top-8 h-8 top-11"
        style={{
            left: `${index * (elementSize + gap) + elementSize / 2}px`,
            top: '90px',
            // height: `${height}px`,
            transition: 'height 0.3s ease-in-out' ,
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
const GROUPED_BUCKET_LABEL_COLORS = [
  "bg-purple-400 border-purple-500 text-white",
  "bg-blue-400 border-blue-500 text-white",
  "bg-green-400 border-green-500 text-white",
  "bg-pink-400 border-pink-500 text-white",
  "bg-orange-400 border-orange-500 text-white",
  "bg-yellow-400 border-yellow-500 text-white",
  "bg-cyan-400 border-cyan-500 text-white"
];

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

// For Binary Search and Jump Search
// Group pointers by their target index
export const getGroupedPointers = (left, right, mid, hasPointers) => {
  const groups = {};
  
  // Add L pointer
  if (left !== null && left !== undefined) {
    if (!groups[left]) groups[left] = [];
    groups[left].push({ label: 'L', color: '#3B82F6', type: 'boundary' });
  }
  
  // Add R pointer
  if (right !== null && right !== undefined) {
    if (!groups[right]) groups[right] = [];
    groups[right].push({ label: 'R', color: '#EF4444', type: 'boundary' });
  }
  
  // Add M pointer
  if (mid !== null && mid !== undefined && hasPointers) {
    if (!groups[mid]) groups[mid] = [];
    groups[mid].push({ label: 'M', color: '#EAB308', type: 'mid' });
  }
  
  return groups;
};

// Combined pointer component for multiple labels
export const CombinedPointer = ({ index, pointers, elementSize, gap, annotationContainerY }) => {
  const elementX = index * (elementSize + gap) + elementSize / 2;
  
  // Determine pointer height based on type
  const hasBoundary = pointers.some(p => p.type === 'boundary');
  
  // Position labels with vertical gaps
  const labelStartY = hasBoundary ? 16 : 16;
  const labelGap = 18; 
  const numLabels = pointers.length;
  
  // Start line BELOW all labels with proper spacing
  const lineStartY = hasBoundary 
    ? labelStartY + 20 + (numLabels - 1) * labelGap + 8 : 40; 
  
  // Adjust height to account for line starting below labels
  const baseHeight = hasBoundary ? 55 : 55;
  const pointerHeight = baseHeight - (numLabels > 1 ? (numLabels - 1) * 8 : 0);
  
  return (
    <div className="absolute w-full h-full">
      {/* Multiple labels with vertical spacing */}
      {pointers.map((pointer, idx) => (
        <div 
          key={pointer.label}
          className="absolute"
          style={{
            left: `${elementX}px`,
            top: `${annotationContainerY + labelStartY + (idx * labelGap)}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className={`font-bold text-sm`} style={{ color: pointer.color }}>
            {pointer.label}
          </span>
        </div>
      ))}
      
      {/* Single pointer line - starts below all labels */}
      <div 
        className="absolute w-px transition-all duration-300"
        style={{
          left: `${elementX}px`,
          top: `${annotationContainerY + lineStartY}px`,
          height: `${pointerHeight}px`,
          backgroundColor: pointers[0].color
        }}
      >
        {/* Diamond tip */}
        <div 
          className="absolute bottom-[-1px] left-1/2 w-2 h-2 transform -translate-x-1/2 rotate-45"
          style={{ backgroundColor: pointers[0].color }}
        />
      </div>
    </div>
  );
};

// Group pointers by their target index - HIDE pointers when found
export const getGroupedJumpPointers = (checking, found, current, prev, phase, hasPointers) => {
  const groups = {};
  
  // Don't show ANY pointers when element is found or search is complete
  if (phase === 'found' || phase === 'not_found') {
    return groups; // Return empty - no pointers
  }
  
  // Add checking pointer (J or C) - only when actively checking
  if (checking && checking.length > 0 && hasPointers && phase !== 'found') {
    const index = checking[0];
    if (!groups[index]) groups[index] = [];
    groups[index].push({ 
      label: phase === 'jumping' ? 'J' : 'C', 
      color: '#EAB308', // yellow-500
      type: 'checking' 
    });
  }
  
  // Add Previous pointer - only during active search phases
  if (prev !== null && prev !== undefined && phase !== 'initial' && phase !== 'found' && phase !== 'not_found') {
    if (!groups[prev]) groups[prev] = [];
    groups[prev].push({ 
      label: 'P', 
      color: '#3B82F6', // blue-500
      type: 'boundary' 
    });
  }
  
  // Add Next/Current pointer - only during jumping phase
  if (current !== null && current !== undefined && phase === 'jumping' && phase !== 'found') {
    if (!groups[current]) groups[current] = [];
    groups[current].push({ 
      label: 'N', 
      color: '#8B5CF6', // purple-500
      type: 'boundary' 
    });
  }
  
  return groups;
};

// Combined pointer component (same as before)
export const CombinedJumpPointer = ({ index, pointers, elementSize, gap, annotationContainerY }) => {
  const elementX = index * (elementSize + gap) + elementSize / 2;
  
  // Determine pointer type and positioning
  const hasBoundary = pointers.some(p => p.type === 'boundary');
  const hasChecking = pointers.some(p => p.type === 'checking');
  
  // Position labels with vertical gaps
  const labelStartY = hasBoundary && !hasChecking ? 20 : 20; // Above array if only boundary, below if checking
  const labelGap = 18; // Vertical gap between labels
  const numLabels = pointers.length;
  
  // Start line below all labels with proper spacing
  const lineStartY = hasBoundary && !hasChecking
    ? labelStartY + 20 + (numLabels - 1) * labelGap + 8 : 60; 
  
  // Adjust height based on pointer type
  const baseHeight = hasBoundary && !hasChecking ? 55 : 55;
  const pointerHeight = baseHeight - (numLabels > 1 ? (numLabels - 1) * 8 : 0);
  
  return (
    <div className="absolute w-full h-full">
      {/* Multiple labels with vertical spacing */}
      {pointers.map((pointer, idx) => (
        <div 
          key={pointer.label}
          className="absolute"
          style={{
            left: `${elementX}px`,
            top: `${annotationContainerY + labelStartY + (idx * labelGap)}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className={`font-bold text-sm`} style={{ color: pointer.color }}>
            {pointer.label}
          </span>
        </div>
      ))}
      
      {/* Single pointer line */}
      <div 
        className="absolute w-px transition-all duration-300"
        style={{
          left: `${elementX}px`,
          top: `${annotationContainerY + lineStartY}px`,
          height: `${pointerHeight}px`,
          backgroundColor: pointers[0].color
        }}
      >
        {/* Diamond tip */}
        <div 
          className="absolute bottom-[-1px] left-1/2 w-2 h-2 transform -translate-x-1/2 rotate-45"
          style={{ backgroundColor: pointers[0].color }}
        />
      </div>
    </div>
  );
};

// Jump size indicator - hide when found
export const JumpSizeIndicator = ({ phase, jumpSize, annotationContainerY }) => {
  // Hide jump size indicator when search is complete
  if (phase === 'found' || phase === 'not_found') {
    return null;
  }
  
  if (phase === 'initial' && jumpSize) {
    return (
      <div 
        className="absolute"
        style={{
          left: '20px',
          top: `${annotationContainerY + 80}px`
        }}
      >
        <div className="text-xs text-text-secondary bg-background-secondary px-2 py-1 rounded border border-border">
          Jump Size: {jumpSize}
        </div>
      </div>
    );
  }
  return null;
};

// Group pointers by their target index
export const getGroupedInterpolationPointers = (checking, found, low, high, pos, phase, hasPointers) => {
  const groups = {};
  
  // Don't show ANY pointers when element is found or search is complete
  if (phase === 'found' || phase === 'not_found') {
    return groups; // Return empty - no pointers
  }
  
  // Add Low pointer
  if (low !== null && low !== undefined && phase !== 'init') {
    if (!groups[low]) groups[low] = [];
    groups[low].push({ 
      label: 'L', 
      color: '#3B82F6', // blue-500
      type: 'boundary' 
    });
  }
  
  // Add High pointer
  if (high !== null && high !== undefined && phase !== 'init') {
    if (!groups[high]) groups[high] = [];
    groups[high].push({ 
      label: 'H', 
      color: '#EF4444', // red-500
      type: 'boundary' 
    });
  }
  
  // Add Position pointer (POS)
  if (pos !== null && pos !== undefined && hasPointers && phase !== 'found' && phase !== 'not_found') {
    if (!groups[pos]) groups[pos] = [];
    groups[pos].push({ 
      label: 'POS', 
      color: '#EAB308', // yellow-500
      type: 'checking' 
    });
  }
  
  return groups;
};