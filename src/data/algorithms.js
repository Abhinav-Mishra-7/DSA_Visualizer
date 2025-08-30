export const allAlgorithms = [
  // --- SORTING ALGORITHMS ---
  { name: 'Bubble Sort', category: 'Sorting', description: 'A simple, stable sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.', slug: 'bubble-sort', visualizerType: 'array' },
  { name: 'Selection Sort', category: 'Sorting', description: 'An in-place comparison sort that divides the list into a sorted and an unsorted sublist, repeatedly finding the minimum element from the unsorted part.', slug: 'selection-sort', visualizerType: 'array' },
  { name: 'Insertion Sort', category: 'Sorting', description: 'A simple, stable sorting algorithm that builds the final sorted array one item at a time. Efficient for small or nearly sorted datasets.', slug: 'insertion-sort', visualizerType: 'array' },
  { name: 'Merge Sort', category: 'Sorting', description: 'An efficient, stable, divide-and-conquer sorting algorithm. It divides the array into halves, sorts them, and then merges them.', slug: 'merge-sort', visualizerType: 'array' },
  { name: 'Quick Sort', category: 'Sorting', description: 'An efficient, in-place, divide-and-conquer sorting algorithm. It picks a pivot element and partitions the other elements into two sub-arrays.', slug: 'quick-sort', visualizerType: 'array' },
  { name: 'Heap Sort', category: 'Sorting', description: 'A comparison-based sorting technique based on a Binary Heap data structure. It is an in-place algorithm.', slug: 'heap-sort', visualizerType: 'array' },
  { name: 'Radix Sort', category: 'Sorting', description: 'A non-comparison integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits.', slug: 'radix-sort', visualizerType: 'array' },
  { name: 'Bucket Sort', category: 'Sorting', description: 'A distribution sort that works by distributing the elements of an array into a number of buckets.', slug: 'bucket-sort', visualizerType: 'array' },
  
  // --- SEARCHING ALGORITHMS ---
  { name: 'Linear Search', category: 'Searching', description: 'A simple method for finding an element in a list. It sequentially checks each element until a match is found or the list ends.', slug: 'linear-search', visualizerType: 'array' },
  { name: 'Binary Search', category: 'Searching', description: 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing the search interval in half.', slug: 'binary-search', visualizerType: 'array' },
  { name: 'Jump Search', category: 'Searching', description: 'A searching algorithm for sorted arrays. The basic idea is to check fewer elements by jumping ahead by fixed steps.', slug: 'jump-search', visualizerType: 'array' },
  { name: 'Interpolation Search', category: 'Searching', description: 'An improvement over Binary Search for uniformly distributed data. It probes positions based on the value being searched.', slug: 'interpolation-search', visualizerType: 'array' },
  
  // --- GRAPH ALGORITHMS (includes Pathfinding) ---
  { name: 'Breadth-First Search (BFS)', category: 'Graph Algorithms', description: 'An algorithm for traversing or searching tree or graph data structures. It explores neighbor nodes level by level.', slug: 'bfs', visualizerType: 'graph' },
  { name: 'Depth-First Search (DFS)', category: 'Graph Algorithms', description: 'An algorithm for traversing or searching tree or graph data structures. It explores as far as possible along each branch before backtracking.', slug: 'dfs', visualizerType: 'graph' },
  { name: 'Dijkstra\'s Algorithm', category: 'Graph Algorithms', description: 'Finds the shortest paths between nodes in a weighted graph for a single source node. Does not handle negative weights.', slug: 'dijkstra', visualizerType: 'graph' },
  { name: 'A* Search', category: 'Graph Algorithms', description: 'An informed search algorithm, or a "best-first search", for finding the shortest path between nodes using a heuristic function.', slug: 'a-star', visualizerType: 'graph' },
  { name: 'Bellman-Ford Algorithm', category: 'Graph Algorithms', description: 'Finds the shortest paths from a single source vertex to all other vertices in a weighted digraph, even with negative edge weights.', slug: 'bellman-ford', visualizerType: 'graph' },
  { name: 'Kruskal\'s Algorithm', category: 'Graph Algorithms', description: 'A minimum spanning tree (MST) algorithm that finds an edge of the least possible weight that connects any two trees in the forest.', slug: 'kruskal-mst', visualizerType: 'graph' },
  { name: 'Prim\'s Algorithm', category: 'Graph Algorithms', description: 'A greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph.', slug: 'prim-mst', visualizerType: 'graph' },
  { name: 'Topological Sort', category: 'Graph Algorithms', description: 'A linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge from vertex u to vertex v, u comes before v.', slug: 'topological-sort', visualizerType: 'graph' },

  // --- DATA STRUCTURES ---
  { name: 'Stack', category: 'Data Structures', description: 'A LIFO (Last-In, First-Out) data structure. Supports push, pop, and peek operations.', slug: 'stack', visualizerType: 'structure' },
  { name: 'Queue', category: 'Data Structures', description: 'A FIFO (First-In, First-Out) data structure. Supports enqueue and dequeue operations.', slug: 'queue', visualizerType: 'structure' },
  { name: 'Linked List', category: 'Data Structures', description: 'A linear collection of data elements (nodes) where each node points to the next. Supports insertion and deletion.', slug: 'linked-list', visualizerType: 'structure' },
  { name: 'Hash Table', category: 'Data Structures', description: 'A data structure that implements an associative array abstract data type, a structure that can map keys to values.', slug: 'hash-table', visualizerType: 'structure' },
  { name: 'Binary Search Tree (BST)', category: 'Data Structures', description: 'A rooted binary tree with the binary search property. Allows fast lookup, addition and removal of items.', slug: 'bst', visualizerType: 'tree' },
  { name: 'Heap (Min/Max)', category: 'Data Structures', description: 'A specialized tree-based data structure that satisfies the heap property. Used in Heap Sort and Priority Queues.', slug: 'heap', visualizerType: 'tree' },
  { name: 'Trie (Prefix Tree)', category: 'Data Structures', description: 'A tree-like data structure that stores a dynamic set or associative array where the keys are usually strings.', slug: 'trie', visualizerType: 'tree' },
  { name: 'Disjoint Set Union (DSU)', category: 'Data Structures', description: 'A data structure that stores a collection of disjoint (non-overlapping) sets. Supports find and union operations.', slug: 'dsu', visualizerType: 'structure' },
  { name: 'AVL Tree', category: 'Data Structures', description: 'A self-balancing Binary Search Tree. The heights of the two child subtrees of any node differ by at most one.', slug: 'avl-tree', visualizerType: 'tree' },

  // --- TREE ALGORITHMS ---
  { name: 'In-order Traversal', category: 'Tree Algorithms', description: 'A tree traversal method that visits nodes in the order: Left Subtree, Root, Right Subtree. In a Binary Search Tree, this traversal visits nodes in ascending order.', slug: 'in-order-traversal', visualizerType: 'tree' },
  { name: 'Pre-order Traversal', category: 'Tree Algorithms', description: 'A tree traversal method that visits nodes in the order: Root, Left Subtree, Right Subtree. Often used to create a copy of the tree.', slug: 'pre-order-traversal', visualizerType: 'tree' },
  { name: 'Post-order Traversal', category: 'Tree Algorithms', description: 'A tree traversal method that visits nodes in the order: Left Subtree, Right Subtree, Root. Often used to delete nodes from a tree.', slug: 'post-order-traversal', visualizerType: 'tree' },
  { name: 'Lowest Common Ancestor (LCA)', category: 'Tree Algorithms', description: 'Finds the lowest node in a tree that has both n1 and n2 as descendants.', slug: 'lca', visualizerType: 'tree' },

  // --- DYNAMIC PROGRAMMING ---
  { name: 'Fibonacci Sequence', category: 'Dynamic Programming', description: 'Visualize how overlapping subproblems in the Fibonacci sequence can be optimized using memoization or tabulation.', slug: 'fibonacci', visualizerType: 'dp_table' },
  { name: '0/1 Knapsack Problem', category: 'Dynamic Programming', description: 'Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.', slug: 'knapsack', visualizerType: 'dp_table' },
  { name: 'Longest Common Subsequence', category: 'Dynamic Programming', description: 'Find the longest subsequence common to all sequences in a set of sequences (often just two).', slug: 'lcs', visualizerType: 'dp_table' },

  // --- STRING ALGORITHMS ---
  { name: 'Knuth-Morris-Pratt (KMP)', category: 'String Algorithms', description: 'A string-searching algorithm that searches for occurrences of a "word" within a main "text string".', slug: 'kmp', visualizerType: 'string' },
  { name: 'Rabin-Karp Algorithm', category: 'String Algorithms', description: 'A string-searching algorithm that uses hashing to find any one of a set of pattern strings in a text.', slug: 'rabin-karp', visualizerType: 'string' },

  // --- MISCELLANEOUS ---
  { name: 'Fisher-Yates Shuffle', category: 'Miscellaneous', description: 'An algorithm for generating a random permutation of a finite sequence—in plain terms, for randomly shuffling the sequence.', slug: 'fisher-yates-shuffle', visualizerType: 'array' },
  { name: 'Convex Hull', category: 'Miscellaneous', description: 'Find the smallest convex polygon that encloses a given set of points. Visualize using Graham scan or Monotone Chain.', slug: 'geometry' },
];