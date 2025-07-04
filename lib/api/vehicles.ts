import { apiService } from './base';
import { ICreateVehicleDto, IUpdateVehicleDto, IVehicle } from '@/app/types/vehicle';

export const vehicleService = {
  createVehicle: async (data: ICreateVehicleDto): Promise<IVehicle> => {
    return apiService.post<IVehicle>('/vehicles', data);
  },

  getVehicle: async (id: string): Promise<IVehicle> => {
    return apiService.get<IVehicle>(`/vehicles/${id}`);
  },

  updateVehicle: async (id: string, data: IUpdateVehicleDto): Promise<IVehicle> => {
    return apiService.patch<IVehicle>(`/vehicles/${id}`, data);
  },

  deleteVehicle: async (id: string): Promise<void> => {
    return apiService.delete(`/vehicles/${id}`);
  },

  getIncidentVehicles: async (incidentId: string): Promise<IVehicle[]> => {
    return apiService.get<IVehicle[]>(`/vehicles/incident/${incidentId}`);
  },

  getAllVehicles: async (): Promise<IVehicle[]> => {
    return apiService.get<IVehicle[]>('/vehicles');
  },
};

export default vehicleService;
