import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { patientManagementService, PatientData, CreatePatientData, UpdatePatientData } from "@/services/patientManagement";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Eye,
  Search,
  Filter,
  User,
  Calendar,
  Activity,
  MapPin,
} from "lucide-react";

export default function SubscriberManagement() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<PatientData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [activeSubscribers, setActiveSubscribers] = useState(0);
  const [inactiveSubscribers, setInactiveSubscribers] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<PatientData | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreatePatientData>({
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: 'male',
    blood_group: '',
    height: undefined,
    weight: undefined,
    address: '',
    documents: [],
  });

  const [editForm, setEditForm] = useState<UpdatePatientData>({});

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await patientManagementService.getPatients({
        page: currentPage,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
      });

      if (response.status && response.data) {
        setSubscribers(response.data.patients || []);
        setTotalPages(response.data.last_page);
        setTotalSubscribers(response.data.total);
        setActiveSubscribers(response.data.total_actifs);
        setInactiveSubscribers(response.data.total_inactifs);
        setNewThisMonth(response.data.new_this_month);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les abonnés",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, [currentPage, searchTerm, statusFilter]);

  const handleCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await patientManagementService.createPatient(createForm);
      toast({
        title: "Abonné créé",
        description: "L'abonné a été créé avec succès.",
      });
      setShowCreateModal(false);
      setCreateForm({
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: 'male',
        blood_group: '',
        height: undefined,
        weight: undefined,
        address: '',
        documents: [],
      });
      loadSubscribers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'abonné",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscriber) return;

    setIsLoading(true);
    try {
      await patientManagementService.updatePatient(selectedSubscriber.id, editForm);
      toast({
        title: "Abonné modifié",
        description: "L'abonné a été modifié avec succès.",
      });
      setShowEditModal(false);
      setSelectedSubscriber(null);
      setEditForm({});
      loadSubscribers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'abonné",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: number) => {
    try {
      await patientManagementService.deletePatient(subscriberId);
      toast({
        title: "Abonné supprimé",
        description: "L'abonné a été supprimé avec succès.",
      });
      loadSubscribers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'abonné",
        variant: "destructive",
      });
    }
  };

  const handleRestoreSubscriber = async (subscriberId: number) => {
    try {
      await patientManagementService.restorePatient(subscriberId);
      toast({
        title: "Abonné restauré",
        description: "L'abonné a été restauré avec succès.",
      });
      loadSubscribers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de restaurer l'abonné",
        variant: "destructive",
      });
    }
  };

  const openViewModal = async (subscriber: PatientData) => {
    try {
      const response = await patientManagementService.getPatient(subscriber.id);
      if (response.status && response.data) {
        setSelectedSubscriber(response.data.patient);
        setShowViewModal(true);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les détails",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (subscriber: PatientData) => {
    setSelectedSubscriber(subscriber);
    setEditForm({
      first_name: subscriber.first_name,
      last_name: subscriber.last_name,
      birth_date: subscriber.birth_date,
      gender: subscriber.gender as 'male' | 'female',
      blood_group: subscriber.blood_type,
      height: subscriber.height,
      weight: subscriber.weight,
      address: subscriber.address,
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abonnés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnés Actifs</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeSubscribers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnés Inactifs</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inactiveSubscribers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <Plus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{newThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Abonnés</CardTitle>
              <CardDescription>
                Gérer les abonnés de l'application PassPay
              </CardDescription>
            </div>
            
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Abonné
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un abonné</DialogTitle>
                  <DialogDescription>
                    Ajouter un nouvel abonné au système
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateSubscriber} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-first-name">Prénom *</Label>
                      <Input
                        id="create-first-name"
                        value={createForm.first_name}
                        onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-last-name">Nom *</Label>
                      <Input
                        id="create-last-name"
                        value={createForm.last_name}
                        onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-birth-date">Date de naissance *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="create-birth-date"
                          type="date"
                          value={createForm.birth_date}
                          onChange={(e) => setCreateForm({ ...createForm, birth_date: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-gender">Genre *</Label>
                      <Select value={createForm.gender} onValueChange={(value: 'male' | 'female') => setCreateForm({ ...createForm, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Homme</SelectItem>
                          <SelectItem value="female">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-blood-group">Groupe sanguin</Label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="create-blood-group"
                          value={createForm.blood_group}
                          onChange={(e) => setCreateForm({ ...createForm, blood_group: e.target.value })}
                          className="pl-10"
                          placeholder="A+, B-, O+, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-height">Taille (cm)</Label>
                      <Input
                        id="create-height"
                        type="number"
                        value={createForm.height || ''}
                        onChange={(e) => setCreateForm({ ...createForm, height: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-weight">Poids (kg)</Label>
                      <Input
                        id="create-weight"
                        type="number"
                        value={createForm.weight || ''}
                        onChange={(e) => setCreateForm({ ...createForm, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-address">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="create-address"
                        value={createForm.address}
                        onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                        className="pl-10"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      Créer
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtres */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un abonné..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Actif">Actifs</SelectItem>
                <SelectItem value="Inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Abonné</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{subscriber.first_name} {subscriber.last_name}</div>
                          <div className="text-xs text-muted-foreground">ID: {subscriber.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{subscriber.email || 'Non renseigné'}</TableCell>
                    <TableCell>{subscriber.phone || 'Non renseigné'}</TableCell>
                    <TableCell>
                      <Badge variant={subscriber.status === 'Actif' ? 'default' : 'destructive'}>
                        {subscriber.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {subscriber.created_at ? new Date(subscriber.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(subscriber)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(subscriber)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {subscriber.status === 'Actif' ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'abonné</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Voulez-vous vraiment supprimer cet abonné ? Cette action peut être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSubscriber(subscriber.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreSubscriber(subscriber.id)}
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                Précédent
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'abonné</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'abonné
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubscriber} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">Prénom</Label>
                <Input
                  id="edit-first-name"
                  value={editForm.first_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-last-name">Nom</Label>
                <Input
                  id="edit-last-name"
                  value={editForm.last_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-birth-date">Date de naissance</Label>
                <Input
                  id="edit-birth-date"
                  type="date"
                  value={editForm.birth_date || ''}
                  onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">Genre</Label>
                <Select value={editForm.gender || ''} onValueChange={(value: 'male' | 'female') => setEditForm({ ...editForm, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-blood-group">Groupe sanguin</Label>
                <Input
                  id="edit-blood-group"
                  value={editForm.blood_group || ''}
                  onChange={(e) => setEditForm({ ...editForm, blood_group: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-height">Taille (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  value={editForm.height || ''}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Poids (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={editForm.weight || ''}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Adresse</Label>
              <Textarea
                id="edit-address"
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                Modifier
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de visualisation */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'abonné</DialogTitle>
            <DialogDescription>
              Informations complètes de l'abonné
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscriber && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Nom complet</Label>
                  <p className="text-sm">{selectedSubscriber.first_name} {selectedSubscriber.last_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedSubscriber.email || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                  <p className="text-sm">{selectedSubscriber.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Genre</Label>
                  <p className="text-sm">{selectedSubscriber.gender === 'male' ? 'Homme' : 'Femme'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date de naissance</Label>
                  <p className="text-sm">{selectedSubscriber.birth_date || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Groupe sanguin</Label>
                  <p className="text-sm">{selectedSubscriber.blood_type || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Taille</Label>
                  <p className="text-sm">{selectedSubscriber.height ? `${selectedSubscriber.height} cm` : 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Poids</Label>
                  <p className="text-sm">{selectedSubscriber.weight ? `${selectedSubscriber.weight} kg` : 'N/A'}</p>
                </div>
              </div>
              
              {selectedSubscriber.address && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                  <p className="text-sm">{selectedSubscriber.address}</p>
                </div>
              )}

              {selectedSubscriber.documents && selectedSubscriber.documents.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Documents</Label>
                  <div className="space-y-2">
                    {selectedSubscriber.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.type}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
