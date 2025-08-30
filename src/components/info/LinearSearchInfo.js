export const linearSearchInfo = {
    title: "What is Linear Search?",
    description: "Linear Search is a simple method to find a particular value in a list. It checks each element one by one from the start until it finds the target value. If the value is found, it returns its position; otherwise, it says the value is not present.",
    howItWorks: {
        title: "How Does It Work?",
        steps: [
            "Start from the first element (index 0) of the array.",
            "Compare the current element with the target value.",
            "If the elements match, return the current index. The search is successful.",
            "If they don't match, move to the next element in the array.",
            "Repeat steps 2-4 until the end of the array is reached.",
            "If the end is reached without finding the target, the search is unsuccessful."
        ]
    },
    complexity: {
        title: "Time Complexity",
        best: "O(1) - The target is the first element.",
        worst: "O(n) - The target is the last element or not present.",
        average: "O(n) - On average, the algorithm checks half of the elements.",
        space: "O(1) - No extra memory is needed besides a few variables."
    },
    pros: [
        "Simple to understand and implement.",
        "Works on unsorted arrays, unlike more complex algorithms like Binary Search.",
        "Requires minimal memory (O(1) space complexity)."
    ],
    cons: [
        "Very inefficient for large datasets with a time complexity of O(n).",
        "The time taken to search increases linearly with the size of the array."
    ]
};