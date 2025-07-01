"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ImageIcon,
  Video,
  FileText,
  Mic,
  MessageSquare,
  Package,
  HelpCircle,
  MapPin,
  Calendar,
  User,
  Car,
  Tag,
  Shield,
  AlertTriangle,
  Eye,
  Download,
} from "lucide-react";
import type { EvidenceType } from "./evidence-type-selector";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  evidenceType: EvidenceType;
  preview?: string;
}

interface EvidenceMetadata {
  title: string;
  description: string;
  tags: string[];
  location: string;
  timestamp: string;
  relatedVehicles: string[];
  relatedPersons: string[];
  priority: "low" | "medium" | "high" | "critical";
  confidential: boolean;
  chainOfCustody: string;
  collectedBy: string;
}

interface EvidencePreviewProps {
  evidenceType: EvidenceType;
  metadata: EvidenceMetadata;
  files: UploadedFile[];
  incidentId?: string | null;
}

export function EvidencePreview({
  evidenceType,
  metadata,
  files,
  incidentId,
}: EvidencePreviewProps) {
  const getEvidenceTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case "photo":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "audio":
        return <Mic className="h-4 w-4" />;
      case "witness_statement":
        return <MessageSquare className="h-4 w-4" />;
      case "physical_evidence":
        return <Package className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getEvidenceTypeTitle = (type: EvidenceType) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const completedFiles = files.filter((f) => f.status === "completed");
  const totalSize = completedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Review Evidence Submission</span>
            <Badge variant="outline" className="flex items-center space-x-1">
              {getEvidenceTypeIcon(evidenceType)}
              <span>{getEvidenceTypeTitle(evidenceType)}</span>
            </Badge>
          </CardTitle>
          <CardDescription>
            Review all details before submitting your evidence. Make sure all
            information is accurate and complete.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Basic Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Evidence Title</p>
                <p className="text-sm font-medium">
                  {metadata.title || "Not specified"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Linked Incident</p>
                <p className="text-sm font-medium">
                  {incidentId || "Standalone evidence"}
                </p>
              </div>
            </div>

            {metadata.description && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{metadata.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Files Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                Files ({completedFiles.length})
              </h4>
              <p className="text-xs text-muted-foreground">
                Total size: {formatFileSize(totalSize)}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {completedFiles.map((file) => (
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
                      getEvidenceTypeIcon(evidenceType)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Evidence Details</h4>

            <div className="grid gap-4 md:grid-cols-2">
              {metadata.location && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>Collection Location</span>
                  </p>
                  <p className="text-sm">{metadata.location}</p>
                </div>
              )}

              {metadata.timestamp && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Collection Time</span>
                  </p>
                  <p className="text-sm">{formatDate(metadata.timestamp)}</p>
                </div>
              )}

              {metadata.collectedBy && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>Collected By</span>
                  </p>
                  <p className="text-sm">{metadata.collectedBy}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Priority Level</span>
                </p>
                <Badge className={getPriorityColor(metadata.priority)}>
                  {metadata.priority.toUpperCase()}
                </Badge>
              </div>
            </div>

            {metadata.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>Tags</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(metadata.relatedVehicles.length > 0 ||
              metadata.relatedPersons.length > 0) && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Related Items</p>

                {metadata.relatedVehicles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium flex items-center space-x-1">
                      <Car className="h-3 w-3" />
                      <span>Related Vehicles</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {metadata.relatedVehicles.map((vehicle) => (
                        <Badge
                          key={vehicle}
                          variant="outline"
                          className="text-xs"
                        >
                          {vehicle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {metadata.relatedPersons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>Related Persons</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {metadata.relatedPersons.map((person) => (
                        <Badge
                          key={person}
                          variant="outline"
                          className="text-xs"
                        >
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {metadata.chainOfCustody && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Chain of Custody Notes
                </p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">
                  {metadata.chainOfCustody}
                </p>
              </div>
            )}

            {metadata.confidential && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <Shield className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-500 font-medium">
                  This evidence is marked as confidential
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Ready to Submit</p>
              <p className="text-xs text-muted-foreground">
                {completedFiles.length} file
                {completedFiles.length !== 1 ? "s" : ""} •{" "}
                {getEvidenceTypeTitle(evidenceType)} • {metadata.priority}{" "}
                priority
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Complete
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
