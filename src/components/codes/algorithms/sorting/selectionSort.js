// Selection Sort Implementation in C
export const selectionSortC = `#include <stdio.h>

// Function to perform selection sort
void selectionSort(int arr[], int n) {
    // Outer loop: controls which element to place in correct position
    for (int i = 0; i < n - 1; i++) {
        // Assume current position has minimum element
        int minIndex = i;
        
        // Inner loop: find minimum element in remaining unsorted array
        for (int j = i + 1; j < n; j++) {
            // If we find smaller element, update minIndex
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap minimum element with current position if needed
        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}

// Main function
int main() {
    // Initialize array
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    // Calculate array size
    int n = sizeof(arr) / sizeof(arr[0]);
    
    // Call selection sort function
    selectionSort(arr, n);
    
    // Print result
    printf("Sorted array: ");
    // Loop through sorted array
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    
    return 0;
}`;

// Selection Sort Implementation in C++
export const selectionSortCpp = `#include <iostream>
#include <vector>
using namespace std;

// Function to perform selection sort on vector
void selectionSort(vector<int>& arr) {
    // Get array size
    int n = arr.size();
    
    // Outer loop: controls which element to place in correct position
    for (int i = 0; i < n - 1; i++) {
        // Assume current position has minimum element
        int minIndex = i;
        
        // Inner loop: find minimum element in remaining unsorted array
        for (int j = i + 1; j < n; j++) {
            // If we find smaller element, update minIndex
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap minimum element with current position if needed
        if (minIndex != i) {
            swap(arr[i], arr[minIndex]);
        }
    }
}

// Main function
int main() {
    // Initialize vector with values
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    // Call selection sort function
    selectionSort(arr);
    
    // Print result
    cout << "Sorted array: ";
    // Loop through sorted array
    for (int num : arr)
        cout << num << " ";
    
    return 0;
}`;

// Selection Sort Implementation in Java
export const selectionSortJava = `public class SelectionSort {
    
    // Static method to perform selection sort
    public static void selectionSort(int[] arr) {
        // Get array length
        int n = arr.length;
        
        // Outer loop: controls which element to place in correct position
        for (int i = 0; i < n - 1; i++) {
            // Assume current position has minimum element
            int minIndex = i;
            
            // Inner loop: find minimum element in remaining unsorted array
            for (int j = i + 1; j < n; j++) {
                // If we find smaller element, update minIndex
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Swap minimum element with current position if needed
            if (minIndex != i) {
                int temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
            }
        }
    }
    
    // Main method
    public static void main(String[] args) {
        // Initialize array with values
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        // Call selection sort method
        selectionSort(arr);
        
        // Print result
        System.out.print("Sorted array: ");
        // Loop through sorted array
        for (int num : arr)
            System.out.print(num + " ");
    }
}`;

// Selection Sort Implementation in Python
export const selectionSortPython = `# Function to perform selection sort
def selection_sort(arr):
    # Get length of array
    n = len(arr)
    
    # Outer loop: controls which element to place in correct position
    for i in range(n - 1):
        # Assume current position has minimum element
        min_index = i
        
        # Inner loop: find minimum element in remaining unsorted array
        for j in range(i + 1, n):
            # If we find smaller element, update min_index
            if arr[j] < arr[min_index]:
                min_index = j
        
        # Swap minimum element with current position if needed
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]

# Main function
def main():
    # Initialize array with values
    arr = [64, 34, 25, 12, 22, 11, 90]
    
    # Call selection sort function
    selection_sort(arr)
    
    # Print result
    print("Sorted array:", ' '.join(map(str, arr)))

# Entry point of program
if __name__ == "__main__":
    main()`;