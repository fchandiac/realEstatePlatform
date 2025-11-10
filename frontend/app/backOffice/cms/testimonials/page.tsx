import { getTestimonials } from '@/app/actions/testimonials';
import ListTestimonials from './ui/ListTestimonials';

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';

  const result = await getTestimonials({ search });

  // Si hay error, mostramos array vacío por ahora
  const testimonials = result.success ? result.data || [] : [];

  return <ListTestimonials testimonials={testimonials} />;
}
