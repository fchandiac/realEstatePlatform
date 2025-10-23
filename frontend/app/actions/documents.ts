'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';

// ===================================
// Document Types and Interfaces
// ===================================

export interface Document {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  metadata?: {
    propertyId?: string;
    type?: 'PROPERTY_IMG' | 'PROPERTY_VIDEO' | 'DOCUMENT' | 'OTHER';
    category?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentMetadata {
  propertyId?: string;
  type?: 'PROPERTY_IMG' | 'PROPERTY_VIDEO' | 'DOCUMENT' | 'OTHER';
  category?: string;
  description?: string;
}

export interface DocumentListParams {
  propertyId?: string;
  type?: 'PROPERTY_IMG' | 'PROPERTY_VIDEO' | 'DOCUMENT' | 'OTHER';
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

// ===================================
// Document Server Actions
// ===================================

/**
 * Upload a single document/file
 */
export async function uploadDocument(
  file: File, 
  metadata?: UploadDocumentMetadata
): Promise<{
  success: boolean;
  data?: Document;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(`${env.backendApiUrl}/document/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Upload failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Upload multiple documents/files
 */
export async function uploadMultipleDocuments(
  files: File[], 
  metadata?: UploadDocumentMetadata
): Promise<{
  success: boolean;
  data?: Document[];
  errors?: Array<{ file: string; error: string }>;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const results: Document[] = [];
    const errors: Array<{ file: string; error: string }> = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      try {
        const response = await fetch(`${env.backendApiUrl}/document/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          results.push(result);
        } else {
          const errorData = await response.json().catch(() => null);
          errors.push({ 
            file: file.name, 
            error: errorData?.message || `Upload failed: ${response.status}` 
          });
        }
      } catch (fileError) {
        errors.push({ 
          file: file.name, 
          error: fileError instanceof Error ? fileError.message : 'Unknown error' 
        });
      }
    }

    return { 
      success: results.length > 0, 
      data: results.length > 0 ? results : undefined,
      errors: errors.length > 0 ? errors : undefined,
      error: errors.length === files.length ? 'All uploads failed' : undefined
    };
  } catch (error) {
    console.error('Error uploading multiple documents:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get a document by ID
 */
export async function getDocument(id: string): Promise<{
  success: boolean;
  data?: Document;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/document/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to fetch document: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * List documents with filters
 */
export async function listDocuments(params: DocumentListParams = {}): Promise<{
  success: boolean;
  data?: {
    data: Document[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const searchParams = new URLSearchParams();
    if (params.propertyId) searchParams.set('propertyId', params.propertyId);
    if (params.type) searchParams.set('type', params.type);
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    const url = `${env.backendApiUrl}/document?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to list documents: ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error listing documents:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/document/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to delete document: ${response.status}` 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update document metadata
 */
export async function updateDocumentMetadata(
  id: string, 
  metadata: UploadDocumentMetadata
): Promise<{
  success: boolean;
  data?: Document;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/document/${id}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ metadata }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to update metadata: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating document metadata:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get documents by property ID (specific to property multimedia)
 */
export async function getPropertyDocuments(propertyId: string): Promise<{
  success: boolean;
  data?: Document[];
  error?: string;
}> {
  try {
    const result = await listDocuments({ 
      propertyId,
      limit: 100 
    });
    
    if (result.success && result.data) {
      return { success: true, data: result.data.data };
    }
    
    return { success: false, error: result.error };
  } catch (error) {
    console.error('Error fetching property documents:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}