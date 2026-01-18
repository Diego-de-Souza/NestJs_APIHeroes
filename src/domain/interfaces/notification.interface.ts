export interface NotificationInterface {
  id: number;
  usuario_id: number;
  title: string;
  message: string;
  image: string | null;
  author: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  tag_color: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';
