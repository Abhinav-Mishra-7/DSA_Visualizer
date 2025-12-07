// src/components/quiz/quizzes/selectionSort.js

export const selectionSortQuiz = [
  {
    id: 1,
    question: 'What is the worst‑case time complexity of Selection Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'Selection Sort always performs two nested loops over the array, independent of the input order, giving a worst‑case time complexity of O(n²).'
  },
  {
    id: 2,
    question: 'How many swaps does Selection Sort perform in the worst case for an array of size n?',
    options: ['O(n²) swaps', 'At most n−1 swaps', 'O(log n) swaps', 'Exactly n² swaps'],
    correctIndex: 1,
    explanation:
      'Selection Sort performs at most one swap per outer iteration, so for n elements it makes at most n−1 swaps.'
  },
  {
    id: 3,
    question: 'Which of the following best describes the working of Selection Sort?',
    options: [
      'Repeatedly inserts the current element into the sorted part',
      'Repeatedly selects the minimum element from the unsorted part and places it at the beginning',
      'Repeatedly partitions the array around a pivot',
      'Builds a heap and repeatedly extracts the maximum'
    ],
    correctIndex: 1,
    explanation:
      'Selection Sort repeatedly finds the minimum element in the remaining unsorted part and swaps it into the current position at the beginning.'
  },
  {
    id: 4,
    question: 'Is the standard Selection Sort algorithm stable?',
    options: [
      'Yes, always stable',
      'No, generally not stable',
      'Stable only when all keys are distinct',
      'Stability depends on input size'
    ],
    correctIndex: 1,
    explanation:
      'Because Selection Sort may swap non‑adjacent elements, it can change the relative order of equal elements, so the standard version is not stable.'
  },
  {
    id: 5,
    question: 'When might Selection Sort be preferred over Bubble Sort or Insertion Sort?',
    options: [
      'When the array is nearly sorted',
      'When we want the best possible time complexity',
      'When the cost of writing to memory is high',
      'When the input size is extremely large'
    ],
    correctIndex: 2,
    explanation:
      'Selection Sort minimizes the number of writes (at most n−1 swaps), so it can be preferable when memory writes are relatively expensive.'
  }
];
