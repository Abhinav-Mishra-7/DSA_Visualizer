// src/components/quiz/quizzes/bucketSort.js

export const bucketSortQuiz = [
  {
    id: 1,
    question: 'What is the typical average‑case time complexity of Bucket Sort when elements are well distributed?',
    options: ['O(n²)', 'O(n log n)', 'O(n + k)', 'O(log n)'],
    correctIndex: 2,
    explanation:
      'When the input data is reasonably well and uniformly distributed across k buckets, distributing elements and sorting small buckets leads to an average‑case time complexity of O(n + k).[web:70][web:72][web:75]'
  },
  {
    id: 2,
    question: 'What is the main idea behind the Bucket Sort algorithm?',
    options: [
      'Divide the array into halves and sort recursively',
      'Build a heap and repeatedly extract the maximum element',
      'Group elements into ranges (buckets), sort each bucket, then concatenate',
      'Use comparisons to repeatedly swap adjacent elements'
    ],
    correctIndex: 2,
    explanation:
      'Bucket Sort divides the input range into several buckets, places each element into its corresponding bucket based on value, sorts each bucket individually, and finally concatenates all buckets to obtain the sorted output.[web:72][web:74][web:83]'
  },
  {
    id: 3,
    question: 'What is the worst‑case time complexity of Bucket Sort when one bucket receives almost all elements?',
    options: ['O(n)', 'O(n log n)', 'O(n + k)', 'O(n²)'],
    correctIndex: 3,
    explanation:
      'If most or all elements fall into a single bucket, that bucket may be sorted with an algorithm like insertion sort, which can take O(n²) in the worst case, so the overall algorithm also degrades to O(n²).[web:72][web:77][web:78]'
  },
  {
    id: 4,
    question: 'When is Bucket Sort generally a good choice compared to comparison‑based sorts?',
    options: [
      'When the elements are arbitrary strings with unknown range',
      'When the input numbers are uniformly distributed over a known range',
      'When the array is already fully sorted',
      'When there is very little extra memory available'
    ],
    correctIndex: 1,
    explanation:
      'Bucket Sort is most effective when the input data is approximately uniformly distributed over a known numeric range, allowing elements to be spread fairly evenly among buckets and sorted efficiently.[web:71][web:74][web:80]'
  },
  {
    id: 5,
    question: 'Which statement about the stability and space usage of Bucket Sort is generally correct?',
    options: [
      'It is always stable and in‑place',
      'It is stable only if the inner bucket‑sorting algorithm is stable and uses extra space O(n + k)',
      'It is unstable but in‑place with O(1) extra space',
      'It is always unstable and requires exponential extra space'
    ],
    correctIndex: 1,
    explanation:
      'Bucket Sort uses additional memory for buckets, giving auxiliary space on the order of O(n + k); it can be made stable when each bucket is sorted with a stable algorithm such as insertion sort.[web:72][web:73][web:74][web:76]'
  }
];
