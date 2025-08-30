import { motion, AnimatePresence } from 'framer-motion';

const BOX_STATE_CLASSES = {
    default: 'bg-gray-700 border-gray-600',
    inactive: 'bg-gray-800/50 border-gray-700 text-gray-500',
    checking: 'bg-yellow-500 border-yellow-400 ring-2 ring-yellow-300',
    found: 'bg-green-500 border-green-400 ring-2 ring-green-300',
};

export default function ArrayCanvasSearch({ stepData, getBarState }) {
  if (!stepData || !stepData.array) {
    return <div className="flex h-full w-full items-center justify-center"><p className="text-text-secondary">Loading visualization...</p></div>;
  }

  const { array, left, right, mid, isFinished, foundIndex } = stepData;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
      <div className="w-full">
        <div className="relative h-12 w-full">
          <AnimatePresence>
            {array.map((_, index) => (
              <div key={index} className="absolute top-0 h-full" style={{ left: `calc(${(index / array.length) * 100}% + ${(1 / array.length) * 50}%)`, transform: 'translateX(-50%)' }}>
                {left === index && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col items-center font-bold text-sky-400">
                    <span>Left</span><div className="mt-1 h-3 w-0.5 bg-sky-400"></div>
                  </motion.div>
                )}
                {right === index && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col items-center font-bold text-rose-400">
                    <span>Right</span><div className="mt-1 h-3 w-0.5 bg-rose-400"></div>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex h-24 w-full items-center justify-center gap-2">
          <AnimatePresence>
            {array.map((value, index) => (
              <motion.div key={`${value}-${index}`} layout transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="flex flex-col items-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-md border-2 text-2xl font-bold transition-colors duration-300 ${BOX_STATE_CLASSES[getBarState(index, stepData)]}`}>{value}</div>
                <div className="mt-2 text-sm text-gray-400">{index}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="relative h-12 w-full">
          <AnimatePresence>
            {array.map((_, index) => (
              <div key={index} className="absolute top-0 h-full" style={{ left: `calc(${(index / array.length) * 100}% + ${(1 / array.length) * 50}%)`, transform: 'translateX(-50%)' }}>
                {mid === index && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center font-bold text-yellow-400">
                    <div className="mb-1 h-3 w-0.5 bg-yellow-400"></div><span>Mid</span>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/50 px-6 py-3 text-2xl font-bold backdrop-blur-sm">
            {foundIndex !== -1 ? <span className="text-green-400">Found at Index {foundIndex}!</span> : <span className="text-red-400">Element Not Found.</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}