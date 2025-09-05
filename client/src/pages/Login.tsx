import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { AuthModals } from "@/components/AuthModals";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md">
        <AuthModals 
          showModal="login"
          onClose={() => setLocation("/")}
          onSwitch={() => setLocation("/register")}
        />
      </div>
    </div>
  );
}
