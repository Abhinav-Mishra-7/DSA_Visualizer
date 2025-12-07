// DFS Implementation in C
export const dfsC = `#include <stdio.h>
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

// DFS recursive function
void dfsRecursive(struct Graph* graph, int vertex, int visited[]) {
    // Mark current vertex as visited
    visited[vertex] = 1;
    
    // Print current vertex
    printf("%d ", vertex);
    
    // Get adjacent vertices from adjacency list
    struct Node* temp = graph->adjLists[vertex];
    
    // Visit all adjacent vertices
    while (temp) {
        int adjVertex = temp->vertex;
        
        // If not visited, recurse on it
        if (!visited[adjVertex]) {
            dfsRecursive(graph, adjVertex, visited);
        }
        temp = temp->next;
    }
}

// DFS traversal
void dfs(struct Graph* graph, int startVertex) {
    // Visited array
    int visited[MAX] = {0};
    
    // Start DFS from startVertex
    dfsRecursive(graph, startVertex, visited);
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
    
    // Perform DFS starting from vertex 0
    printf("DFS starting from vertex 0: ");
    dfs(graph, 0);
    
    return 0;
}`;

// DFS Implementation in C++
export const dfsCpp = `#include <iostream>
#include <vector>
#include <stack>
using namespace std;

// Graph represented as adjacency list
vector<vector<int>> adjList;

// DFS recursive function
void dfsRecursive(int vertex, vector<bool>& visited) {
    // Mark current vertex as visited
    visited[vertex] = true;
    
    // Print current vertex
    cout << vertex << " ";
    
    // Visit all adjacent vertices
    for (int adjVertex : adjList[vertex]) {
        // If not visited, recurse on it
        if (!visited[adjVertex]) {
            dfsRecursive(adjVertex, visited);
        }
    }
}

// DFS traversal (recursive)
void dfs(int startVertex) {
    // Visited array
    vector<bool> visited(adjList.size(), false);
    
    // Start DFS from startVertex
    dfsRecursive(startVertex, visited);
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
    
    // Perform DFS starting from vertex 0
    cout << "DFS starting from vertex 0: ";
    dfs(0);
    
    return 0;
}`;

// DFS Implementation in Java
export const dfsJava = `import java.util.*;

public class DFS {
    
    // Graph represented as adjacency list
    private static List<List<Integer>> adjList = new ArrayList<>();
    
    // DFS recursive function
    public static void dfsRecursive(int vertex, boolean[] visited) {
        // Mark current vertex as visited
        visited[vertex] = true;
        
        // Print current vertex
        System.out.print(vertex + " ");
        
        // Visit all adjacent vertices
        for (int adjVertex : adjList.get(vertex)) {
            // If not visited, recurse on it
            if (!visited[adjVertex]) {
                dfsRecursive(adjVertex, visited);
            }
        }
    }
    
    // DFS traversal
    public static void dfs(int startVertex) {
        // Visited array
        boolean[] visited = new boolean[adjList.size()];
        
        // Start DFS from startVertex
        dfsRecursive(startVertex, visited);
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
        
        // Perform DFS starting from vertex 0
        System.out.print("DFS starting from vertex 0: ");
        dfs(0);
    }
}`;

// DFS Implementation in Python
export const dfsPython = `# DFS Implementation using recursion
adj_list = {
    0: [1, 2],
    1: [2],
    2: [0, 1, 3],
    3: [2]
}

# DFS recursive function
def dfs_recursive(vertex, visited):
    # Mark current vertex as visited
    visited[vertex] = True
    
    # Print current vertex
    print(vertex, end=" ")
    
    # Visit all adjacent vertices
    for adj_vertex in adj_list[vertex]:
        # If not visited, recurse on it
        if not visited[adj_vertex]:
            dfs_recursive(adj_vertex, visited)

# Function to perform DFS
def dfs(start_vertex):
    # Visited dictionary
    visited = {i: False for i in adj_list}
    
    # Start DFS from start_vertex
    dfs_recursive(start_vertex, visited)

# Main function
def main():
    print("DFS starting from vertex 0: ", end="")
    dfs(0)

# Entry point of program
if __name__ == "__main__":
    main()`;