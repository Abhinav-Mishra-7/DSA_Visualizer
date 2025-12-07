// src/components/quiz/quizzes/bubbleSort.js

export const bubbleSortQuiz = [
  {
    id: 1,
    question: 'What is the worst‑case time complexity of Bubble Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'Bubble Sort uses two nested loops over n elements in the worst case, which leads to O(n²) time complexity.'
  },
  {
    id: 2,
    question: 'In an optimized Bubble Sort, in which case does it achieve its best‑case time complexity?',
    options: [
      'When the array is randomly ordered',
      'When the array is already sorted',
      'When the array is reverse sorted',
      'When all elements are distinct'
    ],
    correctIndex: 1,
    explanation:
      'With the early‑exit optimization (no swaps in a pass), an already sorted array is handled in one pass, giving O(n) time.'
  },
  {
    id: 3,
    question: 'Bubble Sort is considered which type of sorting algorithm?',
    options: [
      'Divide and conquer, not in‑place',
      'Comparison‑based, in‑place',
      'Non‑comparison, not in‑place',
      'Hash‑based'
    ],
    correctIndex: 1,
    explanation:
      'Bubble Sort repeatedly compares and swaps adjacent elements in the same array, so it is comparison‑based and in‑place.'
  },
  {
    id: 4,
    question: 'Is Bubble Sort a stable sorting algorithm?',
    options: ['Yes, it is stable', 'No, it is not stable', 'Only for unique keys', 'Depends on data'],
    correctIndex: 0,
    explanation:
      'The standard implementation only swaps when the left element is greater than the right, so equal elements keep their relative order, making it stable.'
  },
  {
    id: 5,
    question: 'How many nested loops does a typical Bubble Sort implementation use?',
    options: ['One loop', 'Two nested loops', 'Three nested loops', 'Four nested loops'],
    correctIndex: 1,
    explanation:
      'A typical Bubble Sort has an outer loop for passes and an inner loop for adjacent comparisons, i.e., two nested loops.'
  }
];