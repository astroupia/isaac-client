"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  Trash2,
  Plus,
  Camera,
  Video,
  Mic,
  File,
  Eye,
  Package,
  X,
  Save,
} from "lucide-react";

interface Evidence {
  id: string;
  title: string;
  description?: string;
  type: string;
  file?: File;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  tags: string[];
  uploadProgress?: number;
  uploaded?: boolean;
}

interface EvidenceFormProps {
  evidence: Evidence[];
  onChange: (evidence: Evidence[]) => void;
}

const evidenceTypes = [
  {
    value: "photo",
    label: "Photo",
    icon: Camera,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "video",
    label: "Video",
    icon: Video,
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "document",
    label: "Document",
    icon: FileText,
    color: "bg-green-100 text-green-800",
  },
  {
    value: "audio",
    label: "Audio",
    icon: Mic,
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "witness_statement",
    label: "Witness Statement",
    icon: Eye,
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "physical_evidence",
    label: "Physical Evidence",
    icon: Package,
    color: "bg-red-100 text-red-800",
  },
  {
    value: "other",
    label: "Other",
    icon: File,
    color: "bg-gray-100 text-gray-800",
  },
];

const quickActionTypes = [
  { type: "photo", label: "Take Photo", icon: Camera, accept: "image/*" },
  { type: "video", label: "Record Video", icon: Video, accept: "video/*" },
  { type: "audio", label: "Record Audio", icon: Mic, accept: "audio/*" },
  {
    type: "document",
    label: "Upload Document",
    icon: FileText,
    accept: ".pdf,.doc,.docx,.txt",
  },
];

