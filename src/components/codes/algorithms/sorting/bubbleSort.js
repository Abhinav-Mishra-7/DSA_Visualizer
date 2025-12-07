// Bubble Sort Implementation in C
export const bubbleSortC = `#include <stdio.h>

// Function to perform bubble sort
void bubbleSort(int arr[], int n) {
    // Outer loop: controls number of passes
    for (int i = 0; i < n - 1; i++) {
        // Inner loop: compares adjacent elements
        for (int j = 0; j < n - i - 1; j++) {
            // If current element is greater than next, swap them
            if (arr[j] > arr[j + 1]) {
                // Swap logic
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// Main function
int main() {
    // Initialize array
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    // Calculate array size
    int n = sizeof(arr) / sizeof(arr[0]);
    
    // Call bubble sort function
    bubbleSort(arr, n);
    
    // Print result
    printf("Sorted array: ");
    // Loop through sorted array
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    
    return 0;
}`;

// Bubble Sort Implementation in C++
export const bubbleSortCpp = `#include <iostream>
#include <vector>
using namespace std;

// Function to perform bubble sort on vector
void bubbleSort(vector<int>& arr) {
    // Get array size
    int n = arr.size();
    
    // Outer loop: controls number of passes
    for (int i = 0; i < n - 1; i++) {
        // Inner loop: compares adjacent elements
        for (int j = 0; j < n - i - 1; j++) {
            // If current element is greater than next, swap them
            if (arr[j] > arr[j + 1]) {
                // Use built-in swap function
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// Main function
int main() {
    // Initialize vector with values
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    // Call bubble sort function
    bubbleSort(arr);
    
    // Print result
    cout << "Sorted array: ";
    // Loop through sorted array
    for (int num : arr)
        cout << num << " ";
    
    return 0;
}`;

// Bubble Sort Implementation in Java
export const bubbleSortJava = `public class BubbleSort {
    
    // Static method to perform bubble sort
    public static void bubbleSort(int[] arr) {
        // Get array length
        int n = arr.length;
        
        // Outer loop: controls number of passes
        for (int i = 0; i < n - 1; i++) {
            // Inner loop: compares adjacent elements
            for (int j = 0; j < n - i - 1; j++) {
                // If current element is greater than next, swap them
                if (arr[j] > arr[j + 1]) {
                    // Swap logic
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    // Main method
    public static void main(String[] args) {
        // Initialize array with values
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        // Call bubble sort method
        bubbleSort(arr);
        
        // Print result
        System.out.print("Sorted array: ");
        // Loop through sorted array
        for (int num : arr)
            System.out.print(num + " ");
    }
}`;

// Bubble Sort Implementation in Python
export const bubbleSortPython = `# Function to perform bubble sort
def bubble_sort(arr):
    # Get length of array
    n = len(arr)
    
    # Outer loop: controls number of passes
    for i in range(n - 1):
        # Inner loop: compares adjacent elements
        for j in range(n - i - 1):
            # If current element is greater than next, swap them
            if arr[j] > arr[j + 1]:
                # Python tuple unpacking for swap
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

# Main function
def main():
    # Initialize array with values
    arr = [64, 34, 25, 12, 22, 11, 90]
    
    # Call bubble sort function
    bubble_sort(arr)
    
    # Print result
    print("Sorted array:", ' '.join(map(str, arr)))

# Entry point of program
if __name__ == "__main__":
    main()`;