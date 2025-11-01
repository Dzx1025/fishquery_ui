// API response types
export interface ApiResponse<T = never> {
  status: "success" | "error";
  code: number;
  message: string;
  data: T;
  errors: string[] | null;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  subscription_type: string;
  is_subscription_active: boolean;
  daily_message_quota: number;
  messages_used_today: number;
  subscription_expiry: string | null;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth API types
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

// Front-end Page Chat types
export type Citation = {
  page_content: string;
  metadata: {
    page: number;
    chunk: number;
    total_pages: number;
    source: string;
  };
};

export type Message = {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: string;
  citations?: Citation[];
};