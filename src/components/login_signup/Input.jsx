export default function Input({ icon, ...props }) {
  return (
    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-card/60 focus-within:ring-2 focus-within:ring-blue-500/60 transition">
      <div className="text-blue-600 dark:text-blue-300">{icon}</div>
      <input
        {...props}
        className="w-full outline-none text-sm bg-transparent text-text-primary placeholder:text-text-secondary/60"
      />
    </div>
  );
}