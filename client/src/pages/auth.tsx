
import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

type AuthMode = "login" | "register" | "forgot-password";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to appropriate dashboard if already authenticated
  if (isAuthenticated) {
    // Get stored user type to redirect appropriately
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.userType === 'client') {
          navigate("/client/dashboard");
        } else if (payload.userType === 'admin') {
          navigate("/admin/dashboard");
        } else if (payload.userType === 'dev_admin') {
          navigate("/dev-admin/dashboard");
        } else if (payload.userType === 'personnel') {
          navigate("/personnel/dashboard");
        } else if (payload.userType === 'regional_partner') {
          navigate("/admin/dashboard"); // Regional partners also go to admin dashboard
        } else if (payload.userType === 'service_provider') {
          navigate("/admin/dashboard"); // Service providers also go to admin dashboard  
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    } else {
      navigate("/");
    }
    return null;
  }

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a1a2f] via-[#1a2b4a] to-[#0a1a2f]">
      <div className="w-full max-w-md">
        {mode === "login" && (
          <LoginForm
            onSuccess={() => {
              // Navigation will happen automatically via useAuth hook
            }}
            onSwitchToRegister={() => setMode("register")}
            onForgotPassword={() => setMode("forgot-password")}
          />
        )}
        
        {mode === "register" && (
          <RegisterForm
            onSuccess={() => {
              // Navigation will happen automatically via useAuth hook
            }}
            onSwitchToLogin={() => setMode("login")}
          />
        )}
        
        {mode === "forgot-password" && (
          <ForgotPasswordForm
            onBack={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}