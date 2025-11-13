'use client'

import IconButton from '@/components/IconButton/IconButton';
import Switch from '@/components/Switch/Switch';
import { Article, toggleArticleActive } from '@/app/actions/articles';
import React, { useState } from 'react';
import Alert from '@/components/Alert/Alert';

export interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onEdit,
  onDelete,
}) => {
  const [isActive, setIsActive] = useState(article.isActive);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleActiveChange = async (checked: boolean) => {
    setLoading(true);
    try {
      const result = await toggleArticleActive(article.id, checked);
      
      if (result.success) {
        setIsActive(checked);
        setAlertMessage({
          type: 'success',
          message: checked ? 'Artículo activado' : 'Artículo desactivado'
        });
      } else {
        setAlertMessage({
          type: 'error',
          message: result.error || 'Error al actualizar el artículo'
        });
        // Revertir el cambio en caso de error
        setIsActive(!checked);
      }
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Error al actualizar el artículo'
      });
      // Revertir el cambio en caso de error
      setIsActive(!checked);
    } finally {
      setLoading(false);
      // Limpiar el mensaje después de 3 segundos
      if (alertMessage) {
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Alert */}
      {alertMessage && (
        <div className="mb-4">
          <Alert variant={alertMessage.type}>
            {alertMessage.message}
          </Alert>
        </div>
      )}
      {/* Imagen */}
      {article.multimediaUrl && (
        <div className="mb-4">
          <img
            src={article.multimediaUrl}
            alt={article.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
        {article.subtitle && (
          <p className="text-sm text-muted-foreground">{article.subtitle}</p>
        )}
        <p className="text-sm text-foreground line-clamp-3">{article.text}</p>
      </div>

      {/* Acciones - Siempre al fondo */}
      <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t border-border">
        {/* Switch y Categoría a la izquierda */}
        <div className="flex items-center gap-2">
          <span className="text-xs border border-border text-primary px-2 py-1 rounded-full">
            {article.category}
          </span>
          <Switch
            checked={isActive}
            onChange={handleActiveChange}
          />
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2">
          <IconButton
            icon="edit"
            variant="text"
            onClick={() => onEdit(article)}
            aria-label="Editar artículo"
          />
          <IconButton
            icon="delete"
            variant="text"
            onClick={() => onDelete(article)}
            className="text-red-500"
            aria-label="Eliminar artículo"
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;