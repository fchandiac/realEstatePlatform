"use client";
import React, { useRef, useState } from 'react';
import { Button } from '../Button/Button';
import IconButton from '../IconButton/IconButton';

interface FileImageUploaderProps {
  uploadPath: string; // Ruta donde se guardará el archivo (en el backend)
  onChange?: (files: File[]) => void;
  label?: string;
  accept?: string;
  maxFiles?: number;
}

export const FileImageUploader: React.FC<FileImageUploaderProps> = ({
  uploadPath,
  onChange,
  label = 'Selecciona imágenes',
  accept = 'image/*',
  maxFiles = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Generate previews only for current files, avoid duplicates
  const previews = files.map(file => URL.createObjectURL(file));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    // Avoid duplicates by name and size
    const allFiles = [...files, ...selectedFiles];
    const uniqueFiles = Array.from(
      new Map(allFiles.map(f => [f.name + f.size, f])).values()
    ).slice(0, maxFiles);
    setFiles(uniqueFiles);
    onChange?.(uniqueFiles);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  return (
    <div className="flex flex-col gap-4 w-full" data-test-id="file-image-uploader-root">
      <label className="font-medium cursor-pointer">
        {label}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
      </label>
      <Button variant="secondary" type="button" onClick={() => inputRef.current?.click()} style={{ width: 'fit-content' }}>
        Subir imágenes
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full" style={{ flexWrap: 'nowrap' }}>
        {previews.map((url, idx) => (
          <div key={idx} style={{ position: 'relative', display: 'inline-block', flex: '0 0 auto' }}>
            <img
              src={url}
              alt={`preview-${idx}`}
              className="w-full h-28 sm:h-32 md:h-36 object-cover rounded-lg shadow"
            />
            <IconButton
              aria-label="Eliminar imagen"
              icon="close"
              variant="containedSecondary"
              onClick={() => handleRemove(idx)}
              style={{ position: 'absolute', top: 2, right: 2, borderRadius: '50%', minWidth: 24, minHeight: 24, padding: 0, width: 24, height: 24, lineHeight: 1 }}
            />
          </div>
        ))}
      </div>
      <small className="text-xs text-gray-500">Las imágenes seleccionadas se subirán a: <b>{uploadPath}</b></small>
    </div>
  );
};

export default FileImageUploader;
