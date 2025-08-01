import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Mail } from "lucide-react";
import ylgBrandLogo from "@assets/image_1753678077310.png";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      // Simulate forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: "Password reset email sent" };
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-6 pb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={ylgBrandLogo} 
              alt="YoLuxGo™" 
              className="h-12 mr-0.5"
            />
            <span className="font-serif text-2xl text-[#0a1a2f] font-light">
              YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-[#d4af37]">™</sup>
            </span>
          </div>
          <p className="text-xs text-[#666] uppercase tracking-wider text-center mb-4">
            Discreet Luxury. Global Security.
          </p>
          <CardTitle className="text-xl text-center text-[#0a1a2f] font-medium">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-[#0a1a2f] font-medium">
                Password reset instructions sent
              </p>
              <p className="text-sm text-[#666] mt-1">
                We've sent a secure link to{" "}
                <span className="font-medium">{getValues("email")}</span>
              </p>
            </div>
            
            <p className="text-xs text-[#666]">
              Don't see the email? Check your spam folder or try again in a few minutes.
            </p>
          </div>

          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a1a2f] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-6 pb-8">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={ylgBrandLogo} 
            alt="YoLuxGo™" 
            className="h-12 mr-0.5"
          />
          <span className="font-serif text-2xl text-[#0a1a2f] font-light">
            YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-[#d4af37]">™</sup>
          </span>
        </div>
        <p className="text-xs text-[#666] uppercase tracking-wider text-center mb-4">
          Discreet Luxury. Global Security.
        </p>
        <CardTitle className="text-xl text-center text-[#0a1a2f] font-medium">
          Reset Your Password
        </CardTitle>
        <p className="text-sm text-[#666] text-center">
          Enter your email address and we'll send you a secure link to reset your password.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
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

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] text-[#0a1a2f] font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            {onBack && (
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a1a2f] transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            )}
          </div>

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