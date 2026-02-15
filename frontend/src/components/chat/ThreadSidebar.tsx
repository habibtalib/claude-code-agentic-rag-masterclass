import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Thread } from "@/types";

interface ThreadSidebarProps {
  threads: Thread[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function ThreadSidebar({
  threads,
  selectedId,
  loading,
  onSelect,
  onCreate,
  onDelete,
}: ThreadSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button onClick={onCreate} className="w-full" variant="outline">
          + New Thread
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-2 p-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <p className="p-3 text-center text-sm text-muted-foreground">
            No threads yet
          </p>
        ) : (
          <div className="space-y-1 p-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  selectedId === thread.id
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => onSelect(thread.id)}
              >
                <span className="truncate">{thread.title}</span>
                <button
                  className="ml-2 hidden shrink-0 text-muted-foreground hover:text-destructive group-hover:inline-block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(thread.id);
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
