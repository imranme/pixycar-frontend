export interface ThreadItem {
  id: number;
  listing: number;
  listing_title: string;
  is_unlocked: boolean;
  other_party_label: string;
  last_message: { text?: string; created_at?: string } | string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: ThreadItem[];
}

export interface ThreadMessageItem {
  id: number;
  sender_id: number;
  sender_email: string;
  text: string;
  created_at: string;
}

export interface ThreadMessagesResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: ThreadMessageItem[];
}

export interface UnlockChatResponse {
  detail: string;
  thread_id?: number | string;
  thread?: ThreadItem;
}

export interface SendMessageRequest {
  threadId: number | string;
  text: string;
}

export interface SendMessageResponse {
  id: number;
  sender_id: number;
  sender_email: string;
  text: string;
  created_at: string;
}
