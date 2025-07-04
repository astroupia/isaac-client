import { apiService } from './base';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
}

export const mediaService = {
  uploadFile: async (file: File): Promise<CloudinaryUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    console.debug('[mediaService] Uploading file to Cloudinary:', file);

    try {
      const response = await apiService.post<CloudinaryUploadResponse>(
        '/cloudinary/upload',
        formData,
      );
      console.debug('[mediaService] Cloudinary upload response:', response);
      return response;
    } catch (err) {
      console.error('[mediaService] Cloudinary upload error:', err);
      throw err;
    }
  },

  deleteFile: async (publicId: string): Promise<void> => {
    await apiService.delete(`/cloudinary/delete/${publicId}`);
  },

  getFileInfo: async (publicId: string): Promise<any> => {
    return apiService.get(`/cloudinary/info/${publicId}`);
  },
};

export default mediaService;