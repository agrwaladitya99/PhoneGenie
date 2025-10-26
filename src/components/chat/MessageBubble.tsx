import { Message } from "@/types/chat";
import ProductGrid from "../product/ProductGrid";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-3xl ${isUser ? "w-auto" : "w-full"}`}>
        {/* Message bubble */}
        <div
          className={`rounded-lg p-4 shadow-sm ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Product cards if present */}
        {message.phones && message.phones.length > 0 && (
          <div className="mt-3">
            <ProductGrid phones={message.phones} />
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}


