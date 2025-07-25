import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { providerManagementService, ProviderData, CreateProviderData, UpdateProviderData } from "@/services/providerManagement";
import { userManagementService } from "@/services/userManagement";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Eye, Edit, Trash2, RotateCcw, Users, Activity, Calendar, TrendingUp, Building2, Stethoscope } from "lucide-react";

export function ProviderManagement() {
  const { toast } = useToast();
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    total_actifs: 0,
    total_inactifs: 0,
    new_this_month: 0
  });

  // États pour les modals
  const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Données du formulaire
  const [formData, setFormData] = useState<CreateProviderData & UpdateProviderData>({
    name: "",
    type: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    specialties: [],
    status: "actif",
    creation_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadProviders();
    loadAvailableUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const response = await providerManagementService.getProviders(params);
      if (response.status) {
        setProviders(response.data.providers);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setStats({
          total: response.data.total,
          total_actifs: response.data.total_actifs,
          total_inactifs: response.data.total_inactifs,
          new_this_month: response.data.new_this_month
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les prestataires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const response = await userManagementService.getUsers();
      if (response.status) {
        setAvailableUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  const handleCreateProvider = async () => {
    if (!formData.name || !formData.type || !formData.email || !formData.password || !formData.creation_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (nom, type, email, mot de passe, date de création)",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await providerManagementService.createProvider(formData);
      if (response.status) {
        toast({
          title: "Succès",
          description: "Prestataire créé avec succès",
        });
        setIsCreateModalOpen(false);
        resetForm();
        loadProviders();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le prestataire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProvider = async () => {
    if (!selectedProvider || !formData.name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await providerManagementService.updateProvider(selectedProvider.id, formData);
      if (response.status) {
        toast({
          title: "Succès",
          description: "Prestataire mis à jour avec succès",
        });
        setIsEditModalOpen(false);
        setSelectedProvider(null);
        resetForm();
        loadProviders();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le prestataire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProvider = async (provider: ProviderData) => {
    try {
      const response = await providerManagementService.deleteProvider(provider.id);
      if (response.status) {
        toast({
          title: "Succès",
          description: "Prestataire supprimé avec succès",
        });
        loadProviders();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le prestataire",
        variant: "destructive",
      });
    }
  };

  const handleRestoreProvider = async (provider: ProviderData) => {
    try {
      const response = await providerManagementService.restoreProvider(provider.id);
      if (response.status) {
        toast({
          title: "Succès",
          description: "Prestataire restauré avec succès",
        });
        loadProviders();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de restaurer le prestataire",
        variant: "destructive",
      });
    }
  };

  const handleViewProvider = async (provider: ProviderData) => {
    try {
      const response = await providerManagementService.getProvider(provider.id);
      if (response.status) {
        setSelectedProvider(response.data);
        setIsViewModalOpen(true);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les détails du prestataire",
        variant: "destructive",
      });
    }
  };

  const handleEditProvider = (provider: ProviderData) => {
    setSelectedProvider(provider);
    setFormData({
      name: provider.name,
      phone: provider.phone,
      address: provider.address || "",
      specialties: provider.specialties || [],
      type: provider.type,
      email: provider.email,
      password: "", // Not needed for update
      status: provider.status,
      creation_date: new Date().toISOString().split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      specialties: [],
      status: "actif",
      creation_date: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status: string) => {
    return status === "Actif" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Actif
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
        Inactif
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Prestataires</h1>
          <p className="text-muted-foreground">Gérez les prestataires de santé de votre système</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Prestataire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau prestataire</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau prestataire de santé au système
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nom du prestataire *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom du prestataire"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type de prestataire *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de prestataire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinique">Clinique</SelectItem>
                      <SelectItem value="Hôpital">Hôpital</SelectItem>
                      <SelectItem value="Centre médical">Centre médical</SelectItem>
                      <SelectItem value="Cabinet médical">Cabinet médical</SelectItem>
                      <SelectItem value="Laboratoire">Laboratoire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email du prestataire"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mot de passe"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Téléphone du prestataire"
                  />
                </div>
                <div>
                  <Label htmlFor="creation_date">Date de création *</Label>
                  <Input
                    id="creation_date"
                    type="date"
                    value={formData.creation_date}
                    onChange={(e) => setFormData({ ...formData, creation_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Adresse du prestataire"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateProvider} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prestataires</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestataires Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.total_actifs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestataires Inactifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.total_inactifs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new_this_month}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actifs</SelectItem>
                <SelectItem value="Inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des prestataires */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des prestataires</CardTitle>
          <CardDescription>
            {providers.length} prestataire(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{provider.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{provider.email}</div>
                        <div className="text-muted-foreground">{provider.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(provider.status)}</TableCell>
                    <TableCell>
                      {new Date(provider.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProvider(provider)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProvider(provider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {provider.status === "Actif" ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce prestataire ? Cette action peut être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProvider(provider)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreProvider(provider)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualisation */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du prestataire</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nom</Label>
                  <p className="text-sm text-muted-foreground">{selectedProvider.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedProvider.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedProvider.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Téléphone</Label>
                  <p className="text-sm text-muted-foreground">{selectedProvider.phone}</p>
                </div>
              </div>
              {selectedProvider.address && (
                <div>
                  <Label className="text-sm font-medium">Adresse</Label>
                  <p className="text-sm text-muted-foreground">{selectedProvider.address}</p>
                </div>
              )}
              {selectedProvider.specialties && selectedProvider.specialties.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Spécialités</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProvider.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Separator />
              <div>
                <Label className="text-sm font-medium">Statut</Label>
                <div className="mt-1">{getStatusBadge(selectedProvider.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le prestataire</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-name">Nom du prestataire *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">Adresse</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateProvider} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}