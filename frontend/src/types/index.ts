export interface Thread {
  id: string;
  user_id: string;
  title: string;
  openai_response_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
