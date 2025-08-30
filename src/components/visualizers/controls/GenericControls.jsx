import { Play, Pause, RotateCcw } from 'lucide-react';

export default function GenericControls({ isAnimating, currentStep, totalSteps, onPlayPause, onReset, speed, onSpeedChange }) {
    return (
        <>
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onPlayPause}
                    disabled={currentStep >= totalSteps - 1}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-accent-foreground bg-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnimating ? <Pause size={18} /> : <Play size={18} />}
                    <span>{isAnimating ? 'Pause' : 'Start'}</span>
                </button>
                <button
                    onClick={onReset} disabled={isAnimating}
                    className="p-3 rounded-lg bg-card border border-border text-text-secondary hover:text-accent hover:border-accent transition disabled:opacity-50"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
            {/* Speed Control */}
            <div>
                <label htmlFor="speed" className="block text-sm font-medium text-text-secondary mb-2">Speed</label>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span>Slow</span>
                    <input
                        id="speed" type="range" min="50" max="1000" step="50"
                        // THIS IS THE FIX: The value is calculated from the speed prop
                        value={1050 - speed}
                        // The event 'e' is passed directly to the onSpeedChange prop
                        onChange={onSpeedChange}
                        disabled={isAnimating}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                    />
                    <span>Fast</span>
                </div>
            </div>
        </>
    );
}