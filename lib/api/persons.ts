import { apiService } from './base';
import { IPerson, ICreatePersonDto, IUpdatePersonDto } from '@/types/person';

export const personService = {
  // Create a new person
  createPerson: async (personData: ICreatePersonDto): Promise<IPerson> => {
    return apiService.post<IPerson>('/persons', personData);
  },

  // Get all persons
  getAllPersons: async (): Promise<IPerson[]> => {
    return apiService.get<IPerson[]>('/persons');
  },

  // Get a person by ID
  getPerson: async (id: string): Promise<IPerson> => {
    return apiService.get<IPerson>(`/persons/${id}`);
  },

  // Update a person by ID
  updatePerson: async (id: string, personData: IUpdatePersonDto): Promise<IPerson> => {
    return apiService.patch<IPerson>(`/persons/${id}`, personData);
  },

  // Delete a person by ID
  deletePerson: async (id: string): Promise<any> => {
    return apiService.delete<any>(`/persons/${id}`);
  },

  // Get persons by incident ID
  getIncidentPersons: async (incidentId: string): Promise<IPerson[]> => {
    console.log('personService.getIncidentPersons called with incidentId:', incidentId);
    console.log('Making API call to:', `/persons/incident/${incidentId}`);
    const result = await apiService.get<IPerson[]>(`/persons/incident/${incidentId}`);
    console.log('personService.getIncidentPersons result:', result);
    return result;
  },
};

export default personService; 