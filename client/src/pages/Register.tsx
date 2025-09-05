import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { AuthModals } from "@/components/AuthModals";

export default function Register() {
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
          showModal="register"
          onClose={() => setLocation("/")}
          onSwitch={() => setLocation("/login")}
        />
      </div>
    </div>
  );
}
