import { apiService } from "./base";
import {
  ICreateReportDto,
  IReport,
  IUpdateReportDto,
} from "@/app/types/report";

export const reportService = {
  createReport: async (data: ICreateReportDto): Promise<IReport> => {
    return apiService.post<IReport>("/reports", data);
  },

  getReport: async (id: string): Promise<IReport> => {
    return apiService.get<IReport>(`/reports/${id}`);
  },

  updateReport: async (
    id: string,
    data: IUpdateReportDto
  ): Promise<IReport> => {
    return apiService.patch<IReport>(`/reports/${id}`, data);
  },

  deleteReport: async (id: string): Promise<void> => {
    return apiService.delete(`/reports/${id}`);
  },

  getIncidentReport: async (incidentId: string): Promise<IReport> => {
    return apiService.get<IReport>(`/reports/incident/${incidentId}`);
  },

  getAllReports: async (): Promise<IReport[]> => {
    return apiService.get<IReport[]>(`/reports`);
  },

  getReportsByAssignedUser: async (userId: string): Promise<IReport[]> => {
    return apiService.get<IReport[]>(`/reports?assignedTo=${userId}`);
  },
};

export default reportService;
