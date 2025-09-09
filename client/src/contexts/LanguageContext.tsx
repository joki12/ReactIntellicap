import { createContext, useState, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.projects": "Projets",
    "nav.activities": "Activités", 
    "nav.gallery": "Galerie",
    "nav.donations": "Dons",
    "nav.contact": "Contact",
    "nav.login": "Connexion",
    "nav.register": "S'inscrire",
    "nav.dashboard": "Tableau de bord",
    "nav.admin": "Administration",
    "nav.logout": "Déconnexion",
    
    // Hero section
    "hero.title": "Empowering Innovation & Education",
    "hero.subtitle": "La foundation Intellcap soutient l'innovation technologique et l'éducation en offrant mentorat, espaces de travail et financement aux entrepreneurs et étudiants.",
    "hero.discover": "Découvrir nos projets",
    "hero.donate": "Faire un don",
    
    // Stats
    "stats.projects": "Projets soutenus",
    "stats.beneficiaries": "Bénéficiaires", 
    "stats.workshops": "Workshops",
    
    // Projects
    "projects.title": "Nos Projets",
    "projects.subtitle": "Découvrez les initiatives innovantes que nous soutenons dans différents domaines technologiques",
    "projects.filter.all": "Tous",
    "projects.filter.ongoing": "En cours",
    "projects.filter.completed": "Terminés",
    "projects.filter.upcoming": "À venir",
    "projects.viewAll": "Voir tous les projets",
    "projects.learnMore": "En savoir plus",
    "projects.participants": "participants",
    
    // Activities
    "activities.title": "Activités & Workshops",
    "activities.subtitle": "Participez à nos événements, formations et ateliers pour développer vos compétences",
    "activities.register": "S'inscrire",
    "activities.viewAll": "Voir toutes les activités",
    "activities.registered": "inscrits",
    "activities.free": "Gratuit",
    
    // Gallery
    "gallery.title": "Galerie",
    "gallery.subtitle": "Découvrez en images nos événements, projets et la vie de notre communauté",
    
    // Contact
    "contact.title": "Contactez-nous",
    "contact.subtitle": "Une question, une suggestion ou envie de collaborer ? N'hésitez pas à nous écrire",
    "contact.address": "Adresse",
    "contact.phone": "Téléphone", 
    "contact.email": "Email",
    "contact.hours": "Horaires",
    "contact.followUs": "Suivez-nous",
    "contact.sendMessage": "Envoyez-nous un message",
    "contact.send": "Envoyer le message",
    
    // Auth
    "auth.login": "Connexion",
    "auth.register": "Inscription", 
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.name": "Nom",
    "auth.firstName": "Prénom",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.rememberMe": "Se souvenir de moi",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.signIn": "Se connecter",
    "auth.signUp": "S'inscrire",
    "auth.noAccount": "Pas encore de compte ?",
    "auth.hasAccount": "Déjà un compte ?",
    "auth.acceptTerms": "J'accepte les conditions d'utilisation",
    
    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.edit": "Modifier", 
    "common.delete": "Supprimer",
    "common.confirm": "Confirmer",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.close": "Fermer",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.projects": "Projects", 
    "nav.activities": "Activities",
    "nav.gallery": "Gallery",
    "nav.donations": "Donations",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",
    "nav.logout": "Logout",
    
    // Hero section
    "hero.title": "Empowering Innovation & Education",
    "hero.subtitle": "foundation Intellcap supports technological innovation and education by providing mentorship, workspaces and funding to entrepreneurs and students.",
    "hero.discover": "Discover our projects",
    "hero.donate": "Donate",
    
    // Stats
    "stats.projects": "Supported projects",
    "stats.beneficiaries": "Beneficiaries",
    "stats.workshops": "Workshops",
    
    // Projects
    "projects.title": "Our Projects",
    "projects.subtitle": "Discover the innovative initiatives we support in different technological domains",
    "projects.filter.all": "All",
    "projects.filter.ongoing": "Ongoing",
    "projects.filter.completed": "Completed", 
    "projects.filter.upcoming": "Upcoming",
    "projects.viewAll": "View all projects",
    "projects.learnMore": "Learn more",
    "projects.participants": "participants",
    
    // Activities
    "activities.title": "Activities & Workshops",
    "activities.subtitle": "Join our events, training and workshops to develop your skills",
    "activities.register": "Register",
    "activities.viewAll": "View all activities",
    "activities.registered": "registered",
    "activities.free": "Free",
    
    // Gallery
    "gallery.title": "Gallery", 
    "gallery.subtitle": "Discover our events, projects and community life in pictures",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Have a question, suggestion or want to collaborate? Feel free to reach out",
    "contact.address": "Address",
    "contact.phone": "Phone",
    "contact.email": "Email", 
    "contact.hours": "Hours",
    "contact.followUs": "Follow us",
    "contact.sendMessage": "Send us a message",
    "contact.send": "Send message",
    
    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name", 
    "auth.firstName": "First Name",
    "auth.confirmPassword": "Confirm Password",
    "auth.rememberMe": "Remember me",
    "auth.forgotPassword": "Forgot password?",
    "auth.signIn": "Sign in",
    "auth.signUp": "Sign up",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.acceptTerms": "I accept the terms of service",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel", 
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.close": "Close",
  }
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState("fr");

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
