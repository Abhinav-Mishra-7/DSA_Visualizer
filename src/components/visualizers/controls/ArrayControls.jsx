import { Play, Pause, RotateCcw, ChevronsRight, Settings, BarChart3, Gauge, ChevronsRightLeft, StepForward, PlayCircle, StepBack} from 'lucide-react';

export default function ArrayControls({isAnimating, currentStep, totalSteps, speed,onPlayPause, onReset,onSpeedChange,
    onStepForward, onStepBackward,userInput, onUserInput, onApplyUserInput}) 
{
    const secondaryButtonStyles =  "btn-liquid-glass group w-full flex items-center justify-center gap-2 px-4 py-2 cursor-pointer";

    return (
        <div className="p-5 space-y-9">
            {/* --- MAIN HEADER --- */}
            <div className="flex items-center gap-3">
                <Settings className="text-accent" />
                <h2 className="text-2xl font-bold text-text-primary">Controls</h2>
            </div>

            {/* --- PLAYBACK CONTROLS --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <PlayCircle className="text-accent" />
                    <h3 className="text-xl font-semibold text-text-primary">Playback Controls</h3>
                </div>
                <div className="flex items-center gap-4 px-1">
                    {/* Primary Action Button with Gradient and Animated Text */}
                    <button
                        onClick={onPlayPause}
                        disabled={isAnimating && currentStep >= totalSteps - 1}
                        className="group flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px hover:shadow-lg hover:shadow-accent/40 cursor-pointer"
                    >
                        {isAnimating ? <Pause size={18} /> : <Play size={18} />}
                        <span className="transition-all duration-300 group-hover:tracking-wider">
                            {isAnimating ? 'Pause' : (currentStep > 0 && currentStep < totalSteps - 1 ? 'Resume' : 'Start')}
                        </span>
                    </button>
                    {/* Reset Button with Subtle Hover */}
                    <button
                        onClick={onReset}
                        disabled={isAnimating}
                        className="p-2.5 rounded-lg bg-card border border-border text-text-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent hover:text-accent hover:-translate-y-px"
                        title="Reset Algorithm"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* --- STEP-BY-STEP CONTROLS --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <ChevronsRightLeft className="text-accent" />
                    <h3 className="text-xl font-semibold text-text-primary">Step Controls</h3>
                </div>
                <div className="flex items-center gap-4 px-1">
                    {/* Secondary Button with Animated Icon */}
                    <button
                        onClick={onStepBackward}
                        disabled={isAnimating || currentStep === 0}
                        className={secondaryButtonStyles}
                    >
                        <StepBack size={18} className="transition-transform duration-300 group-hover:-translate-x-1" /> 
                        <span>Previous</span>
                    </button>
                    {/* Secondary Button with Animated Icon */}
                    <button
                        onClick={onStepForward}
                        disabled={isAnimating || currentStep >= totalSteps - 1}
                        className={secondaryButtonStyles}
                    >
                        <span>Next</span>
                        <StepForward size={18} className="transition-transform duration-300 group-hover:translate-x-1 cursor-pointer" />
                    </button>
                </div>
            </div>

            {/* --- ANIMATION SPEED --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Gauge className="text-accent" />
                    <h3 className="text-xl font-semibold text-text-primary">Animation Speed</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary px-1">
                    <span>Slow</span>
                    <input
                        id="speed" type="range" min="10" max="1000" step="50"
                        value={1050 - speed}
                        onChange={(e) => onSpeedChange(e.target.value)}
                        disabled={isAnimating}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                    />
                    <span>Fast</span>
                </div>
            </div>

            {/* --- CUSTOM INPUT --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="text-accent" />
                    <h3 className="text-xl font-semibold text-text-primary">Custom Input</h3>
                </div>
                <div className='px-1'>
                    <textarea
                        rows="2"
                        value={userInput} onChange={onUserInput} disabled={isAnimating}
                        placeholder="e.g., 54, 26, 93, 17"
                        className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-1 focus:ring-accent transition resize-none outline-none scrollbar-hide"                    
                    />
                    <p className="text-xs text-text-secondary mt-1 mb-3">Max 15 numbers, values 1-100. Comma-separated.</p>
                    {/* Secondary Button with Animated Icon */}
                    <button
                        onClick={onApplyUserInput} disabled={isAnimating}
                        className={secondaryButtonStyles}
                    >
                        <ChevronsRight size={18} className="transition-transform duration-300 group-hover:scale-125 cursor-pointer" />
                        <span>Apply New Array</span>
                    </button>
                </div>
            </div>
        </div>
    );
}