import { apiService } from './base';
import { ICreateEvidenceDto, IEvidence, IUpdateEvidenceDto } from '@/types/evidence';

export const evidenceService = {
  createEvidence: async (data: ICreateEvidenceDto): Promise<IEvidence> => {
    return apiService.post<IEvidence>('/evidence', data);
  },

  getEvidence: async (id: string): Promise<IEvidence> => {
    return apiService.get<IEvidence>(`/evidence/${id}`);
  },

  updateEvidence: async (id: string, data: IUpdateEvidenceDto): Promise<IEvidence> => {
    return apiService.patch<IEvidence>(`/evidence/${id}`, data);
  },

  deleteEvidence: async (id: string): Promise<void> => {
    return apiService.delete(`/evidence/${id}`);
  },

  getIncidentEvidence: async (incidentId: string): Promise<IEvidence[]> => {
    return apiService.get<IEvidence[]>(`/evidence/incident/${incidentId}`);
  },
};

export default evidenceService;
