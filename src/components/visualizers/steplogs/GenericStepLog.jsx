// A simple step log for algorithms without complex state highlighting
export default function GenericStepLog({ steps, currentStep }) {
    return (
        <ul className="space-y-1 text-sm font-mono">
            {steps.slice(0, currentStep + 1).reverse().map((step, index) => {
                const isCurrent = index === 0;
                return (
                    <li
                        key={steps.length - 1 - index}
                        className={`px-2 py-1 rounded transition-colors duration-200 ${isCurrent ? 'bg-accent/10' : ''}`}
                    >
                        <span className={`font-semibold mr-2 ${isCurrent ? 'text-accent' : 'opacity-70'}`}>
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