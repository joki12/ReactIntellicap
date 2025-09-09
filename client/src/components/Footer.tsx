import { Link } from "wouter";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-muted/30 border-t border-border py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Foundation Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <span className="text-xl font-bold text-foreground">foundation Intellcap</span>
            </div>
            <p className="text-muted-foreground">
              Empowering innovation and education through technology, mentorship, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.projects")}</Link></li>
              <li><Link href="/activities" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.activities")}</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.gallery")}</Link></li>
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="w-3 h-3" />
                <span>Casablanca, Maroc</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3 h-3" />
                <span>+212 698-5541-00</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3 h-3" />
                <span>contact@intellcap.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Foundation Intellcap. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
