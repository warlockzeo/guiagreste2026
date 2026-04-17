import { useState } from 'react';
import { api } from '../utils/api';

const UPLOAD_BASE_URL = 'http://localhost:3001';

interface UseUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useUpload(options?: UseUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Por favor, selecione uma imagem';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return null;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = 'A imagem deve ter no máximo 5MB';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const res = await api.post('/api/upload', { image: base64 });
      const relativeUrl = res.data.url;
      const fullUrl = `${UPLOAD_BASE_URL}${relativeUrl}`;
      options?.onSuccess?.(fullUrl);
      return fullUrl;
    } catch (err: unknown) {
      const errorMsg = 'Erro ao fazer upload da imagem';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
