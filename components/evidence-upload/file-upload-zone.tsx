"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Upload,
  File,
  ImageIcon,
  Video,
  FileText,
  Mic,
  X,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import { EvidenceType } from "./evidence-type-selector";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
  evidenceType: EvidenceType;
}

interface FileUploadZoneProps {
  evidenceType: EvidenceType;
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

export function FileUploadZone({
  evidenceType,
  onFilesUploaded,
  maxFiles = 10,
  maxFileSize = 100,
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const getAcceptedTypes = (type: EvidenceType): string => {
    switch (type) {
      case EvidenceType.PHOTO:
        return "image/*,.jpg,.jpeg,.png,.heic,.raw";
      case EvidenceType.VIDEO:
        return "video/*,.mp4,.mov,.avi,.mkv";
      case EvidenceType.DOCUMENT:
        return ".pdf,.doc,.docx,.txt";
      case EvidenceType.AUDIO:
        return "audio/*,.mp3,.wav,.m4a,.aac";
      case EvidenceType.WITNESS_STATEMENT:
        return ".pdf,.doc,.docx,.txt,audio/*,.mp3,.wav,.mp4,.mov";
      case EvidenceType.PHYSICAL_EVIDENCE:
        return "image/*,.pdf,.doc,.docx";
      default:
        return "*/*";
    }
  };

  const getMaxFileSize = (type: EvidenceType): number => {
    switch (type) {
      case EvidenceType.VIDEO:
        return 500; // 500MB for videos
      case EvidenceType.AUDIO:
        return 100; // 100MB for audio
      case EvidenceType.PHOTO:
        return 50; // 50MB for photos
      case EvidenceType.WITNESS_STATEMENT:
        return 50; // 50MB for witness statements
      default:
        return 25; // 25MB for documents and others
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = getMaxFileSize(evidenceType) * 1024 * 1024; // Convert to bytes

    if (file.size > maxSize) {
      return `File size exceeds ${getMaxFileSize(evidenceType)}MB limit`;
    }

    if (uploadedFiles.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Upload Errors",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    validFiles.forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
        evidenceType,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id
              ? {
                  ...f,
                  progress: Math.min(f.progress + Math.random() * 30, 100),
                }
              : f
          )
        );
      }, 500);

      // Complete upload after random time
      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === newFile.id
              ? { ...f, progress: 100, status: "completed" as const }
              : f
          );
          onFilesUploaded(updated.filter((f) => f.status === "completed"));
          return updated;
        });
      }, 2000 + Math.random() * 3000);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      onFilesUploaded(updated.filter((f) => f.status === "completed"));
      return updated;
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Mic className="h-4 w-4" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getEvidenceTypeTitle = (type: EvidenceType) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  Upload {getEvidenceTypeTitle(evidenceType)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size: {getMaxFileSize(evidenceType)}MB • Maximum{" "}
                  {maxFiles} files
                </p>
              </div>
              <input
                type="file"
                multiple
                accept={getAcceptedTypes(evidenceType)}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <Badge variant="outline">
                  {getEvidenceTypeTitle(evidenceType)}
                </Badge>
              </div>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <Image
                            src={file.preview || "/placeholder.svg"}
                            alt={file.name}
                            fill
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {file.status === "completed" && (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                            <Check className="mr-1 h-3 w-3" />
                            Uploaded
                          </Badge>
                        )}
                        {file.status === "error" && (
                          <Badge variant="destructive">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Error
                          </Badge>
                        )}
                      </div>
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="h-1 mt-1" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {file.status === "completed" && file.preview && (
                        <Button type="button" variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
