import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';

type UploadedFile = {
  id: string;
  filename: string;
  bytes: number;
  created_at: number;
  purpose: string;
  status: string;
};

type AdminPanelProps = {
  accessToken: string;
  projectId: string;
  onBack: () => void;
};

export function AdminPanel({ accessToken, projectId, onBack }: AdminPanelProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [assistantStatus, setAssistantStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    loadFiles();
    checkAssistant();
  }, []);

  const checkAssistant = async () => {
    try {
      const response = await fetch(API_URLS.assistantStatus(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssistantId(data.assistantId);
        setAssistantStatus(data.assistantId ? 'ready' : 'error');
      } else {
        setAssistantStatus('error');
      }
    } catch (error) {
      console.error('Error checking assistant:', error);
      setAssistantStatus('error');
    }
  };

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.adminFiles(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        const errorText = await response.text();
        console.error('Error loading files:', errorText);
        toast.error('Error al cargar archivos');
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Error al cargar archivos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    // Validate file size (max 512MB for OpenAI)
    const maxSize = 512 * 1024 * 1024; // 512MB
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 512MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_URLS.uploadPdf(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`PDF "${file.name}" subido exitosamente`);
        
        // Reload files
        await loadFiles();
        
        // Update assistant if needed
        if (data.assistantUpdated) {
          setAssistantId(data.assistantId);
          setAssistantStatus('ready');
        }

        // Clear input
        event.target.value = '';
      } else {
        const errorText = await response.text();
        console.error('Error uploading file:', errorText);
        toast.error('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, filename: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${filename}"?`)) {
      return;
    }

    try {
      const response = await fetch(API_URLS.deleteFile(fileId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        toast.success(`Archivo "${filename}" eliminado`);
        await loadFiles();
      } else {
        const errorText = await response.text();
        console.error('Error deleting file:', errorText);
        toast.error('Error al eliminar el archivo');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error al eliminar el archivo');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Panel de Administración
              </h2>
              <p className="text-muted-foreground">
                Gestiona los PDFs de referencia para la IA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Assistant Status */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {assistantStatus === 'loading' && (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verificando asistente de IA...
              </span>
            )}
            {assistantStatus === 'ready' && (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Asistente de IA configurado correctamente
                {assistantId && <Badge variant="outline" className="ml-2">{assistantId}</Badge>}
              </span>
            )}
            {assistantStatus === 'error' && (
              <span className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                El asistente se creará automáticamente al subir el primer PDF
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Subir PDF de Referencia</CardTitle>
            <CardDescription>
              Los PDFs subidos serán utilizados por la IA como base de conocimiento para 
              generar respuestas más precisas durante los check-ins conversacionales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <label 
                  htmlFor="pdf-upload" 
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-muted-foreground">Subiendo archivo...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p>
                          Haz clic para seleccionar un archivo PDF
                        </p>
                        <p className="text-muted-foreground">
                          Máximo 512MB
                        </p>
                      </div>
                      <Button type="button" variant="outline">
                        Seleccionar PDF
                      </Button>
                    </>
                  )}
                </label>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tipo de contenido recomendado:</strong> Manuales de restauración, 
                  estudios bíblicos sobre identidad sexual, guías de consejería, material sobre 
                  sanidad emocional, recursos sobre luchas espirituales, etc.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>PDFs Subidos ({files.length})</span>
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
            </CardTitle>
            <CardDescription>
              Archivos actualmente disponibles para la IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay archivos subidos aún</p>
                <p className="text-sm">Sube tu primer PDF para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.filename}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{formatBytes(file.bytes)}</span>
                          <span>•</span>
                          <span>{formatDate(file.created_at)}</span>
                          {file.status && (
                            <>
                              <span>•</span>
                              <Badge 
                                variant={file.status === 'processed' ? 'default' : 'outline'}
                              >
                                {file.status}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.id, file.filename)}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Información importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              • Los PDFs se suben directamente a OpenAI y se indexan automáticamente para búsqueda semántica
            </p>
            <p>
              • Cuando un discípulo hace un check-in conversacional, la IA consulta estos documentos automáticamente
            </p>
            <p>
              • Los archivos permanecen almacenados en OpenAI hasta que los elimines manualmente
            </p>
            <p>
              • Se recomienda usar material relevante para el contexto de restauración y sanidad espiritual
            </p>
            <p>
              • Cada vez que subes o eliminas un archivo, el asistente de IA se actualiza automáticamente
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
