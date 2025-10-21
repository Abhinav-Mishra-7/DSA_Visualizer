import React from 'react';
import { BarChart3, Scale, Zap, CheckCircle2, XCircle } from "lucide-react";
// Assuming KeyCharacteristicCard is exported from a shared location
// import { KeyCharacteristicCard } from '../BFSExplain'; 

export default function BinarySearchExplain() {
    const info = {
        summary: "Binary Search is a highly efficient searching algorithm that works on sorted arrays. It operates by repeatedly dividing the search interval in half. If the value of the search key is less than the item in the middle of the interval, it narrows the interval to the lower half. Otherwise, it narrows it to the upper half, until the value is found or the interval is empty.",
        howItWorks: [
            "Start with the entire sorted array. Define 'left' and 'right' pointers at the beginning and end.",
            "While the 'left' pointer is less than or equal to the 'right' pointer, find the middle element.",
            "Compare the middle element with the target value.",
            "If they match, the search is successful and the index is returned.",
            "If the target is greater, move the 'left' pointer to the middle + 1.",
            "If the target is smaller, move the 'right' pointer to the middle - 1.",
            "Repeat until the target is found or the interval is empty.",
        ],
        characteristics: {
            timeComplexity: { value: "O(log n)", description: "The search interval is halved at each step, making it extremely fast." },
            spaceComplexity: { value: "O(1)", description: "It requires no extra space, performing the search in-place (iterative version)." },
            preRequisite: { value: "Sorted Array", description: "The algorithm fundamentally relies on the data being sorted beforehand." },
        },
        pros: ["Extremely fast for large datasets due to its logarithmic time complexity.", "Simple to implement iteratively."],
        cons: ["The array must be sorted. The cost of sorting might outweigh the search benefit if the data is dynamic.", "Inefficient for small datasets where linear search might be faster due to lower overhead."],
    };

    return (
        <div className="space-y-16">
            <p className="text-center text-lg text-text-secondary max-w-3xl mx-auto">{info.summary}</p>
            <div>
                <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Key Characteristics</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <KeyCharacteristicCard icon={<BarChart3 size={24}/>} title="Time Complexity" value={info.characteristics.timeComplexity.value} valueColor="text-red-500">{info.characteristics.timeComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<Scale size={24}/>} title="Space Complexity" value={info.characteristics.spaceComplexity.value} valueColor="text-green-500">{info.characteristics.spaceComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<Zap size={24}/>} title="Pre-requisite" value={info.characteristics.preRequisite.value} valueColor="text-blue-500">{info.characteristics.preRequisite.description}</KeyCharacteristicCard>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary text-center mb-4">How It Works: The Core Logic</h2>
                <ol className="list-decimal list-inside space-y-3 pl-2 text-text-secondary text-base">
                    {info.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Pros</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{info.pros.map((pro, index) => <li key={index}>{pro}</li>)}</ul></div>
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><XCircle className="text-red-500"/> Cons</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{info.cons.map((con, index) => <li key={index}>{con}</li>)}</ul></div>
            </div>
        </div>
    );
}