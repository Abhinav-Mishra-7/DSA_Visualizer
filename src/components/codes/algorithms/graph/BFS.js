// BFS Implementation in C
export const bfsC = `#include <stdio.h>
#include <stdlib.h>

#define MAX 100

// Graph represented as adjacency list
struct Node {
    int vertex;
    struct Node* next;
};

struct Graph {
    int numVertices;
    struct Node** adjLists;
};

// Create new node
struct Node* createNode(int v) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->vertex = v;
    newNode->next = NULL;
    return newNode;
}

// Add edge to graph
void addEdge(struct Graph* graph, int src, int dest) {
    struct Node* newNode = createNode(dest);
    newNode->next = graph->adjLists[src];
    graph->adjLists[src] = newNode;
}

// BFS traversal
void bfs(struct Graph* graph, int startVertex) {
    // Visited array
    int visited[MAX] = {0};
    
    // Create queue
    int queue[MAX];
    int front = 0, rear = 0;
    
    // Add start vertex to queue
    queue[rear++] = startVertex;
    visited[startVertex] = 1;
    
    int currentVertex;
    
    // Traverse while queue is not empty
    while (front != rear) {
        // Remove vertex from queue
        currentVertex = queue[front++];
        
        // Print current vertex
        printf("%d ", currentVertex);
        
        // Get adjacent vertices from adjacency list
        struct Node* temp = graph->adjLists[currentVertex];
        
        // Check each adjacent vertex
        while (temp) {
            int adjVertex = temp->vertex;
            
            // If not visited, add to queue
            if (!visited[adjVertex]) {
                queue[rear++] = adjVertex;
                visited[adjVertex] = 1;
            }
            temp = temp->next;
        }
    }
}

// Main function
int main() {
    // Create graph with 4 vertices
    struct Graph* graph = malloc(sizeof(struct Graph));
    graph->numVertices = 4;
    graph->adjLists = malloc(graph->numVertices * sizeof(struct Node*));
    
    // Initialize adjacency lists
    for (int i = 0; i < 4; i++)
        graph->adjLists[i] = NULL;
    
    // Add edges (undirected graph)
    addEdge(graph, 0, 1);
    addEdge(graph, 0, 2);
    addEdge(graph, 1, 2);
    addEdge(graph, 2, 3);
    
    // Perform BFS starting from vertex 0
    printf("BFS starting from vertex 0: ");
    bfs(graph, 0);
    
    return 0;
}`;

// BFS Implementation in C++
export const bfsCpp = `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

// Graph represented as adjacency list
vector<vector<int>> adjList;

// BFS traversal using STL queue
void bfs(int startVertex) {
    // Visited array
    vector<bool> visited(adjList.size(), false);
    
    // Create queue
    queue<int> queue;
    
    // Add start vertex to queue
    queue.push(startVertex);
    visited[startVertex] = true;
    
    int currentVertex;
    
    // Traverse while queue is not empty
    while (!queue.empty()) {
        // Remove vertex from queue
        currentVertex = queue.front();
        queue.pop();
        
        // Print current vertex
        cout << currentVertex << " ";
        
        // Visit all adjacent vertices
        for (int adjVertex : adjList[currentVertex]) {
            // If not visited, add to queue
            if (!visited[adjVertex]) {
                visited[adjVertex] = true;
                queue.push(adjVertex);
            }
        }
    }
}

// Main function
int main() {
    // Create graph with 4 vertices
    int numVertices = 4;
    adjList.resize(numVertices);
    
    // Add edges (undirected graph)
    adjList[0].push_back(1);
    adjList[0].push_back(2);
    adjList[1].push_back(2);
    adjList[2].push_back(0);
    adjList[2].push_back(1);
    adjList[2].push_back(3);
    adjList[3].push_back(2);
    
    // Perform BFS starting from vertex 0
    cout << "BFS starting from vertex 0: ";
    bfs(0);
    
    return 0;
}`;

// BFS Implementation in Java
export const bfsJava = `import java.util.*;

public class BFS {
    
    // Graph represented as adjacency list
    private static List<List<Integer>> adjList = new ArrayList<>();
    
    // BFS traversal using LinkedList as queue
    public static void bfs(int startVertex) {
        // Visited array
        boolean[] visited = new boolean[adjList.size()];
        
        // Create queue
        Queue<Integer> queue = new LinkedList<>();
        
        // Add start vertex to queue
        queue.add(startVertex);
        visited[startVertex] = true;
        
        int currentVertex;
        
        // Traverse while queue is not empty
        while (!queue.isEmpty()) {
            // Remove vertex from queue
            currentVertex = queue.poll();
            
            // Print current vertex
            System.out.print(currentVertex + " ");
            
            // Visit all adjacent vertices
            for (int adjVertex : adjList.get(currentVertex)) {
                // If not visited, add to queue
                if (!visited[adjVertex]) {
                    visited[adjVertex] = true;
                    queue.add(adjVertex);
                }
            }
        }
    }
    
    // Main method
    public static void main(String[] args) {
        // Create graph with 4 vertices
        int numVertices = 4;
        for (int i = 0; i < numVertices; i++) {
            adjList.add(new ArrayList<>());
        }
        
        // Add edges (undirected graph)
        adjList.get(0).add(1);
        adjList.get(0).add(2);
        adjList.get(1).add(2);
        adjList.get(2).add(0);
        adjList.get(2).add(1);
        adjList.get(2).add(3);
        adjList.get(3).add(2);
        
        // Perform BFS starting from vertex 0
        System.out.print("BFS starting from vertex 0: ");
        bfs(0);
    }
}`;

// BFS Implementation in Python
export const bfsPython = `# BFS Implementation using collections.deque
from collections import deque

# Graph represented as adjacency list
adj_list = {
    0: [1, 2],
    1: [2],
    2: [0, 1, 3],
    3: [2]
}

# Function to perform BFS
def bfs(start_vertex):
    # Visited set
    visited = set()
    
    # Create queue using deque
    queue = deque()
    
    # Add start vertex to queue
    queue.append(start_vertex)
    visited.add(start_vertex)
    
    # Traverse while queue is not empty
    while queue:
        # Remove vertex from queue
        current_vertex = queue.popleft()
        
        # Print current vertex
        print(current_vertex, end=" ")
        
        # Visit all adjacent vertices
        for adj_vertex in adj_list[current_vertex]:
            # If not visited, add to queue
            if adj_vertex not in visited:
                visited.add(adj_vertex)
                queue.append(adj_vertex)

# Main function
def main():
    print("BFS starting from vertex 0: ", end="")
    bfs(0)

# Entry point of program
if __name__ == "__main__":
    main()`;
