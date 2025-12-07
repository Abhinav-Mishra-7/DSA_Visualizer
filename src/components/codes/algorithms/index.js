// Sorting
import { bubbleSortC, bubbleSortCpp, bubbleSortJava, bubbleSortPython } from './sorting/bubbleSort';
import { selectionSortC, selectionSortCpp, selectionSortJava, selectionSortPython } from './sorting/selectionSort';
import { insertionSortC, insertionSortCpp, insertionSortJava, insertionSortPython } from './sorting/insertionSort';
import { bucketSortC, bucketSortCpp, bucketSortJava, bucketSortPython } from './sorting/bucketSort';

// Graph
import { bfsC, bfsCpp, bfsJava, bfsPython } from './graph/BFS';
import { dfsC, dfsCpp, dfsJava, dfsPython } from './graph/DFS';

export const codeSnippets = {

    // Sorting    
    'bubble-sort': { c: bubbleSortC, cpp: bubbleSortCpp, java: bubbleSortJava, python: bubbleSortPython },
    'selection-sort': { c: selectionSortC, cpp: selectionSortCpp, java: selectionSortJava, python: selectionSortPython },
    'insertion-sort': { c: insertionSortC, cpp: insertionSortCpp, java: insertionSortJava, python: insertionSortPython },
    'bucket-sort': { c: bucketSortC, cpp: bucketSortCpp, java: bucketSortJava, python: bucketSortPython },
   
    // Graph
    'bfs': {c: bfsC, cpp: bfsCpp, java: bfsJava, python: bfsPython} ,
    'dfs': {c: dfsC, cpp: dfsCpp, java: dfsJava, python: dfsPython}
};
