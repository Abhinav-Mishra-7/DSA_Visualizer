import { useState, useMemo, useCallback } from 'react';
import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
import GraphControls from '../../components/visualizers/controls/GraphControls';
import DFSExplanation from '../../components/algoExplanationPage/DFSExplain';

const defaultGraph = {
    nodes: [ 
        { id: 'A', x: 300, y: 50 }, { id: 'B', x: 150, y: 150 }, { id: 'C', x: 300, y: 150 }, { id: 'D', x: 450, y: 150 },
        { id: 'E', x: 100, y: 250 }, { id: 'F', x: 200, y: 250 },
        { id: 'G', x: 400, y: 250 },
        { id: 'H', x: 250, y: 350 },
    ],
    edges: [ 
        { from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'A', to: 'D' },
        { from: 'B', to: 'E' }, { from: 'B', to: 'F' },
        { from: 'D', to: 'G' },
        { from: 'F', to: 'H' },
    ]
};

const generateNodeId = (existingNodes) => {
    const existingIds = new Set(existingNodes.map(n => n.id));
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        if (!existingIds.has(char)) return char;
    }
    let i = 1;
    while (existingIds.has(`N${i}`)) {
        i++;
    }
    return `N${i}`;
};

const getDFSSteps = (graph, startNodeId, isDirected) => {
    const steps = [];
    const adj = new Map(graph.nodes.map(n => [n.id, []]));

    graph.edges.forEach(({ from, to }) => { 
        adj.get(from)?.push(to); 
        if (!isDirected) {
            adj.get(to)?.push(from); 
        }
    });

    if (!startNodeId || !adj.has(startNodeId)) {
        return [{ ...graph, stack: [], visitedNodes: [], visitedEdges: [], current: null, activeEdge: null, info: 'Please select a valid start node.' }];
    }

    const stack = [startNodeId];
    const visitedNodes = new Set();
    const visitedEdges = new Set();

    steps.push({ ...graph, stack: [...stack], visitedNodes: [], visitedEdges: [], current: startNodeId, activeEdge: null, info: `Start traversal at node ${startNodeId}. Push it onto the stack.` });

    while (stack.length > 0) {
        const current = stack.pop();

        if (visitedNodes.has(current)) {
            steps.push({ ...graph, stack: [...stack], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, info: `Node ${current} already visited, skipping.` });
            continue;
        }

        visitedNodes.add(current);
        steps.push({ ...graph, stack: [...stack], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, info: `Pop node ${current} and process it.` });
        
        const neighbors = (adj.get(current) || []);
        let neighborsPushed = false;
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            if (!visitedNodes.has(neighbor)) {
                const edgeId = isDirected ? `${current}-${neighbor}` : [current, neighbor].sort().join('-');
                visitedEdges.add(edgeId);
                stack.push(neighbor);
                steps.push({ ...graph, stack: [...stack], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: edgeId, info: `Visit neighbor ${neighbor}. Push it onto the stack.` });
                neighborsPushed = true;
            }
        }
        
        if (!neighborsPushed) {
            steps.push({ ...graph, stack: [...stack], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current, activeEdge: null, info: `Node ${current} has no unvisited neighbors. Backtracking.` });
        }
    }

    steps.push({ ...graph, stack: [], visitedNodes: Array.from(visitedNodes), visitedEdges: Array.from(visitedEdges), current: null, activeEdge: null, info: 'Traversal complete. Stack is empty.' });
    return steps;
};

export default function DFSProvider({ children }) {
    const [graph, setGraph] = useState(defaultGraph);
    const [startNode, setStartNode] = useState('A');
    const [editMode, setEditMode] = useState('idle');
    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [isDirected, setIsDirected] = useState(true);

    const steps = useMemo(() => getDFSSteps(graph, startNode, isDirected), [graph, startNode, isDirected]);

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
            if (prev.nodes.length === 0) setStartNode(newNodeId);
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
        if (!step) return 'fill-gray-500';
        if (nodeId === startNode) return 'fill-yellow-500';
        if (step.current === nodeId) return 'fill-yellow-400';
        if (step.stack?.includes(nodeId)) return 'fill-purple-500';
        if (step.visitedNodes?.includes(nodeId)) return 'fill-accent';
        return 'fill-gray-500';
    }, [startNode]);

    const getGraphEdgeState = useCallback((edge, step) => {
        if (!step) return 'stroke-gray-600';
        const edgeId = isDirected ? `${edge.from}-${edge.to}` : [edge.from, edge.to].sort().join('-');
        if (step.activeEdge === edgeId) return 'stroke-yellow-400';
        if (step.visitedEdges?.includes(edgeId)) return 'stroke-accent';
        return 'stroke-gray-600';
    }, [isDirected]);
    
    const canvasProps = { getGraphNodeState, getGraphEdgeState, onCanvasClick: handleAddNode, onNodeClick: handleNodeInteraction, editMode, edgeStartNode, isDirected };
    const controlProps = { options: graph.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), selectedValue: startNode, onSelectChange: handleSetStartNode, selectLabel: "Start Node", editMode, setEditMode, onClearGraph: handleClearGraph, edgeStartNode, isDirected, setIsDirected };

    return children({ steps, ExplanationComponent: DFSExplanation, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
}