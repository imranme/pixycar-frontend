export interface NotificationItem {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  related_listing_id: number | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: NotificationItem[];
}

export interface MarkReadRequest {
  id?: number;
}

export interface MarkReadResponse {
  detail: string;
}

export interface UnreadCountResponse {
  unread_count: number;
  unread_messages_count?: number;
  unread_notifications_count?: number;
}
