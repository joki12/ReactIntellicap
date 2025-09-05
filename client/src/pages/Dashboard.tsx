import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthHeaders } from "@/lib/auth";
import { 
  CalendarCheck, 
  Trophy, 
  Clock, 
  User,
  Calendar,
  Settings,
  Activity,
  BookOpen
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, token } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: participations, isLoading: participationsLoading } = useQuery({
    queryKey: ["/api/user/participations"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/user/participations", {
        headers: getAuthHeaders(token)
      });
      if (!response.ok) throw new Error("Failed to fetch participations");
      return response.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="dashboard-title">
            {t("nav.dashboard")}
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, {user.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Profile */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground" data-testid="user-name">
                    {user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="user-email">
                    {user.email}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 pt-4 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-3" />
                    Profil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-3" />
                    Mes activités
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Mes projets
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-3" />
                    Paramètres
                  </Button>
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground" data-testid="user-activities-count">
                      {participationsLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        participations?.length || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Activités rejointes</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground">Projets terminés</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Clock className="text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">24h</div>
                    <div className="text-sm text-muted-foreground">Temps formation</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Activités récentes
              </h3>
              
              {participationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : participations && participations.length > 0 ? (
                <div className="space-y-4">
                  {participations.slice(0, 5).map((participation: any) => (
                    <div key={participation.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          Activité inscrite
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Statut: {participation.status}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        participation.status === 'attended' 
                          ? 'bg-secondary/10 text-secondary'
                          : participation.status === 'registered'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {participation.status === 'attended' ? 'Terminé' : 
                         participation.status === 'registered' ? 'Inscrit' : 'Annulé'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune activité pour le moment</p>
                  <Button asChild className="mt-4">
                    <Link href="/activities">Découvrir les activités</Link>
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto p-4">
                  <Link href="/activities" className="flex items-start space-x-3">
                    <Calendar className="w-6 h-6 text-primary mt-1" />
                    <div className="text-left">
                      <div className="font-medium">Rejoindre une activité</div>
                      <div className="text-sm text-muted-foreground">
                        Inscrivez-vous aux prochains événements
                      </div>
                    </div>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto p-4">
                  <Link href="/projects" className="flex items-start space-x-3">
                    <Trophy className="w-6 h-6 text-secondary mt-1" />
                    <div className="text-left">
                      <div className="font-medium">Explorer les projets</div>
                      <div className="text-sm text-muted-foreground">
                        Découvrez nos initiatives innovantes
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
