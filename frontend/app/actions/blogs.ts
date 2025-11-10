'use server';

import { env } from '@/lib/env';

export interface BlogArticle {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: 'Comprar' | 'Arrendar' | 'Inversión' | 'Decoración' | 'Mercado';
  imageUrl?: string;
  publishedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  relatedArticles?: BlogArticle[];
}

export interface ListBlogsParams {
  category?: string;
  limit?: number;
  offset?: number;
}

export async function listBlogs(params: ListBlogsParams = {}): Promise<BlogArticle[]> {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.append('category', params.category);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());

  const response = await fetch(`${env.backendApiUrl}/blogs?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blogs: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}