import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { useState, useEffect } from "react";
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
  DollarSign,
  Target,
  Lightbulb,
  Award,
  Globe,
  BookOpen,
  Zap
} from "lucide-react";
import { Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add smooth scroll behavior and handle anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle anchor link clicks with offset
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.hash && link.hash.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(link.hash);
        if (element) {
          const offset = 80; // Account for fixed navigation
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
  });

  // Check if all critical data is loaded
  const isPageLoading = projectsLoading;

  // Add a small delay to ensure smooth transition
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    if (!isPageLoading) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isPageLoading]);

  const featuredProjects = projects?.slice(0, 3) || [];

  // Show loading state until all critical data is loaded
  if (isPageLoading || !showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="relative">
            {/* Main spinner */}
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            {/* Secondary spinner for visual effect */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-secondary rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
            {/* Inner accent spinner */}
            <div className="absolute inset-2 w-16 h-16 border-3 border-transparent border-t-accent rounded-full animate-spin mx-auto" style={{ animationDuration: '0.8s' }}></div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Bienvenue sur Intellcap</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chargement de votre expérience personnalisée...
            </p>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse loading-bar-animation"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen content-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center" data-testid="hero-section">
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
      <section className="py-20 bg-muted/50 min-h-[600px]" data-testid="projects-section">
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
                <Card key={i} className="overflow-hidden">
                  <div className="relative h-48 bg-muted animate-pulse rounded-t-lg"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-muted rounded-full w-20 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                  data-testid={`project-card-${project.id}`}
                >
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        project.status === "ongoing" ? "bg-secondary/10 text-secondary" :
                        project.status === "completed" ? "bg-primary/10 text-primary" :
                        project.status === "upcoming" ? "bg-accent/10 text-accent" :
                        "bg-muted text-muted-foreground"
                      }>
                        {project.status === "ongoing" ? "En cours" :
                         project.status === "completed" ? "Terminé" :
                         project.status === "upcoming" ? "À venir" :
                         project.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{project.domain}</span>
                    </div>

                    <h3
                      className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors"
                      data-testid={`project-title-${project.id}`}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="text-muted-foreground line-clamp-3"
                      data-testid={`project-description-${project.id}`}
                    >
                      {project.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm" data-testid={`project-participants-${project.id}`}>
                        {project.participants} {t("projects.participants")}
                      </span>
                    </div>

                    {project.status === "completed" ? (
                      <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-md">
                        Terminé
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                        onClick={() => window.location.href = `/projects`}
                        data-testid={`project-learn-more-${project.id}`}
                      >
                        En savoir plus
                      </Button>
                    )}
                  </CardFooter>
                </Card>
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

      {/* About Us Section */}
      <section className="py-20 bg-muted/50 min-h-[600px]" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">À propos de nous</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre mission, nos valeurs et notre impact dans la communauté technologique marocaine
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Notre Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Foundation Intellcap est dédiée à l'innovation et à l'éducation technologique au Maroc. 
                  Nous croyons que la technologie est un levier essentiel pour le développement économique 
                  et social de notre pays.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Nos Valeurs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="text-primary w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Innovation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-secondary w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Éducation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="text-accent w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Communauté</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="text-primary w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Excellence</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Team collaboration and innovation" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-lg border border-border glass-effect">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">5+</div>
                    <div className="text-sm text-muted-foreground">Années d'expérience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">1000+</div>
                    <div className="text-sm text-muted-foreground">Bénéficiaires</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Impact Stats */}
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <GraduationCap className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Étudiants formés</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Lightbulb className="text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">150+</div>
                  <div className="text-sm text-muted-foreground">Projets innovants</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">50+</div>
                  <div className="text-sm text-muted-foreground">Mentors actifs</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">Partenaires</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 min-h-[600px]" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Nos Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment nous accompagnons l'innovation et l'éducation technologique au Maroc
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Formation et Éducation */}
            <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Formation et Éducation</h3>
                  <p className="text-muted-foreground text-sm">
                    Programmes de formation complets en développement web, mobile, data science et intelligence artificielle.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Accompagnement de Projets */}
            <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Lightbulb className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Accompagnement de Projets</h3>
                  <p className="text-muted-foreground text-sm">
                    Support technique et méthodologique pour transformer vos idées innovantes en projets concrets.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mentorat et Coaching */}
            <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mentorat et Coaching</h3>
                  <p className="text-muted-foreground text-sm">
                    Accompagnement personnalisé par des experts du secteur pour accélérer votre développement professionnel.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Événements et Workshops */}
            <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Zap className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Événements et Workshops</h3>
                  <p className="text-muted-foreground text-sm">
                    Organisation d'événements, ateliers pratiques et conférences pour favoriser l'échange de connaissances.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Partenariats Stratégiques */}
            <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Globe className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Partenariats Stratégiques</h3>
                  <p className="text-muted-foreground text-sm">
                    Collaboration avec entreprises, universités et organisations pour créer des opportunités uniques.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Innovation Lab */}
            <Card className="p-6 border border-border hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Award className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Innovation Lab</h3>
                  <p className="text-muted-foreground text-sm">
                    Espace dédié à l'expérimentation, au prototypage et au développement de solutions innovantes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donations Section */}
      <section id="donations" className="py-20 min-h-[600px]" data-testid="donations-section">
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
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">50 MAD</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">100 MAD</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">250 MAD</span>
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
            <Button size="lg" className="group" asChild data-testid="make-donation-button">
              <Link href="/don">
                <Heart className="w-4 h-4 mr-2" />
                Faire un don
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/50 min-h-[500px]" data-testid="contact-section">
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
                  <p className="text-sm text-muted-foreground">+212 698-5541-00</p>
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
                <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.gallery")}</Link></li>
                <li><Link href="/don" className="text-muted-foreground hover:text-primary transition-colors">Don</Link></li>
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
    </div>
  );
}
