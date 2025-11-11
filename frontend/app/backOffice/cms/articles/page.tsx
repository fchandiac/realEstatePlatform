import React from 'react'
import { getArticles } from '@/app/actions/articles'
import ListArticles from './ui/ListArticles'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined

  const result = await getArticles({ search })

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="text-red-600">
          Error: {result.error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administración de Artículos</h1>
      <ListArticles articles={result.data || []} search={search} />
    </div>
  )
}
