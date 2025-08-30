import { useState, useMemo, useCallback } from 'react';
import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
import GraphControls from '../../components/visualizers/controls/GraphControls';
import BFSExplanation from '../../components/algoExplanationPage/BFSExplain';

const defaultGraph = {
    nodes: [ 
        { id: 'A', x: 300, y: 50 }, { id: 'B', x: 150, y: 150 }, { id: 'C', x: 300, y: 150 }, { id: 'D', x: 450, y: 150 },
        { id: 'E', x: 100, y: 250 }, { id: 'F', x: 200, y: 250 }, { id: 'G', x: 400, y: 250 }, { id: 'H', x: 250, y: 350 },
    ],
    edges: [ 
        { from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'C', to: 'D' }, { from: 'B', to: 'E' },
        { from: 'B', to: 'F' }, { from: 'D', to: 'G' }, { from: 'F', to: 'H' },
    ]
};

// Helper function to generate unique IDs for new nodes
const generateNodeId = (existingNodes) => {
    const existingIds = new Set(existingNodes.map(n => n.id));
    for (let i = 65; i <= 90; i++) { // A-Z
        const char = String.fromCharCode(i);
        if (!existingIds.has(char)) return char;
    }
    let i = 1;
    while (existingIds.has(`N${i}`)) { i++; }
    return `N${i}`;
};

// The core algorithm logic, sensitive to the isDirected flag
const getBFSSteps = (graph, startNodeId, isDirected) => {
    const steps = [];
    const adj = new Map(graph.nodes.map(n => [n.id, []]));

    graph.edges.forEach(({ from, to }) => { 
        adj.get(from)?.push(to); 
        if (!isDirected) { 
            adj.get(to)?.push(from); 
        }
    });

    if (!startNodeId || !adj.has(startNodeId)) {
        return [{ ...graph, queue: [], visitedNodes: [], visitedEdges: [], current: null, activeEdge: null, potentialEdges: [], info: 'Please select a valid start node.' }];
    }
    
    const queue = [startNodeId];
    const visitedNodes = new Set([startNodeId]);
    const visitedEdges = new Set();
    
    steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: [], current: startNodeId, activeEdge: null, potentialEdges: [], info: `Start traversal at node ${startNodeId}.` });

    while (queue.length > 0) {
        const current = queue.shift();
        steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, potentialEdges: [], info: `Dequeue node ${current}. Find neighbors.` });
        
        const unvisitedNeighbors = (adj.get(current) || []).filter(n => !visitedNodes.has(n));
        
        if (unvisitedNeighbors.length > 0) {
            const potentialEdges = unvisitedNeighbors.map(n => isDirected ? `${current}-${n}` : [current, n].sort().join('-'));
            steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, potentialEdges, info: `Highlighting paths from node ${current}.` });
        }

        for (const neighbor of unvisitedNeighbors) {
            visitedNodes.add(neighbor);
            const edgeId = isDirected ? `${current}-${neighbor}` : [current, neighbor].sort().join('-');
            steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: edgeId, potentialEdges: [], info: `Traversing from ${current} to ${neighbor}.` });
            queue.push(neighbor);
            visitedEdges.add(edgeId);
            steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current: neighbor, activeEdge: edgeId, potentialEdges: [], info: `Enqueued node ${neighbor}.` });
        }
    }
    steps.push({ ...graph, queue: [], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current: null, activeEdge: null, potentialEdges: [], info: 'Traversal complete.' });
    return steps;
};

