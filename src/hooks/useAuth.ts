import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoginCredentials, RegisterData, UserProfile } from "@/lib/types";
import authService from "@/lib/services/auth-service";

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface InitialAuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

export function useAuth(initialState?: InitialAuthState) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: initialState?.user || null,
    isLoading: initialState ? false : true,
    isAuthenticated: initialState?.isAuthenticated || false,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.getProfile();
      if (response.status === "success" && response.data) {
        setState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: response.errors ? response.errors[0] : "Failed to fetch user",
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: "Authentication error",
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      if (response.status === "success") {
        await fetchUser();
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.errors ? response.errors[0] : response.message,
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Login failed. Please try again.",
      }));
      return false;
    }
  };

  const register = async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { username, email, password, password_confirm } = data;
      const response = await authService.register({
        username,
        email,
        password,
      });
      if (response.status === "success") {
        // Optionally auto-login the user after registration
        // or redirect to login page
        // router.push("/login");
        // return true;
        const autoLoginSuccess = await login({
          email: data.email,
          password: data.password,
        });
        if (autoLoginSuccess) {
          router.push("/");
          return true;
        } else {
          router.push("/login");
          return false;
        }
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.errors
            ? Object.values(response.errors)[0][0]
            : response.message,
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Registration failed. Please try again.",
      }));
      return false;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.logout();
      if (response.status === "success") {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        router.push("/login");
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.errors ? response.errors[0] : response.message,
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Logout failed. Please try again.",
      }));
      return false;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.updateProfile(data);
      if (response.status === "success" && response.data) {
        setState((prev) => ({
          ...prev,
          user: response.data,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.errors ? response.errors[0] : response.message,
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Profile update failed. Please try again.",
      }));
      return false;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    // Only fetch user data if not provided in initialState
    if (!initialState) {
      fetchUser();
    }
  }, [fetchUser, initialState]);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    refreshUser: fetchUser,
  };
}
