export default function Input({ icon, ...props }) {
  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white/80 focus-within:ring-2 focus-within:ring-blue-400 transition">
      <div className="text-blue-500">{icon}</div>
      <input
        {...props}
        className="w-full outline-none text-sm bg-transparent"
      />
    </div>
  );
}