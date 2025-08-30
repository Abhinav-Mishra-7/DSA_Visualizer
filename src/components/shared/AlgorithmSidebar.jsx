// src/components/shared/AlgorithmSidebar.jsx

import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router'; // Correct import for react-router v6+
import { Search, Code2, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { allAlgorithms } from '../../data/algorithms';
import usePersistentState from '../../hooks/usePersistentState';
import clsx from 'clsx';

const allCategories = ['All', ...new Set(allAlgorithms.map(algo => algo.category))];

export default function AlgorithmSidebar() {
    const { slug: activeSlug } = useParams();

    // --- State for self-contained sidebar: open/close, width, and resizing ---
    const [isOpen, setIsOpen] = usePersistentState('sidebarOpen', true);
    const [width, setWidth] = usePersistentState('sidebarWidth', 288);
    const [isResizing, setIsResizing] = useState(false);
    const minWidth = 240;
    const maxWidth = 500;

    // --- State for internal UI: search, filters, accordion, and hover effects ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [openCategory, setOpenCategory] = useState(null);
    const [hoveredSlug, setHoveredSlug] = useState(null);

    // --- Effect to handle accordion opening on navigation ---
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // On initial load, find the category of the active algorithm and open it.
            const currentAlgorithm = allAlgorithms.find(a => a.slug === activeSlug);
            if (currentAlgorithm) {
                setOpenCategory(currentAlgorithm.category);
            }
            return;
        }
        // On subsequent navigation, also open the correct category.
        const currentAlgorithm = allAlgorithms.find(a => a.slug === activeSlug);
        if (currentAlgorithm) {
            setOpenCategory(currentAlgorithm.category);
        }
    }, [activeSlug]);

    // --- Resizing Logic ---
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            requestAnimationFrame(() => {
                let newWidth = e.clientX;
                if (newWidth < minWidth) newWidth = minWidth;
                if (newWidth > maxWidth) newWidth = maxWidth;
                setWidth(newWidth);
            });
        };
        const handleMouseUp = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, setWidth]);

    // --- Filtering and Search Logic ---
    const isSearching = searchQuery.trim().length > 0;

    const groupedAlgorithms = useMemo(() => {
        if (isSearching) return {}; // No need to compute if we are searching
        return allAlgorithms
            .filter(algo => activeFilter === 'All' || algo.category === activeFilter)
            .reduce((acc, algo) => {
                (acc[algo.category] = acc[algo.category] || []).push(algo);
                return acc;
            }, {});
    }, [activeFilter, isSearching]);

    const searchResults = useMemo(() => {
        if (!isSearching) return [];
        const lowercasedQuery = searchQuery.toLowerCase();
        return allAlgorithms.filter(algo =>
            algo.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, isSearching]);

    // --- Handler for single-open accordion behavior ---
    const toggleCategory = (category) => {
        setOpenCategory(prev => (prev === category ? null : category));
    };

    // --- Reusable Link component for consistent styling ---
    const AlgorithmLink = ({ algo }) => {
        const isHighlighted = activeSlug === algo.slug || hoveredSlug === algo.slug;
        return (
            <Link
                to={`/visualizers/${algo.slug}`}
                key={algo.slug}
                onMouseEnter={() => setHoveredSlug(algo.slug)}
                className="relative group flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium"
            >
                <div className={clsx(
                    'absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-accent rounded-r-full transition-all duration-200',
                    { 'opacity-100 scale-y-100': isHighlighted, 'opacity-0 scale-y-0': !isHighlighted }
                )}></div>
                <span className={clsx(
                    'transition-all duration-200',
                    {
                        'text-accent font-semibold translate-x-3': isHighlighted,
                        'text-text-secondary group-hover:text-text-primary': !isHighlighted
                    }
                )}>
                    {algo.name}
                </span>
            </Link>
        );
    };

    return (
        <aside
            className="relative flex-shrink-0 bg-card border-r border-border transition-all duration-300 ease-in-out"
            style={{ width: isOpen ? `${width}px` : '0px' }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-background transition-all duration-300"
                style={{ left: isOpen ? `${width}px` : '0px', transform: 'translateX(-50%)' }}
                title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
                {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            
            <div className={`h-full overflow-hidden transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col h-full bg-card p-4">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <Code2 className="text-accent" />
                        <h2 className="text-lg font-bold text-text-primary">Algorithms</h2>
                    </div>
                    <div className="relative mb-4">
                        <input type="text" placeholder="Search Algorithms" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-1 focus:ring-accent transition outline-none" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    </div>
                    
                    {/* Hide filters when searching for a cleaner UI */}
                    <div className={`mb-4 flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide ${isSearching ? 'hidden' : ''}`}>
                        <div className="flex flex-nowrap gap-2">
                            {allCategories.map(category => (
                                <button key={category} onClick={() => setActiveFilter(category)} className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${activeFilter === category ? 'bg-accent text-accent-foreground shadow-md' : 'bg-card text-text-secondary border border-border hover:border-accent/50 hover:bg-accent/10 hover:text-accent'}`}>
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <hr className="border-border my-2"/>

                    <nav className="flex-grow overflow-y-auto space-y-1 -mr-4 pr-4" onMouseLeave={() => setHoveredSlug(null)}>
                        {isSearching ? (
                            <div className="space-y-1">
                                {searchResults.length > 0 ? (
                                    searchResults.map(algo => <AlgorithmLink key={algo.slug} algo={algo} />)
                                ) : (
                                    <div className="px-3 py-2 text-sm text-text-secondary">No algorithms found.</div>
                                )}
                            </div>
                        ) : (
                            Object.entries(groupedAlgorithms).map(([category, algos]) => (
                                <div key={category}>
                                    <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between text-left px-2 py-2 rounded-md transition-colors hover:bg-background">
                                        <span className="font-semibold text-sm text-text-primary">{category}</span>
                                        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${openCategory === category ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`pl-3 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openCategory === category ? 'max-h-screen' : 'max-h-0'}`}>
                                        {algos.map(algo => <AlgorithmLink key={algo.slug} algo={algo} />)}
                                    </div>
                                </div>
                            ))
                        )}
                    </nav>
                </div>
            </div>

            {isOpen && (
                <div
                    onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize hover:bg-accent/20 transition-colors"
                    title="Resize sidebar"
                />
            )}
        </aside>
    );
}


// import { useState, useMemo, useEffect } from 'react';
// import { Link } from 'react-router';
// import { Search, Code2, ChevronDown } from 'lucide-react';
// import { allAlgorithms } from '../../data/algorithms.js';

// const allCategories = ['All', ...new Set(allAlgorithms.map(algo => algo.category))];

// export default function AlgorithmSidebar({ activeSlug }) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState('All');

//   const [openCategory, setOpenCategory] = useState(null);
//   const [highlightedSlug, setHighlightedSlug] = useState(activeSlug);

//   useEffect(() => {
//     setHighlightedSlug(activeSlug);
//   }, [activeSlug]);
  
//   const isSearching = searchQuery.length > 0;

//   const groupedAlgorithms = useMemo(() => {
//     return allAlgorithms
//       .filter(algo => activeFilter === 'All' || algo.category === activeFilter)
//       .reduce((acc, algo) => {
//         (acc[algo.category] = acc[algo.category] || []).push(algo);
//         return acc;
//       }, {});
//   }, [activeFilter]);

//   const searchResults = useMemo(() => {
//     if (!isSearching) return [];
//     return allAlgorithms.filter(algo => algo.name.toLowerCase().includes(searchQuery.toLowerCase()));
//   }, [searchQuery, isSearching]);

//   useEffect(() => {
//     if (isSearching && searchResults.length > 0) {
//       setHighlightedSlug(searchResults[0].slug);
//     } else if (!isSearching) {
//       setHighlightedSlug(activeSlug);
//     }
//   }, [searchResults, isSearching, activeSlug]);

//   // --- REWRITTEN: toggleCategory function for single-open behavior ---
//   const toggleCategory = (category) => {
//     // If the clicked category is already open, close it (set to null).
//     // Otherwise, open the clicked category.
//     const newOpenCategory = openCategory === category ? null : category;
//     setOpenCategory(newOpenCategory);

//     // If we just opened a new category, highlight its first item.
//     if (newOpenCategory) {
//         const firstAlgoInCat = groupedAlgorithms[newOpenCategory]?.[0];
//         if (firstAlgoInCat) {
//             setHighlightedSlug(firstAlgoInCat.slug);
//         }
//     }
//   };
  
//   return (
//     <div className="flex flex-col h-full bg-card p-4">
//       <div className="flex items-center gap-3 mb-4 px-2">
//         <Code2 className="text-accent" />
//         <h2 className="text-lg font-bold text-text-primary">Algorithms</h2>
//       </div>
//       <div className="relative mb-4">
//         <input type="text" placeholder="Search Algorithms" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-1 focus:ring-accent transition outline-none" />
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
//       </div>
//       <div className="mb-4 flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
//         <div className="flex flex-nowrap gap-2">
//           {allCategories.map(category => (
//             <button key={category} onClick={() => setActiveFilter(category)} className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${ activeFilter === category ? 'bg-accent text-accent-foreground shadow-md' : 'bg-card text-text-secondary border border-border hover:border-accent/50 hover:bg-accent/10 hover:text-accent' }`} >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>
//       <hr className="border-border my-2"/>

//       <nav 
//         className="flex-grow overflow-y-auto space-y-1 -mr-4 pr-4"
//         onMouseLeave={() => setHighlightedSlug(activeSlug)}
//       >
//         {isSearching ? (
//           // --- SEARCH VIEW (no changes needed here) ---
//           <div>
//             <h3 className="px-2 py-2 font-semibold text-sm text-text-secondary">Search Results</h3>
//             {searchResults.length > 0 ? (
//                 searchResults.map(algo => (
//                     <Link to={`/visualizers/${algo.slug}`} key={algo.slug}
//                       onMouseEnter={() => setHighlightedSlug(algo.slug)}
//                       className={`relative group flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-text-primary hover:bg-background hover:translate-x-1 ${
//                         highlightedSlug === algo.slug ? 'text-accent font-semibold' : 'text-text-secondary'
//                       }`}
//                     >
//                       {highlightedSlug === algo.slug && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-accent rounded-r-full"></div>}
//                       {algo.name}
//                     </Link>
//                 ))
//             ) : <p className="text-center text-text-secondary text-sm p-4">No algorithms found.</p> }
//           </div>
//         ) : (
//           // --- CATEGORY ACCORDION VIEW ---
//           Object.entries(groupedAlgorithms).map(([category, algos]) => (
//             <div key={category}>
//               <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between text-left px-2 py-2 rounded-md transition-colors hover:bg-background" >
//                 <span className="font-semibold text-sm text-text-primary">{category}</span>
//                 {/* UPDATED: Check for open state */}
//                 <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${openCategory === category ? 'rotate-180' : ''}`} />
//               </button>
//               {/* UPDATED: Check for open state */}
//               <div className={`pl-3 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openCategory === category ? 'max-h-96' : 'max-h-0'}`}>
//                 {algos.map(algo => (
//                   <Link to={`/visualizers/${algo.slug}`} key={algo.slug}
//                     onMouseEnter={() => setHighlightedSlug(algo.slug)}
//                     className={`relative group flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-text-primary hover:bg-background hover:translate-x-1 ${
//                       highlightedSlug === algo.slug ? 'text-accent font-semibold' : 'text-text-secondary'
//                     }`}
//                   >
//                     {highlightedSlug === algo.slug && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-accent rounded-r-full"></div>}
//                     {algo.name}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           ))
//         )}
//       </nav>
//     </div>
//   );
// }