import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { User, Mail, Calendar, MapPin, Edit } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, token, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const authHeaders = getAuthHeaders(token);
      const response = await apiRequest("GET", "/api/user/stats", undefined, authHeaders);
      return response.json();
    }
  });

  // Refetch user data when component mounts to ensure latest data
  const { data: freshUserData } = useQuery({
    queryKey: ["user-profile"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const authHeaders = getAuthHeaders(token);
      const response = await apiRequest("GET", "/api/auth/me", undefined, authHeaders);
      return response.json();
    }
  });

  // Use fresh user data if available, otherwise fall back to auth context
  const displayUser = freshUserData?.user || user;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Vérification de l'authentification...</p>
      </div>
    </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Information Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Informations personnelles</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{displayUser.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse email</p>
                  <p className="font-medium">{displayUser.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Membre depuis</p>
                  <p className="font-medium">
                    {new Date(displayUser.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setLocation("/settings")}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm">Activités rejointes</span>
                </div>
                <span className="font-semibold">
                  {userStatsLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    userStats?.activitiesJoined || 0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Projets terminés</span>
                </div>
                <span className="font-semibold">
                  {userStatsLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    userStats?.completedProjects || 0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="text-sm">Heures formation</span>
                </div>
                <span className="font-semibold">
                  {userStatsLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    `${userStats?.trainingHours || 0}h`
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" onClick={() => setLocation("/my-activities")}>
              <Calendar className="w-4 h-4 mr-2" />
              Mes activités
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setLocation("/my-projects")}>
              <User className="w-4 h-4 mr-2" />
              Mes projets
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
