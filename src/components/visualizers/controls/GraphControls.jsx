import React from 'react';
import { Settings, Waypoints, Network, Plus, Trash2, GitBranch, Anchor, ArrowRight, CornerRightUp } from 'lucide-react';
import GenericControls from './GenericControls';

const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default function GraphControls(props) {
    const { 
        options, selectedValue, onSelectChange, selectLabel,
        editMode, setEditMode, onClearGraph, edgeStartNode,
        isTree, validationError,
        isDirected, setIsDirected, disableGraphTypeToggle
    } = props;
    
    const parameterIcon = isTree ? <Anchor className="text-accent" /> : <Waypoints className="text-accent" />;
    const parameterTitle = isTree ? "Tree Parameters" : "Parameters";

    const getHelpText = () => {
        switch (editMode) {
            case 'add-node': return "Click on an empty area to add a node.";
            case 'add-edge': return edgeStartNode ? `Selected Parent '${edgeStartNode}'. Select child node.` : "Select the first node for the edge (parent).";
            case 'delete-node': return "Click a node to delete it.";
            default: return "";
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3"><Settings className="text-accent" /><h2 className="text-2xl font-bold text-text-primary">Controls</h2></div>
            <GenericControls {...props} />
            
            {!disableGraphTypeToggle && (
                 <div>
                    <div className="flex items-center gap-3 mb-2"><CornerRightUp className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Graph Type</h3></div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <button onClick={() => setIsDirected(true)} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', isDirected ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><ArrowRight size={16} /> Directed</button>
                        <button onClick={() => setIsDirected(false)} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', !isDirected ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}>Undirected</button>
                    </div>
                </div>
            )}
            
            <div>
                <div className="flex items-center gap-3 mb-2">{parameterIcon}<h3 className="text-xl font-bold text-text-primary">{parameterTitle}</h3></div>
                {options && ( 
                    <div>
                        <label htmlFor="start-node-select" className="block text-sm font-medium text-text-secondary mb-1">{selectLabel || "Select Option"}</label>
                        <select id="start-node-select" value={selectedValue} onChange={onSelectChange} disabled={props.isAnimating || editMode !== 'idle'} className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-accent transition disabled:opacity-50">
                            {options.length > 0 ? (
                                options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))
                            ) : (<option disabled>No nodes available</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><Network className="text-accent" /><h3 className="text-xl font-bold text-text-primary">Graph Editor</h3></div>
                    <button onClick={onClearGraph} disabled={props.isAnimating || editMode !== 'idle'} className="p-2 text-text-secondary hover:text-red-500 transition disabled:opacity-50" title="Clear Graph"><Trash2 size={18} /></button>
                </div>
                {/* --- THIS SECTION IS NOW RESTORED --- */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <button onClick={() => setEditMode(editMode === 'add-node' ? 'idle' : 'add-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-node' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Plus size={16} /> Node</button>
                    <button onClick={() => setEditMode(editMode === 'add-edge' ? 'idle' : 'add-edge')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition', editMode === 'add-edge' ? 'bg-accent text-accent-foreground' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><GitBranch size={16} /> Edge</button>
                    <button onClick={() => setEditMode(editMode === 'delete-node' ? 'idle' : 'delete-node')} className={clsx('p-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-red-500/80', editMode === 'delete-node' ? 'bg-red-500 text-white' : 'bg-card-light hover:bg-background')} disabled={props.isAnimating}><Trash2 size={16} /> Delete</button>
                </div>
                <div className="mt-3 text-center text-xs min-h-[30px] flex items-center justify-center p-1 font-semibold">
                    {validationError ? ( <p className="text-red-500">{validationError}</p> ) : ( <p className="text-accent">{getHelpText()}</p> )}
                </div>
            </div>
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