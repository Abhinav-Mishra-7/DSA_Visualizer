import { useState, useMemo, useCallback } from 'react';
import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
import GraphControls from '../../components/visualizers/controls/GraphControls';
import DijkstraExplanation from '../../components/algoExplanationPage/DijkstraExplain';

const defaultGraph = {
    nodes: [ 
        { id: 'A', x: 150, y: 100 }, { id: 'B', x: 350, y: 100 }, { id: 'C', x: 250, y: 200 }, 
        { id: 'D', x: 100, y: 250 }, { id: 'E', x: 400, y: 250 }, { id: 'F', x: 250, y: 300 }
    ],
    edges: [ 
        { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 2 }, { from: 'B', to: 'E', weight: 3 },
        { from: 'C', to: 'D', weight: 3 }, { from: 'C', to: 'F', weight: 4 }, { from: 'D', to: 'F', weight: 1 },
        { from: 'E', to: 'F', weight: 2 }
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

// Priority Queue implementation
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element, priority) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }
    
    dequeue() {
        return this.items.shift();
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    contains(element) {
        return this.items.some(item => item.element === element);
    }
    
    decreaseKey(element, newPriority) {
        const item = this.items.find(item => item.element === element);
        if (item && item.priority > newPriority) {
            item.priority = newPriority;
            this.items.sort((a, b) => a.priority - b.priority);
        }
    }
    
    toArray() {
        return this.items.map(item => item.element);
    }
}

// Dijkstra's algorithm implementation
const getDijkstraSteps = (graph, startNodeId, isDirected) => {
    const steps = [];
    const adj = new Map(graph.nodes.map(n => [n.id, []]));

    // Build adjacency list with weights
    graph.edges.forEach(({ from, to, weight }) => { 
        adj.get(from)?.push({ node: to, weight: weight || 1 }); 
        if (!isDirected) { 
            adj.get(to)?.push({ node: from, weight: weight || 1 }); 
        }
    });

    if (!startNodeId || !adj.has(startNodeId)) {
        return [{ ...graph, priorityQueue: [], distances: {}, visited: [], current: null, activeEdge: null, relaxingEdges: [], info: 'Please select a valid start node.' }];
    }
    
    const distances = {};
    const visited = new Set();
    const pq = new PriorityQueue();
    const relaxedEdges = new Set();
    
    // Initialize distances
    graph.nodes.forEach(node => {
        distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    });
    
    pq.enqueue(startNodeId, 0);
    
    steps.push({ 
        ...graph, 
        priorityQueue: pq.toArray(), 
        distances: {...distances}, 
        visited: [], 
        current: null, 
        activeEdge: null, 
        relaxingEdges: [], 
        info: `Initialize distances. Start node ${startNodeId} has distance 0, others have infinity.` 
    });

    while (!pq.isEmpty()) {
        const { element: current, priority: currentDist } = pq.dequeue();
        
        if (visited.has(current)) continue;
        
        visited.add(current);
        
        steps.push({ 
            ...graph, 
            priorityQueue: pq.toArray(), 
            distances: {...distances}, 
            visited: Array.from(visited), 
            current, 
            activeEdge: null, 
            relaxingEdges: [], 
            info: `Extract ${current} with distance ${currentDist}. Mark as visited.` 
        });

        const neighbors = adj.get(current) || [];
        const relaxingEdges = [];
        
        for (const { node: neighbor, weight } of neighbors) {
            if (!visited.has(neighbor)) {
                const newDist = currentDist + weight;
                const edgeId = isDirected ? `${current}-${neighbor}` : [current, neighbor].sort().join('-');
                
                if (newDist < distances[neighbor]) {
                    relaxingEdges.push(edgeId);
                    
                    steps.push({ 
                        ...graph, 
                        priorityQueue: pq.toArray(), 
                        distances: {...distances}, 
                        visited: Array.from(visited), 
                        current, 
                        activeEdge: edgeId, 
                        relaxingEdges: [], 
                        info: `Relax edge ${current}→${neighbor}. New distance: ${distances[neighbor]} → ${newDist}` 
                    });
                    
                    distances[neighbor] = newDist;
                    
                    if (pq.contains(neighbor)) {
                        pq.decreaseKey(neighbor, newDist);
                    } else {
                        pq.enqueue(neighbor, newDist);
                    }
                    
                    relaxedEdges.add(edgeId);
                } else {
                    steps.push({ 
                        ...graph, 
                        priorityQueue: pq.toArray(), 
                        distances: {...distances}, 
                        visited: Array.from(visited), 
                        current, 
                        activeEdge: edgeId, 
                        relaxingEdges: [], 
                        info: `Check edge ${current}→${neighbor}. Distance ${newDist} ≥ ${distances[neighbor]}, no improvement.` 
                    });
                }
            }
        }
        
        steps.push({ 
            ...graph, 
            priorityQueue: pq.toArray(), 
            distances: {...distances}, 
            visited: Array.from(visited), 
            current, 
            activeEdge: null, 
            relaxingEdges: Array.from(relaxedEdges), 
            info: `Finished processing ${current}. Updated priority queue.` 
        });
    }
    
    steps.push({ 
        ...graph, 
        priorityQueue: [], 
        distances: {...distances}, 
        visited: Array.from(visited), 
        current: null, 
        activeEdge: null, 
        relaxingEdges: Array.from(relaxedEdges), 
        info: 'Algorithm complete. All shortest distances found.' 
    });
    
    return steps;
};

