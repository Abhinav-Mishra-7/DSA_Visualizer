import React from 'react';
import { BarChart3, Scale, GitBranch, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { KeyCharacteristicCard } from './BFSExplain'; // Re-using your excellent card component

// A custom diagram for tree traversal
const TreeDiagram = ({ caption }) => (
    <svg viewBox="0 0 200 150" className="w-full max-w-xs mx-auto">
        <text x="100" y="15" textAnchor="middle" className="text-xs font-semibold fill-text-primary">In-order: Left, Root, Right</text>
        {/* Nodes */}
        <g><circle cx="100" cy="40" r="12" className="fill-yellow-400"/><text x="100" y="44" textAnchor="middle" className="text-xs font-bold fill-white">F</text></g>
        <g><circle cx="50" cy="80" r="12" className="fill-sky-400"/><text x="50" y="84" textAnchor="middle" className="text-xs font-bold fill-white">B</text></g>
        <g><circle cx="150" cy="80" r="12" className="fill-purple-400"/><text x="150" y="84" textAnchor="middle" className="text-xs font-bold fill-white">G</text></g>
        {/* Edges */}
        <line x1="100" y1="40" x2="50" y2="80" className="stroke-2 stroke-gray-600"/>
        <line x1="100" y1="40" x2="150" y2="80" className="stroke-2 stroke-gray-600"/>
        {/* Traversal path */}
        <text x="50" y="110" textAnchor="middle" className="font-mono font-bold text-sm fill-sky-400">1. Left</text>
        <text x="100" y="130" textAnchor="middle" className="font-mono font-bold text-sm fill-yellow-400">2. Root</text>
        <text x="150" y="110" textAnchor="middle" className="font-mono font-bold text-sm fill-purple-400">3. Right</text>
        <path d="M65 105 L 85 125" stroke="gray" fill="none" strokeDasharray="2,2"/>
        <path d="M115 125 L 135 105" stroke="gray" fill="none" strokeDasharray="2,2"/>
        <text x="100" y="145" textAnchor="middle" className="text-xs text-text-secondary">{caption}</text>
    </svg>
);


export default function InOrderTraversalExplain() {
    const info = {
        summary: "In-order traversal is a fundamental method for visiting nodes in a binary tree. It follows a strict 'Left, Root, Right' sequence, which produces a sorted list of node values when performed on a Binary Search Tree (BST).",
        howItWorks: [
            "Recursively traverse the entire left subtree.",
            "After returning from the left subtree, visit the current node (the root of that subtree).",
            "Finally, recursively traverse the entire right subtree.",
            "This process is applied at every node in the tree.",
        ],
        characteristics: {
            timeComplexity: { value: "O(V)", description: "V = Vertices (or Nodes). Every node is visited exactly once." },
            spaceComplexity: { value: "O(H)", description: "H = Height of the tree. This space is used by the recursion call stack." },
            type: { value: "Depth-First", description: "It's a type of Depth-First Search that explores as far as possible before backtracking." },
        },
        pros: ["Primary method for retrieving items from a BST in sorted order.", "Conceptually simple and follows the natural structure of a binary tree."],
        cons: ["Requires recursion, which can lead to stack overflow on very deep (unbalanced) trees.", "Not an iterative algorithm by nature, though it can be implemented with a stack."],
    };

    return (
        <div className="space-y-16">
            <p className="text-center text-lg text-text-secondary max-w-3xl mx-auto">{info.summary}</p>
            <div>
                <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Key Characteristics</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <KeyCharacteristicCard icon={<BarChart3 size={24}/>} title="Time Complexity" value={info.characteristics.timeComplexity.value} valueColor="text-red-500">{info.characteristics.timeComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<Scale size={24}/>} title="Space Complexity" value={info.characteristics.spaceComplexity.value} valueColor="text-green-500">{info.characteristics.spaceComplexity.description}</KeyCharacteristicCard>
                    <KeyCharacteristicCard icon={<GitBranch size={24}/>} title="Algorithm Type" value={info.characteristics.type.value} valueColor="text-blue-500">{info.characteristics.type.description}</KeyCharacteristicCard>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary text-center mb-4">How It Works: The Core Logic</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <ol className="list-decimal list-inside space-y-3 pl-2 text-text-secondary text-base">
                        {info.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                    <TreeDiagram caption="The process repeats for every subtree."/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Pros</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{info.pros.map((pro, index) => <li key={index}>{pro}</li>)}</ul></div>
                <div className="bg-card border border-border rounded-xl p-6"><h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><XCircle className="text-red-500"/> Cons</h3><ul className="space-y-2 list-disc list-inside text-text-secondary">{info.cons.map((con, index) => <li key={index}>{con}</li>)}</ul></div>
            </div>
        </div>
    );
}