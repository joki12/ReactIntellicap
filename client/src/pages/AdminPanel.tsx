import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  FolderOpen, 
  Calendar,
  Heart,
  FileText,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminPanel() {
  const { isAdmin, isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else if (!isAdmin) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isAdmin, setLocation]);

  // Queries
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/admin/users", {
        headers: getAuthHeaders(token)
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    }
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isAdmin,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
    enabled: isAdmin,
  });

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["/api/donations"],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/donations", {
        headers: getAuthHeaders(token)
      });
      if (!response.ok) throw new Error("Failed to fetch donations");
      return response.json();
    }
  });

  const { data: spaceRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/space-requests"],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/space-requests", {
        headers: getAuthHeaders(token)
      });
      if (!response.ok) throw new Error("Failed to fetch requests");
      return response.json();
    }
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/contacts"],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/contacts", {
        headers: getAuthHeaders(token)
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    }
  });

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Utilisateur supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/space-requests/${requestId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Demande mise à jour" });
      queryClient.invalidateQueries({ queryKey: ["/api/space-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const filteredUsers = users?.filter((user: any) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="admin-title">
            Administration
          </h1>
          <p className="text-muted-foreground">
            Gestion de la fondation
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground" data-testid="stat-users">
                  {users?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Utilisateurs</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FolderOpen className="text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground" data-testid="stat-projects">
                  {projects?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Projets</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground" data-testid="stat-activities">
                  {activities?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Activités</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground" data-testid="stat-donations">
                  €{donations?.reduce((sum: number, d: any) => sum + parseFloat(d.amount || 0), 0).toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Dons collectés</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="users" data-testid="tab-users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projets</TabsTrigger>
            <TabsTrigger value="activities" data-testid="tab-activities">Activités</TabsTrigger>
            <TabsTrigger value="donations" data-testid="tab-donations">Dons</TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">Demandes</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Gestion des utilisateurs</h3>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="users-search"
                    />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-0">
                {usersLoading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: any) => (
                        <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" data-testid={`edit-user-${user.id}`}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteUserMutation.mutate(user.id)}
                                data-testid={`delete-user-${user.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Gestion des projets</h3>
              </div>
              
              <CardContent className="p-0">
                {projectsLoading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Domaine</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects?.map((project: any) => (
                        <TableRow key={project.id} data-testid={`project-row-${project.id}`}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.domain}</TableCell>
                          <TableCell>
                            <Badge variant={
                              project.status === 'completed' ? 'default' :
                              project.status === 'ongoing' ? 'secondary' : 'outline'
                            }>
                              {project.status === 'completed' ? 'Terminé' :
                               project.status === 'ongoing' ? 'En cours' : 'À venir'}
                            </Badge>
                          </TableCell>
                          <TableCell>{project.participants}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Gestion des activités</h3>
              </div>
              
              <CardContent className="p-0">
                {activitiesLoading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Inscrits/Capacité</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities?.map((activity: any) => (
                        <TableRow key={activity.id} data-testid={`activity-row-${activity.id}`}>
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{activity.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(activity.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {activity.registeredCount}/{activity.capacity}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Gestion des dons</h3>
              </div>
              
              <CardContent className="p-0">
                {donationsLoading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations?.map((donation: any) => (
                        <TableRow key={donation.id} data-testid={`donation-row-${donation.id}`}>
                          <TableCell className="font-medium">{donation.name}</TableCell>
                          <TableCell className="text-muted-foreground">{donation.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{donation.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {donation.amount ? `€${donation.amount}` : '-'}
                          </TableCell>
                          <TableCell>
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Demandes d'espaces et mentorat</h3>
              </div>
              
              <CardContent className="p-0">
                {requestsLoading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {spaceRequests?.map((request: any) => (
                        <TableRow key={request.id} data-testid={`request-row-${request.id}`}>
                          <TableCell className="font-medium">{request.name}</TableCell>
                          <TableCell className="text-muted-foreground">{request.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {request.type === 'room' ? 'Salle' : 'Mentorat'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              request.status === 'approved' ? 'default' :
                              request.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {request.status === 'approved' ? 'Approuvé' :
                               request.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => updateRequestMutation.mutate({
                                    requestId: request.id,
                                    status: 'approved'
                                  })}
                                  data-testid={`approve-request-${request.id}`}
                                >
                                  <Check className="w-4 h-4 text-secondary" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => updateRequestMutation.mutate({
                                    requestId: request.id,
                                    status: 'rejected'
                                  })}
                                  data-testid={`reject-request-${request.id}`}
                                >
                                  <X className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
