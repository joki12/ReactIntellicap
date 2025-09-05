import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { Project } from "@shared/schema";

export default function Projects() {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects", statusFilter === "all" ? undefined : statusFilter],
  });

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const handleProjectDetails = (project: Project) => {
    // Could implement a modal or navigate to project detail page
    console.log("View project details:", project);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground">Impossible de charger les projets</p>
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
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="projects-title">
              {t("projects.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="projects-subtitle">
              {t("projects.subtitle")}
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
                placeholder="Rechercher des projets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="projects-search"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { key: "all", label: t("projects.filter.all") },
              { key: "ongoing", label: t("projects.filter.ongoing") },
              { key: "completed", label: t("projects.filter.completed") },
              { key: "upcoming", label: t("projects.filter.upcoming") },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={statusFilter === filter.key ? "default" : "outline"}
                onClick={() => setStatusFilter(filter.key)}
                data-testid={`filter-${filter.key}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground">
              Essayez d'ajuster vos critères de recherche ou vos filtres.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onViewDetails={handleProjectDetails}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredProjects.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center text-muted-foreground">
              <p data-testid="projects-count">
                {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
