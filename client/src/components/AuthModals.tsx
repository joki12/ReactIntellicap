import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthModalsProps {
  showModal: "login" | "register" | null;
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
}

export function AuthModals({ showModal, onClose, onSwitch }: AuthModalsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authApi.login(email, password);
      login(response.user, response.token);
      toast({
        title: t("common.success"),
        description: "Connexion réussie",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || "Erreur de connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast({
        title: t("common.error"),
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register(name, email, password);
      login(response.user, response.token);
      toast({
        title: t("common.success"),
        description: "Inscription réussie",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || "Erreur d'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={showModal === "login"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md" data-testid="login-modal">
          <DialogHeader>
            <DialogTitle>{t("auth.login")}</DialogTitle>
            <DialogDescription>
              Accédez à votre espace personnel
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email">{t("auth.email")}</Label>
              <Input 
                id="login-email"
                name="email"
                type="email" 
                required 
                data-testid="login-email-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">{t("auth.password")}</Label>
              <Input 
                id="login-password"
                name="password"
                type="password" 
                required 
                data-testid="login-password-input"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  {t("auth.rememberMe")}
                </Label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="login-submit"
            >
              {isLoading ? t("common.loading") : t("auth.signIn")}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {t("auth.noAccount")}{" "}
              </span>
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={() => onSwitch("register")}
                data-testid="switch-to-register"
              >
                {t("auth.signUp")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={showModal === "register"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md" data-testid="register-modal">
          <DialogHeader>
            <DialogTitle>{t("auth.register")}</DialogTitle>
            <DialogDescription>
              Rejoignez notre communauté
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="register-name">{t("auth.name")}</Label>
              <Input 
                id="register-name"
                name="name"
                type="text" 
                required 
                data-testid="register-name-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email">{t("auth.email")}</Label>
              <Input 
                id="register-email"
                name="email"
                type="email" 
                required 
                data-testid="register-email-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">{t("auth.password")}</Label>
              <Input 
                id="register-password"
                name="password"
                type="password" 
                required 
                data-testid="register-password-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">{t("auth.confirmPassword")}</Label>
              <Input 
                id="register-confirm-password"
                name="confirmPassword"
                type="password" 
                required 
                data-testid="register-confirm-password-input"
              />
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                {t("auth.acceptTerms")}
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="register-submit"
            >
              {isLoading ? t("common.loading") : t("auth.signUp")}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {t("auth.hasAccount")}{" "}
              </span>
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={() => onSwitch("login")}
                data-testid="switch-to-login"
              >
                {t("auth.signIn")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
