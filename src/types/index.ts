export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Lead {
  createdAt: string | number | Date;
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
}
