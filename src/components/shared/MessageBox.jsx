import { Info } from "lucide-react";

const MessageBox = ({ message, style, messageRef }) => {
    if (!message || !message.text) return null;

    const words = message.text.split(' ');
    const firstWord = words[0];
    const restOfMessage = words.slice(1).join(' ');

    return (
        <div
            ref={messageRef}
            className="absolute top-0 lg:p-3 p-2.5 text-center rounded-lg bg-background-tertiary border border-border shadow-lg shadow-text-primary/10 lg:text-sm md:text-xs text-xs/2 text-text-primary whitespace-nowrap flex items-center gap-2"
            style={style}
        >
            <Info size={16} className="text-blue-500 flex-shrink-0" />
            <span>
                <span className="lg:font-bold font-semibold">{firstWord}</span>
                {restOfMessage && <span> {restOfMessage}</span>}
            </span>
        </div>
    );
};

export default MessageBox ;