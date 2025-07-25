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

export const PatientManagement = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [activePatients, setActivePatients] = useState(0);
  const [inactivePatients, setInactivePatients] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreatePatientData>({
    user_id: 0,
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    blood_type: '',
    height: undefined,
    weight: undefined,
    address: '',
  });

  const [editForm, setEditForm] = useState<UpdatePatientData>({});

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const response = await patientManagementService.getPatients({
        page: currentPage,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
      });

      if (response.status && response.data) {
        setPatients(response.data.patients);
        setTotalPages(response.data.last_page);
        setTotalPatients(response.data.total);
        setActivePatients(response.data.total_actifs);
        setInactivePatients(response.data.total_inactifs);
        setNewThisMonth(response.data.new_this_month);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les patients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [currentPage, searchTerm, statusFilter]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await patientManagementService.createPatient(createForm);
      toast({
        title: "Patient créé",
        description: "Le patient a été créé avec succès.",
      });
      setShowCreateModal(false);
      setCreateForm({
        user_id: 0,
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        blood_type: '',
        height: undefined,
        weight: undefined,
        address: '',
      });
      loadPatients();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le patient",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsLoading(true);
    try {
      await patientManagementService.updatePatient(selectedPatient.id, editForm);
      toast({
        title: "Patient modifié",
        description: "Le patient a été modifié avec succès.",
      });
      setShowEditModal(false);
      setSelectedPatient(null);
      setEditForm({});
      loadPatients();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le patient",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: number) => {
    try {
      await patientManagementService.deletePatient(patientId);
      toast({
        title: "Patient supprimé",
        description: "Le patient a été supprimé avec succès.",
      });
      loadPatients();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le patient",
        variant: "destructive",
      });
    }
  };

  const handleRestorePatient = async (patientId: number) => {
    try {
      await patientManagementService.restorePatient(patientId);
      toast({
        title: "Patient restauré",
        description: "Le patient a été restauré avec succès.",
      });
      loadPatients();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de restaurer le patient",
        variant: "destructive",
      });
    }
  };

  const openViewModal = async (patient: PatientData) => {
    try {
      const response = await patientManagementService.getPatient(patient.id);
      if (response.status && response.data) {
        setSelectedPatient(response.data.patient);
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

  const openEditModal = (patient: PatientData) => {
    setSelectedPatient(patient);
    setEditForm({
      first_name: patient.first_name,
      last_name: patient.last_name,
      birth_date: patient.birth_date,
      gender: patient.gender,
      blood_type: patient.blood_type,
      height: patient.height,
      weight: patient.weight,
      address: patient.address,
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Actifs</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activePatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Inactifs</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inactivePatients}</div>
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
              <CardTitle>Gestion des Patients</CardTitle>
              <CardDescription>
                Gérer les patients de l'application PassPay
              </CardDescription>
            </div>
            
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un patient</DialogTitle>
                  <DialogDescription>
                    Ajouter un nouveau patient au système
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreatePatient} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-user-id">ID Utilisateur</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="create-user-id"
                          type="number"
                          value={createForm.user_id || ''}
                          onChange={(e) => setCreateForm({ ...createForm, user_id: parseInt(e.target.value) || 0 })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-birth-date">Date de naissance</Label>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-first-name">Prénom</Label>
                      <Input
                        id="create-first-name"
                        value={createForm.first_name}
                        onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-last-name">Nom</Label>
                      <Input
                        id="create-last-name"
                        value={createForm.last_name}
                        onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-gender">Genre</Label>
                      <Select value={createForm.gender} onValueChange={(value) => setCreateForm({ ...createForm, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Homme</SelectItem>
                          <SelectItem value="female">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-blood-type">Groupe sanguin</Label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="create-blood-type"
                          value={createForm.blood_type}
                          onChange={(e) => setCreateForm({ ...createForm, blood_type: e.target.value })}
                          className="pl-10"
                          placeholder="A+, B-, O+, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                placeholder="Rechercher un patient..."
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
                  <TableHead>Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {patient.first_name?.charAt(0).toUpperCase()}{patient.last_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{patient.first_name} {patient.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{patient.email || 'N/A'}</TableCell>
                    <TableCell>{patient.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'Actif' ? 'default' : 'destructive'}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(patient)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(patient)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {patient.status === 'Actif' ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer ce patient ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action supprimera temporairement le patient. Vous pourrez le restaurer plus tard.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePatient(patient.id)}
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
                            onClick={() => handleRestorePatient(patient.id)}
                            className="text-success"
                          >
                            <RotateCcw className="w-4 h-4" />
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
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualisation */}
      {selectedPatient && (
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du Patient</DialogTitle>
              <DialogDescription>
                Informations complètes du patient
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Nom complet</Label>
                  <p className="text-sm">{selectedPatient.first_name} {selectedPatient.last_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedPatient.email || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                  <p className="text-sm">{selectedPatient.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Genre</Label>
                  <p className="text-sm">{selectedPatient.gender === 'male' ? 'Homme' : 'Femme'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date de naissance</Label>
                  <p className="text-sm">{selectedPatient.birth_date || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Groupe sanguin</Label>
                  <p className="text-sm">{selectedPatient.blood_type || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Taille</Label>
                  <p className="text-sm">{selectedPatient.height ? `${selectedPatient.height} cm` : 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Poids</Label>
                  <p className="text-sm">{selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}</p>
                </div>
              </div>
              
              {selectedPatient.address && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                  <p className="text-sm">{selectedPatient.address}</p>
                </div>
              )}

              {selectedPatient.documents && selectedPatient.documents.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Documents</Label>
                  <div className="space-y-2">
                    {selectedPatient.documents.map((doc) => (
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
          </DialogContent>
        </Dialog>
      )}

      {/* Modal d'édition */}
      {selectedPatient && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le patient</DialogTitle>
              <DialogDescription>
                Mettre à jour les informations du patient
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditPatient} className="space-y-6">
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
                  <Select value={editForm.gender || ''} onValueChange={(value) => setEditForm({ ...editForm, gender: value })}>
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
                  <Label htmlFor="edit-blood-type">Groupe sanguin</Label>
                  <Input
                    id="edit-blood-type"
                    value={editForm.blood_type || ''}
                    onChange={(e) => setEditForm({ ...editForm, blood_type: e.target.value })}
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
      )}
    </div>
  );
};