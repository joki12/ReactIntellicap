import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { FolderOpen, Users, Calendar, CheckCircle } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

export default function MyProjects() {
  const { isAuthenticated, token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const authHeaders = getAuthHeaders(token);
      const response = await apiRequest("GET", "/api/projects", undefined, authHeaders);
      return response.json();
    }
  });

  const projectsArray = Array.isArray(projects) ? projects : [];

  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const authHeaders = getAuthHeaders(token);
      const response = await apiRequest("GET", "/api/user/stats", undefined, authHeaders);
      return response.json();
    }
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div className="min-h-screen bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mes Projets</h1>
            <p className="text-muted-foreground">
              Découvrez les projets de la foundation
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {projectsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      projectsArray?.length || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Projets disponibles</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {userStatsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      userStats?.completedProjects || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Projets terminés</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {projectsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      projectsArray?.reduce((sum: number, p: any) => sum + (p.participants || 0), 0) || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Participants totaux</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardContent>
                </Card>
              ))
            ) : projectsArray && projectsArray.length > 0 ? (
              projectsArray.map((project: any) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="w-12 h-12 text-primary" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={
                        project.status === 'completed' ? 'default' :
                        project.status === 'ongoing' ? 'secondary' : 'outline'
                      }>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'ongoing' ? 'En cours' : 'À venir'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{project.participants || 0} participants</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {project.domain}
                      </Badge>
                    </div>
                    <Button className="w-full" variant="outline">
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun projet</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun projet n'est disponible pour le moment.
                </p>
                <Button onClick={() => setLocation("/projects")}>
                  Voir tous les projets
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
