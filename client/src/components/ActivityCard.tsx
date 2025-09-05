import { Activity } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ActivityCardProps {
  activity: Activity;
  onRegister?: (activity: Activity) => void;
  featured?: boolean;
}

export function ActivityCard({ activity, onRegister, featured = false }: ActivityCardProps) {
  const { t } = useLanguage();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "workshop": return "bg-secondary/10 text-secondary";
      case "hackathon": return "bg-accent/10 text-accent";
      case "formation": return "bg-primary/10 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "workshop": return "Workshop";
      case "hackathon": return "Hackathon";
      case "formation": return "Formation";
      default: return type;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (featured) {
    return (
      <Card 
        className="hero-gradient rounded-2xl p-8 border border-border"
        data-testid={`featured-activity-${activity.id}`}
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Clock className="text-primary-foreground" />
            </div>
            <div>
              <Badge className={getTypeColor(activity.type)}>
                {getTypeLabel(activity.type)}
              </Badge>
              <h3 className="text-xl font-semibold text-foreground mt-1">
                {activity.title}
              </h3>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {activity.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {formatDate(activity.date)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {activity.location}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {activity.registeredCount}/{activity.capacity} {t("activities.registered")}
              </span>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => onRegister?.(activity)}
            disabled={activity.registeredCount >= activity.capacity}
            data-testid={`register-activity-${activity.id}`}
          >
            {activity.registeredCount >= activity.capacity 
              ? "Complet" 
              : `${t("activities.register")} ${getTypeLabel(activity.type)}`
            }
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="p-6 hover:shadow-md transition-shadow"
      data-testid={`activity-card-${activity.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={getTypeColor(activity.type)}>
              {getTypeLabel(activity.type)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(activity.date)}
            </span>
          </div>
          
          <h4 className="font-semibold text-foreground mb-1">
            {activity.title}
          </h4>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {activity.description}
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>{activity.location}</span>
            <span>{activity.capacity} places</span>
          </div>
        </div>
        
        <Button 
          size="sm"
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground"
          onClick={() => onRegister?.(activity)}
          disabled={activity.registeredCount >= activity.capacity}
          data-testid={`register-button-${activity.id}`}
        >
          {activity.registeredCount >= activity.capacity 
            ? "Complet" 
            : t("activities.register")
          }
        </Button>
      </div>
    </Card>
  );
}
