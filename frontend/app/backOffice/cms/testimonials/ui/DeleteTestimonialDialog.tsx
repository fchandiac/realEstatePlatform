import { useState } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import { Button } from '@/components/Button/Button';
import { deleteTestimonial } from '@/app/actions/testimonials';

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  position?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteTestimonialDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  testimonial: Testimonial | null;
}

const DeleteTestimonialDialog: React.FC<DeleteTestimonialDialogProps> = ({
  open,
  onClose,
  onSuccess,
  testimonial,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!testimonial) return;

    setIsSubmitting(true);
    try {
      const result = await deleteTestimonial(testimonial.id);

      if (result.success) {
        alert('Testimonio eliminado exitosamente');
        handleClose();
        onSuccess();
      } else {
        alert(result.error || 'Error al eliminar testimonio');
      }
    } catch (err) {
      alert('Error interno del servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Eliminar Testimonio"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-foreground">
          ¿Estás seguro de que quieres eliminar el testimonio de <strong>{testimonial?.name}</strong>?
        </p>
        <p className="text-sm text-muted-foreground">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            variant="outlined"
            onClick={handleConfirmDelete}
            disabled={isSubmitting}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            {isSubmitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteTestimonialDialog;