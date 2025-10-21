import { Play, Pause, RotateCcw, ChevronsRight, Settings, BarChart3, Gauge, ChevronsRightLeft, StepForward, PlayCircle, StepBack} from 'lucide-react';

export default function ArrayControls({isAnimating, currentStep, totalSteps, speed,onPlayPause, onReset,onSpeedChange,
    onStepForward, onStepBackward,userInput, onUserInput, onApplyUserInput}) 
{
    const secondaryButtonStyles =  "btn-liquid-glass group w-full flex items-center justify-center gap-2 px-4 py-1.75 cursor-pointer";

    const arrayValues = userInput.split(',').map(item => item.trim()).filter(item => item !== '');
    const isOverLimit = arrayValues.length > 10;

    return (
        <div className="p-5 space-y-8.5">
            {/* --- MAIN HEADER --- */}
            <div className="flex items-center gap-3">
                <Settings className="text-accent" />
                <h2 className="text-2xl font-bold text-text-primary">Controls</h2>
            </div>

            {/* --- PLAYBACK CONTROLS --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <PlayCircle className="text-accent" />
                    <h3 className="text-lg font-semibold text-text-primary">Playback Controls</h3>
                </div>
                <div className="flex items-center gap-4 px-2.75">
                    {/* Primary Action Button with Gradient and Animated Text */}
                    <button
                        onClick={onPlayPause}
                        disabled={isAnimating && currentStep >= totalSteps - 1}
                        className="group flex-1 flex items-center justify-center gap-2 px-4 py-1.75 rounded-lg font-semibold text-white bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px hover:shadow-lg hover:shadow-accent/40 cursor-pointer text-sm"
                    >
                        {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                        <span className="transition-all duration-300 group-hover:tracking-wider">
                            {isAnimating ? 'Pause' : (currentStep > 0 && currentStep < totalSteps - 1 ? 'Resume' : 'Start')}
                        </span>
                    </button>
                    {/* Reset Button with Subtle Hover */}
                    <button
                        onClick={onReset}
                        disabled={isAnimating}
                        className="p-2.5 rounded-lg bg-card border border-border text-text-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent hover:text-accent hover:-translate-y-px cursor-pointer"
                        title="Reset Algorithm"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* --- STEP-BY-STEP CONTROLS --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <ChevronsRightLeft className="text-accent" />
                    <h3 className="text-lg font-semibold text-text-primary">Step Controls</h3>
                </div>
                <div className="flex items-center gap-4 px-2.75">
                    {/* Secondary Button with Animated Icon */}
                    <button
                        onClick={onStepBackward}
                        disabled={isAnimating || currentStep === 0}
                        className={secondaryButtonStyles}
                    >
                        <StepBack size={16} className="transition-transform duration-300 group-hover:-translate-x-1" /> 
                        <span className='text-sm'>Previous</span>
                    </button>
                    {/* Secondary Button with Animated Icon */}
                    <button
                        onClick={onStepForward}
                        disabled={isAnimating || currentStep >= totalSteps - 1}
                        className={secondaryButtonStyles}
                    >
                        <span className='text-sm'>Next</span>
                        <StepForward size={16} className="transition-transform duration-300 group-hover:translate-x-1 cursor-pointer" />
                    </button>
                </div>
            </div>

            {/* --- ANIMATION SPEED --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Gauge className="text-accent" />
                    <h3 className="text-lg font-semibold text-text-primary">Animation Speed</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-primary/90 px-2.75">
                    <span>Slow</span>
                    <input
                        id="speed" type="range" min="10" max="1000" step="50"
                        value={1050 - speed}
                        onChange={(e) => onSpeedChange(e.target.value)}
                        disabled={isAnimating}
                        className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                    />
                    <span>Fast</span>
                </div>
            </div>

            {/* --- CUSTOM INPUT --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="text-accent" />
                    <h3 className="text-lg font-semibold text-text-primary">Custom Input</h3>
                </div>
                <div className='px-2.75'>
                    <textarea
                        rows="2"
                        value={userInput} onChange={onUserInput} disabled={isAnimating}
                        placeholder="e.g., 54, 26, 93, 17"
                        className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-1 focus:ring-accent transition resize-none outline-none scrollbar-hide text-sm"                    
                    />
                    
                    <p className={`text-xs mt-1 mb-3 px-2.75 ${isOverLimit ? 'text-red-500' : 'text-text-primary/90'}`}>
                        Max 10 numbers, values 1-100. Comma-separated.
                        {isOverLimit && (
                        <span className="block font-semibold">
                            ⚠️ You have {arrayValues.length} numbers. Only the first 10 will be used.
                        </span>
                        )}
                    </p>

                    {/* Secondary Button with Animated Icon */}
                    <button
                        onClick={onApplyUserInput} disabled={isAnimating}
                        className={secondaryButtonStyles}
                    >
                        <ChevronsRight size={18} className="transition-transform duration-300 group-hover:scale-125 cursor-pointer" />
                        <span className='text-sm'>Apply New Array</span>
                    </button>
                </div>
            </div>
        </div>
    );
}