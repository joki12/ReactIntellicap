import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuthModals } from "./AuthModals";
import { 
  GraduationCap, 
  Menu, 
  X,
  User,
  Settings,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<"login" | "register" | null>(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/activities", label: t("nav.activities") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/don", label: "Don" },
    { href: "/contact", label: t("nav.contact") },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3" data-testid="logo-link">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <span className="text-xl font-bold text-foreground">foundation Intellcap</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  data-testid={`nav-link-${item.href.slice(1) || 'home'}`}
                >
                  <span className={`transition-colors ${
                    location === item.href 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Auth & Language */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <Link href="/admin" data-testid="admin-link">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        {t("nav.admin")}
                      </Button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" data-testid="user-menu">
                        <User className="w-4 h-4 mr-2" />
                        {user?.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" data-testid="dashboard-link">
                          <User className="w-4 h-4 mr-2" />
                          {t("nav.dashboard")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("nav.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthModal("login")}
                    data-testid="login-button"
                  >
                    {t("nav.login")}
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal("register")}
                    data-testid="register-button"
                  >
                    {t("nav.register")}
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4" data-testid="mobile-menu">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-nav-link-${item.href.slice(1) || 'home'}`}
                  >
                    <div className={`block px-3 py-2 rounded-md transition-colors ${
                      location === item.href 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}>
                      {item.label}
                    </div>
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <>
                    <Link 
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-dashboard-link"
                    >
                      <div className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted">
                        {t("nav.dashboard")}
                      </div>
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid="mobile-admin-link"
                      >
                        <div className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted">
                          {t("nav.admin")}
                        </div>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <AuthModals 
        showModal={showAuthModal}
        onClose={() => setShowAuthModal(null)}
        onSwitch={(mode) => setShowAuthModal(mode)}
      />
    </>
  );
}
