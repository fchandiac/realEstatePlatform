// Types and interfaces for FullProperty component

export interface PropertyType {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  personalInfo?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface MultimediaItem {
  id: string;
  url: string;
  filename: string;
  type: string;
  format: string;
  fileSize?: number;
  uploadedAt?: string;
}

export interface ChangeHistoryEntry {
  timestamp: Date | string;
  changedBy: string;
  changedByName?: string;
  field: string;
  previousValue: any;
  newValue: any;
}

export interface ViewEntry {
  userId: string;
  duration?: number;
  viewedAt: string;
  timestamp?: Date | string;
}

export interface LeadEntry {
  timestamp: Date | string;
  status: string;
  [key: string]: any;
}

export interface PostRequest {
  requestedAt?: string;
  requestedBy?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  message?: string;
  notes?: string;
  status?: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  status: string;
  operationType: string;
  creatorUser?: User;
  assignedAgent?: User | null;
  price: number;
  currencyPrice: string;
  seoTitle?: string;
  seoDescription?: string;
  publicationDate?: string;
  isFeatured: boolean;
  propertyType?: PropertyType;
  builtSquareMeters?: number;
  landSquareMeters?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  constructionYear?: number;
  state?: string;
  city?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  multimedia?: MultimediaItem[];
  mainImageUrl?: string;
  postRequest?: PostRequest;
  favoritesCount?: number;
  leadsCount?: number;
  viewsCount?: number;
  internalNotes?: string;
  views?: ViewEntry[];
  changeHistory?: ChangeHistoryEntry[];
  leads?: LeadEntry[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  publishedAt?: string | null;
}

export interface Region {
  id: string;
  label: string;
}

export interface UpdatePropertyBasicDto {
  title?: string;
  description?: string;
  status?: string;
  operationType?: string;
  propertyTypeId?: string;
  assignedAgentId?: string;
  isFeatured?: boolean;
}

// Props interfaces for sections
export interface BaseSectionProps {
  property: Property;
  onChange: (field: string, value: any) => void;
  onSave?: () => void;
}

export interface BasicSectionProps extends BaseSectionProps {
  propertyTypes: PropertyType[];
  users: User[];
  saving: boolean;
}

export interface LocationSectionProps extends BaseSectionProps {
  regions: Region[];
}

export interface HistorySectionProps extends BaseSectionProps {}

export interface PriceSectionProps extends BaseSectionProps {}

export interface FeaturesSectionProps extends BaseSectionProps {}

export interface MultimediaSectionProps extends BaseSectionProps {}

export interface PostRequestSectionProps {
  property: Property;
}

export interface DatesSectionProps {
  property: Property;
}
