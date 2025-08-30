import { useState, useMemo, useCallback, useEffect } from 'react';
import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
import GraphControls from '../../components/visualizers/controls/GraphControls';
import InOrderTraversalExplain from '../../components/algoExplanationPage/InOrderTraversalExplain';

// The default tree structure for initial display
const defaultTree = {
    nodes: [
        { id: 'F', x: 300, y: 50 }, { id: 'B', x: 150, y: 125 }, { id: 'G', x: 450, y: 125 },
        { id: 'A', x: 75, y: 200 }, { id: 'D', x: 225, y: 200 }, { id: 'I', x: 525, y: 200 },
        { id: 'C', x: 187.5, y: 275 }, { id: 'E', x: 262.5, y: 275 }, { id: 'H', x: 487.5, y: 275 },
    ],
    edges: [
        { from: 'F', to: 'B' }, { from: 'F', to: 'G' }, { from: 'B', to: 'A' }, { from: 'B', to: 'D' },
        { from: 'D', to: 'C' }, { from: 'D', to: 'E' }, { from: 'G', to: 'I' }, { from: 'I', to: 'H' },
    ],
    rootId: 'F'
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

// The core algorithm logic to generate visualization steps for In-order Traversal
const getInOrderTraversalSteps = (tree) => {
    const { nodes, edges, rootId } = tree;
    const steps = [];
    if (!rootId || !nodes.find(n => n.id === rootId)) {
        return [{ ...tree, recursionStack: [], visitedNodes: [], currentNodeId: null, info: 'Tree is empty or the root node is not defined.' }];
    }
    const adj = new Map(nodes.map(n => [n.id, { left: null, right: null }]));
    edges.forEach(({ from, to }) => {
        const fromNode = nodes.find(n => n.id === from);
        const toNode = nodes.find(n => n.id === to);
        if (toNode && fromNode && toNode.x < fromNode.x) { adj.get(from).left = to; }
        else if (toNode && fromNode) { adj.get(from).right = to; }
    });
    let visitedNodes = [];
    function traverse(nodeId, stack) {
        if (!nodeId) return;
        const currentStack = [...stack, nodeId];
        steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `At node ${nodeId}. Going left.` });
        traverse(adj.get(nodeId).left, currentStack);
        steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Returned from left. Visiting ${nodeId}.` });
        visitedNodes.push(nodeId);
        steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Order: [${visitedNodes.join(', ')}]` });
        steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `At node ${nodeId}. Going right.` });
        traverse(adj.get(nodeId).right, currentStack);
        steps.push({ ...tree, recursionStack: stack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Finished with ${nodeId}. Backtracking.` });
    }
    steps.push({ ...tree, recursionStack: [], visitedNodes: [], currentNodeId: null, info: `Starting In-order Traversal from root '${rootId}'.` });
    traverse(rootId, []);
    steps.push({ ...tree, recursionStack: [], visitedNodes: [...visitedNodes], currentNodeId: null, info: `Traversal complete! Final order: [${visitedNodes.join(', ')}]` });
    return steps;
};

export default function InOrderTraversalProvider({ children }) {
    const [tree, setTree] = useState(defaultTree);
    const [editMode, setEditMode] = useState('idle');
    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (validationError) {
            const timer = setTimeout(() => setValidationError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [validationError]);

    const steps = useMemo(() => getInOrderTraversalSteps(tree), [tree]);

    const handleSetRoot = (e) => {
        const newRootId = e.target.value;
        const oldRootId = tree.rootId;
        if (newRootId === oldRootId || !oldRootId) {
            setTree(prev => ({...prev, rootId: newRootId}));
            return;
        }
        const newNodes = tree.nodes.map(node => {
            if (node.id === oldRootId) return { ...node, id: newRootId };
            if (node.id === newRootId) return { ...node, id: oldRootId };
            return node;
        });
        const newEdges = tree.edges.map(edge => {
            let { from, to } = edge;
            if (from === oldRootId) from = newRootId;
            else if (from === newRootId) from = oldRootId;
            if (to === oldRootId) to = newRootId;
            else if (to === newRootId) to = oldRootId;
            return { from, to };
        });
        setTree({ nodes: newNodes, edges: newEdges, rootId: newRootId });
    };

    const handleAddEdge = useCallback((nodeId) => {
        if (!edgeStartNode) {
            setEdgeStartNode(nodeId);
            return;
        }
        const parentId = edgeStartNode;
        const childId = nodeId;
        if (parentId === childId) setValidationError("Cannot connect a node to itself.");
        else if (tree.edges.some(e => e.to === childId)) setValidationError(`Node ${childId} already has a parent.`);
        else if (tree.edges.filter(e => e.from === parentId).length >= 2) setValidationError(`Parent ${parentId} already has two children.`);
        else setTree(prev => ({ ...prev, edges: [...prev.edges, { from: parentId, to: childId }] }));
        setEdgeStartNode(null);
        setEditMode('idle');
    }, [edgeStartNode, tree.edges]);

    const handleAddNode = useCallback((coords) => {
        setTree(prev => {
            const newNodeId = generateNodeId(prev.nodes);
            const newNodes = [...prev.nodes, { id: newNodeId, x: coords.x, y: coords.y }];
            const newRootId = prev.nodes.length === 0 ? newNodeId : prev.rootId;
            return { ...prev, nodes: newNodes, rootId: newRootId };
        });
        setEditMode('idle');
    }, []);

    const handleDeleteNode = useCallback((nodeIdToDelete) => {
        setTree(prev => {
            const newNodes = prev.nodes.filter(n => n.id !== nodeIdToDelete);
            const newEdges = prev.edges.filter(e => e.from !== nodeIdToDelete && e.to !== nodeIdToDelete);
            let newRootId = prev.rootId;
            if (prev.rootId === nodeIdToDelete) {
                newRootId = newNodes.length > 0 ? newNodes[0].id : '';
            }
            return { nodes: newNodes, edges: newEdges, rootId: newRootId };
        });
        setEditMode('idle');
    }, []);

    const handleClearGraph = () => setTree({ nodes: [], edges: [], rootId: '' });

    const handleNodeInteraction = useCallback((nodeId) => {
        if (editMode === 'add-edge') handleAddEdge(nodeId);
        else if (editMode === 'delete-node') handleDeleteNode(nodeId);
    }, [editMode, handleAddEdge, handleDeleteNode]);
    
    const getTreeNodeState = useCallback((nodeId, step) => {
        if (!step) return 'fill-gray-500';
        if (nodeId === step.rootId) return 'fill-yellow-500';
        if (step.visitedNodes?.includes(nodeId)) return 'fill-accent';
        if (step.recursionStack?.includes(nodeId)) return 'fill-purple-500';
        return 'fill-gray-500';
    }, []);

    const getTreeEdgeState = useCallback((edge, step) => {
        if (!step) return 'stroke-gray-600';
        const inStack = step.recursionStack || [];
        if (inStack.includes(edge.from) && inStack.includes(edge.to)) return 'stroke-purple-400';
        return 'stroke-gray-600';
    }, []);

    const canvasProps = { 
        getGraphNodeState: getTreeNodeState, 
        getGraphEdgeState: getTreeEdgeState, 
        onCanvasClick: handleAddNode, 
        onNodeClick: handleNodeInteraction, 
        editMode, 
        edgeStartNode,
        isDirected: true // Tree is always directed
    };
    
    const controlProps = { 
        options: tree.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), 
        selectedValue: tree.rootId, 
        onSelectChange: handleSetRoot, 
        selectLabel: "Root Node", 
        editMode, 
        setEditMode, 
        onClearGraph: handleClearGraph, 
        edgeStartNode, 
        isTree: true,
        validationError,
        disableGraphTypeToggle: true // Hide the toggle for this algorithm
    };

    return children({ steps, ExplanationComponent: InOrderTraversalExplain, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
}





// import { useState, useMemo, useCallback, useEffect } from 'react';
// import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
// import GraphControls from '../../components/visualizers/controls/GraphControls';
// import InOrderTraversalExplain from '../../components/algoExplanationPage/InOrderTraversalExplain';

// const defaultTree = {
//     nodes: [
//         { id: 'F', x: 300, y: 50 }, { id: 'B', x: 150, y: 125 }, { id: 'G', x: 450, y: 125 },
//         { id: 'A', x: 75, y: 200 }, { id: 'D', x: 225, y: 200 }, { id: 'I', x: 525, y: 200 },
//         { id: 'C', x: 187.5, y: 275 }, { id: 'E', x: 262.5, y: 275 }, { id: 'H', x: 487.5, y: 275 },
//     ],
//     edges: [
//         { from: 'F', to: 'B' }, { from: 'F', to: 'G' }, { from: 'B', to: 'A' }, { from: 'B', to: 'D' },
//         { from: 'D', to: 'C' }, { from: 'D', to: 'E' }, { from: 'G', to: 'I' }, { from: 'I', to: 'H' },
//     ],
//     rootId: 'F'
// };

// const generateNodeId = (existingNodes) => {
//     const existingIds = new Set(existingNodes.map(n => n.id));
//     for (let i = 65; i <= 90; i++) {
//         const char = String.fromCharCode(i);
//         if (!existingIds.has(char)) return char;
//     }
//     let i = 1;
//     while (existingIds.has(`N${i}`)) { i++; }
//     return `N${i}`;
// };

// const getInOrderTraversalSteps = (tree) => {
//     const { nodes, edges, rootId } = tree;
//     const steps = [];
//     if (!rootId || !nodes.find(n => n.id === rootId)) {
//         return [{ ...tree, recursionStack: [], visitedNodes: [], currentNodeId: null, info: 'Tree is empty or the root node is not defined.' }];
//     }
//     const adj = new Map(nodes.map(n => [n.id, { left: null, right: null }]));
//     edges.forEach(({ from, to }) => {
//         const fromNode = nodes.find(n => n.id === from);
//         const toNode = nodes.find(n => n.id === to);
//         if (toNode && fromNode && toNode.x < fromNode.x) { adj.get(from).left = to; }
//         else if (toNode && fromNode) { adj.get(from).right = to; }
//     });
//     let visitedNodes = [];
//     function traverse(nodeId, stack) {
//         if (!nodeId) return;
//         const currentStack = [...stack, nodeId];
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `At node ${nodeId}. Going left.` });
//         traverse(adj.get(nodeId).left, currentStack);
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Returned from left. Visiting ${nodeId}.` });
//         visitedNodes.push(nodeId);
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Order: [${visitedNodes.join(', ')}]` });
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `At node ${nodeId}. Going right.` });
//         traverse(adj.get(nodeId).right, currentStack);
//         steps.push({ ...tree, recursionStack: stack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Finished with ${nodeId}. Backtracking.` });
//     }
//     steps.push({ ...tree, recursionStack: [], visitedNodes: [], currentNodeId: null, info: `Starting In-order Traversal from root '${rootId}'.` });
//     traverse(rootId, []);
//     steps.push({ ...tree, recursionStack: [], visitedNodes: [...visitedNodes], currentNodeId: null, info: `Traversal complete! Final order: [${visitedNodes.join(', ')}]` });
//     return steps;
// };

