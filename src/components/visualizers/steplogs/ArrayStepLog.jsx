export default function ArrayStepLog({ steps, currentStep }) {
    return (
        <ul className="space-y-1 text-sm font-mono">
            {steps.slice(0, currentStep + 1).reverse().map((step, index) => {
                const isCurrent = index === 0;
                let colorClass = 'text-text-secondary';
                if (isCurrent) {
                    if (step.swapping?.length) colorClass = 'text-red-400';
                    else if (step.comparing?.length) colorClass = 'text-yellow-400';
                    else if (step.sorted?.length) colorClass = 'text-green-400';
                    else colorClass = 'text-accent';
                }

                return (
                    <li
                        key={steps.length - 1 - index}
                        className={`px-2 py-1 rounded transition-colors duration-200 ${isCurrent ? 'bg-accent/10' : ''}`}
                    >
                        <span className={`font-semibold mr-2 ${isCurrent ? colorClass : 'opacity-70'}`}>
                            [{currentStep - index}]
                        </span>
                        <span className={`${isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {step.info}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}