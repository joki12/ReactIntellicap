import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-secondary/10 text-secondary";
      case "completed": return "bg-primary/10 text-primary";
      case "upcoming": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ongoing": return "En cours";
      case "completed": return "Terminé";
      case "upcoming": return "À venir";
      default: return status;
    }
  };

  return (
    <Card
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
          <Badge className={getStatusColor(project.status)}>
            {getStatusLabel(project.status)}
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

        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80"
          onClick={() => onViewDetails?.(project)}
          data-testid={`project-learn-more-${project.id}`}
        >
          En savoir plus
        </Button>
      </CardFooter>
    </Card>
  );
}
