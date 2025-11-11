import { listBlogs } from '@/app/actions/blogs';
import BlogList from '@/components/BlogList/BlogList';

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const articles = await listBlogs({ category });

  return <BlogList articles={articles} currentCategory={category} />;
}
