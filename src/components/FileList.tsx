import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { toast } from 'sonner'; 
import { ExternalLinkIcon, DownloadIcon, FileTextIcon, Image as ImageIcon } from 'lucide-react'; // Example icons
import {doctorFile} from '@api/doctorApi'
interface FileItem {
  attachmentId: string;
  attachmentType: 'PRESCRIPTION' | 'TREATMENT_PLAN' | 'BLOOD_TEST' |'HORMONE_TEST'| 
  'ULTRASOUND_RESULT'|'SPERM_ANALYSIS'|'EMBRYO_REPORT'|'CONSENT_FORM'|'OTHER'; 
  fileType: string;
  fileSize: number;
  fileName: string;
  fileUrl: string; 
}

interface FileListProps {
  patientId: string;
}

const FileList: React.FC<FileListProps> = ({ patientId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: FileItem[] = await doctorFile(patientId);
        setFiles(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(`Failed to load files: ${err.message}`);
        } else {
          setError("An unknown error occurred.");
          toast.error("Failed to load files: An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchFiles();
    }
  }, [patientId]);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
      case 'docx':
      case 'doc':
      case 'txt':
        return <FileTextIcon className="w-5 h-5 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Không thể tải danh sách hồ sơ: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Thử lại</Button>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-white border border-[color:var(--card-border)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[color:var(--text-accent)] flex items-center gap-2">
          Hồ sơ đính kèm của bệnh nhân 📁
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có hồ sơ nào được lưu cho bệnh nhân này.</p>
        ) : (
          <div className="grid gap-4">
            {files.map((file) => (
              <div
                key={file.attachmentId}
                className="flex items-center justify-between p-4 border border-[color:var(--card-border)] rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.fileType)}
                  <div>
                    <p className="font-medium text-[color:var(--text-primary)]">{file.fileName}</p>
                    <p className="text-sm text-[color:var(--text-secondary)]">
                      {file.attachmentType} &bull; {formatFileSize(file.fileSize)} &bull; {file.fileType.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.fileUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                      className="text-[color:var(--deep-taupe)] hover:text-[color:var(--button-hover-bg)]"
                      title="Xem hồ sơ"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </Button>
                  )}
                  {file.fileUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.fileUrl;
                        link.setAttribute('download', file.fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success(`Đang tải xuống ${file.fileName}`);
                      }}
                      className="text-[color:var(--deep-taupe)] hover:text-[color:var(--button-hover-bg)]"
                      title="Tải xuống"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileList;