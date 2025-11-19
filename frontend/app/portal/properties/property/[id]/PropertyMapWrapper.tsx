import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

interface PropertyMapWrapperProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  city?: string;
  state?: string;
}

const PropertyMapClient = dynamic(
  () => import('./PropertyMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full rounded-lg overflow-hidden border border-border flex items-center justify-center" style={{ height: '400px' }}>
        <CircularProgress />
      </div>
    ),
  }
);

export default function PropertyMapWrapper(props: PropertyMapWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full rounded-lg overflow-hidden border border-border flex items-center justify-center" style={{ height: '400px' }}>
        <CircularProgress />
      </div>
    }>
      <PropertyMapClient {...props} />
    </Suspense>
  );
}
