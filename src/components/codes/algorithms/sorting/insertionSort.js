// Insertion Sort Implementation in C
export const insertionSortC = `#include <stdio.h>

// Function to perform insertion sort
void insertionSort(int arr[], int n) {
    // Start from second element (index 1)
    for (int i = 1; i < n; i++) {
        // Store current element to be inserted
        int key = arr[i];
        int j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Place key in correct position
        arr[j + 1] = key;
    }
}

// Main function
int main() {
    // Initialize array
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    // Calculate array size
    int n = sizeof(arr) / sizeof(arr[0]);
    
    // Call insertion sort function
    insertionSort(arr, n);
    
    // Print result
    printf("Sorted array: ");
    // Loop through sorted array
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    
    return 0;
}`;

// Insertion Sort Implementation in C++
export const insertionSortCpp = `#include <iostream>
#include <vector>
using namespace std;

// Function to perform insertion sort on vector
void insertionSort(vector<int>& arr) {
    // Get array size
    int n = arr.size();
    
    // Start from second element (index 1)
    for (int i = 1; i < n; i++) {
        // Store current element to be inserted
        int key = arr[i];
        int j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Place key in correct position
        arr[j + 1] = key;
    }
}

// Main function
int main() {
    // Initialize vector with values
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    // Call insertion sort function
    insertionSort(arr);
    
    // Print result
    cout << "Sorted array: ";
    // Loop through sorted array
    for (int num : arr)
        cout << num << " ";
    
    return 0;
}`;

// Insertion Sort Implementation in Java
export const insertionSortJava = `public class InsertionSort {
    
    // Static method to perform insertion sort
    public static void insertionSort(int[] arr) {
        // Get array length
        int n = arr.length;
        
        // Start from second element (index 1)
        for (int i = 1; i < n; i++) {
            // Store current element to be inserted
            int key = arr[i];
            int j = i - 1;
            
            // Move elements greater than key one position ahead
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            // Place key in correct position
            arr[j + 1] = key;
        }
    }
    
    // Main method
    public static void main(String[] args) {
        // Initialize array with values
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        // Call insertion sort method
        insertionSort(arr);
        
        // Print result
        System.out.print("Sorted array: ");
        // Loop through sorted array
        for (int num : arr)
            System.out.print(num + " ");
    }
}`;

// Insertion Sort Implementation in Python
export const insertionSortPython = `# Function to perform insertion sort
def insertion_sort(arr):
    # Get length of array
    n = len(arr)
    
    # Start from second element (index 1)
    for i in range(1, n):
        # Store current element to be inserted
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Place key in correct position
        arr[j + 1] = key

# Main function
def main():
    # Initialize array with values
    arr = [64, 34, 25, 12, 22, 11, 90]
    
    # Call insertion sort function
    insertion_sort(arr)
    
    # Print result
    print("Sorted array:", ' '.join(map(str, arr)))

# Entry point of program
if __name__ == "__main__":
    main()`;