export default function DijkstraProvider({ children }) {
    const [graph, setGraph] = useState(defaultGraph);
    const [startNode, setStartNode] = useState('A');
    const [editMode, setEditMode] = useState('idle');
    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [isDirected, setIsDirected] = useState(true);

    const steps = useMemo(() => getDijkstraSteps(graph, startNode, isDirected), [graph, startNode, isDirected]);

    const handleSetStartNode = (e) => {
        const newStartNodeId = e.target.value;
        const oldStartNodeId = startNode;

        if (newStartNodeId === oldStartNodeId || !oldStartNodeId) {
            setStartNode(newStartNodeId);
            return;
        }

        // Swap node IDs while keeping positions
        const newNodes = graph.nodes.map(node => {
            if (node.id === oldStartNodeId) return { ...node, id: newStartNodeId };
            if (node.id === newStartNodeId) return { ...node, id: oldStartNodeId };
            return node;
        });

        const newEdges = graph.edges.map(edge => {
            let { from, to } = edge;
            if (from === oldStartNodeId) from = newStartNodeId;
            else if (from === newStartNodeId) from = oldStartNodeId;
            
            if (to === oldStartNodeId) to = newStartNodeId;
            else if (to === newStartNodeId) to = oldStartNodeId;
            
            return { ...edge, from, to };
        });
        
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
            const weight = parseInt(prompt('Enter edge weight (default 1):') || '1', 10);
            setGraph(prev => {
                const edgeExists = prev.edges.some(e => 
                    (e.from === edgeStartNode && e.to === nodeId) || 
                    (!isDirected && (e.from === nodeId && e.to === edgeStartNode))
                );
                if (nodeId !== edgeStartNode && !edgeExists) {
                    return { ...prev, edges: [...prev.edges, { from: edgeStartNode, to: nodeId, weight }] };
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
        if (step.priorityQueue?.includes(nodeId)) return 'fill-purple-500';
        if (step.visited?.includes(nodeId)) return 'fill-accent';
        return 'fill-gray-500';
    }, [startNode]);

    const getGraphEdgeState = useCallback((edge, step) => {
        if (!step) return 'stroke-gray-600';
        const edgeId = isDirected ? `${edge.from}-${edge.to}` : [edge.from, edge.to].sort().join('-');
        if (step.activeEdge === edgeId) return 'stroke-yellow-400';
        if (step.relaxingEdges?.includes(edgeId)) return 'stroke-green-500';
        return 'stroke-gray-600';
    }, [isDirected]);
    
    const canvasProps = { 
        getGraphNodeState, 
        getGraphEdgeState, 
        onCanvasClick: handleAddNode, 
        onNodeClick: handleNodeInteraction, 
        editMode, 
        edgeStartNode, 
        isDirected,
        showWeights: true // Show edge weights for Dijkstra
    };
    
    const controlProps = { 
        options: graph.nodes.map(node => ({ value: node.id, label: `Node ${node.id}` })), 
        selectedValue: startNode, 
        onSelectChange: handleSetStartNode, 
        selectLabel: "Start Node", 
        editMode, 
        setEditMode, 
        onClearGraph: handleClearGraph, 
        edgeStartNode, 
        isDirected, 
        setIsDirected 
    };

    return children({ steps, ExplanationComponent: DijkstraExplanation, CanvasComponent: GraphCanvas, ControlsComponent: GraphControls, canvasProps, controlProps });
}
