import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "@/lib/auth";

export function useAuth() {
  const hasValidToken = checkAuthStatus();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: hasValidToken, // Only fetch user data if we have a valid token
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && hasValidToken,
  };
}