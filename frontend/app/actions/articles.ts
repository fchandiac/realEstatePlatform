'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'
import { ArticleCategory } from '@/app/types/article'

// Types
export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  text: string;
  multimediaUrl?: string;
  category: ArticleCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  subtitle?: string;
  text: string;
  multimediaUrl?: string;
  category: ArticleCategory;
}

export interface UpdateArticleDto {
  title?: string;
  subtitle?: string;
  text?: string;
  multimediaUrl?: string;
  category?: ArticleCategory;
}

export interface GetArticlesParams {
  search?: string;
}

export async function getArticles(params: GetArticlesParams = {}): Promise<{
  success: boolean;
  data?: Article[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' }
    }

    const url = new URL(`${env.backendApiUrl}/articles`)

    // Agregar parámetros de búsqueda
    if (params.search) {
      url.searchParams.set('search', params.search)
    }

    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      return {
        success: false,
        error: errorData?.message || `HTTP ${res.status}`
      }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function createArticle(formData: FormData): Promise<{
  success: boolean;
  data?: Article;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' }
    }

    const res = await fetch(`${env.backendApiUrl}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      return {
        success: false,
        error: errorData?.message || `Failed to create article: ${res.status}`
      }
    }

    const result = await res.json()

    // Revalidar la página para reflejar los cambios
    revalidatePath('/backOffice/cms/articles')

    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating article:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function updateArticle(id: string, formData: FormData): Promise<{
  success: boolean;
  data?: Article;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' }
    }

    const res = await fetch(`${env.backendApiUrl}/articles/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      return {
        success: false,
        error: errorData?.message || `Failed to update article: ${res.status}`
      }
    }

    const result = await res.json()

    // Revalidar la página para reflejar los cambios
    revalidatePath('/backOffice/cms/articles')

    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating article:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteArticle(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' }
    }

    const res = await fetch(`${env.backendApiUrl}/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      return {
        success: false,
        error: errorData?.message || `Failed to delete article: ${res.status}`
      }
    }

    // Revalidar la página para reflejar los cambios
    revalidatePath('/backOffice/cms/articles')

    return { success: true }
  } catch (error) {
    console.error('Error deleting article:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}