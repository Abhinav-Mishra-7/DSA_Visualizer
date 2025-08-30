import React from 'react';
// Create this info file in src/components/algoExplanationPage/info/
import { linearSearchInfo } from '../info/LinearSearchInfo'; 

const InfoCard = ({ title, children }) => (
    <section className="p-8 bg-white dark:bg-gray-800/50 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        {children}
    </section>
);

export default function LinearSearchExplain() {
    return (
        <div className="space-y-12">
            <InfoCard title={linearSearchInfo.title}>{/* ... */}</InfoCard>
            <InfoCard title={linearSearchInfo.complexity.title}>
                 <div className="grid md:grid-cols-2 gap-8 items-center">
                    <ul className="text-lg space-y-4 text-gray-600 dark:text-gray-300">
                        <li><strong>Best Case:</strong> {linearSearchInfo.complexity.best}</li>
                        <li><strong>Worst Case:</strong> {linearSearchInfo.complexity.worst}</li>
                        <li><strong>Space Complexity:</strong> {linearSearchInfo.complexity.space}</li>
                    </ul>
                    <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg h-64 flex items-center justify-center">
                        <img src="/path-to-your/complexity-chart.png" alt="Time Complexity Graph" />
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}