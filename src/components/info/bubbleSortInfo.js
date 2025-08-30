const BubbleSortInfo = {
    summary: "Bubble Sort is a straightforward sorting algorithm known for its simplicity. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. While easy to understand, it is highly inefficient for large, real-world datasets.",
    howItWorks: ["Start at the beginning of the array.", "Compare the first element with the second.", "If the first element is larger than the second, they are swapped.", "Move to the next pair (second and third) and repeat the process.", "Continue until the end of the array. The largest element is now in its final position.", "Repeat the entire process, excluding the now-sorted elements at the end."],
    characteristics: {
        timeComplexity: { value: "O(n²)", description: "Worst & Average Case. The runtime grows quadratically with the input size." },
        spaceComplexity: { value: "O(1)", description: "It only requires a constant amount of extra memory, making it very space-efficient." },
        stability: { value: "Stable", description: "It preserves the original order of equal elements." },
    },
    pros: ["Simple to understand and implement.", "Very memory efficient (O(1) space complexity).", "Can detect if the list is already sorted, terminating early."],
    cons: ["Extremely slow for large datasets (O(n²) time complexity).", "Generally outperformed by other algorithms like Merge Sort or Quick Sort.", "Not practical for most real-world applications."],
};

export default BubbleSortInfo ;