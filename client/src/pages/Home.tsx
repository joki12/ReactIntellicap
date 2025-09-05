import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/ProjectCard";
import { ActivityCard } from "@/components/ActivityCard";
import { GalleryModal } from "@/components/GalleryModal";
import { useState } from "react";
import { Link } from "wouter";
import { 
  GraduationCap, 
  Users, 
  Trophy,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  Code,
  Wrench,
  DollarSign
} from "lucide-react";
import { Project, Activity } from "@shared/schema";

export default function Home() {
  const { t } = useLanguage();
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities", "upcoming"],
    select: (data) => data?.slice(0, 4) // Show only first 4 upcoming activities
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const featuredProjects = projects?.slice(0, 3) || [];
  const featuredActivity = activities?.[0];
  const upcomingActivities = activities?.slice(1) || [];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3",
      alt: "Hackathon team collaboration",
      title: "Hackathon 2024"
    },
    {
      src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3",
      alt: "Workshop presentation session", 
      title: "Workshop React"
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3",
      alt: "Networking event",
      title: "Événement Networking"
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3",
      alt: "Innovation lab workspace",
      title: "Lab Innovation"
    },
  ];

  const handleGalleryClick = (index: number) => {
    setGalleryIndex(index);
    setGalleryModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32" data-testid="hero-section">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight" data-testid="hero-title">
                  Empowering Innovation &{" "}
                  <span className="text-primary">Education</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed" data-testid="hero-subtitle">
                  {t("hero.subtitle")}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/projects">
                  <Button size="lg" className="group" data-testid="hero-discover-button">
                    {t("hero.discover")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" asChild data-testid="hero-donate-button">
                  <a href="#donations">{t("hero.donate")}</a>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="stat-projects">
                    {stats?.projects || 150}+
                  </div>
                  <div className="text-sm text-muted-foreground">{t("stats.projects")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary" data-testid="stat-beneficiaries">
                    {stats?.beneficiaries || 5000}+
                  </div>
                  <div className="text-sm text-muted-foreground">{t("stats.beneficiaries")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent" data-testid="stat-workshops">
                    {stats?.workshops || 200}+
                  </div>
                  <div className="text-sm text-muted-foreground">{t("stats.workshops")}</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Team collaboration in innovation space" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="hero-image"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border glass-effect">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <Users className="text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Communauté active</div>
                    <div className="text-sm text-muted-foreground">Plus de 1,000 membres</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-muted/50" data-testid="projects-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("projects.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </div>
          
          {projectsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild size="lg" data-testid="view-all-projects">
              <Link href="/projects">{t("projects.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20" data-testid="activities-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("activities.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("activities.subtitle")}
            </p>
          </div>
          
          {activitiesLoading ? (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl h-96 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-xl h-32 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Featured Activity */}
              {featuredActivity && (
                <ActivityCard activity={featuredActivity} featured={true} />
              )}
              
              {/* Upcoming Activities List */}
              <div className="space-y-4">
                {upcomingActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button variant="outline" asChild size="lg" data-testid="view-all-activities">
              <Link href="/activities">{t("activities.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-muted/50" data-testid="gallery-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("gallery.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("gallery.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
                onClick={() => handleGalleryClick(index)}
                data-testid={`gallery-item-${index}`}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h4 className="font-semibold text-sm">{image.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donations Section */}
      <section id="donations" className="py-20" data-testid="donations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Soutenez notre Mission</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Votre contribution nous aide à soutenir plus de projets innovants et à former la prochaine génération de leaders technologiques
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Financial Donation */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Don Financier</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Contribuez financièrement au développement de nos programmes et projets.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">50€</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">100€</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">250€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Donation */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Code className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Don Technique</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Partagez votre expertise en tant que mentor, formateur ou consultant.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Mentorat</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Formation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Material Donation */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wrench className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Don Matériel</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Équipements informatiques, matériel de développement, ou autres ressources.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Ordinateurs</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Serveurs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="group" data-testid="make-donation-button">
              <Heart className="w-4 h-4 mr-2" />
              Faire un don
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/50" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("contact.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <MapPin className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("contact.address")}</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Avenue de l'Innovation<br />Casablanca, Maroc
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Phone className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("contact.phone")}</h4>
                  <p className="text-sm text-muted-foreground">+212 5XX-XXXX-XX</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                  <Mail className="text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("contact.email")}</h4>
                  <p className="text-sm text-muted-foreground">contact@intellcap.ma</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Clock className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("contact.hours")}</h4>
                  <p className="text-sm text-muted-foreground">
                    Lun - Ven: 9h00 - 18h00<br />Sam: 9h00 - 13h00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" data-testid="contact-us-button">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Foundation Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-primary-foreground text-lg" />
                </div>
                <span className="text-xl font-bold text-foreground">Fondation Intellcap</span>
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
            
            {/* Services */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground">Mentorat</span></li>
                <li><span className="text-muted-foreground">Formation</span></li>
                <li><span className="text-muted-foreground">Espace de travail</span></li>
                <li><span className="text-muted-foreground">Financement</span></li>
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
                  <span>+212 5XX-XXXX-XX</span>
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
              © 2024 Fondation Intellcap. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Gallery Modal */}
      <GalleryModal 
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        images={galleryImages}
        initialIndex={galleryIndex}
      />
    </div>
  );
}