// export default function InOrderTraversalProvider({ children }) {
//     const [tree, setTree] = useState(defaultTree);
//     const [editMode, setEditMode] = useState('idle');
//     const [edgeStartNode, setEdgeStartNode] = useState(null);
//     const [validationError, setValidationError] = useState('');

//     useEffect(() => {
//         if (validationError) {
//             const timer = setTimeout(() => setValidationError(''), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [validationError]);

//     const steps = useMemo(() => getInOrderTraversalSteps(tree), [tree]);

//     const handleSetRoot = (e) => {
//         const newRootId = e.target.value;
//         const oldRootId = tree.rootId;
//         if (newRootId === oldRootId || !oldRootId) {
//             setTree(prev => ({...prev, rootId: newRootId}));
//             return;
//         }
//         const newNodes = tree.nodes.map(node => {
//             if (node.id === oldRootId) return { ...node, id: newRootId };
//             if (node.id === newRootId) return { ...node, id: oldRootId };
//             return node;
//         });
//         const newEdges = tree.edges.map(edge => {
//             let { from, to } = edge;
//             if (from === oldRootId) from = newRootId;
//             else if (from === newRootId) from = oldRootId;
//             if (to === oldRootId) to = newRootId;
//             else if (to === newRootId) to = oldRootId;
//             return { from, to };
//         });
//         setTree({ nodes: newNodes, edges: newEdges, rootId: newRootId });
//     };

