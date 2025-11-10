import { listBlogs } from '@/app/actions/blogs';
import BlogList from '@/components/BlogList/BlogList';

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  const articles = await listBlogs({ category });

  return <BlogList articles={articles} currentCategory={category} />;
}
