import IconButton from '@/components/IconButton/IconButton';
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
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
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
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
        {article.subtitle && (
          <p className="text-sm text-muted-foreground">{article.subtitle}</p>
        )}
        <p className="text-sm text-foreground line-clamp-3">{article.text}</p>

        {/* Categoría */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
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
  );
};

export default ArticleCard;