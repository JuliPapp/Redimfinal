import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  FileText,
  Video,
  Headphones,
  Link as LinkIcon,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'link' | 'document';
  content: string;
  url?: string;
  category: string;
  created_by: string;
  created_at: string;
};

type Props = {
  userRole: 'leader' | 'disciple' | 'admin';
  accessToken: string;
  projectId: string;
  onBack: () => void;
};

const RESOURCE_TYPES = [
  { value: 'article', label: 'Artículo', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'audio', label: 'Audio', icon: Headphones },
  { value: 'link', label: 'Enlace', icon: LinkIcon },
  { value: 'document', label: 'Documento', icon: BookOpen }
];

const CATEGORIES = [
  'Identidad en Cristo',
  'Sanidad emocional',
  'Intimidad con Dios',
  'Familia y relaciones',
  'Victoria sobre adicciones',
  'Perdón y restauración',
  'Propósito y llamado',
  'Otro'
];

export function SpiritualLibrary({ userRole, accessToken, projectId, onBack }: Props) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Resource['type']>('article');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchResources();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/auth/profile`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.profile.id);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/library`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      toast.error('Error al cargar los recursos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResource = async () => {
    if (!title || !description || !category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (type === 'link' && !url) {
      toast.error('Por favor ingresa la URL');
      return;
    }

    if ((type === 'article' || type === 'document') && !content) {
      toast.error('Por favor ingresa el contenido');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/library`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            title,
            description,
            type,
            content,
            url,
            category
          })
        }
      );

      if (response.ok) {
        toast.success('Recurso agregado exitosamente');
        setShowAddDialog(false);
        resetForm();
        await fetchResources();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al agregar recurso');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al agregar recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setDescription(resource.description);
    setType(resource.type);
    setContent(resource.content);
    setUrl(resource.url || '');
    setCategory(resource.category);
    setShowEditDialog(true);
  };

  const handleUpdateResource = async () => {
    if (!editingResource) return;

    if (!title || !description || !category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (type === 'link' && !url) {
      toast.error('Por favor ingresa la URL');
      return;
    }

    if ((type === 'article' || type === 'document') && !content) {
      toast.error('Por favor ingresa el contenido');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/library/${editingResource.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            title,
            description,
            type,
            content,
            url,
            category
          })
        }
      );

      if (response.ok) {
        toast.success('Recurso actualizado exitosamente');
        setShowEditDialog(false);
        setEditingResource(null);
        resetForm();
        await fetchResources();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar recurso');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/library/${resourceId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (response.ok) {
        toast.success('Recurso eliminado');
        await fetchResources();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar recurso');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar recurso');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('article');
    setContent('');
    setUrl('');
    setCategory(CATEGORIES[0]);
  };

  const filteredResources = resources.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getResourceIcon = (type: Resource['type']) => {
    const resourceType = RESOURCE_TYPES.find(t => t.value === type);
    return resourceType ? resourceType.icon : FileText;
  };

  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando biblioteca...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>Biblioteca Espiritual</h1>
              <p className="text-muted-foreground">Recursos para tu crecimiento espiritual</p>
            </div>
          </div>
          {(userRole === 'leader' || userRole === 'admin') && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar recurso
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="px-3 py-2 rounded-md border border-border bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">No hay recursos disponibles</h3>
              <p className="text-muted-foreground">
                {selectedCategory !== 'all' || searchQuery !== ''
                  ? 'No se encontraron recursos con los filtros seleccionados'
                  : 'Aún no se han agregado recursos a la biblioteca'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(resource => {
              const Icon = getResourceIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </div>
                      {(userRole === 'leader' || userRole === 'admin') && (resource.created_by === currentUserId || userRole === 'admin') && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditResource(resource)}
                            title="Editar recurso"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteResource(resource.id)}
                            title="Eliminar recurso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="secondary">{resource.category}</Badge>
                      
                      {resource.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Abrir enlace
                        </Button>
                      )}
                      
                      {resource.content && (
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-primary hover:underline">
                            Ver contenido
                          </summary>
                          <ScrollArea className="mt-2 h-[200px]">
                            <p className="text-sm whitespace-pre-wrap">{linkifyText(resource.content)}</p>
                          </ScrollArea>
                        </details>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Agregado el {new Date(resource.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Resource Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar nuevo recurso</DialogTitle>
              <DialogDescription>
                Comparte contenido espiritual útil para tus discípulos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="mb-2 block">Título *</label>
                <Input
                  placeholder="Ej: La identidad en Cristo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block">Descripción *</label>
                <Textarea
                  placeholder="Breve descripción del recurso..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-2 block">Tipo de recurso *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {RESOURCE_TYPES.map(({ value, label, icon: TypeIcon }) => (
                    <button
                      key={value}
                      type="button"
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        type === value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setType(value as Resource['type'])}
                    >
                      <TypeIcon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block">Categoría *</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-border bg-background"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {(type === 'link' || type === 'video' || type === 'audio') && (
                <div>
                  <label className="mb-2 block">URL *</label>
                  <Input
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              )}

              {(type === 'article' || type === 'document') && (
                <div>
                  <label className="mb-2 block">Contenido *</label>
                  <Textarea
                    placeholder="Escribe el contenido del recurso..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddResource} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Agregar recurso'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Resource Dialog */}
        <Dialog open={showEditDialog} onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setEditingResource(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar recurso</DialogTitle>
              <DialogDescription>
                Actualiza el contenido espiritual
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="mb-2 block">Título *</label>
                <Input
                  placeholder="Ej: La identidad en Cristo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block">Descripción *</label>
                <Textarea
                  placeholder="Breve descripción del recurso..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-2 block">Tipo de recurso *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {RESOURCE_TYPES.map(({ value, label, icon: TypeIcon }) => (
                    <button
                      key={value}
                      type="button"
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        type === value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setType(value as Resource['type'])}
                    >
                      <TypeIcon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block">Categoría *</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-border bg-background"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {(type === 'link' || type === 'video' || type === 'audio') && (
                <div>
                  <label className="mb-2 block">URL *</label>
                  <Input
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              )}

              {(type === 'article' || type === 'document') && (
                <div>
                  <label className="mb-2 block">Contenido *</label>
                  <Textarea
                    placeholder="Escribe el contenido del recurso..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowEditDialog(false);
                setEditingResource(null);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateResource} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar recurso'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
