import { useState, useMemo, useCallback, useEffect } from 'react';
import GraphCanvas from '../../components/visualizers/canvases/GraphCanvas';
import GraphControls from '../../components/visualizers/controls/GraphControls';
import KruskalExplanation from '../../components/algoExplanationPage/KruskalExplain';
import KruskalAnnotation from '../../components/visualizers/step_annotations/graph_annotations/KruskalAnnotations';

// Default graph with weights
const defaultGraph = {
  nodes: [
    { id: 'A', x: 150, y: 80 },
    { id: 'B', x: 350, y: 80 },
    { id: 'C', x: 250, y: 180 },
    { id: 'D', x: 100, y: 280 },
    { id: 'E', x: 400, y: 280 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 5 },
    { from: 'B', to: 'E', weight: 3 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'C', to: 'E', weight: 6 },
    { from: 'D', to: 'E', weight: 1 },
  ]
};

// Disjoint Set (Union-Find)
class DSU {
  constructor(nodes) {
    this.parent = {};
    nodes.forEach(n => this.parent[n.id] = n.id);
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra !== rb) this.parent[rb] = ra;
  }
}

const getKruskalSteps = (graph) => {
  const steps = [];
  const edges = [...graph.edges].sort((a,b) => a.weight - b.weight);
  const dsu = new DSU(graph.nodes);
  const mstEdges = [];

  // STEP 0: initial state
  steps.push({
    ...graph,
    sortedEdges: edges.map(e=>`${e.from}-${e.to}(${e.weight})`),
    dsuParents: { ...dsu.parent },
    mst: [],
    currentEdge: null,
    info: 'Sorted edges by weight; DSU initialized.',
  });

  for (const e of edges) {
    const { from: u, to: v, weight } = e;
    steps.push({
      ...graph,
      sortedEdges: edges.map(ed=>`${ed.from}-${ed.to}(${ed.weight})`),
      dsuParents: { ...dsu.parent },
      mst: [...mstEdges],
      currentEdge: `${u}-${v}(${weight})`,
      info: `Consider edge ${u}–${v} (weight ${weight}).`,
    });

    if (dsu.find(u) !== dsu.find(v)) {
      dsu.union(u, v);
      mstEdges.push(e);
      steps.push({
        ...graph,
        sortedEdges: edges.map(ed=>`${ed.from}-${ed.to}(${ed.weight})`),
        dsuParents: { ...dsu.parent },
        mst: [...mstEdges],
        currentEdge: `${u}-${v}(${weight})`,
        info: `Edge ${u}–${v} added to MST.`,
      });
    } else {
      steps.push({
        ...graph,
        sortedEdges: edges.map(ed=>`${ed.from}-${ed.to}(${ed.weight})`),
        dsuParents: { ...dsu.parent },
        mst: [...mstEdges],
        currentEdge: `${u}-${v}(${weight})`,
        info: `Edge ${u}–${v} would form cycle. Skipped.`,
      });
    }
  }

  steps.push({
    ...graph,
    sortedEdges: edges.map(e=>`${e.from}-${e.to}(${e.weight})`),
    dsuParents: { ...dsu.parent },
    mst: [...mstEdges],
    currentEdge: null,
    info: 'Kruskal complete. MST constructed.',
  });

  return steps;
};

export default function KruskalProvider({ children }) {
  const [graph, setGraph] = useState(defaultGraph);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(500);

  const steps = useMemo(() => getKruskalSteps(graph), [graph]);

  useEffect(() => {
    if (!isAnimating) return;
    if (currentStep >= steps.length - 1) {
      setIsAnimating(false);
      return;
    }
    const t = setTimeout(() => setCurrentStep(s => Math.min(s + 1, steps.length - 1)), speed);
    return () => clearTimeout(t);
  }, [isAnimating, currentStep, steps.length, speed]);

  const onPlayPause = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setIsAnimating(a => !a);
  };
  const onReset = () => { setCurrentStep(0); setIsAnimating(false); };
  const onStepForward = () => { setIsAnimating(false); setCurrentStep(s => Math.min(s+1, steps.length-1)); };
  const onStepBackward = () => { setIsAnimating(false); setCurrentStep(s => Math.max(s-1,0)); };
  const onSpeedChange = v => setSpeed(Math.max(50, Math.min(2000, parseInt(v,10))));

  const stepData = steps[currentStep];

  const canvasProps = {
    stepData,
    getGraphNodeState: (id) => 'fill-gray-500',  // customize as needed
    getGraphEdgeState: (edge) => 
      stepData.mst.some(e=>e.from===edge.from && e.to===edge.to)
        ? 'stroke-accent'
        : (stepData.currentEdge === `${edge.from}-${edge.to}(${edge.weight})`)
          ? 'stroke-yellow-400'
          : 'stroke-gray-600',
    onCanvasClick: () => {},
    onNodeClick: () => {},
    editMode: 'idle',
    isDirected: false,
    showWeights: true,
    AnnotationComponent: KruskalAnnotation
  };

  const controlProps = {
    isAnimating,
    currentStep,
    totalSteps: steps.length,
    speed,
    onPlayPause,
    onReset,
    onSpeedChange,
    onStepForward,
    onStepBackward,
    userInput: '',
    onUserInput: () => {},
    onApplyUserInput: () => {},
  };

  return children({
    CanvasComponent: GraphCanvas,
    ControlsComponent: GraphControls,
    ExplanationComponent: KruskalExplanation,
    canvasProps,
    controlProps
  });
}