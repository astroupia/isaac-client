import { apiService } from './base';
import { ICreateIncidentDto, IIncident, IUpdateIncidentDto } from '@/app/types/incident';

export const incidentService = {
  createIncident: async (data: ICreateIncidentDto): Promise<IIncident> => {
    return apiService.post<IIncident>('/incidents', data);
  },

  getIncident: async (id: string): Promise<IIncident> => {
    return apiService.get<IIncident>(`/incidents/${id}`);
  },

  getAllIncidents: async (): Promise<IIncident[]> => {
    return apiService.get<IIncident[]>('/incidents');
  },

  updateIncident: async (id: string, data: IUpdateIncidentDto): Promise<IIncident> => {
    return apiService.patch<IIncident>(`/incidents/${id}`, data);
  },

  deleteIncident: async (id: string): Promise<void> => {
    return apiService.delete(`/incidents/${id}`);
  },
};

export default incidentService;
