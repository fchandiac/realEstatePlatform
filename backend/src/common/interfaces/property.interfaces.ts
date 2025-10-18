

import { PostRequestStatus } from '../enums/post-request-status.enum';

export interface PostRequest {
  requestedAt: Date;
  requestedBy: string;
  platform?: string;
  specifications?: string;
  budget?: number;
  notes?: string;
  status: PostRequestStatus;
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