import { useState } from 'react';
import { ICreateIncidentDto } from '@/app/types/incident';
import { ICreateEvidenceDto } from '@/types/evidence';
import { ICreateVehicleDto } from '@/app/types/vehicle';
import { incidentService } from '@/lib/api/incidents';
import { evidenceService } from '@/lib/api/evidence';
import { vehicleService } from '@/lib/api/vehicles';
import mediaService from '@/lib/api/media';

export const useIncidentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      const response = await mediaService.uploadFile(file);
      return response.url;
    } catch (err) {
      console.error('Error uploading media:', err);
      throw new Error('Failed to upload file. Please try again.');
    }
  };

  const createIncident = async (incidentData: ICreateIncidentDto) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the incident first
      const incident = await incidentService.createIncident(incidentData);
      return incident;
    } catch (err) {
      console.error('Error creating incident:', err);
      setError('Failed to create incident. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEvidence = async (incidentId: string, evidenceData: ICreateEvidenceDto) => {
    try {
      const evidence = await evidenceService.createEvidence({
        ...evidenceData,
        relatedTo: {
          // Note: evidence doesn't directly relate to incidents in the current schema
          // You may need to update the evidence schema or handle this differently
        },
      });
      return evidence;
    } catch (err) {
      console.error('Error adding evidence:', err);
      throw new Error('Failed to add evidence. Please try again.');
    }
  };

  const addVehicle = async (incidentId: string, vehicleData: ICreateVehicleDto) => {
    try {
      const vehicle = await vehicleService.createVehicle(vehicleData);
      
      // Update incident with the new vehicle
      await incidentService.updateIncident(incidentId, {
        vehicleIds: [(vehicle as any)._id],
      });
      
      return vehicle;
    } catch (err) {
      console.error('Error adding vehicle:', err);
      throw new Error('Failed to add vehicle. Please try again.');
    }
  };

  return {
    isSubmitting,
    error,
    uploadMedia,
    createIncident,
    addEvidence,
    addVehicle,
  };
};

export default useIncidentForm;
