import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ICreateEvidenceDto, EvidenceType } from '@/types/evidence';

interface EvidenceUploadProps {
  onUpload: (evidence: ICreateEvidenceDto) => Promise<void>;
}

export const EvidenceUpload = ({ onUpload }: EvidenceUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      setIsUploading(true);
      setError(null);

      try {
        // In a real implementation, you would upload the file here
        // and then create an evidence record
        const evidence: ICreateEvidenceDto = {
          title: file.name,
          type: getFileType(file.type),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedBy: 'current-user-id', // You would get this from your auth context
          uploadedAt: new Date(),
        };

        await onUpload(evidence);
      } catch (err) {
        console.error('Error uploading file:', err);
        setError('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-600">Drop the file here</p>
        ) : (
          <div>
            <p className="text-gray-600">
              Drag and drop a file here, or click to select a file
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports images, videos, PDFs, and audio files (max 50MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Helper function to determine evidence type from file type
function getFileType(mimeType: string): EvidenceType {
  if (mimeType.startsWith('image/')) return EvidenceType.PHOTO;
  if (mimeType.startsWith('video/')) return EvidenceType.VIDEO;
  if (mimeType.startsWith('audio/')) return EvidenceType.AUDIO;
  if (mimeType === 'application/pdf' || 
      mimeType.startsWith('text/') || 
      mimeType.includes('word') || 
      mimeType.includes('excel') || 
      mimeType.includes('powerpoint')) {
    return EvidenceType.DOCUMENT;
  }
  return EvidenceType.OTHER;
}
