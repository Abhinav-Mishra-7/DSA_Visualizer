import React from 'react';
import { Settings, Waypoints, Network, Plus, Trash2, GitBranch, Anchor, ArrowRight, CornerRightUp, Play, Pause, RotateCcw, ChevronsRightLeft, StepForward, PlayCircle, StepBack, Gauge } from 'lucide-react';
import GenericControls from './GenericControls';

const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default function GraphControls(props) {
    const { 
        options, selectedValue, onSelectChange, selectLabel,
        editMode, setEditMode, onClearGraph, edgeStartNode,
        isTree, validationError,
        isDirected, setIsDirected, disableGraphTypeToggle,
        // Step navigation props (same as ArrayControls)
        isAnimating, currentStep, totalSteps, speed,
        onPlayPause, onReset, onSpeedChange,
        onStepForward, onStepBackward
    } = props;
    
    const parameterIcon = isTree ? <Anchor className="text-accent" /> : <Waypoints className="text-accent" />;
    const parameterTitle = isTree ? "Tree Parameters" : "Parameters";

    // Same secondary button styles as ArrayControls
    const secondaryButtonStyles = "btn-liquid-glass group w-full flex items-center justify-center gap-2 px-4 py-1.75 cursor-pointer";

    const getHelpText = () => {
        switch (editMode) {
            case 'add-node': return "Click on an empty area to add a node.";
            case 'add-edge': return edgeStartNode ? `Selected Parent '${edgeStartNode}'. Select child node.` : "Select the first node for the edge (parent).";
            case 'delete-node': return "Click a node to delete it.";
            default: return "";
        }
    };

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

            {/* --- GRAPH TYPE --- */}
            {!disableGraphTypeToggle && (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <CornerRightUp className="text-accent" />
                        <h3 className="text-lg font-semibold text-text-primary">Graph Type</h3>
                    </div>
                    <div className="flex items-center gap-4 px-2.75">
                        <button 
                            onClick={() => setIsDirected(true)} 
                            className={clsx(
                                secondaryButtonStyles,
                                isDirected ? 'bg-accent text-accent-foreground' : ''
                            )} 
                            disabled={isAnimating}
                        >
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                            <span className='text-sm'>Directed</span>
                        </button>
                        <button 
                            onClick={() => setIsDirected(false)} 
                            className={clsx(
                                secondaryButtonStyles,
                                !isDirected ? 'bg-accent text-accent-foreground' : ''
                            )} 
                            disabled={isAnimating}
                        >
                            <span className='text-sm'>Undirected</span>
                        </button>
                    </div>
                </div>
            )}
            
            {/* --- PARAMETERS --- */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    {parameterIcon}
                    <h3 className="text-lg font-semibold text-text-primary">{parameterTitle}</h3>
                </div>
                {options && ( 
                    <div className="px-2.75">
                        <label htmlFor="start-node-select" className="block text-sm font-medium text-text-secondary mb-2">
                            {selectLabel || "Select Option"}
                        </label>
                        <select 
                            id="start-node-select" 
                            value={selectedValue} 
                            onChange={onSelectChange} 
                            disabled={isAnimating || editMode !== 'idle'} 
                            className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-1 focus:ring-accent transition disabled:opacity-50 outline-none text-sm"
                        >
                            {options.length > 0 ? (
                                options.map(option => ( 
                                    <option key={option.value} value={option.value}>{option.label}</option> 
                                ))
                            ) : (
                                <option disabled>No nodes available</option>
                            )}
                        </select>
                    </div>
                )}
            </div>

            {/* --- GRAPH EDITOR --- */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Network className="text-accent" />
                        <h3 className="text-lg font-semibold text-text-primary">Graph Editor</h3>
                    </div>
                    <button 
                        onClick={onClearGraph} 
                        disabled={isAnimating || editMode !== 'idle'} 
                        className="p-2 text-text-secondary hover:text-red-500 transition disabled:opacity-50" 
                        title="Clear Graph"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                
                <div className="px-2.75 space-y-4">
                    {/* Edit Mode Buttons */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <button 
                            onClick={() => setEditMode(editMode === 'add-node' ? 'idle' : 'add-node')} 
                            className={clsx(
                                'p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', 
                                editMode === 'add-node' ? 'bg-accent text-accent-foreground' : 'btn-liquid-glass'
                            )} 
                            disabled={isAnimating}
                        >
                            <Plus size={16} /> Node
                        </button>
                        <button 
                            onClick={() => setEditMode(editMode === 'add-edge' ? 'idle' : 'add-edge')} 
                            className={clsx(
                                'p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', 
                                editMode === 'add-edge' ? 'bg-accent text-accent-foreground' : 'btn-liquid-glass'
                            )} 
                            disabled={isAnimating}
                        >
                            <GitBranch size={16} /> Edge
                        </button>
                        <button 
                            onClick={() => setEditMode(editMode === 'delete-node' ? 'idle' : 'delete-node')} 
                            className={clsx(
                                'p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', 
                                editMode === 'delete-node' ? 'bg-red-500 text-white' : 'btn-liquid-glass text-red-500/80'
                            )} 
                            disabled={isAnimating}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                    
                    {/* Help Text */}
                    <div className="text-center text-xs min-h-[30px] flex items-center justify-center p-1 font-semibold">
                        {validationError ? ( 
                            <p className="text-red-500">{validationError}</p> 
                        ) : ( 
                            <p className="text-accent">{getHelpText()}</p> 
                        )}
                    </div>
                </div>
            </div>

            {/* Include GenericControls if needed */}
            {props.includeGenericControls && <GenericControls {...props} />}
        </div>
    );
}




// import { Settings, Waypoints, Network, Plus, Trash2, GitBranch, Anchor, ArrowRight, CornerRightUp } from 'lucide-react';
// import GenericControls from './GenericControls';

// const clsx = (...classes) => classes.filter(Boolean).join(' ');

// export default function GraphControls(props) {
//     const { 
//         options, selectedValue, onSelectChange, selectLabel,
//         editMode, setEditMode, onClearGraph, edgeStartNode,
//         isTree, validationError,
//         isDirected, setIsDirected, disableGraphTypeToggle // New props for the toggle
//     } = props;
    
//     const parameterIcon = isTree ? <Anchor className="text-accent" /> : <Waypoints className="text-accent" />;
//     const parameterTitle = isTree ? "Tree Parameters" : "Parameters";

//     const getHelpText = () => {
//         switch (editMode) {
//             case 'add-node': return "Click on an empty area to add a node.";
//             case 'add-edge': return edgeStartNode ? `Selected Parent '${edgeStartNode}'. Select child node.` : "Select the first node for the edge (parent).";
//             case 'delete-node': return "Click a node to delete it.";
//             default: return "";
//         }
//     };

//     return (
//         <div className="p-6 space-y-6">
//             <div className="flex items-center gap-3"><Settings className="text-accent" /><h2 className="text-2xl font-bold text-text-primary">Controls</h2></div>
//             <GenericControls {...props} />
//             <div>
//                 <div className="flex items-center gap-3 mb-2">{parameterIcon}<h3 className="text-xl font-bold text-text-primary">{parameterTitle}</h3></div>
                
//                 {options && (
//                     <div>
//                         <label htmlFor="start-node-select" className="block text-sm font-medium text-text-secondary mb-1">{selectLabel || "Select Option"}</label>
//                         <select id="start-node-select" value={selectedValue} onChange={onSelectChange} disabled={props.isAnimating || editMode !== 'idle'} className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-accent transition disabled:opacity-50">
//                             {options.length > 0 ? (
//                                 options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))
//                             ) : (<option disabled>No nodes available</option>)}
//                         </select>
//                     </div>
//                 )}
//             </div>
//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3"><Network className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Graph Editor</h3></div>
//                     <button onClick={onClearGraph} disabled={props.isAnimating || editMode !== 'idle'} className="p-2 text-text-secondary hover:text-red-500 transition disabled:opacity-50" title="Clear Graph"><Trash2 size={18} /></button>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 text-sm">
//                     <button onClick={() => setEditMode(editMode === 'add-node' ? 'idle' : 'add-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-node' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Plus size={16} /> Node</button>
//                     <button onClick={() => setEditMode(editMode === 'add-edge' ? 'idle' : 'add-edge')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-edge' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><GitBranch size={16} /> Edge</button>
//                     <button onClick={() => setEditMode(editMode === 'delete-node' ? 'idle' : 'delete-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-red-500/80', editMode === 'delete-node' ? 'bg-red-500 text-white' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Trash2 size={16} /> Delete</button>
//                 </div>
//                 <div className="mt-3 text-center text-xs min-h-[30px] flex items-center justify-center p-1 font-semibold">
//                     {validationError ? (
//                         <p className="text-red-500">{validationError}</p>
//                     ) : (
//                         <p className="text-accent">{getHelpText()}</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


// import React from 'react';
// import { Settings, Waypoints, Network, Plus, Trash2, GitBranch, Anchor } from 'lucide-react';
// import GenericControls from './GenericControls';

// const clsx = (...classes) => classes.filter(Boolean).join(' ');

// export default function GraphControls(props) {
//     const { 
//         options, selectedValue, onSelectChange, selectLabel,
//         editMode, setEditMode, onClearGraph, edgeStartNode,
//         isTree // Destructure the new prop to enable "tree mode"
//     } = props;
    
//     // Conditionally set the icon and title based on the algorithm type
//     const parameterIcon = isTree ? <Anchor className="text-accent" /> : <Waypoints className="text-accent" />;
//     const parameterTitle = isTree ? "Tree Parameters" : "Parameters";

//     return (
//         <div className="p-6 space-y-6">
//             <div className="flex items-center gap-3"><Settings className="text-accent" /><h2 className="text-2xl font-bold text-text-primary">Controls</h2></div>
//             <GenericControls {...props} />
//             <div>
//                 <div className="flex items-center gap-3 mb-2">{parameterIcon}<h3 className="text-xl font-bold text-text-primary">{parameterTitle}</h3></div>
                
//                 {/* This section now works for both graphs and trees without changes */}
//                 {options && (
//                     <div>
//                         <label htmlFor="start-node-select" className="block text-sm font-medium text-text-secondary mb-1">{selectLabel || "Select Option"}</label>
//                         <select 
//                             id="start-node-select" 
//                             value={selectedValue} 
//                             onChange={onSelectChange} 
//                             disabled={props.isAnimating || editMode !== 'idle'} 
//                             className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-accent transition disabled:opacity-50"
//                         >
//                             {options.length > 0 ? (
//                                 options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))
//                             ) : (<option disabled>No nodes available</option>)}
//                         </select>
//                     </div>
//                 )}
//             </div>
//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3"><Network className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Graph Editor</h3></div>
//                     <button onClick={onClearGraph} disabled={props.isAnimating || editMode !== 'idle'} className="p-2 text-text-secondary hover:text-red-500 transition disabled:opacity-50" title="Clear Graph"><Trash2 size={18} /></button>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 text-sm">
//                     <button onClick={() => setEditMode(editMode === 'add-node' ? 'idle' : 'add-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-node' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Plus size={16} /> Node</button>
//                     <button onClick={() => setEditMode(editMode === 'add-edge' ? 'idle' : 'add-edge')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-edge' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><GitBranch size={16} /> Edge</button>
//                     <button onClick={() => setEditMode(editMode === 'delete-node' ? 'idle' : 'delete-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-red-500/80', editMode === 'delete-node' ? 'bg-red-500 text-white' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Trash2 size={16} /> Delete</button>
//                 </div>
//                 <div className="mt-3 text-center text-xs text-accent min-h-[30px] flex items-center justify-center p-1">
//                     {editMode === 'add-node' && <p>Click on an empty area to add a node.</p>}
//                     {editMode === 'add-edge' && !edgeStartNode && <p>Select the first node for the edge (parent).</p>}
//                     {editMode === 'add-edge' && edgeStartNode && <p>Selected Parent '{edgeStartNode}'. Select child node.</p>}
//                     {editMode === 'delete-node' && <p>Click a node to delete it.</p>}
//                 </div>
//             </div>
//         </div>
//     );
// }


// import React from 'react';
// import { Settings, Waypoints, Network, Plus, Trash2, GitBranch } from 'lucide-react';
// import GenericControls from './GenericControls';

// const clsx = (...classes) => classes.filter(Boolean).join(' ');

// export default function GraphControls(props) {
//     const { 
//         options, selectedValue, onSelectChange, selectLabel,
//         editMode, setEditMode, onClearGraph, edgeStartNode,
//     } = props;

//     return (
//         <div className="p-6 space-y-6">
//             <div className="flex items-center gap-3"><Settings className="text-accent" /><h2 className="text-2xl font-bold text-text-primary">Controls</h2></div>
//             <GenericControls {...props} />
//             <div>
//                 <div className="flex items-center gap-3 mb-2"><Waypoints className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Parameters</h3></div>
//                 {options && (
//                     <div>
//                         <label htmlFor="start-node-select" className="block text-sm font-medium text-text-secondary mb-1">{selectLabel || "Select Option"}</label>
//                         <select id="start-node-select" value={selectedValue} onChange={onSelectChange} disabled={props.isAnimating || editMode !== 'idle'} className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-accent transition disabled:opacity-50">
//                             {options.length > 0 ? (
//                                 options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))
//                             ) : (<option disabled>No nodes available</option>)}
//                         </select>
//                     </div>
//                 )}
//             </div>
//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3"><Network className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Graph Editor</h3></div>
//                     <button onClick={onClearGraph} disabled={props.isAnimating || editMode !== 'idle'} className="p-2 text-text-secondary hover:text-red-500 transition disabled:opacity-50" title="Clear Graph"><Trash2 size={18} /></button>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 text-sm">
//                     <button onClick={() => setEditMode(editMode === 'add-node' ? 'idle' : 'add-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-node' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Plus size={16} /> Node</button>
//                     <button onClick={() => setEditMode(editMode === 'add-edge' ? 'idle' : 'add-edge')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-edge' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><GitBranch size={16} /> Edge</button>
//                     <button onClick={() => setEditMode(editMode === 'delete-node' ? 'idle' : 'delete-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-red-500/80', editMode === 'delete-node' ? 'bg-red-500 text-white' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Trash2 size={16} /> Delete</button>
//                 </div>
//                 <div className="mt-3 text-center text-xs text-accent min-h-[30px] flex items-center justify-center p-1">
//                     {editMode === 'add-node' && <p>Click on an empty area to add a node.</p>}
//                     {editMode === 'add-edge' && !edgeStartNode && <p>Select the first node for the edge.</p>}
//                     {editMode === 'add-edge' && edgeStartNode && <p>Selected Node '{edgeStartNode}'. Select the second node.</p>}
//                     {editMode === 'delete-node' && <p>Click a node to delete it.</p>}
//                 </div>
//             </div>
//         </div>
//     );
// }




// import { Play, Pause, RotateCcw, Settings, Waypoints } from 'lucide-react';
// import GenericControls from './GenericControls'; // We'll reuse the common controls

// export default function GraphControls(props) {
//     const { onRun, isAnimating } = props; // Algorithm-specific prop

//     return (
//         <div className="p-6 space-y-6">
//             <div className="flex items-center gap-3">
//                 <Settings className="text-accent" />
//                 <h2 className="text-2xl font-bold text-text-primary">Controls</h2>
//             </div>
            
//             <GenericControls {...props} /> {/* Play, Pause, Reset, Speed */}
            
//             <div>
//                 <div className="flex items-center gap-3 mb-4">
//                     <Waypoints className="text-accent" />
//                     <h3 className="text-xl font-bold text-text-primary">Algorithm</h3>
//                 </div>
//                 <button
//                     onClick={onRun}
//                     disabled={isAnimating}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition disabled:opacity-50"
//                 >
//                     Run Algorithm
//                 </button>
//                 <p className="text-xs text-text-secondary mt-2">
//                     For pathfinding, you would add Start/End node inputs here.
//                 </p>
//             </div>
//         </div>
//     );
// }