//     const handleAddEdge = useCallback((nodeId) => {
//         if (!edgeStartNode) {
//             setEdgeStartNode(nodeId);
//             return;
//         }
//         const parentId = edgeStartNode;
//         const childId = nodeId;
//         if (parentId === childId) setValidationError("Cannot connect a node to itself.");
//         else if (tree.edges.some(e => e.to === childId)) setValidationError(`Node ${childId} already has a parent.`);
//         else if (tree.edges.filter(e => e.from === parentId).length >= 2) setValidationError(`Parent ${parentId} already has two children.`);
//         else setTree(prev => ({ ...prev, edges: [...prev.edges, { from: parentId, to: childId }] }));
//         setEdgeStartNode(null);
//         setEditMode('idle');
//     }, [edgeStartNode, tree.edges]);

//     const handleAddNode = useCallback((coords) => {
//         setTree(prev => {
//             const newNodeId = generateNodeId(prev.nodes);
//             const newNodes = [...prev.nodes, { id: newNodeId, x: coords.x, y: coords.y }];
//             const newRootId = prev.nodes.length === 0 ? newNodeId : prev.rootId;
//             return { ...prev, nodes: newNodes, rootId: newRootId };
//         });
//         setEditMode('idle');
//     }, []);

//     const handleDeleteNode = useCallback((nodeIdToDelete) => {
//         setTree(prev => {
//             const newNodes = prev.nodes.filter(n => n.id !== nodeIdToDelete);
//             const newEdges = prev.edges.filter(e => e.from !== nodeIdToDelete && e.to !== nodeIdToDelete);
//             let newRootId = prev.rootId;
//             if (prev.rootId === nodeIdToDelete) {
//                 newRootId = newNodes.length > 0 ? newNodes[0].id : '';
//             }
//             return { nodes: newNodes, edges: newEdges, rootId: newRootId };
//         });
//         setEditMode('idle');
//     }, []);

