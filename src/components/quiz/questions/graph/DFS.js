// src/components/quiz/quizzes/dfs.js

export const dfsQuiz = [
  {
    id: 1,
    question: 'What is the time complexity of Depth‑First Search (DFS) on a graph with V vertices and E edges?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V · E)'],
    correctIndex: 2,
    explanation:
      'DFS visits each reachable vertex and traverses each edge a constant number of times, so its running time is linear in the size of the graph, O(V + E).[web:104][web:114][web:116]'
  },
  {
    id: 2,
    question: 'Which underlying data structure best characterizes how DFS is implemented?',
    options: [
      'Queue (first‑in, first‑out)',
      'Stack (explicitly or via recursion)',
      'Priority queue ordered by distance',
      'Hash table storing all neighbors'
    ],
    correctIndex: 1,
    explanation:
      'DFS explores as deep as possible along one path before backtracking, which naturally uses a stack; this can be an explicit stack or the call stack in a recursive implementation.[web:105][web:109][web:112][web:119]'
  },
  {
    id: 3,
    question: 'Which of the following problems is DFS especially well suited for?',
    options: [
      'Finding shortest paths in an unweighted graph',
      'Level‑order traversal of a tree',
      'Detecting cycles and exploring graph connectivity',
      'Balancing a binary search tree'
    ],
    correctIndex: 2,
    explanation:
      'DFS is widely used for tasks like detecting cycles, checking connectivity, finding articulation points, and serving as the basis for algorithms such as strongly connected components.[web:106][web:108][web:111][web:110]'
  },
  {
    id: 4,
    question: 'Which statement best describes how DFS traverses a graph?',
    options: [
      'It visits all neighbors of the current vertex before going deeper',
      'It explores one path as deep as possible before backtracking to explore other paths',
      'It always chooses the smallest‑weight edge next',
      'It randomly picks any unvisited vertex at each step'
    ],
    correctIndex: 1,
    explanation:
      'DFS performs deep exploration: it follows a path from the start vertex down to a dead end, then backtracks to explore alternative branches.[web:104][web:105][web:109][web:110]'
  },
  {
    id: 5,
    question: 'How is DFS commonly used in relation to topological sorting of a directed acyclic graph (DAG)?',
    options: [
      'DFS is not used for topological sorting',
      'Vertices are pushed to an ordering when they are first discovered',
      'Vertices are added to the ordering after all their outgoing edges are explored',
      'Vertices are ordered by their in‑degree only'
    ],
    correctIndex: 2,
    explanation:
      'A classic DFS‑based topological sort pushes each vertex onto a stack (or list) after exploring all its outgoing edges; reversing this post‑order yields a valid topological ordering for a DAG.[web:110][web:113][web:115][web:91]'
  }
];
