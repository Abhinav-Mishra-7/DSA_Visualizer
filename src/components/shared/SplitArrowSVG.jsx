// SplitArrowSVG.jsx

import React from 'react';

// Generates a single, continuous path to prevent rendering artifacts.
const createArrowPath = (start, end, headSize = 10, headAngle = Math.PI / 7) => {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const x1 = end.x - headSize * Math.cos(angle - headAngle);
    const y1 = end.y - headSize * Math.sin(angle - headAngle);
    const x2 = end.x - headSize * Math.cos(angle + headAngle);
    const y2 = end.y - headSize * Math.sin(angle + headAngle);
    return `M ${start.x} ${start.y} L ${end.x} ${end.y} L ${x1} ${y1} M ${end.x} ${end.y} L ${x2} ${y2}`;
};


const SplitArrowSVG = ({
    arrows = [
        { start: { x: 80, y: 15 }, end: { x: 30, y: 65 } },
        { start: { x: 100, y: 15 }, end: { x: 120, y: 65 } }
    ]
}) => {
    const pathData = arrows.map(arrow => createArrowPath(arrow.start, arrow.end));

    return (
        // Expanded viewBox prevents the glow from being clipped.
        <svg viewBox="0 -10 150 95" className="w-full h-full" preserveAspectRatio="xMidYMin meet">
            <defs>
                {/* A filter that includes both a shadow and a light glow. */}
                {/* It reads its colors directly from your index.css file. */}
                <filter id="glass-glow-and-shadow" x="-70%" y="-70%" width="240%" height="240%">
                    <feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="var(--glass-liquid-shadow)" floodOpacity="0.6" result="shadow" />
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="var(--glass-liquid-highlight)" floodOpacity="0.8" result="glow" />
                    <feMerge>
                        <feMergeNode in="shadow" />
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                
                {/* Gradient for the bright outer rim to make it "pop". */}
                <linearGradient id="glass-rim-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
                    <stop offset="40%" stopColor="rgba(200, 200, 220, 0.5)" />
                    <stop offset="100%" stopColor="rgba(150, 150, 180, 0.4)" />
                </linearGradient>

                {/* GRADIENT FOR THE MAIN BORDER (The "Glass Tube") */}
                {/* This uses your theme variables from index.css */}
                <linearGradient id="glass-border-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--glass-liquid-border-light)" />
                    <stop offset="100%" stopColor="var(--glass-liquid-border-dark)" />
                </linearGradient>

                {/* GRADIENT FOR THE FILL (The "Liquid Core") */}
                {/* This also uses your theme variables from index.css */}
                <linearGradient id="glass-fill-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--glass-liquid-bg)" />
                    <stop offset="30%" stopColor="var(--glass-liquid-highlight)" />
                    <stop offset="55%" stopColor="var(--glass-liquid-trail)" />
                    <stop offset="100%" stopColor="var(--glass-liquid-bg)" />
                </linearGradient>
            </defs>

            <g filter="url(#glass-glow-and-shadow)">
                {pathData.map((d, index) => (
                    <g key={index}>
                        {/* === LAYER 1: The Outer Rim / Glint === */}
                        <path
                            d={d}
                            fill="none"
                            stroke="url(#glass-rim-gradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        
                        {/* === LAYER 2: The Main Glass Tube === */}
                        <path
                            d={d}
                            fill="none"
                            stroke="url(#glass-border-gradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        
                        {/* === LAYER 3: The Liquid Core / Fill === */}
                        <path
                            d={d}
                            fill="none"
                            stroke="url(#glass-fill-gradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                ))}
            </g>
        </svg>
    );
};

export default SplitArrowSVG;