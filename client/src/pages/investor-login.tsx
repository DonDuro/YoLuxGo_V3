import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

export default function InvestorLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email: formData.email,
        password: formData.password,
        loginType: "investor"
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.userType === "investor") {
          toast({
            title: "Login Successful",
            description: "Welcome to YoLuxGo™ Business Plan Access",
          });
          
          // Store investor authentication
          localStorage.setItem("investorAuth", JSON.stringify({
            token: data.token,
            user: data.user,
            loginTime: new Date().toISOString()
          }));
          
          setLocation("/business-plan");
        } else {
          toast({
            title: "Access Denied",
            description: "This login portal is exclusively for verified investors.",
            variant: "destructive",
          });
        }
      } else {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials. Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-navy/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center items-center mb-4">
              <img 
                src={primaryLogo}
                alt="YoLuxGo™" 
                className="h-12 mr-0.5"
              />
              <span className="font-serif text-2xl text-navy font-light">
                YoLuxGo<sup className="text-[0.5rem] ml-0.5 text-gold">™</sup>
              </span>
            </div>
            <CardTitle className="text-2xl font-serif text-navy">Investor Access Portal</CardTitle>
            <CardDescription className="text-charcoal">
              Secure login for verified investors to access business plan and founder profile
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-navy font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-charcoal/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="investor@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 border-charcoal/20 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-navy font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-charcoal/60" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 border-charcoal/20 focus:border-gold focus:ring-gold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-charcoal/60 hover:text-charcoal"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-navy hover:bg-navy/90 text-white font-medium py-3"
              >
                {isLoading ? "Authenticating..." : "Access Business Plan"}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <div className="text-sm text-charcoal/70">
                Demo Investor Credentials:
              </div>
              <div className="bg-cream/50 p-3 rounded-lg text-xs space-y-1">
                <div><strong>Email:</strong> <span className="font-mono text-navy">investor.demo@mockylg.com</span></div>
                <div><strong>Password:</strong> <span className="font-mono text-navy">investor123</span></div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    email: "investor.demo@mockylg.com",
                    password: "investor123"
                  });
                }}
                className="text-xs border-gold text-gold hover:bg-gold hover:text-white"
              >
                Auto-Fill Demo Credentials
              </Button>
              <div className="text-xs text-charcoal/50">
                ⚠️ Please use the exact email above (note: "investor.demo", not "demo")
              </div>
              <div className="text-xs text-charcoal/60">
                For investor inquiries, contact{" "}
                <a href="mailto:yoluxgo@nebusis.com" className="text-gold hover:underline">
                  yoluxgo@nebusis.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}