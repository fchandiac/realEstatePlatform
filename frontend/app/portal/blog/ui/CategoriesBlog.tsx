"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button/Button';
import { BlogCategory } from './BlogCard';

const CATEGORIES = Object.values(BlogCategory);

export interface CategoriesBlogProps {
  className?: string;
}

export default function CategoriesBlog({ className = '' }: CategoriesBlogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') as BlogCategory | null;

  const handleCategoryClick = (category: BlogCategory | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    // Mantener otros parámetros pero resetear página
    params.delete('page');

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : '';

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Botón "Todos" */}
      <Button
        variant={currentCategory === null ? 'primary' : 'outlined'}
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
      >
        Todos
      </Button>

      {/* Botones de categorías */}
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? 'primary' : 'outlined'}
          size="sm"
          onClick={() => handleCategoryClick(category)}
          className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}