//     const handleClearGraph = () => setTree({ nodes: [], edges: [], rootId: '' });
//     const handleNodeInteraction = useCallback((nodeId) => {
//         if (editMode === 'add-edge') handleAddEdge(nodeId);
//         else if (editMode === 'delete-node') handleDeleteNode(nodeId);
//     }, [editMode, handleAddEdge, handleDeleteNode]);
    
//     const getTreeNodeState = useCallback((nodeId, step) => {
//         if (!step) return 'fill-gray-500';
//         if (nodeId === step.rootId) return 'fill-blue-500';
//         if (step.visitedNodes?.includes(nodeId)) return 'fill-accent';
//         if (step.recursionStack?.includes(nodeId)) return 'fill-purple-500';
//         return 'fill-gray-500';
//     }, []);

//     const getTreeEdgeState = useCallback((edge, step) => {
//         if (!step) return 'stroke-gray-600';
//         const inStack = step.recursionStack || [];
//         if (inStack.includes(edge.from) && inStack.includes(edge.to)) return 'stroke-purple-400';
//         return 'stroke-gray-600';
//     }, []);

//     const canvasProps = { getGraphNodeState: getTreeNodeState, getGraphEdgeState: getTreeEdgeState, onCanvasClick: handleAddNode, onNodeClick: handleNodeInteraction, editMode, edgeStartNode };
//     const controlProps = { options: tree.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), selectedValue: tree.rootId, onSelectChange: handleSetRoot, selectLabel: "Root Node", editMode, setEditMode, onClearGraph: handleClearGraph, edgeStartNode, isTree: true, validationError };

//     return children({ steps, ExplanationComponent: InOrderTraversalExplain, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
// }



// import { useState, useMemo, useCallback, useEffect } from 'react';
// import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
// import GraphControls from '../../components/visualizers/controls/GraphControls';
// import InOrderTraversalExplain from '../../components/algoExplanationPage/InOrderTraversalExplain';

