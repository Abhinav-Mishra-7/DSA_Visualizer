// src/components/quiz/quizzes/insertionSort.js

export const insertionSortQuiz = [
  {
    id: 1,
    question: 'What is the worst‑case time complexity of Insertion Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'In the worst case (for example, when the array is reverse sorted), each new element is compared with all previously sorted elements, leading to O(n²) time.'
  },
  {
    id: 2,
    question: 'What is the best‑case time complexity of Insertion Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
    correctIndex: 0,
    explanation:
      'If the array is already sorted, each element is compared once and inserted without shifting, giving a best‑case time complexity of O(n).'
  },
  {
    id: 3,
    question: 'Which of the following best describes how Insertion Sort works?',
    options: [
      'Repeatedly selects the minimum and puts it at the beginning',
      'Builds the sorted array one element at a time by inserting each new element into its correct position',
      'Divides the array into halves and sorts them recursively',
      'Uses a priority queue to repeatedly extract the minimum'
    ],
    correctIndex: 1,
    explanation:
      'Insertion Sort maintains a sorted prefix and, for each new element, inserts it into the correct position within that sorted portion.'
  },
  {
    id: 4,
    question: 'Is the standard Insertion Sort algorithm stable?',
    options: [
      'Yes, it is stable',
      'No, it is not stable',
      'Only stable for distinct keys',
      'Stability depends on input order'
    ],
    correctIndex: 0,
    explanation:
      'Insertion Sort only shifts elements that are strictly greater than the key, so equal elements keep their relative order, making it stable.'
  },
  {
    id: 5,
    question: 'For which type of input is Insertion Sort usually a good practical choice?',
    options: [
      'Very large random arrays',
      'Nearly sorted or small‑sized arrays',
      'Arrays with all distinct elements',
      'Data stored on external disks'
    ],
    correctIndex: 1,
    explanation:
      'Insertion Sort has low overhead and runs in O(n) when the array is nearly sorted, so it is efficient for small or almost sorted inputs.'
  }
];
