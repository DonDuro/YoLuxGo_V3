import { useEffect } from "react";

export function AdminBypass() {
  useEffect(() => {
    // Create a temporary admin token and user data
    const tempToken = "temp-admin-token-bypass";
    const tempAdmin = {
      id: "fa57e891-eb53-44ac-a000-e58fb55938f0",
      username: "calvarado@nebusis.com",
      email: "calvarado@nebusis.com",
      firstName: "Celso",
      lastName: "Alvarado",
      role: "master_admin"
    };

    // Store in localStorage
    localStorage.setItem('adminToken', tempToken);
    localStorage.setItem('adminUser', JSON.stringify(tempAdmin));

    // Redirect to dashboard
    window.location.href = '/admin/dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f] flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-serif mb-4">Admin Access</h1>
        <p>Bypassing authentication...</p>
      </div>
    </div>
  );
}