// const defaultTree = {
//     nodes: [
//         { id: 'F', x: 300, y: 50 }, { id: 'B', x: 150, y: 125 }, { id: 'G', x: 450, y: 125 },
//         { id: 'A', x: 75, y: 200 }, { id: 'D', x: 225, y: 200 }, { id: 'I', x: 525, y: 200 },
//         { id: 'C', x: 187.5, y: 275 }, { id: 'E', x: 262.5, y: 275 }, { id: 'H', x: 487.5, y: 275 },
//     ],
//     edges: [
//         { from: 'F', to: 'B' }, { from: 'F', to: 'G' }, { from: 'B', to: 'A' }, { from: 'B', to: 'D' },
//         { from: 'D', to: 'C' }, { from: 'D', to: 'E' }, { from: 'G', to: 'I' }, { from: 'I', to: 'H' },
//     ],
//     rootId: 'F'
// };

// const generateNodeId = (existingNodes) => {
//     const existingIds = new Set(existingNodes.map(n => n.id));
//     for (let i = 65; i <= 90; i++) {
//         const char = String.fromCharCode(i);
//         if (!existingIds.has(char)) return char;
//     }
//     let i = 1;
//     while (existingIds.has(`N${i}`)) { i++; }
//     return `N${i}`;
// };

// const getInOrderTraversalSteps = (tree) => {
//     const { nodes, edges, rootId } = tree;
//     const steps = [];
//     if (!rootId || !nodes.find(n => n.id === rootId)) {
//         return [{ ...tree, recursionStack: [], visitedNodes: [], currentNodeId: null, info: 'Tree is empty or the root node is not defined.' }];
//     }
//     const adj = new Map(nodes.map(n => [n.id, { left: null, right: null }]));
//     edges.forEach(({ from, to }) => {
//         const fromNode = nodes.find(n => n.id === from);
//         const toNode = nodes.find(n => n.id === to);
//         if (toNode && fromNode && toNode.x < fromNode.x) { adj.get(from).left = to; }
//         else if (toNode && fromNode) { adj.get(from).right = to; }
//     });
//     let visitedNodes = [];
//     function traverse(nodeId, stack) {
//         if (!nodeId) return;
//         const currentStack = [...stack, nodeId];
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `At node ${nodeId}. Going left.` });
//         traverse(adj.get(nodeId).left, currentStack);
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Returned from left. Visiting ${nodeId}.` });
//         visitedNodes.push(nodeId);
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Order: [${visitedNodes.join(', ')}]` });
//         steps.push({ ...tree, recursionStack: currentStack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `At node ${nodeId}. Going right.` });
//         traverse(adj.get(nodeId).right, currentStack);
//         steps.push({ ...tree, recursionStack: stack, visitedNodes: [...visitedNodes], currentNodeId: nodeId, info: `Finished with ${nodeId}. Backtracking.` });
//     }
//     steps.push({ ...tree, recursionStack: [], visitedNodes: [], currentNodeId: null, info: `Starting In-order Traversal from root '${rootId}'.` });
//     traverse(rootId, []);
//     steps.push({ ...tree, recursionStack: [], visitedNodes: [...visitedNodes], currentNodeId: null, info: `Traversal complete! Final order: [${visitedNodes.join(', ')}]` });
//     return steps;
// };

// export default function InOrderTraversalProvider({ children }) {
//     const [tree, setTree] = useState(defaultTree);
//     const [editMode, setEditMode] = useState('idle');
//     const [edgeStartNode, setEdgeStartNode] = useState(null);
//     const [validationError, setValidationError] = useState('');

//     useEffect(() => {
//         if (validationError) {
//             const timer = setTimeout(() => setValidationError(''), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [validationError]);

//     const steps = useMemo(() => getInOrderTraversalSteps(tree), [tree]);

