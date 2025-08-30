import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import GenericControls from './GenericControls';

// A simpler controls panel for non-editable visualizations
export default function TreeControls(props) {
    const { onReset } = props;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3"><Settings className="text-accent" /><h2 className="text-2xl font-bold text-text-primary">Controls</h2></div>
            
            {/* Renders the play/pause, slider, and speed controls */}
            <GenericControls {...props} />

            {/* Algorithm-specific controls */}
            <div className="pt-6 border-t border-border">
                 <button 
                    onClick={onReset} 
                    disabled={props.isAnimating}
                    className="w-full p-2 bg-card-light hover:bg-background rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                    <RefreshCw size={16} /> Reset Tree
                </button>
            </div>
        </div>
    );
}