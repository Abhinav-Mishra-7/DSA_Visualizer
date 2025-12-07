// src/components/quiz/quizzes/bfs.js

export const bfsQuiz = [
  {
    id: 1,
    question: 'What is the time complexity of Breadth‑First Search (BFS) on a graph with V vertices and E edges?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V · E)'],
    correctIndex: 2,
    explanation:
      'BFS visits every reachable vertex once and inspects each edge at most twice, so the total running time is linear in the number of vertices plus edges, O(V + E).[web:85][web:88][web:92]'
  },
  {
    id: 2,
    question: 'Which data structure is primarily used to implement BFS?',
    options: ['Stack', 'Queue', 'Priority queue', 'Hash table'],
    correctIndex: 1,
    explanation:
      'BFS processes vertices in the order they are discovered by exploring the graph level by level, which is naturally implemented with a FIFO queue.[web:86][web:88][web:97]'
  },
  {
    id: 3,
    question: 'In an unweighted graph, what important property does BFS guarantee when searching from a single source?',
    options: [
      'It minimizes the total edge weights',
      'It always finds a cycle if one exists',
      'It finds a path with the fewest number of edges to each reachable vertex',
      'It always visits nodes in alphabetical order'
    ],
    correctIndex: 2,
    explanation:
      'Because BFS explores the graph layer by layer from the source, the first time a vertex is reached corresponds to a path with the minimum number of edges, giving single‑source shortest paths in unweighted graphs.[web:89][web:90][web:93][web:103]'
  },
  {
    id: 4,
    question: 'Which of the following best describes how BFS traverses a graph?',
    options: [
      'It follows one path as deep as possible before backtracking',
      'It randomly jumps between unvisited vertices',
      'It explores all neighbors of the current vertex before moving to the next level',
      'It always chooses the edge with the smallest weight next'
    ],
    correctIndex: 2,
    explanation:
      'BFS is a level‑order traversal: it visits all vertices at the current distance from the source, then proceeds to vertices at the next distance level.[web:86][web:91][web:94][web:97]'
  },
  {
    id: 5,
    question: 'Which scenario is typically a good fit for using BFS?',
    options: [
      'Finding shortest paths in a weighted graph with positive weights',
      'Detecting strongly connected components in a directed graph',
      'Exploring all nodes within a fixed distance from a source in an unweighted graph',
      'Sorting vertices in topological order in a DAG'
    ],
    correctIndex: 2,
    explanation:
      'BFS is well suited for breadth‑limited or distance‑limited exploration in unweighted graphs, such as finding all nodes within a given number of edges or computing shortest paths by edge count.[web:90][web:94][web:95][web:98]'
  }
];
