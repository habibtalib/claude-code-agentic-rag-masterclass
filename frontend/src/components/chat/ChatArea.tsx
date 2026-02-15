import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

interface ChatAreaProps {
  threadId: string | null;
  onTitleUpdated: () => void;
}

export function ChatArea({ threadId, onTitleUpdated }: ChatAreaProps) {
  const { messages, isStreaming, error, sendMessage } = useChat(
    threadId,
    onTitleUpdated,
  );

  if (!threadId) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a thread or create a new one to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {error && (
        <div className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