export function EvidenceForm({ evidence, onChange }: EvidenceFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileStore, setFileStore] = useState<Map<string, File>>(new Map());

  // Debug: Log evidence state changes
  console.log('EvidenceForm rendered with evidence:', evidence);
  evidence.forEach((item, index) => {
    console.log(`Evidence[${index}]:`, {
      id: item.id,
      title: item.title,
      hasFile: !!item.file,
      fileName: item.fileName,
      uploaded: item.uploaded,
      uploadProgress: item.uploadProgress
    });
  });

  // Monitor evidence prop changes
  useEffect(() => {
    console.log('=== EVIDENCE PROP CHANGED ===');
    console.log('New evidence prop:', evidence);
    
    let needsUpdate = false;
    const updatedEvidence = evidence.map((item, index) => {
      if (fileStore.has(item.id) && !item.file) {
        console.log(`WARNING: Evidence[${index}] ${item.id} has file in store but not in prop!`);
        console.log('File in store:', fileStore.get(item.id));
        console.log('Automatically restoring file...');
        
        const storedFile = fileStore.get(item.id)!;
        needsUpdate = true;
        return {
          ...item,
          file: storedFile,
          fileName: storedFile.name,
          fileSize: storedFile.size,
          fileType: storedFile.type
        };
      }
      return item;
    });
    
    if (needsUpdate) {
      console.log('Restoring missing files from store...');
      onChange(updatedEvidence);
    }
  }, [evidence, fileStore, onChange]);

  const addEvidence = (type?: string) => {
    const newEvidence: Evidence = {
      id: `evidence-${Date.now()}`,
      title: "",
      type: type || "photo",
      tags: [],
      uploadProgress: 0,
      uploaded: false,
    };
    onChange([...evidence, newEvidence]);
    setEditingIndex(evidence.length);
  };

  const updateEvidence = (index: number, field: string, value: any) => {
    console.log(`=== UPDATE EVIDENCE START ===`);
    console.log(`Updating evidence[${index}].${field} to:`, value);
    console.log(`Current evidence[${index}] before update:`, evidence[index]);
    
    const updatedEvidence = evidence.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, [field]: value };
        console.log(`Creating new evidence item:`, newItem);
        return newItem;
      }
      return item;
    });
    
    console.log(`Updated evidence[${index}]:`, updatedEvidence[index]);
    console.log(`File preserved in update?`, !!updatedEvidence[index].file);
    
    onChange(updatedEvidence);
    
    console.log(`=== UPDATE EVIDENCE END ===`);
  };

  const removeEvidence = (index: number) => {
    const updatedEvidence = evidence.filter((_, i) => i !== index);
    onChange(updatedEvidence);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleFileUpload = (index: number, file: File) => {
    console.log('=== HANDLE FILE UPLOAD START ===');
    console.log('handleFileUpload called with file:', file.name, 'for index:', index);
    console.log('File object:', file);
    console.log('Current evidence before file upload:', evidence[index]);
    
    const evidenceId = evidence[index].id;
    
    // Store file in fileStore
    setFileStore(prev => {
      const newStore = new Map(prev);
      newStore.set(evidenceId, file);
      console.log('File stored in fileStore for evidence ID:', evidenceId);
      return newStore;
    });
    
    updateEvidence(index, "file", file);
    updateEvidence(index, "fileName", file.name);
    updateEvidence(index, "fileSize", file.size);
    updateEvidence(index, "fileType", file.type);
    console.log('File attached to evidence at index:', index);
    
    // Check if file was actually attached
    setTimeout(() => {
      console.log('Evidence after file attachment:', evidence[index]);
      console.log('File still attached?', !!evidence[index]?.file);
      console.log('File in store?', fileStore.has(evidenceId));
    }, 50);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        updateEvidence(index, "uploaded", true);
        console.log('File upload completed for index:', index);
        clearInterval(interval);
      }
      updateEvidence(index, "uploadProgress", progress);
    }, 200);
    
    console.log('=== HANDLE FILE UPLOAD END ===');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.length, 'files');
    files.forEach((file, fileIndex) => {
      console.log(`Processing dropped file ${fileIndex + 1}:`, file.name, file.type);
      const newEvidence: Evidence = {
        id: `evidence-${Date.now()}-${Math.random()}`,
        title: file.name.split(".")[0],
        type: file.type.startsWith("image/")
          ? "photo"
          : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
          ? "audio"
          : "document",
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        tags: [],
        uploadProgress: 0,
        uploaded: false,
      };
      console.log('Created evidence with file:', newEvidence);
      onChange([...evidence, newEvidence]);

      // Simulate upload
      setTimeout(() => {
        const index = evidence.length;
        console.log('Starting upload simulation for index:', index);
        handleFileUpload(index, file);
      }, 100);
    });
  };

  const addTag = (index: number, tag: string) => {
    if (tag.trim() && !evidence[index].tags.includes(tag.trim())) {
      const newTags = [...evidence[index].tags, tag.trim()];
      updateEvidence(index, "tags", newTags);
    }
  };

  const removeTag = (index: number, tagToRemove: string) => {
    const newTags = evidence[index].tags.filter((tag) => tag !== tagToRemove);
    updateEvidence(index, "tags", newTags);
  };

  const getTypeInfo = (type: string) => {
    return evidenceTypes.find((t) => t.value === type) || evidenceTypes[0];
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evidence ({evidence.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload and organize evidence related to the incident
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quickActionTypes.map((action) => (
            <Button
              key={action.type}
              variant="outline"
              size="sm"
              onClick={() => addEvidence(action.type)}
              className="flex items-center gap-2"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload
            className={`h-12 w-12 mb-4 ${
              dragOver ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="text-center mb-2">
            <span className="font-medium">Drag and drop files here</span> or
            click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports images, videos, documents, and audio files up to 50MB
          </p>
          <Button
            onClick={() => addEvidence()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Evidence
          </Button>
        </CardContent>
      </Card>

      {evidence.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No evidence added yet. Use the buttons above or drag files to get
              started.
            </p>
          </CardContent>
        </Card>
      )}

      {evidence.map((item, index) => {
        const typeInfo = getTypeInfo(item.type);
        const TypeIcon = typeInfo.icon;

        return (
          <Card
            key={item.id}
            className={editingIndex === index ? "ring-2 ring-primary" : ""}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {item.title || `Evidence ${index + 1}`}
                    {item.fileName && (
                      <Badge variant="secondary" className="ml-2">
                        {item.fileName}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                    {item.fileSize && (
                      <span>{formatFileSize(item.fileSize)}</span>
                    )}
                    {item.uploaded && (
                      <Badge variant="outline" className="text-green-600">
                        Uploaded
                      </Badge>
                    )}
                    {item.file && !item.uploaded && (
                      <Badge variant="outline" className="text-blue-600">
                        File Attached
                      </Badge>
                    )}
                    {!item.file && !item.uploaded && (
                      <Badge variant="outline" className="text-gray-600">
                        No File
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingIndex(editingIndex === index ? null : index)
                  }
                >
                  {editingIndex === index ? "Collapse" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEvidence(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {item.uploadProgress !== undefined && item.uploadProgress < 100 && (
              <div className="px-6 pb-2">
                <Progress value={item.uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading... {Math.round(item.uploadProgress)}%
                </p>
              </div>
            )}

            {editingIndex === index && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      updateEvidence(index, "title", e.target.value)
                    }
                    placeholder="Enter evidence title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={item.type}
                    onValueChange={(value) =>
                      updateEvidence(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                    <SelectContent>
                      {evidenceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(e) =>
                      updateEvidence(index, "description", e.target.value)
                    }
                    placeholder="Describe the evidence..."
                    rows={3}
                  />
                </div>

                {!item.file && (
                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <Input
                      type="file"
                      onChange={(e) => {
                        console.log('File input onChange triggered');
                        const file = e.target.files?.[0];
                        console.log('Selected file:', file);
                        if (file) {
                          console.log('Calling handleFileUpload with file:', file.name, 'for index:', index);
                          handleFileUpload(index, file);
                        } else {
                          console.log('No file selected');
                        }
                      }}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeTag(index, tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(index, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>

                {/* Save and Cancel buttons */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      console.log('Save button clicked for evidence index:', index);
                      console.log('Current evidence data:', evidence[index]);
                      console.log('Evidence file object:', evidence[index].file);
                      
                      // Force a state update to ensure data is saved
                      const currentEvidence = evidence[index];
                      const evidenceId = currentEvidence.id;
                      
                      // Check if file is in store but missing from evidence
                      if (!currentEvidence.file && fileStore.has(evidenceId)) {
                        console.log('File missing from evidence but found in store, restoring...');
                        const storedFile = fileStore.get(evidenceId)!;
                        updateEvidence(index, "file", storedFile);
                        updateEvidence(index, "fileName", storedFile.name);
                        updateEvidence(index, "fileSize", storedFile.size);
                        updateEvidence(index, "fileType", storedFile.type);
                      }
                      
                      // Detailed logging of current state
                      console.log('Current evidence state before save:', {
                        hasFile: !!currentEvidence.file,
                        fileName: currentEvidence.fileName,
                        fileSize: currentEvidence.fileSize,
                        fileType: currentEvidence.fileType,
                        uploaded: currentEvidence.uploaded,
                        uploadProgress: currentEvidence.uploadProgress
                      });
                      
                      const finalFile = currentEvidence.file || fileStore.get(evidenceId);
                      
                      if (finalFile) {
                        console.log('Evidence has file, marking as uploaded');
                        console.log('File details:', {
                          name: finalFile.name,
                          size: finalFile.size,
                          type: finalFile.type
                        });
                        updateEvidence(index, "uploaded", true);
                      } else {
                        console.log('ERROR: No file found in evidence or store!');
                      }
                      
                      // Log the evidence array after potential updates
                      setTimeout(() => {
                        console.log('Evidence state after save:', evidence[index]);
                      }, 100);
                      
                      setEditingIndex(null);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Evidence
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Cancel button clicked');
                      setEditingIndex(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
