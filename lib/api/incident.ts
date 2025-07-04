import { apiFetch } from './client';
import { ICreateIncidentDto, IIncident, IUpdateIncidentDto } from '@/types/incident';

export const createIncident = async (data: ICreateIncidentDto): Promise<IIncident> => {
  return apiFetch<IIncident>('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getIncident = async (id: string): Promise<IIncident> => {
  return apiFetch<IIncident>(`/incidents/${id}`);
};

export const updateIncident = async (id: string, data: IUpdateIncidentDto): Promise<IIncident> => {
  return apiFetch<IIncident>(`/incidents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteIncident = async (id: string): Promise<void> => {
  return apiFetch<void>(`/incidents/${id}`, {
    method: 'DELETE',
  });
};
