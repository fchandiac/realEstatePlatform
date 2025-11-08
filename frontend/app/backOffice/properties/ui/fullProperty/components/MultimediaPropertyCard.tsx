'use client';

import { useState, useEffect, useRef } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import DotProgress from '@/components/DotProgress/DotProgress';
import { getMultimedia, deleteMultimedia, type MultimediaItem } from '@/app/actions/multimedia';
import { updateMainImage, isMultimediaMain } from '@/app/actions/properties';
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect';

interface MultimediaPropertyCardProps {
  multimediaId: string;
  propertyId: string;
  isMain?: boolean;
  onDelete?: (deletedId: string) => void;
  onMainChange?: (newMainUrl: string) => void;
}

export default function MultimediaPropertyCard({
  multimediaId,
  propertyId,
  isMain = false,
  onDelete,
  onMainChange
}: MultimediaPropertyCardProps) {
  // Extend MultimediaItem dynamically because backend sends extra fields like filename, format, seoTitle
  const [multimedia, setMultimedia] = useState<(MultimediaItem & Record<string, any>) | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [verifiedIsMain, setVerifiedIsMain] = useState(isMain);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [resolutionTried, setResolutionTried] = useState(false);
  const [candidateResults, setCandidateResults] = useState<Array<{url:string; ok:boolean; status:number; contentType?:string;}>>([]);
  
  const { handleAuthError } = useAuthRedirect();

  // Build absolute URL for multimedia
  const mediaUrl = multimedia?.url.startsWith('http')
    ? multimedia.url
    : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${multimedia?.url || ''}`;

  // Log URL para debugging (solo cuando cambia la multimedia)
  useEffect(() => {
    if (multimedia) {
      const debugFilename = (multimedia as any).filename || (multimedia as any).originalName || 'N/A';
      console.log('🔍 MultimediaPropertyCard Debug:', {
        multimediaId,
        originalUrl: multimedia?.url,
        finalMediaUrl: mediaUrl,
        type: multimedia?.type,
        format: (multimedia as any).format,
        filename: debugFilename,
        fullMultimediaObject: multimedia // Ver todo el objeto para detectar inconsistencias
      });
    }
  }, [multimedia?.id, mediaUrl]);

  // Load multimedia on mount
  useEffect(() => {
    loadMultimedia();
  }, [multimediaId]);

  const loadMultimedia = async () => {
    try {
      setLoading(true);
      
      const multimediaResult = await getMultimedia(multimediaId);
      if (!multimediaResult.success || !multimediaResult.data) {
        throw new Error(multimediaResult.error || 'Error loading multimedia');
      }
      
      setMultimedia(multimediaResult.data);
      
      const mainResult = await isMultimediaMain(propertyId, multimediaId);
      if (mainResult.success) {
        setVerifiedIsMain(mainResult.isMain || false);
      }
    } catch (error) {
      console.error('Error loading multimedia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this multimedia?')) return;

    try {
      setDeleting(true);
      const result = await deleteMultimedia(multimediaId);
      
      if (result.success) {
        onDelete?.(multimediaId);
      } else {
        if (!handleAuthError(result.error || 'Error deleting')) {
          alert(result.error || 'Error deleting multimedia');
        }
      }
    } catch (error) {
      if (!handleAuthError('Unexpected error')) {
        alert('Error deleting multimedia');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleSetMain = async () => {
    if (!multimedia) return;

    try {
      const result = await updateMainImage(propertyId, mediaUrl);
      
      if (result.success) {
        setVerifiedIsMain(true);
        onMainChange?.(mediaUrl);
      } else {
        if (!handleAuthError(result.error || 'Error setting main')) {
          alert(result.error || 'Error setting as main');
        }
      }
    } catch (error) {
      if (!handleAuthError('Unexpected error')) {
        alert('Error setting as main');
      }
    }
  };

  // Detectar si es video por format o type
  const rawFormat = (multimedia as any)?.format as string | undefined;
  const rawFileName = (multimedia as any)?.filename as string | undefined;
  const isVideo =
    rawFormat === 'VIDEO' ||
    multimedia?.type === 'VIDEO' ||
    (multimedia as any)?.propertyType === 'PROPERTY_VIDEO' ||
    rawFileName?.toLowerCase().endsWith('.mp4') ||
    rawFileName?.toLowerCase().endsWith('.webm') ||
    rawFileName?.toLowerCase().endsWith('.mov') ||
    mediaUrl?.includes('/video/');

  // Generate candidate alternate URLs for debugging / fallback
  const candidateVideoUrls = isVideo && multimedia ? (() => {
    const base = mediaUrl;
    const list = new Set<string>();
    if (base) list.add(base);
    // Remove /public prefix (a common SSR vs static mismatch)
    if (base.includes('/public/')) list.add(base.replace('/public', ''));
    // Try /uploads instead of /public if pattern suggests so
    if (base.includes('/public/properties/')) list.add(base.replace('/public/properties/', '/uploads/properties/'));
    // Try switching host to backend env if different
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    try {
      const u = new URL(base);
      if (backend && !base.startsWith(backend)) {
        list.add(backend.replace(/\/$/, '') + u.pathname);
      }
    } catch { /* ignore */ }
    // Add plain filename at common folders (best‑effort)
    if (rawFileName) {
      const filename = rawFileName;
      list.add(`${backend.replace(/\/$/, '')}/uploads/properties/video/${filename}`);
      list.add(`${backend.replace(/\/$/, '')}/public/properties/video/${filename}`);
    }
    return Array.from(list);
  })() : [];

  // Resolve first working video URL (HEAD probe) once per multimedia item
  useEffect(() => {
    if (!isVideo || !multimedia || resolutionTried) return;
    let cancelled = false;
    const run = async () => {
      setResolving(true);
      const results: Array<{url:string; ok:boolean; status:number; contentType?:string;}> = [];
      for (const url of candidateVideoUrls) {
        try {
          const r = await fetch(url, { method: 'HEAD' });
          const ok = r.ok && (r.headers.get('content-type') || '').includes('video');
          results.push({ url, ok, status: r.status, contentType: r.headers.get('content-type') || undefined });
          if (ok && !cancelled) {
            setResolvedVideoUrl(url);
            break;
          }
        } catch (e) {
          results.push({ url, ok: false, status: 0 });
        }
      }
      if (!cancelled) {
        setCandidateResults(results);
        if (!results.find(r => r.ok)) {
          // fallback to original even if probes failed (maybe HEAD blocked)
          setResolvedVideoUrl(mediaUrl);
        }
        setResolutionTried(true);
        setResolving(false);
        console.log('🎯 Video URL resolution results', { multimediaId, results, chosen: resolvedVideoUrl || mediaUrl });
      }
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideo, multimedia?.id]);

  const handleVideoClick = async () => {
    if (isVideo && videoRef.current) {
      console.log('🎬 Intentando reproducir video:', {
        mediaUrl,
        resolvedVideoUrl,
        videoElement: videoRef.current,
        currentSrc: videoRef.current.src,
        readyState: videoRef.current.readyState,
        networkState: videoRef.current.networkState
      });

      // Verificar si el video existe primero
      try {
        const probeUrl = resolvedVideoUrl || mediaUrl;
        const response = await fetch(probeUrl, { method: 'HEAD' });
        console.log('🌐 Video URL check:', {
          url: probeUrl,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          throw new Error(`Video no encontrado (HEAD): ${response.status} ${response.statusText}`);
        }
      } catch (fetchError) {
        console.error('❌ Error verificando video URL:', fetchError);
        alert(`No se puede acceder al video: ${fetchError}`);
        return;
      }

      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
          console.log('⏸️ Video pausado');
        } else {
          videoRef.current.muted = true;
          videoRef.current.loop = true;
          videoRef.current.playsInline = true;
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn('⚠️ play() directo falló, reintentando con small timeout', playErr);
            setTimeout(() => { videoRef.current?.play().catch(e => console.error('❌ Segundo intento play() falló', e)); }, 150);
          }
          setIsPlaying(true);
          console.log('✅ Video reproduciendo después de click');
        }
      } catch (error) {
        console.error('❌ Error reproduciendo video:', {
          error,
          mediaUrl,
          resolvedVideoUrl,
          videoSrc: videoRef.current?.src,
          readyState: videoRef.current?.readyState
        });
        alert(`Error reproduciendo video: ${error}`);
      }
    } else {
      console.warn('⚠️ No se puede reproducir:', {
        isVideo,
        hasVideoRef: !!videoRef.current,
        multimedia,
        detectedAsVideo: isVideo,
        resolvedVideoUrl,
        candidateVideoUrls
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center">
        <DotProgress />
      </div>
    );
  }

  // Error or no multimedia
  if (!multimedia) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p className="text-sm">Multimedia no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video min-h-[7rem] rounded-lg overflow-hidden">
      {/* Video cuando está reproduciéndose, imagen/poster cuando no */}
      {isVideo && isPlaying ? (
        <video
          ref={videoRef}
          src={resolvedVideoUrl || mediaUrl}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          onClick={handleVideoClick}
          controls
          preload="auto"
          onLoadStart={() => console.log('🔄 Video: loadstart', resolvedVideoUrl || mediaUrl)}
          onLoadedData={() => console.log('📦 Video: loadeddata', resolvedVideoUrl || mediaUrl)}
          onCanPlay={() => console.log('▶️ Video: canplay', resolvedVideoUrl || mediaUrl)}
          onPlay={() => console.log('🎬 Video: play event', resolvedVideoUrl || mediaUrl)}
          onEnded={() => {
            console.log('🏁 Video: ended', resolvedVideoUrl || mediaUrl);
            setIsPlaying(false);
          }}
          onError={(e) => {
            console.error('❌ Video: error event', {
              error: e,
              mediaUrl,
              resolvedVideoUrl,
              target: e.target,
              code: (e.target as HTMLVideoElement)?.error?.code,
              message: (e.target as HTMLVideoElement)?.error?.message
            });
            setIsPlaying(false);
          }}
        />
      ) : (
        <>
          <img
            src={resolvedVideoUrl || mediaUrl}
            alt={rawFileName || 'Multimedia'}
            className="w-full h-full object-cover cursor-pointer"
            onClick={isVideo ? handleVideoClick : undefined}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="400" height="225" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="225" fill="#f3f4f6"/>
                  <text x="200" y="120" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">Multimedia no disponible</text>
                </svg>
              `)}`;
            }}
          />

          {/* Indicador de play para videos */}
          {isVideo && !isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handleVideoClick}
            >
              <div className="bg-black/60 rounded-full p-4 hover:bg-black/80 transition-colors">
                <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
              </div>
            </div>
          )}
          {isVideo && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[10px] text-white p-1 space-y-0.5 leading-tight max-h-28 overflow-auto">
              <div className="flex flex-wrap gap-1">
                {candidateVideoUrls.map(c => (
                  <span key={c} className={`px-1 py-0.5 rounded ${ (resolvedVideoUrl||mediaUrl)===c ? 'bg-green-600' : 'bg-gray-700'} `}>{c.replace(/^https?:\/\//,'')}</span>
                ))}
              </div>
              {resolving && <div>Resolviendo rutas de video...</div>}
              {!resolving && candidateResults.length > 0 && (
                <div className="mt-1 grid gap-0.5" style={{gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))'}}>
                  {candidateResults.map(r => (
                    <div key={r.url} className={`border rounded px-1 ${r.ok ? 'border-green-400 text-green-300' : 'border-red-400 text-red-300'}`}>[{r.status}] {r.contentType?.split(';')[0]||'?'}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Controls - Always visible */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        {/* Star button */}
        <IconButton
          icon="star"
          variant={verifiedIsMain ? "containedPrimary" : "outlined"}
          size="sm"
          onClick={handleSetMain}
          disabled={deleting}
        />
        
        {/* Delete button */}
        <IconButton
          icon="delete"
          variant="containedSecondary"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting && <DotProgress />}
        </IconButton>
      </div>

      {/* Main indicator */}
      {verifiedIsMain && (
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1 font-medium z-10">
          <span className="material-symbols-outlined text-base">star</span>
          Main
        </div>
      )}
    </div>
  );
}