export default function BFSProvider({ children }) {
    const [graph, setGraph] = useState(defaultGraph);
    const [startNode, setStartNode] = useState('A');
    const [editMode, setEditMode] = useState('idle');
    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [isDirected, setIsDirected] = useState(true);

    const steps = useMemo(() => getBFSSteps(graph, startNode, isDirected), [graph, startNode, isDirected]);

    const handleSetStartNode = (e) => {
        const newStartNodeId = e.target.value;
        const oldStartNodeId = startNode;

        if (newStartNodeId === oldStartNodeId || !oldStartNodeId) {
            setStartNode(newStartNodeId);
            return;
        }

        // 1. Swap the IDs in the nodes array, keeping coordinates and other properties fixed.
        const newNodes = graph.nodes.map(node => {
            if (node.id === oldStartNodeId) return { ...node, id: newStartNodeId };
            if (node.id === newStartNodeId) return { ...node, id: oldStartNodeId };
            return node;
        });

        // 2. Update the edges array to reflect the new node IDs.
        //    This makes the connections "stick" to the positions.
        const newEdges = graph.edges.map(edge => {
            let { from, to } = edge;
            if (from === oldStartNodeId) from = newStartNodeId;
            else if (from === newStartNodeId) from = oldStartNodeId;
            
            if (to === oldStartNodeId) to = newStartNodeId;
            else if (to === newStartNodeId) to = oldStartNodeId;
            
            return { from, to };
        });
        
        // 3. Update the graph structure and the startNode state.
        setGraph({ nodes: newNodes, edges: newEdges });
        setStartNode(newStartNodeId);
    };

    const handleAddNode = useCallback((coords) => {
        setGraph(prev => {
            const newNodeId = generateNodeId(prev.nodes);
            const newGraph = { ...prev, nodes: [...prev.nodes, { id: newNodeId, x: coords.x, y: coords.y }]};
            if (prev.nodes.length === 0) {
                setStartNode(newNodeId);
            }
            return newGraph;
        });
        setEditMode('idle');
    }, []);

    const handleAddEdge = useCallback((nodeId) => {
        if (!edgeStartNode) {
            setEdgeStartNode(nodeId);
        } else {
            setGraph(prev => {
                const edgeExists = prev.edges.some(e => 
                    (e.from === edgeStartNode && e.to === nodeId) || 
                    (!isDirected && (e.from === nodeId && e.to === edgeStartNode))
                );
                if (nodeId !== edgeStartNode && !edgeExists) {
                    return { ...prev, edges: [...prev.edges, { from: edgeStartNode, to: nodeId }] };
                }
                return prev;
            });
            setEdgeStartNode(null);
            setEditMode('idle');
        }
    }, [edgeStartNode, isDirected]);

    const handleDeleteNode = useCallback((nodeIdToDelete) => {
        setGraph(prev => {
            const newNodes = prev.nodes.filter(n => n.id !== nodeIdToDelete);
            const newEdges = prev.edges.filter(e => e.from !== nodeIdToDelete && e.to !== nodeIdToDelete);
            setStartNode(prevStart => {
                if (prevStart === nodeIdToDelete) {
                    return newNodes.length > 0 ? newNodes[0].id : '';
                }
                return prevStart;
            });
            return { nodes: newNodes, edges: newEdges };
        });
        setEditMode('idle');
    }, []);

    const handleNodeInteraction = useCallback((nodeId) => {
        if (editMode === 'add-edge') handleAddEdge(nodeId);
        else if (editMode === 'delete-node') handleDeleteNode(nodeId);
    }, [editMode, handleAddEdge, handleDeleteNode]);

    const handleClearGraph = () => {
        setGraph({ nodes: [], edges: [] });
        setStartNode('');
    };
    
    const getGraphNodeState = useCallback((nodeId, step) => {
        if (!step) return 'fill-blue-500';
        if (nodeId === startNode) return 'fill-yellow-500';
        if (step.current === nodeId) return 'fill-yellow-400';
        if (step.queue?.includes(nodeId)) return 'fill-purple-500';
        if (step.visitedNodes?.includes(nodeId)) return 'fill-accent';
        return 'fill-gray-500';
    }, [startNode]);

    const getGraphEdgeState = useCallback((edge, step) => {
        if (!step) return 'stroke-gray-600';
        const edgeId = isDirected ? `${edge.from}-${edge.to}` : [edge.from, edge.to].sort().join('-');
        if (step.activeEdge === edgeId) return 'stroke-yellow-400';
        if (step.potentialEdges?.includes(edgeId)) return 'stroke-purple-500';
        if (step.visitedEdges?.includes(edgeId)) return 'stroke-accent';
        return 'stroke-gray-600';
    }, [isDirected]);
    
    const canvasProps = { getGraphNodeState, getGraphEdgeState, onCanvasClick: handleAddNode, onNodeClick: handleNodeInteraction, editMode, edgeStartNode, isDirected };
    const controlProps = { options: graph.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), selectedValue: startNode, onSelectChange: handleSetStartNode, selectLabel: "Start Node", editMode, setEditMode, onClearGraph: handleClearGraph, edgeStartNode, isDirected, setIsDirected };

    return children({ steps, ExplanationComponent: BFSExplanation, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
}


// import { useState, useMemo, useCallback } from 'react';
// import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
// import GraphControls from '../../components/visualizers/controls/GraphControls';
// // --- CORRECT IMPORT ---
// // This file IMPORTS the explanation component from its separate file.
// import BFSExplanation from '../../components/algoExplanationPage/BFSExplain';

// // --- A better default graph for a more interesting initial visualization ---
// const defaultGraph = {
//     nodes: [ 
//         { id: 'A', x: 300, y: 50 }, 
//         { id: 'B', x: 150, y: 150 }, { id: 'C', x: 300, y: 150 }, { id: 'D', x: 450, y: 150 },
//         { id: 'E', x: 100, y: 250 }, { id: 'F', x: 200, y: 250 },
//         { id: 'G', x: 400, y: 250 },
//         { id: 'H', x: 250, y: 350 },
//     ],
//     edges: [ 
//         { from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'A', to: 'D' },
//         { from: 'B', to: 'E' }, { from: 'B', to: 'F' },
//         { from: 'D', to: 'G' },
//         { from: 'F', to: 'H' },
//     ]
// };

// // --- Helper function to generate unique IDs for new nodes ---
// const generateNodeId = (existingNodes) => {
//     const existingIds = new Set(existingNodes.map(n => n.id));
//     for (let i = 65; i <= 90; i++) {
//         const char = String.fromCharCode(i);
//         if (!existingIds.has(char)) return char;
//     }
//     let i = 1;
//     while (existingIds.has(`N${i}`)) {
//         i++;
//     }
//     return `N${i}`;
// };

// // --- Algorithm logic to generate visualization steps ---
// const getBFSSteps = (graph, startNodeId) => {
//     const steps = [];
//     const adj = new Map(graph.nodes.map(n => [n.id, []]));
//     graph.edges.forEach(({ from, to }) => { 
//         adj.get(from)?.push(to); 
//         adj.get(to)?.push(from); 
//     });

//     if (!startNodeId || !adj.has(startNodeId)) {
//         return [{ ...graph, queue: [], visitedNodes: [], visitedEdges: [], current: null, activeEdge: null, potentialEdges: [], info: 'Please select a valid start node or add nodes to the graph.' }];
//     }

//     const queue = [startNodeId];
//     const visitedNodes = new Set([startNodeId]);
//     const visitedEdges = new Set();
    
//     steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: [], current: startNodeId, activeEdge: null, potentialEdges: [], info: `Start traversal at node ${startNodeId}.` });

//     while (queue.length > 0) {
//         const current = queue.shift();
//         steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, potentialEdges: [], info: `Dequeue node ${current}. Find unvisited neighbors.` });
//         const unvisitedNeighbors = (adj.get(current) || []).filter(n => !visitedNodes.has(n));
//         if (unvisitedNeighbors.length > 0) {
//             const potentialEdges = unvisitedNeighbors.map(n => [current, n].sort().join('-'));
//             steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, potentialEdges, info: `Highlighting potential paths from node ${current}.` });
//         }
//         for (const neighbor of unvisitedNeighbors) {
//             visitedNodes.add(neighbor);
//             const edgeId = [current, neighbor].sort().join('-');
//             steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: edgeId, potentialEdges: [], info: `Traversing from ${current} to ${neighbor}.` });
//             queue.push(neighbor);
//             visitedEdges.add(edgeId);
//             steps.push({ ...graph, queue: [...queue], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current: neighbor, activeEdge: edgeId, potentialEdges: [], info: `Enqueued node ${neighbor}.` });
//         }
//     }
//     steps.push({ ...graph, queue: [], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current: null, activeEdge: null, potentialEdges: [], info: 'Traversal complete.' });
//     return steps;
// };

// // --- This is the PROVIDER component. Its only job is to manage logic and call children(). ---
// export default function BFSProvider({ children }) {
//     const [graph, setGraph] = useState(defaultGraph);
//     const [startNode, setStartNode] = useState('A');
//     const [editMode, setEditMode] = useState('idle');
//     const [edgeStartNode, setEdgeStartNode] = useState(null);

//     const steps = useMemo(() => getBFSSteps(graph, startNode), [graph, startNode]);

//     const handleAddNode = useCallback((coords) => {
//         setGraph(prev => {
//             const newNodeId = generateNodeId(prev.nodes);
//             const newGraph = { ...prev, nodes: [...prev.nodes, { id: newNodeId, x: coords.x, y: coords.y }]};
//             if (prev.nodes.length === 0) setStartNode(newNodeId);
//             return newGraph;
//         });
//         setEditMode('idle');
//     }, []);

//     const handleAddEdge = useCallback((nodeId) => {
//         if (!edgeStartNode) {
//             setEdgeStartNode(nodeId);
//         } else {
//             setGraph(prev => {
//                 const edgeExists = prev.edges.some(e => (e.from === edgeStartNode && e.to === nodeId) || (e.from === nodeId && e.to === edgeStartNode));
//                 if (nodeId !== edgeStartNode && !edgeExists) {
//                     return { ...prev, edges: [...prev.edges, { from: edgeStartNode, to: nodeId }] };
//                 }
//                 return prev;
//             });
//             setEdgeStartNode(null);
//             setEditMode('idle');
//         }
//     }, [edgeStartNode]);

//     const handleDeleteNode = useCallback((nodeIdToDelete) => {
//         setGraph(prev => {
//             const newNodes = prev.nodes.filter(n => n.id !== nodeIdToDelete);
//             const newEdges = prev.edges.filter(e => e.from !== nodeIdToDelete && e.to !== nodeIdToDelete);
//             setStartNode(prevStartNode => {
//                 if (prevStartNode === nodeIdToDelete) {
//                     return newNodes.length > 0 ? newNodes[0].id : '';
//                 }
//                 return prevStartNode;
//             });
//             return { nodes: newNodes, edges: newEdges };
//         });
//         setEditMode('idle');
//     }, []);

//     const handleNodeInteraction = useCallback((nodeId) => {
//         if (editMode === 'add-edge') handleAddEdge(nodeId);
//         else if (editMode === 'delete-node') handleDeleteNode(nodeId);
//     }, [editMode, handleAddEdge, handleDeleteNode]);

//     const handleClearGraph = () => {
//         setGraph({ nodes: [], edges: [] });
//         setStartNode('');
//     };
    
//     const getGraphNodeState = useCallback((nodeId, step) => {
//         if (!step) return 'fill-gray-500';
//         if (step.info.startsWith('Start traversal') && nodeId === startNode) return 'fill-blue-500';
//         if (step.current === nodeId) return 'fill-yellow-400';
//         if (step.queue?.includes(nodeId)) return 'fill-purple-500';
//         if (step.visitedNodes?.includes(nodeId)) return 'fill-accent';
//         return 'fill-gray-500';
//     }, [startNode]);

//     const getGraphEdgeState = useCallback((edge, step) => {
//         if (!step) return 'stroke-gray-600';
//         const edgeId = [edge.from, edge.to].sort().join('-');
//         if (step.activeEdge === edgeId) return 'stroke-yellow-400';
//         if (step.potentialEdges?.includes(edgeId)) return 'stroke-purple-500';
//         if (step.visitedEdges?.includes(edgeId)) return 'stroke-accent';
//         return 'stroke-gray-600';
//     }, []);
    
//     const canvasProps = { getGraphNodeState, getGraphEdgeState, onCanvasClick: handleAddNode, onNodeClick: handleNodeInteraction, editMode, edgeStartNode };
//     const controlProps = { options: graph.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), selectedValue: startNode, onSelectChange: (e) => setStartNode(e.target.value), selectLabel: "Start Node", editMode, setEditMode, onClearGraph: handleClearGraph, edgeStartNode };

//     return children({ steps, ExplanationComponent: BFSExplanation, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
// }

// import { useState, useMemo, useCallback } from 'react';

// // --- Import the generic UI components this provider will use ---
// import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
// import GraphControls from '../../components/visualizers/controls/GraphControls';
// import BFSExplanation from '../../components/algoExplanationPage/BFSExplain'; // We'll assume this exists

// // ====================================================================================
// // 1. GRAPH DATA & ALGORITHM LOGIC
// // ====================================================================================

// // A sample graph structure. You can replace this with any graph.
// const sampleGraph = {
//     nodes: [
//         { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' },
//         { id: 'E' }, { id: 'F' }, { id: 'G' }
//     ],
//     edges: [
//         { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
//         { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
//         { from: 'C', to: 'F' }, { from: 'E', to: 'G' }
//     ]
// };

// /**
//  * Executes the BFS algorithm and returns an array of step-by-step states for visualization.
//  * @param {object} graph - The graph object with nodes and edges.
//  * @param {string} startNodeId - The ID of the starting node.
//  * @returns {object[]} An array of step objects.
//  */
// const getBFSSteps = (graph, startNodeId) => {
//     const steps = [];
//     const adj = new Map(graph.nodes.map(n => [n.id, []]));
//     graph.edges.forEach(({ from, to }) => {
//         adj.get(from).push(to);
//         adj.get(to).push(from); // For an undirected graph
//     });

//     const queue = [startNodeId];
//     const visited = new Set([startNodeId]);

//     // Initial state
//     steps.push({ ...graph, queue: [...queue], visited: Array.from(visited), current: null, info: `Start traversal at node ${startNodeId}. Add it to the queue.` });

//     while (queue.length > 0) {
//         const current = queue.shift();
        
//         // Dequeue step
//         steps.push({ ...graph, queue: [...queue], visited: Array.from(visited), current, info: `Dequeue node ${current} and process its neighbors.` });

//         const neighbors = adj.get(current) || [];
//         for (const neighbor of neighbors) {
//             if (!visited.has(neighbor)) {
//                 visited.add(neighbor);
//                 queue.push(neighbor);
//                 // Enqueue step
//                 steps.push({ ...graph, queue: [...queue], visited: Array.from(visited), current, info: `Visit neighbor ${neighbor} and add it to the queue.` });
//             }
//         }
//     }
    
//     steps.push({ ...graph, queue: [], visited: Array.from(visited), current: null, info: 'Traversal complete. Queue is empty.' });
//     return steps;
// };


// // ====================================================================================
// // 2. MAIN PROVIDER COMPONENT
// // ====================================================================================

// export default function BFSProvider({ children }) {
//     // State for the graph data and the starting node
//     const [graph] = useState(sampleGraph);
//     const [startNode, setStartNode] = useState('A');

//     // Memoize the animation steps to avoid recalculating on every render
//     const steps = useMemo(() => getBFSSteps(graph, startNode), [graph, startNode]);

//     // This function provides the logic to the GraphCanvas for coloring the nodes
//     const getGraphNodeState = useCallback((nodeId, step) => {
//         if (!step) return 'fill-gray-500'; // Default color

//         if (step.current === nodeId) return 'fill-yellow-400'; // Node being processed
//         if (step.queue?.includes(nodeId)) return 'fill-purple-500'; // Node in the queue
//         if (step.visited?.includes(nodeId)) return 'fill-accent'; // Node has been visited
        
//         return 'fill-gray-500'; // Default for unvisited nodes
//     }, []);

//     // Provide all necessary components and props to the main layout
//     return children({
//         steps,
//         ExplanationComponent: () => <BFSExplanation />, // You would create this component
//         CanvasComponent: GraphCanvas,
//         ControlsComponent: GraphControls,
//         canvasProps: { 
//             getGraphNodeState 
//         },
//         controlProps: { 
//             startNode,
//             setStartNode,
//             nodes: graph.nodes,
//         },
//     });
// }