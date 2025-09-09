import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle } from "lucide-react";

export default function MyActivities() {
  const { isAuthenticated, token } = useAuth();
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
      const authHeaders = getAuthHeaders(token);
      const response = await apiRequest("GET", "/api/user/participations", undefined, authHeaders);
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
            <h1 className="text-3xl font-bold text-foreground">Mes Activités</h1>
            <p className="text-muted-foreground">
              Gérez vos inscriptions aux activités
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {participationsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      participations?.length || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Total activités</div>
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
                    {participationsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      participations?.filter((p: any) => p.status === 'attended').length || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Activités terminées</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {participationsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      participations?.filter((p: any) => p.status === 'registered').length || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Activités à venir</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <XCircle className="text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {participationsLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      participations?.filter((p: any) => p.status === 'cancelled').length || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Activités annulées</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Activities List */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Mes inscriptions</h3>

              {participationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : participations && participations.length > 0 ? (
                <div className="space-y-4">
                  {participations
                    .filter((participation: any) => participation.status !== 'cancelled')
                    .map((participation: any) => (
                    <div key={participation.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {participation.activity?.title || "Activité"}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{participation.activity?.location || "Lieu non spécifié"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {participation.activity?.date 
                                ? new Date(participation.activity.date).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : "Date non spécifiée"
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">
                            {participation.activity?.type || "Type non spécifié"}
                          </Badge>
                          <Badge variant={
                            participation.status === 'attended' ? 'default' :
                            participation.status === 'registered' ? 'secondary' : 'destructive'
                          }>
                            {participation.status === 'attended' ? 'Terminé' :
                             participation.status === 'registered' ? 'Inscrit' : 'Annulé'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {participation.activity?.registeredCount || 0}/{participation.activity?.capacity || 0} inscrits
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune activité</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'êtes inscrit à aucune activité pour le moment.
                  </p>
                  <Button onClick={() => setLocation("/activities")}>
                    Découvrir les activités
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
