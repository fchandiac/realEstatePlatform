'use client';

import { useState, useEffect } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';
import { getMultimedia, type MultimediaItem } from '@/app/actions/multimedia';

interface MultimediaPropertyCardProps {
  multimediaId: string;
  propertyId: string;
}

export default function MultimediaPropertyCard({
  multimediaId,
  propertyId,
}: MultimediaPropertyCardProps) {
  const [multimedia, setMultimedia] = useState<MultimediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Load multimedia on mount
  useEffect(() => {
    loadMultimedia();
  }, [multimediaId]);

  const loadMultimedia = async () => {
    try {
      setLoading(true);
      const multimediaResult = await getMultimedia(multimediaId);
      if (multimediaResult.success && multimediaResult.data) {
        setMultimedia(multimediaResult.data);
      }
    } catch (error) {
      console.error('Error loading multimedia:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral">
        <DotProgress />
      </div>
    );
  }

  // Error or no multimedia
  if (!multimedia) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral p-4">
        <div className="text-center text-muted-foreground break-all">
          <p className="text-xs">No disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video min-h-[7rem] rounded-lg overflow-hidden bg-neutral p-4 flex items-center justify-center">
      <div className="text-center text-muted-foreground break-all">
        <p className="text-xs font-mono">{multimedia.url}</p>
      </div>
    </div>
  );
}
