"use client";
import React, { useRef, useState } from 'react';
import IconButton from '../IconButton/IconButton';

interface MultimediaFile {
  file: File;
  type: 'image' | 'video';
  preview: string;
}

interface MultimediaGalleryProps {
  uploadPath: string; // Ruta donde se guardarán los archivos (en el backend)
  onChange?: (files: MultimediaFile[]) => void;
  label?: string;
  maxFiles?: number;
}

export const MultimediaGallery: React.FC<MultimediaGalleryProps> = ({
  uploadPath,
  onChange,
  label = 'Selecciona multimedia',
  maxFiles = 10,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<MultimediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MultimediaFile | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Procesar archivos y crear previews
    const newMultimediaFiles: MultimediaFile[] = selectedFiles.map(file => {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      return {
        file,
        type,
        preview: URL.createObjectURL(file)
      };
    });

    // Evitar duplicados por nombre y tamaño
    const allFiles = [...files, ...newMultimediaFiles];
    const uniqueFiles = Array.from(
      new Map(allFiles.map(f => [f.file.name + f.file.size, f])).values()
    ).slice(0, maxFiles);

    setFiles(uniqueFiles);
    onChange?.(uniqueFiles);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);

    // Cerrar modal si se elimina el archivo seleccionado
    if (selectedFile === fileToRemove) {
      setSelectedFile(null);
    }
  };

  const openPreview = (file: MultimediaFile) => {
    setSelectedFile(file);
  };

  const closePreview = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full" data-test-id="multimedia-gallery-root">
      <input
        ref={inputRef}
        id="multimedia-file-input"
        type="file"
        accept="image/jpeg,image/png,video/mp4"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Galería de miniaturas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
        {files.map((multimediaFile, idx) => (
          <div
            key={idx}
            className="relative group cursor-pointer"
            onClick={() => openPreview(multimediaFile)}
          >
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {multimediaFile.type === 'image' ? (
                <img
                  src={multimediaFile.preview}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={multimediaFile.preview}
                  className="w-full h-full object-cover"
                  muted
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              )}

              {/* Overlay con tipo de archivo */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                <span className="material-symbols-outlined text-sm">
                  {multimediaFile.type === 'image' ? 'photo_camera' : 'videocam'}
                </span>
              </div>

              {/* Botón de eliminar */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton
                  aria-label="Eliminar archivo"
                  icon="close"
                  variant="containedSecondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  style={{
                    borderRadius: '50%',
                    minWidth: 24,
                    minHeight: 24,
                    padding: 0,
                    width: 24,
                    height: 24,
                    lineHeight: 1
                  }}
                />
              </div>
            </div>

            {/* Información del archivo */}
            <div className="mt-1 text-xs text-gray-600 truncate">
              {multimediaFile.file.name}
            </div>
            <div className="text-xs text-gray-500">
              {(multimediaFile.file.size / 1024 / 1024).toFixed(1)} MB
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📁</div>
          <p>No hay archivos multimedia</p>
        </div>
      )}

      {/* Modal de previsualización */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{selectedFile.file.name}</h3>
                <IconButton
                  icon="close"
                  variant="text"
                  onClick={closePreview}
                  aria-label="Cerrar previsualización"
                />
              </div>
            </div>

            <div className="p-4">
              {selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.preview}
                  alt={selectedFile.file.name}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              ) : (
                <video
                  src={selectedFile.preview}
                  controls
                  className="max-w-full max-h-[70vh] mx-auto"
                  style={{ aspectRatio: '16/9' }}
                />
              )}

              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Tipo:</strong> {selectedFile.type === 'image' ? 'Imagen' : 'Video'}</p>
                <p><strong>Tamaño:</strong> {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Tipo MIME:</strong> {selectedFile.file.type}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultimediaGallery;