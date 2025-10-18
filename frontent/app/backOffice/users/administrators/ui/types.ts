export type AdministratorStatus = "ACTIVE" | "INVITED" | "INACTIVE" | "SUSPENDED";

export interface AdministratorSummary {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: AdministratorStatus;
  avatarUrl?: string | null;
}
