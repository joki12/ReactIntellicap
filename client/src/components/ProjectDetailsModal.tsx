import { Project } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { Users, Calendar, MapPin, Target, Clock } from "lucide-react";

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (projectId: string) => {
      if (!isAuthenticated) {
        throw new Error("Vous devez être connecté pour vous inscrire");
      }

      const response = await apiRequest(
        "POST",
        `/api/projects/${projectId}/register`,
        {},
        getAuthHeaders(token)
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à ce projet",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Impossible de s'inscrire à ce projet",
        variant: "destructive",
      });
    },
  });

  const handleRegister = () => {
    if (!project) return;

    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour vous inscrire à un projet",
        variant: "destructive",
      });
      return;
    }

    // Check if project is completed
    if (project.status === 'completed') {
      toast({
        title: "Projet terminé",
        description: "Les inscriptions ne sont plus possibles pour ce projet terminé",
        variant: "destructive",
      });
      return;
    }

    // Check if project is not ongoing
    if (project.status !== 'ongoing') {
      toast({
        title: "Inscription non disponible",
        description: "Les inscriptions ne sont pas encore ouvertes pour ce projet",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(project.id);
  };

  // Check if registration is allowed
  const canRegister = () => {
    if (!isAuthenticated) return false;
    if (project?.status === 'completed') return false;
    if (project?.status !== 'ongoing') return false;
    return true;
  };

  // Get registration button text based on project status
  const getRegisterButtonText = () => {
    if (!isAuthenticated) return "Se connecter pour s'inscrire";
    if (project?.status === 'completed') return "Projet terminé";
    if (project?.status !== 'ongoing') return "Inscription non disponible";
    if (registerMutation.isPending) return "Inscription...";
    return "S'inscrire au projet";
  };
  if (!project) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
            <span className="text-sm text-muted-foreground">{project.domain}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Project Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Description du projet
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">{project.participants} inscrits</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium">Statut</p>
                  <p className="text-sm text-muted-foreground">{getStatusLabel(project.status)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Domaine</p>
                  <p className="text-sm text-muted-foreground">{project.domain}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Durée estimée</p>
                  <p className="text-sm text-muted-foreground">3-6 mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Goals/Objectives */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Objectifs du projet</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Développer des compétences techniques avancées</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Collaborer avec une équipe multidisciplinaire</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Contribuer à des projets à impact social</span>
              </li>
            </ul>
          </div>

          {/* Skills Required */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Compétences requises</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Node.js</Badge>
              <Badge variant="outline">Git</Badge>
              <Badge variant="outline">Travail d'équipe</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              className="flex-1"
              onClick={handleRegister}
              disabled={!canRegister() || registerMutation.isPending}
            >
              {getRegisterButtonText()}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
