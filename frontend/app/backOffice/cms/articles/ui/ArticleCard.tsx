import IconButton from '@/components/IconButton/IconButton';
import Switch from '@/components/Switch/Switch';
import { Article } from '@/app/actions/articles';

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
  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
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
          <Switch
            checked={article.isActive}
            onChange={() => {}}
          />
          <span className="text-xs border border-border text-primary px-2 py-1 rounded-full">
            {article.category}
          </span>
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