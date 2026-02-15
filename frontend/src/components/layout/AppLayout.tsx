import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThreadSidebar } from "@/components/chat/ThreadSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useThreads } from "@/hooks/useThreads";

interface AppLayoutProps {
  user: User;
  onSignOut: () => void;
}

export function AppLayout({ user, onSignOut }: AppLayoutProps) {
  const { threads, loading, createThread, deleteThread, refetchThreads } =
    useThreads();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCreateThread = async () => {
    const thread = await createThread();
    setSelectedThreadId(thread.id);
    setMobileOpen(false);
  };

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    setMobileOpen(false);
  };

  const handleDeleteThread = async (id: string) => {
    await deleteThread(id);
    if (selectedThreadId === id) {
      setSelectedThreadId(null);
    }
  };

  const sidebarContent = (
    <ThreadSidebar
      threads={threads}
      selectedId={selectedThreadId}
      loading={loading}
      onSelect={handleSelectThread}
      onCreate={handleCreateThread}
      onDelete={handleDeleteThread}
    />
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                &#9776;
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Thread List</SheetTitle>
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">RAG Chat</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 border-r md:block">{sidebarContent}</aside>
        <Separator orientation="vertical" className="hidden md:block" />
        {/* Chat area */}
        <main className="flex flex-1 flex-col">
          <ChatArea
            threadId={selectedThreadId}
            onTitleUpdated={refetchThreads}
          />
        </main>
      </div>
    </div>
  );
}
