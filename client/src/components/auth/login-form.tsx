import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { login, type LoginRequest } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import ylgBrandLogo from "@assets/image_1753678077310.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back to YoLuxGo™!",
      });
      // Invalidate user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Redirect based on user type
      if (data.userType === 'client') {
        window.location.href = '/client/dashboard';
      } else if (data.userType === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (data.userType === 'dev_admin') {
        window.location.href = '/dev-admin/dashboard';
      } else if (data.userType === 'personnel') {
        window.location.href = '/personnel/dashboard';
      } else {
        window.location.href = '/';
      }
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message.includes("Invalid credentials") 
          ? "Invalid email or password" 
          : `Login error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-6 pb-8">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={ylgBrandLogo} 
            alt="YLG" 
            className="h-12"
          />
        </div>
        <CardTitle className="text-xl text-center text-[#0a1a2f] font-medium">
          Sign In to Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-end">
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-[#d4af37] hover:text-[#b8941f] hover:underline transition-colors"
                >
                  Forgot your password?
                </button>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] text-[#0a1a2f] font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          {onSwitchToRegister && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-[#666]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#d4af37] hover:text-[#b8941f] hover:underline font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          <div className="text-center pt-6">
            <p className="text-xs text-[#888]">
              Powered by{" "}
              <a
                href="https://www.nebusis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-[#0a1a2f] transition-colors no-underline"
              >
                Nebusis<span className="align-super text-[10px]">®</span>
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}