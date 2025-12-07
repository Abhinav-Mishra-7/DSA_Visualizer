// Bucket Sort Implementation in C
export const bucketSortC = `#include <stdio.h>
#include <stdlib.h>

// Function to insert element into correct bucket
void insert(int arr[], int index, int value, int bucketSize) {
    int i;
    for (i = bucketSize - 1; i >= 0 && arr[index + i] > value; i--) {
        arr[index + i + 1] = arr[index + i];
    }
    arr[index + i + 1] = value;
}

// Function to perform bucket sort
void bucketSort(int arr[], int n) {
    // Create buckets
    int bucketSize = 10;
    int buckets[bucketSize][n];
    int bucketCount[bucketSize] = {0};
    
    // Distribute elements into buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = (arr[i] * bucketSize) / 100;
        insert(buckets[bucketIndex], bucketCount[bucketIndex], arr[i], n);
        bucketCount[bucketIndex]++;
    }
    
    // Concatenate all buckets
    int index = 0;
    for (int i = 0; i < bucketSize; i++) {
        for (int j = 0; j < bucketCount[i]; j++) {
            arr[index++] = buckets[i][j];
        }
    }
}

// Main function
int main() {
    // Initialize array (0-99 range for bucket sort)
    int arr[] = {64, 34, 25, 12, 22, 11, 90, 45, 78, 56};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    // Call bucket sort function
    bucketSort(arr, n);
    
    // Print result
    printf("Sorted array: ");
    // Loop through sorted array
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    
    return 0;
}`;

// Bucket Sort Implementation in C++
export const bucketSortCpp = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Function to perform bucket sort on vector
void bucketSort(vector<int>& arr) {
    // Get array size
    int n = arr.size();
    
    // Create bucket vector
    vector<vector<int>> buckets(10);
    
    // Distribute elements into buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = (arr[i] * 10) / 100;
        buckets[bucketIndex].push_back(arr[i]);
    }
    
    // Sort individual buckets
    for (int i = 0; i < buckets.size(); i++) {
        sort(buckets[i].begin(), buckets[i].end());
    }
    
    // Concatenate all buckets
    int index = 0;
    for (int i = 0; i < buckets.size(); i++) {
        for (int j = 0; j < buckets[i].size(); j++) {
            arr[index++] = buckets[i][j];
        }
    }
}

// Main function
int main() {
    // Initialize vector with values (0-99 range for bucket sort)
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90, 45, 78, 56};
    
    // Call bucket sort function
    bucketSort(arr);
    
    // Print result
    cout << "Sorted array: ";
    // Loop through sorted array
    for (int num : arr)
        cout << num << " ";
    
    return 0;
}`;

// Bucket Sort Implementation in Java
export const bucketSortJava = `import java.util.*;

public class BucketSort {
    
    // Static method to perform bucket sort
    public static void bucketSort(int[] arr) {
        // Get array length
        int n = arr.length;
        
        // Create array of ArrayLists for buckets
        ArrayList<Integer>[] buckets = new ArrayList[10];
        for (int i = 0; i < 10; i++) {
            buckets[i] = new ArrayList<>();
        }
        
        // Distribute elements into buckets
        for (int i = 0; i < n; i++) {
            int bucketIndex = (arr[i] * 10) / 100;
            buckets[bucketIndex].add(arr[i]);
        }
        
        // Sort individual buckets
        for (int i = 0; i < 10; i++) {
            Collections.sort(buckets[i]);
        }
        
        // Concatenate all buckets
        int index = 0;
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < buckets[i].size(); j++) {
                arr[index++] = buckets[i].get(j);
            }
        }
    }
    
    // Main method
    public static void main(String[] args) {
        // Initialize array with values (0-99 range for bucket sort)
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 45, 78, 56};
        
        // Call bucket sort method
        bucketSort(arr);
        
        // Print result
        System.out.print("Sorted array: ");
        // Loop through sorted array
        for (int num : arr)
            System.out.print(num + " ");
    }
}`;

// Bucket Sort Implementation in Python
export const bucketSortPython = `# Function to perform bucket sort
def bucket_sort(arr):
    # Get length of array
    n = len(arr)
    
    # Create empty buckets
    buckets = [[] for _ in range(10)]
    
    # Distribute elements into buckets
    for i in range(n):
        bucket_index = (arr[i] * 10) // 100
        buckets[bucket_index].append(arr[i])
    
    # Sort individual buckets
    for i in range(10):
        buckets[i].sort()
    
    # Concatenate all buckets
    index = 0
    for i in range(10):
        for j in range(len(buckets[i])):
            arr[index] = buckets[i][j]
            index += 1

# Main function
def main():
    # Initialize array with values (0-99 range for bucket sort)
    arr = [64, 34, 25, 12, 22, 11, 90, 45, 78, 56]
    
    # Call bucket sort function
    bucket_sort(arr)
    
    # Print result
    print("Sorted array:", ' '.join(map(str, arr)))

# Entry point of program
if __name__ == "__main__":
    main()`;
