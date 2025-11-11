/**
 * DeleteBaseForm
 *
 * Formulario de confirmación para eliminación de elementos.
 *
 * Props:
 * - message: Mensaje de confirmación que se mostrará al usuario.
 * - onSubmit: Función para manejar la eliminación.
 * - isSubmitting: (opcional) boolean para mostrar loading en el botón.
 * - title: (opcional) título del formulario.
 * - errors: (opcional) array de strings para mostrar errores.
 */

// Ejemplo de uso:
// import DeleteBaseForm from './BaseForm/DeleteBaseForm';
// const [isSubmitting, setIsSubmitting] = useState(false);
// <DeleteBaseForm
//   message="¿Estás seguro de que deseas eliminar este elemento?"
//   onSubmit={() => { /* lógica de eliminación */ }}
//   isSubmitting={isSubmitting}
//   title="Eliminar elemento"
//   errors={[]}
// />

"use client";
import React from "react";
import { Button } from "../Button/Button";
import DotProgress from "../DotProgress/DotProgress";
import Alert from "../Alert/Alert";

export interface DeleteBaseFormProps {
    message: string;
    onSubmit: () => void;
    isSubmitting?: boolean;
    title?: string;
    subtitle?: string;
    submitLabel?: string;
    errors?: string[];
    ["data-test-id"]?: string;
    showCloseButton?: boolean;
    closeButtonText?: string;
    onClose?: () => void;
}

const DeleteBaseForm: React.FC<DeleteBaseFormProps> = ({
    message,
    onSubmit,
    isSubmitting = false,
    title = "Confirmar eliminación",
    subtitle,
    submitLabel,
    errors = [],
    showCloseButton = false,
    closeButtonText = "cerrar",
    onClose,
    ...props
}) => {
    const dataTestId = props["data-test-id"];
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-test-id={dataTestId || "delete-base-form-root"}>
            {title && title !== "" && (
                <div className="title p-1 pb-0 w-full">{title}</div>
            )}
            {subtitle && subtitle !== "" && (
                <div className="subtitle p-1 pt-0 w-full">{subtitle}</div>
            )}

            {errors.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                    {errors.map((err, i) => (
                        <Alert key={i} variant="error">{err}</Alert>
                    ))}
                </div>
            )}

            <div className="mb-4">
                <Alert variant="error">
                    {message}
                </Alert>
            </div>

            <div className="flex justify-end gap-2">
                {isSubmitting ? (
                    <DotProgress size={18} className="self-end" />
                ) : (
                    <Button variant="primary" type="submit">
                        {submitLabel ?? "Eliminar"}
                    </Button>
                )}
                {showCloseButton && onClose && (
                    <Button
                        variant="outlined"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {closeButtonText}
                    </Button>
                )}
            </div>
        </form>
    );
};

export default DeleteBaseForm;
