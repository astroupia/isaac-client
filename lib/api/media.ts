import { apiService } from './base';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

const mediaService = {
  uploadFile: async (file: File): Promise<CloudinaryUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('[mediaService] Uploading file to Cloudinary:', file);

    try {
      const response = await apiService.post<CloudinaryUploadResponse>(
        '/cloudinary/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('[mediaService] Cloudinary upload response:', response);
      return response;
    } catch (err) {
      console.error('[mediaService] Cloudinary upload error:', err);
      throw err;
    }
  },

  deleteFile: async (publicId: string, resourceType: string = 'auto'): Promise<void> => {
    try {
      await apiService.delete(`/cloudinary/delete/${publicId}?resourceType=${resourceType}`);
    } catch (err) {
      console.error('[mediaService] Cloudinary delete error:', err);
      throw err;
    }
  },

  getFileInfo: async (publicId: string, resourceType: string = 'auto'): Promise<any> => {
    try {
      const response = await apiService.get<any>(`/cloudinary/info/${publicId}?resourceType=${resourceType}`);
      return response;
    } catch (err) {
      console.error('[mediaService] Cloudinary get file info error:', err);
      throw err;
    }
  },

  getSupportedFormats: async (): Promise<{
    images: string[];
    videos: string[];
    audio: string[];
    documents: string[];
    maxFileSize: string;
  }> => {
    try {
      const response = await apiService.get<{
        images: string[];
        videos: string[];
        audio: string[];
        documents: string[];
        maxFileSize: string;
      }>('/cloudinary/supported-formats');
      return response;
    } catch (err) {
      console.error('[mediaService] Cloudinary get supported formats error:', err);
      throw err;
    }
  },
};

export default mediaService;