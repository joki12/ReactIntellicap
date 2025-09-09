import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Users,
  FileText,
  DoorOpen,
  UserCheck
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais",
      });
      // Reset form
      const form = document.getElementById("contact-form") as HTMLFormElement;
      if (form) form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const spaceRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/space-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée",
        description: "Nous examinerons votre demande et vous répondrons rapidement",
      });
      // Reset form
      const form = document.getElementById("space-form") as HTMLFormElement;
      if (form) form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la demande",
        variant: "destructive",
      });
    }
  });

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    contactMutation.mutate(data);
  };

  const handleSpaceRequest = async (e: React.FormEvent<HTMLFormElement>, type: "room" | "mentorship") => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      type,
      details: formData.get("details") as string,
    };

    spaceRequestMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="contact-title">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="contact-subtitle">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Information */}
        <div className="grid lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <MapPin className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.address")}</h3>
                <p className="text-sm text-muted-foreground">
                  123 Avenue de l'Innovation<br />Casablanca, Maroc
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                <Phone className="text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.phone")}</h3>
                <p className="text-sm text-muted-foreground">+212 698-5541-00</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <Mail className="text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.email")}</h3>
                <p className="text-sm text-muted-foreground">contact@intellcap.ma</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="p-0 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Clock className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.hours")}</h3>
                <p className="text-sm text-muted-foreground">
                  Lun - Ven: 9h00 - 18h00<br />Sam: 9h00 - 13h00
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {t("contact.sendMessage")}
              </h2>
              <p className="text-muted-foreground">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </p>
            </div>

            <Card className="p-6">
              <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom complet</Label>
                    <Input 
                      id="contact-name"
                      name="name"
                      required 
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input 
                      id="contact-email"
                      name="email"
                      type="email"
                      required 
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Sujet</Label>
                  <Select name="subject" required>
                    <SelectTrigger data-testid="contact-subject-select">
                      <SelectValue placeholder="Choisissez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Question générale</SelectItem>
                      <SelectItem value="partnership">Partenariat</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="program">Inscription programme</SelectItem>
                      <SelectItem value="support">Support technique</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea 
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder="Décrivez votre demande ou votre message..."
                    required
                    data-testid="contact-message-input"
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox id="contact-privacy" required />
                  <Label htmlFor="contact-privacy" className="text-sm">
                    J'accepte que mes données soient utilisées pour traiter ma demande conformément à notre politique de confidentialité.
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="contact-submit"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t("contact.send")}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Space Requests */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Demandes d'Espaces & Mentorat
              </h2>
              <p className="text-muted-foreground">
                Besoin d'un espace de travail ou d'un accompagnement ? Faites votre demande ici
              </p>
            </div>

            {/* Room Request */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <DoorOpen className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Demande de Salle</h3>
                  <p className="text-sm text-muted-foreground">Réservez un espace pour vos ateliers ou événements</p>
                </div>
              </div>
              
              <form id="space-form" onSubmit={(e) => handleSpaceRequest(e, "room")} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Nom</Label>
                    <Input 
                      id="room-name"
                      name="name"
                      required 
                      data-testid="room-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-email">Email</Label>
                    <Input 
                      id="room-email"
                      name="email"
                      type="email"
                      required 
                      data-testid="room-email-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="room-details">Description de l'événement</Label>
                  <Textarea 
                    id="room-details"
                    name="details"
                    rows={3}
                    placeholder="Décrivez votre événement, la date souhaitée, le nombre de participants..."
                    required
                    data-testid="room-details-input"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  data-testid="room-request-submit"
                >
                  <DoorOpen className="w-4 h-4 mr-2" />
                  Envoyer la demande de salle
                </Button>
              </form>
            </Card>

            {/* Mentorship Request */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Demande de Mentorat</h3>
                  <p className="text-sm text-muted-foreground">Bénéficiez de l'accompagnement de nos experts</p>
                </div>
              </div>
              
              <form onSubmit={(e) => handleSpaceRequest(e, "mentorship")} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentor-name">Nom</Label>
                    <Input 
                      id="mentor-name"
                      name="name"
                      required 
                      data-testid="mentor-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentor-email">Email</Label>
                    <Input 
                      id="mentor-email"
                      name="email"
                      type="email"
                      required 
                      data-testid="mentor-email-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mentor-details">Objectifs et attentes</Label>
                  <Textarea 
                    id="mentor-details"
                    name="details"
                    rows={3}
                    placeholder="Décrivez votre projet, vos défis actuels et ce que vous attendez du mentorat..."
                    required
                    data-testid="mentor-details-input"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  data-testid="mentor-request-submit"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Envoyer la demande de mentorat
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Support réactif</h3>
            <p className="text-sm text-muted-foreground">
              Nous répondons généralement sous 24h
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Équipe dédiée</h3>
            <p className="text-sm text-muted-foreground">
              Une équipe d'experts à votre écoute
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Suivi personnalisé</h3>
            <p className="text-sm text-muted-foreground">
              Suivi régulier de votre demande
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
