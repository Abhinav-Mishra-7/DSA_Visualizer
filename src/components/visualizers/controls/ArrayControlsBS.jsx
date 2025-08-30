import { Play, Pause, RotateCcw, Settings, Search, BarChart3, ChevronsRight, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArrayControlsSearch(props) {
    const { 
        isAnimating, currentStepIndex, totalSteps, onPlayPause, onReset, speed, onSpeedChange,
        onStepForward, onStepBackward,
        target, onTargetChange,
        userInput, onUserInput, onApplyUserInput,
        onGenerateArray,
    } = props;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3"><Settings className="text-accent" /><h2 className="text-2xl font-bold text-text-primary">Controls</h2></div>
            
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
                <button onClick={onPlayPause} disabled={currentStepIndex >= totalSteps - 1} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-accent-foreground bg-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    {isAnimating ? <Pause size={18} /> : <Play size={18} />}
                    <span>{isAnimating ? 'Pause' : (currentStepIndex > 0 && currentStepIndex < totalSteps - 1 ? 'Resume' : 'Start')}</span>
                </button>
                <button onClick={onReset} disabled={isAnimating} className="p-3 rounded-lg bg-card border border-border text-text-secondary hover:text-accent hover:border-accent transition disabled:opacity-50" title="Reset Algorithm"><RotateCcw size={20} /></button>
            </div>

            {/* Step-by-Step Controls */}
            <div className="flex items-center justify-center gap-2">
                 <button onClick={onStepBackward} disabled={isAnimating || currentStepIndex <= 0} className="p-2 rounded-lg bg-card border border-border text-text-secondary hover:text-accent hover:border-accent transition disabled:opacity-50" title="Step Backward"><ChevronLeft size={20}/></button>
                 <span className="text-sm text-text-secondary font-mono">{currentStepIndex} / {totalSteps - 1}</span>
                 <button onClick={onStepForward} disabled={isAnimating || currentStepIndex >= totalSteps - 1} className="p-2 rounded-lg bg-card border border-border text-text-secondary hover:text-accent hover:border-accent transition disabled:opacity-50" title="Step Forward"><ChevronRight size={20}/></button>
            </div>

            {/* Speed Control */}
            <div>
                <label htmlFor="speed" className="block text-sm font-medium text-text-secondary mb-2">Speed</label>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span>Slow</span>
                    <input id="speed" type="range" min="50" max="1000" step="50" value={1050 - speed} onChange={(e) => onSpeedChange(e.target.value)} disabled={isAnimating} className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"/>
                    <span>Fast</span>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-2"><Search className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Parameters</h3></div>
                <div>
                    <label htmlFor="target-input" className="block text-sm font-medium text-text-secondary mb-1">Target Value</label>
                    <input type="tel" id="target-input" value={target} onChange={onTargetChange} disabled={isAnimating} className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-accent transition disabled:opacity-50" placeholder="Enter a number... scrollbar-hide"/>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-4"><BarChart3 className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Custom Input</h3></div>
                <textarea value={userInput} onChange={onUserInput} disabled={isAnimating} placeholder="e.g., 8, 24, 42, 55, 67, 89" className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-accent transition h-20 resize-none"/>
                <p className="text-xs text-text-secondary mt-1 mb-3">Max 15 numbers, values 0-100. Comma-separated.</p>
                <button onClick={onApplyUserInput} disabled={isAnimating} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition disabled:opacity-50">
                    <ChevronsRight size={18} /><span>Apply New Array</span>
                </button>
            </div>
            
            <div className="pt-6 border-t border-border">
                 <button onClick={onGenerateArray} disabled={isAnimating} className="w-full p-2 bg-card-light hover:bg-background rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50">
                    <RefreshCw size={16} /> Generate Random Array
                </button>
            </div>
        </div>
    );
}