import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import ylgBrandLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

const adminLoginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

interface AdminLoginProps {
  onSuccess?: (token: string, admin: any) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const handleLogin = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.token || !result.admin) {
        throw new Error('Invalid response from server');
      }
      
      toast({
        title: "Admin Login Successful",
        description: `Welcome back, ${result.admin.firstName}!`,
      });
      
      // Store the token
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUser', JSON.stringify(result.admin));
      
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard';
      
      onSuccess?.(result.token, result.admin);
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#fdfdfb] shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center items-center mb-4">
            <img src={ylgBrandLogo} alt="YoLuxGo™" className="h-10 sm:h-12 mr-1" />
            <span className="font-serif text-2xl text-[#0a1a2f] font-light">
              YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-[#d4af37]">™</sup>
            </span>
          </div>
          <CardTitle className="text-2xl font-serif text-[#0a1a2f]">
            Admin Access
          </CardTitle>
          <p className="text-[#666] text-sm">
            Master Administration Portal
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                placeholder="Enter your email address"
                {...register("username")}
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] text-[#0a1a2f] font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Access Admin Panel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}