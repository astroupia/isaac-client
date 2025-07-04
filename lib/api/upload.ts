import { apiFetch } from './client';

export interface UploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<UploadResponse>('/cloudinary/upload', {
    method: 'POST',
    headers: {
      // Let the browser set the Content-Type with boundary
    },
    body: formData,
  });
};

export const deleteFile = async (publicId: string): Promise<void> => {
  return apiFetch<void>(`/cloudinary/delete/${publicId}`, {
    method: 'DELETE',
  });
};

export const getFileInfo = async (publicId: string): Promise<UploadResponse> => {
  return apiFetch<UploadResponse>(`/cloudinary/info/${publicId}`);
};
