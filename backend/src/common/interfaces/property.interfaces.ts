export interface MultimediaReference {
  id: string;
  fileName: string;
  order: number;
  isMain: boolean;
  description?: string;
  tags?: string[];
  mediaType: 'image' | 'video' | 'document' | '360' | 'floor-plan';
  uploadedAt: Date;
  fileSize: number;
  url?: string;
}

export interface PostRequest {
  requestedAt: Date;
  requestedBy: string;
  platform?: string;
  specifications?: string;
  budget?: number;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ChangeHistoryEntry {
  timestamp: Date;
  changedBy: string;
  field: string;
  previousValue: any;
  newValue: any;
  reason?: string;
  ip?: string;
  userAgent?: string;
}

export interface ViewEntry {
  timestamp: Date;
  userId?: string;
  sessionId: string;
  ip?: string;
  userAgent?: string;
  platform?: string;
  source?: string;
  timeSpent?: number;
}

export interface RegionCommune {
  regionId?: string;
  regionName?: string;
  communeId?: string;
  communeName?: string;
}

export interface LeadEntry {
  timestamp: Date;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
  source?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  assignedTo?: string;
  followUpDate?: Date;
  notes?: string;
}