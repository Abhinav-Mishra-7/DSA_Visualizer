import { bubbleSortQuiz } from './sorting/bubbleSort';
import { selectionSortQuiz } from './sorting/selectionSort';
import { insertionSortQuiz } from './sorting/insertionSort';
import { bucketSortQuiz } from './sorting/bucketSort';
import { bfsQuiz } from './graph/BFS';
import { dfsQuiz } from './graph/DFS';

export const quizBank = {
  'bubble-sort': bubbleSortQuiz,
  'selection-sort': selectionSortQuiz,
  'insertion-sort': insertionSortQuiz,
  'bucket-sort': bucketSortQuiz,
  'bfs': bfsQuiz,
  'dfs': dfsQuiz,
};
