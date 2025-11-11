'use client';

import React from 'react';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

interface MultimediaPropertyCardProps {
  multimediaItem: { id: string; url: string; type: string };
  propertyId: string;
  mainImageUrl?: string;
  isDeleting: boolean;
  onSetMain: (newMainUrl: string) => void;
  onDelete: (multimediaId: string) => void;
}

export default function MultimediaPropertyCard({
  multimediaItem,
  mainImageUrl,
  isDeleting,
  onSetMain,
  onDelete,
}: MultimediaPropertyCardProps) {
  const { id, url, type } = multimediaItem;
  const isMain = mainImageUrl === url;

  return (
    <div className="relative group aspect-video rounded-lg overflow-hidden border border-border">
      {type.startsWith('image/') ? (
        <img src={url} alt="Property multimedia" className="w-full h-full object-cover" />
      ) : (
        <video src={url} className="w-full h-full object-cover" controls />
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {isDeleting ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <IconButton
              icon="delete"
              variant="containedSecondary"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            />
            
            {!isMain && type.startsWith('image/') && (
              <IconButton
                icon="star"
                variant="containedSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetMain(url);
                }}
              />
            )}
          </>
        )}
      </div>

      {isMain && (
        <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-1">
          <span className="material-symbols-outlined text-sm">star</span>
        </div>
      )}
    </div>
  );
}