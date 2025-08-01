import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Shield, Users } from "lucide-react";
import { Link } from "wouter";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753669210755.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface PersonnelLoginProps {
  onSuccess?: (personnelData: any) => void;
}

export function PersonnelLogin({ onSuccess }: PersonnelLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => {
      return apiRequest("POST", "/api/personnel/login", data);
    },
    onSuccess: async (response) => {
      // Personnel now login through main auth system
      toast({
        title: "Please use main login",
        description: "Personnel accounts now use the main login system.",
        variant: "destructive",
      });
      
      // Redirect to main auth
      window.location.href = "/auth";
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <Card className="w-full max-w-md bg-navy/50 border-gold/20">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={ylgLogo} alt="YLG" className="w-16 h-16 mr-2" />
            <span className="text-3xl font-bold text-gold">YoLuxGo™</span>
          </div>
          <CardTitle className="text-2xl font-bold text-cream flex items-center justify-center space-x-2">
            <Users className="w-6 h-6 text-gold" />
            <span>Personnel Access</span>
          </CardTitle>
          <p className="text-cream/70 mt-2">
            Secure login for designated personnel
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cream">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-navy/50 border-gold/20 text-cream"
                placeholder="your.email@yoluxgo.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-cream">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="bg-navy/50 border-gold/20 text-cream pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream/60 hover:text-cream transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/80 hover:to-gold text-navy font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Access Personnel Portal"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gold/20">
            <div className="text-center space-y-3">
              <p className="text-cream/60 text-sm">
                Personnel access is restricted to authorized staff only.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <Link href="/" className="text-cream/50 hover:text-gold transition-colors">
                  ← Back to Home
                </Link>
                <span className="text-cream/30">•</span>
                <Link href="/contact" className="text-cream/50 hover:text-gold transition-colors">
                  Need Help?
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PersonnelLogin;