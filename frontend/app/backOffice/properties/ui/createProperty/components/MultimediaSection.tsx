'use client';

import { FileImageUploader } from '@/components/FileUploader/FileImageUploader';
import { CreatePropertyFormData } from '../types';

interface MultimediaSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
}

export default function MultimediaSection({
  formData,
  handleChange,
}: MultimediaSectionProps) {
  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">Multimedia</h2>
      
      <FileImageUploader
        uploadPath="/uploads/media"
        label="Subir Multimedia (Imágenes y Videos)"
        accept="image/*,video/*"
        onChange={(files: File[]) => handleChange('multimedia', files)}
      />
      
      {formData.multimedia && formData.multimedia.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Archivos seleccionados: {formData.multimedia.length}</p>
          <ul className="space-y-1">
            {formData.multimedia.map((file, index) => (
              <li key={`${file.name}-${index}`} className="text-sm text-gray-600">
                • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
