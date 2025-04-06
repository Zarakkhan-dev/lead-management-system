import axiosInstance from "../api/axiosInstance";
import type { Lead, LeadFormData, LeadStats, LeadStatus } from "../types";
import { LEAD_STATS_URL, LEAD_URL } from "./constant";

export const fetchLeads = async (): Promise<Lead[]> => {
  const res = await axiosInstance.get(LEAD_URL);
  return res.data;
};

export const fetchLead = async (id: string): Promise<Lead> => {
  const res = await axiosInstance.get(`${LEAD_URL}/${id}`);
  return res.data;
};

export const createLead = async (leadData: LeadFormData): Promise<Lead> => {
  const res = await axiosInstance.post(LEAD_URL, leadData);
  return res.data;
};

export const updateLead = async (id: string, leadData: LeadFormData): Promise<Lead> => {
  const res = await axiosInstance.put(`${LEAD_URL}/${id}`, leadData);
  return res.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${LEAD_URL}/${id}`);
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<Lead> => {
  const res = await axiosInstance.put(`${LEAD_URL}/${id}`, { status });
  return res.data;
};

export const getLeadStats = async (): Promise<LeadStats> => {
  const res = await axiosInstance.get(LEAD_STATS_URL);
  return res.data;
};
