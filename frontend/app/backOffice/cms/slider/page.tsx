import { Suspense } from 'react';
import { getSlides } from '@/app/actions/slides';
import { SlideList } from './ui';
import DotProgress from '@/components/DotProgress/DotProgress';

interface SliderPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function SliderPage({ searchParams }: SliderPageProps) {
  const params = await searchParams;
  const result = await getSlides({
    search: params.search,
  });

  if (!result.success) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Slides</h1>
        <div className="text-red-600">
          Error: {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Suspense fallback={<DotProgress />}>
        <SlideList slides={result.data || []} />
      </Suspense>
    </div>
  );
}
