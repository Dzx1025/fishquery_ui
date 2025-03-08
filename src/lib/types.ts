// API response types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  code: number;
  message: string;
  data: T | null;
  errors: string[] | null;
}

export interface UserProfile {
  email: string;
  username: string;
  subscription_type: string;
  is_subscription_active: boolean;
  daily_message_quota: number;
  messages_used_today: number;
  subscription_expiry: string | null;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

// Chat types
export interface ChatMessage {
  id?: string;
  content: string;
  message_type: "user" | "assistant";
  created_at: Date;
  chat_id: number;
}

export interface Chat {
  id: string;
  title?: string;
  session_id?: string;
  created_at: Date;
  updated_at: Date;
  user_id: number;
}
