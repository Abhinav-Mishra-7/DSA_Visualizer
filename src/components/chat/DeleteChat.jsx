import { X } from "lucide-react";

export default function DeleteChatModal({
  chat,
  onClose,
  onDelete,
  getTitle
}) {
  if (!chat) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[400px] bg-card border border-border rounded-xl shadow-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Delete Chat</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CHAT INFO */}
        <div className="bg-background/60 border rounded-lg p-3 mb-4">
          <p className="text-sm font-medium truncate">
            {getTitle(chat)}
          </p>

          <p className="text-xs text-text-secondary mt-1">
            {chat.messages?.length || 0} messages
          </p>

          <p className="text-xs text-text-secondary mt-2 line-clamp-2">
            {chat.messages?.[0]?.user || "No preview"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          {/* CANCEL */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-background"
          >
            Cancel
          </button>

          {/* 🔥 DELETE (NO CONFIRM) */}
          <button
            onClick={() => {
              onDelete(chat._id);
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}