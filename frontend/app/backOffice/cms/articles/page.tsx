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
  console.log('ArticlesPage result:', result)

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
      <ListArticles articles={result.data || []} search={search} />
  )
}
