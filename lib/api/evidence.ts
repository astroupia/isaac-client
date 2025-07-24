import { apiService } from "./base";
import {
  ICreateEvidenceDto,
  IEvidence,
  IUpdateEvidenceDto,
} from "@/types/evidence";

export const evidenceService = {
  createEvidence: async (data: ICreateEvidenceDto): Promise<IEvidence> => {
    return apiService.post<IEvidence>("/evidences", data);
  },

  getEvidence: async (id: string): Promise<IEvidence> => {
    return apiService.get<IEvidence>(`/evidences/${id}`);
  },

  getAllEvidence: async (): Promise<IEvidence[]> => {
    return apiService.get<IEvidence[]>("/evidences");
  },

  updateEvidence: async (
    id: string,
    data: IUpdateEvidenceDto
  ): Promise<IEvidence> => {
    return apiService.patch<IEvidence>(`/evidences/${id}`, data);
  },

  deleteEvidence: async (id: string): Promise<void> => {
    return apiService.delete(`/evidences/${id}`);
  },

  getIncidentEvidence: async (incidentId: string): Promise<IEvidence[]> => {
    return apiService.get<IEvidence[]>(`/evidences/incident/${incidentId}`);
  },

  getReportEvidence: async (reportId: string): Promise<IEvidence[]> => {
    return apiService.get<IEvidence[]>(`/evidences/report/${reportId}`);
  },
};

export default evidenceService;
