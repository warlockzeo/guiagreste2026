import { useState, useRef, useEffect } from 'react';
import { useUpload } from '../hooks/useUpload';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isUploading, setIsUploading] = useState(false);
  
  const { upload } = useUpload();

  useEffect(() => {
    if (value !== preview && value !== undefined) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setIsUploading(true);
      
      const url = await upload(file);
      
      setIsUploading(false);
      
      if (url) {
        onChange(url);
      } else {
        setPreview(value);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles['image-upload']}>
      {label && <span className={styles['image-upload__label']}>{label}</span>}
      
      <div className={styles['image-upload__preview']} onClick={handleClick}>
        {preview ? (
          <div className={styles['image-upload__image-container']}>
            <img src={preview} alt="Preview" />
            {isUploading && (
              <div className={styles['image-upload__loading-overlay']}>
                <div className={styles['image-upload__spinner']} />
              </div>
            )}
          </div>
        ) : (
          <div className={styles['image-upload__placeholder']}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Clique para adicionar imagem</span>
          </div>
        )}
        
        {preview && !isUploading && (
          <div className={styles['image-upload__overlay']}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Alterar imagem</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles['image-upload__input']}
      />
    </div>
  );
}
