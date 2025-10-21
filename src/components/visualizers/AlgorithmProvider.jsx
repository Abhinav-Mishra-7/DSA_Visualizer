import BubbleSortProvider from '../../visualizers/sorting/BubbleSortPage';
import InsertionSortProvider from '../../visualizers/sorting/InsertionSortPage';
import SelectionSortProvider from '../../visualizers/sorting/SelectionSortPage';
import BFSProvider from '../../visualizers/graph/BFSPage'; 
import DFSProvider from '../../visualizers/graph/DFSPage';
// import InOrderTraversalProvider from '../../visualizers/tree/InOrderTraversalPage';
import BinarySearchProvider from '../../visualizers/searching/BinarySearchPage';
import LinearSearchProvider from '../../visualizers/searching/LinearSearchPage';
import MergeSortProvider from '../../visualizers/sorting/MergeSortPage';
import RadixSortProvider from '../../visualizers/sorting/RadixSortPage';
import QuickSortProvider from '../../visualizers/sorting/QuickSortPage';
import HeapSortProvider from '../../visualizers/sorting/HeapSortPage';
import BucketSortProvider from '../../visualizers/sorting/BucketSortPage';
import JumpSearchProvider from '../../visualizers/searching/JumpSearchPage';
import InterpolationSearchProvider from '../../visualizers/searching/InterpolationSearchPage';
import DijkstraProvider from '../../visualizers/graph/DijkstraPage';
import KruskalProvider from '../../visualizers/graph/KruskalPage';

const pageProviderMap = {
  'bubble-sort': BubbleSortProvider,
  'insertion-sort' : InsertionSortProvider ,
  'selection-sort' : SelectionSortProvider, 
  'merge-sort' : MergeSortProvider,
  'radix-sort' : RadixSortProvider,
  'quick-sort' : QuickSortProvider, 
  'heap-sort' : HeapSortProvider,
  'bucket-sort' : BucketSortProvider,
  'bfs': BFSProvider,
  'dfs': DFSProvider,
  // 'in-order-traversal': InOrderTraversalProvider,
  'binary-search': BinarySearchProvider,
  'linear-search' : LinearSearchProvider,
  'jump-search': JumpSearchProvider ,
  'interpolation-search': InterpolationSearchProvider ,
  'dijkstra' : DijkstraProvider ,
  'kruskal-mst' : KruskalProvider
};

const NotFoundProvider = ({ children }) => {
  return children({
    // Provide safe, renderable fallbacks for ALL expected component keys
    CanvasComponent: () => <div className="p-8 flex items-center justify-center h-full text-center text-text-secondary">Visualizer not yet implemented.</div>,
    ControlsComponent: () => <div className="p-6 text-center text-text-secondary">Controls not available.</div>,
    ExplanationComponent: () => <div className="p-8 text-center text-text-secondary">Explanation not available.</div>,
    
    // Provide safe fallback data
    steps: [{ info: 'No algorithm has been loaded.' }],
    canvasProps: {},
    controlProps: {},
  });
};

export default function AlgorithmProvider({ slug, children }) {
  const AlgorithmComponent = pageProviderMap[slug] || NotFoundProvider;

  return <AlgorithmComponent>{children}</AlgorithmComponent>;
}