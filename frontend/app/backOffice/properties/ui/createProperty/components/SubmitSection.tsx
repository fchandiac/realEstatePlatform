'use client';

import { Button } from '@/components/Button/Button';
import Alert from '@/components/Alert/Alert';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

interface SubmitSectionProps {
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => Promise<void>;
}

export default function SubmitSection({
  isSubmitting,
  submitError,
  onSubmit,
}: SubmitSectionProps) {
  return (
    <div className="space-y-4">
      {submitError && (
        <Alert variant="error">
          {submitError}
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} />
              <span>Creando propiedad...</span>
            </>
          ) : (
            'Crear Propiedad'
          )}
        </Button>
      </div>
    </div>
  );
}
