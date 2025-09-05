import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/ActivityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { Search, Filter, Calendar } from "lucide-react";
import { Activity } from "@shared/schema";

export default function Activities() {
  const { t } = useLanguage();
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const registerMutation = useMutation({
    mutationFn: async (activityId: string) => {
      if (!isAuthenticated) {
        throw new Error("Vous devez être connecté pour vous inscrire");
      }
      
      const response = await apiRequest(
        "POST",
        `/api/activities/${activityId}/register`,
        {},
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à cette activité",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Impossible de s'inscrire à cette activité",
        variant: "destructive",
      });
    },
  });

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = searchQuery === "" || 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    
    return matchesSearch && matchesType;
  }) || [];

  const handleRegister = (activity: Activity) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour vous inscrire à une activité",
        variant: "destructive",
      });
      return;
    }
    
    registerMutation.mutate(activity.id);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground">Impossible de charger les activités</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="activities-title">
              {t("activities.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="activities-subtitle">
              {t("activities.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher des activités..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="activities-search"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "Toutes" },
              { key: "workshop", label: "Workshop" },
              { key: "hackathon", label: "Hackathon" },
              { key: "formation", label: "Formation" },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={typeFilter === filter.key ? "default" : "outline"}
                onClick={() => setTypeFilter(filter.key)}
                data-testid={`filter-${filter.key}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Activities List */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucune activité trouvée</h3>
            <p className="text-muted-foreground">
              Essayez d'ajuster vos critères de recherche ou vos filtres.
            </p>
          </div>
        ) : (
          <div className="space-y-6" data-testid="activities-list">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id}>
                {index === 0 && (
                  <div className="mb-8">
                    <ActivityCard 
                      activity={activity} 
                      onRegister={handleRegister}
                      featured={true}
                    />
                  </div>
                )}
                {index > 0 && (
                  <ActivityCard 
                    activity={activity} 
                    onRegister={handleRegister}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {filteredActivities.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Inscription gratuite</h3>
                <p className="text-sm text-muted-foreground">
                  Toutes nos activités sont gratuites pour les participants
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Certificats</h3>
                <p className="text-sm text-muted-foreground">
                  Obtenez un certificat de participation pour chaque activité complétée
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Filter className="text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Networking</h3>
                <p className="text-sm text-muted-foreground">
                  Rencontrez d'autres entrepreneurs et développez votre réseau
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {filteredActivities.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            <p data-testid="activities-count">
              {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