//     const handleSetRoot = (e) => {
//         const newRootId = e.target.value;
//         const oldRootId = tree.rootId;
//         if (newRootId === oldRootId || !oldRootId) {
//             setTree(prev => ({...prev, rootId: newRootId}));
//             return;
//         }
//         const newNodes = tree.nodes.map(node => {
//             if (node.id === oldRootId) return { ...node, id: newRootId };
//             if (node.id === newRootId) return { ...node, id: oldRootId };
//             return node;
//         });
//         const newEdges = tree.edges.map(edge => {
//             let { from, to } = edge;
//             if (from === oldRootId) from = newRootId;
//             else if (from === newRootId) from = oldRootId;
//             if (to === oldRootId) to = newRootId;
//             else if (to === newRootId) to = oldRootId;
//             return { from, to };
//         });
//         setTree({ nodes: newNodes, edges: newEdges, rootId: newRootId });
//     };

//     const handleAddEdge = useCallback((nodeId) => {
//         if (!edgeStartNode) {
//             setEdgeStartNode(nodeId);
//             return;
//         }
//         const parentId = edgeStartNode;
//         const childId = nodeId;
//         if (parentId === childId) setValidationError("Cannot connect a node to itself.");
//         else if (tree.edges.some(e => e.to === childId)) setValidationError(`Node ${childId} already has a parent.`);
//         else if (tree.edges.filter(e => e.from === parentId).length >= 2) setValidationError(`Parent ${parentId} already has two children.`);
//         else setTree(prev => ({ ...prev, edges: [...prev.edges, { from: parentId, to: childId }] }));
//         setEdgeStartNode(null);
//         setEditMode('idle');
//     }, [edgeStartNode, tree.edges]);

//     const handleAddNode = useCallback((coords) => {
//         setTree(prev => {
//             const newNodeId = generateNodeId(prev.nodes);
//             const newNodes = [...prev.nodes, { id: newNodeId, x: coords.x, y: coords.y }];
//             const newRootId = prev.nodes.length === 0 ? newNodeId : prev.rootId;
//             return { ...prev, nodes: newNodes, rootId: newRootId };
//         });
//         setEditMode('idle');
//     }, []);

//     const handleDeleteNode = useCallback((nodeIdToDelete) => {
//         setTree(prev => {
//             const newNodes = prev.nodes.filter(n => n.id !== nodeIdToDelete);
//             const newEdges = prev.edges.filter(e => e.from !== nodeIdToDelete && e.to !== nodeIdToDelete);
//             let newRootId = prev.rootId;
//             if (prev.rootId === nodeIdToDelete) {
//                 newRootId = newNodes.length > 0 ? newNodes[0].id : '';
//             }
//             return { nodes: newNodes, edges: newEdges, rootId: newRootId };
//         });
//         setEditMode('idle');
//     }, []);

//     const handleClearGraph = () => setTree({ nodes: [], edges: [], rootId: '' });
//     const handleNodeInteraction = useCallback((nodeId) => {
//         if (editMode === 'add-edge') handleAddEdge(nodeId);
//         else if (editMode === 'delete-node') handleDeleteNode(nodeId);
//     }, [editMode, handleAddEdge, handleDeleteNode]);
    
//     const getTreeNodeState = useCallback((nodeId, step) => {
//         if (!step) return 'fill-gray-500';
//         if (nodeId === step.rootId) return 'fill-blue-500';
//         if (step.visitedNodes?.includes(nodeId)) return 'fill-accent';
//         if (step.recursionStack?.includes(nodeId)) return 'fill-purple-500';
//         return 'fill-gray-500';
//     }, []);

//     const getTreeEdgeState = useCallback((edge, step) => {
//         if (!step) return 'stroke-gray-600';
//         const inStack = step.recursionStack || [];
//         if (inStack.includes(edge.from) && inStack.includes(edge.to)) return 'stroke-purple-400';
//         return 'stroke-gray-600';
//     }, []);

//     const canvasProps = { getGraphNodeState: getTreeNodeState, getGraphEdgeState: getTreeEdgeState, onCanvasClick: handleAddNode, onNodeClick: handleNodeInteraction, editMode, edgeStartNode };
//     const controlProps = { options: tree.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), selectedValue: tree.rootId, onSelectChange: handleSetRoot, selectLabel: "Root Node", editMode, setEditMode, onClearGraph: handleClearGraph, edgeStartNode, isTree: true, validationError };

//     return children({ steps, ExplanationComponent: InOrderTraversalExplain, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
// }