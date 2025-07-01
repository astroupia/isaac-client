"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  Video,
  FileText,
  Mic,
  MessageSquare,
  Package,
  HelpCircle,
} from "lucide-react";

export enum EvidenceType {
  PHOTO = "photo",
  VIDEO = "video",
  DOCUMENT = "document",
  AUDIO = "audio",
  WITNESS_STATEMENT = "witness_statement",
  PHYSICAL_EVIDENCE = "physical_evidence",
  OTHER = "other",
}

interface EvidenceTypeOption {
  type: EvidenceType;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  color: string;
  acceptedFormats: string[];
}

const evidenceTypeOptions: EvidenceTypeOption[] = [
  {
    type: EvidenceType.PHOTO,
    title: "Photo Evidence",
    description: "Scene photos, damage documentation, identification images",
    icon: <ImageIcon className="h-6 w-6" />,
    examples: [
      "Scene photos",
      "Vehicle damage",
      "License plates",
      "Road conditions",
    ],
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    acceptedFormats: ["JPG", "PNG", "HEIC", "RAW"],
  },
  {
    type: EvidenceType.VIDEO,
    title: "Video Evidence",
    description: "Dashcam footage, surveillance videos, incident recordings",
    icon: <Video className="h-6 w-6" />,
    examples: [
      "Dashcam footage",
      "Surveillance video",
      "Body cam",
      "Mobile recordings",
    ],
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    acceptedFormats: ["MP4", "MOV", "AVI", "MKV"],
  },
  {
    type: EvidenceType.DOCUMENT,
    title: "Document Evidence",
    description: "Reports, citations, insurance papers, permits",
    icon: <FileText className="h-6 w-6" />,
    examples: ["Police reports", "Insurance docs", "Citations", "Permits"],
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    acceptedFormats: ["PDF", "DOC", "DOCX", "TXT"],
  },
  {
    type: EvidenceType.AUDIO,
    title: "Audio Evidence",
    description: "Voice recordings, emergency calls, interviews",
    icon: <Mic className="h-6 w-6" />,
    examples: [
      "911 calls",
      "Voice recordings",
      "Interviews",
      "Radio communications",
    ],
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    acceptedFormats: ["MP3", "WAV", "M4A", "AAC"],
  },
  {
    type: EvidenceType.WITNESS_STATEMENT,
    title: "Witness Statement",
    description: "Written or recorded witness testimonies",
    icon: <MessageSquare className="h-6 w-6" />,
    examples: [
      "Written statements",
      "Recorded testimonies",
      "Witness interviews",
      "Affidavits",
    ],
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    acceptedFormats: ["PDF", "DOC", "MP3", "MP4"],
  },
  {
    type: EvidenceType.PHYSICAL_EVIDENCE,
    title: "Physical Evidence",
    description: "Documentation of physical items and materials",
    icon: <Package className="h-6 w-6" />,
    examples: [
      "Evidence photos",
      "Item documentation",
      "Material samples",
      "Physical items",
    ],
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    acceptedFormats: ["JPG", "PNG", "PDF", "DOC"],
  },
  {
    type: EvidenceType.OTHER,
    title: "Other Evidence",
    description: "Any other relevant evidence or documentation",
    icon: <HelpCircle className="h-6 w-6" />,
    examples: [
      "Miscellaneous files",
      "Special documentation",
      "Custom evidence",
      "Other materials",
    ],
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    acceptedFormats: ["All formats"],
  },
];

interface EvidenceTypeSelectorProps {
  selectedType: EvidenceType | null;
  onTypeSelect: (type: EvidenceType) => void;
}

export function EvidenceTypeSelector({
  selectedType,
  onTypeSelect,
}: EvidenceTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Evidence Type</CardTitle>
          <CardDescription>
            Choose the type of evidence you want to upload. This will determine
            the accepted file formats and metadata requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evidenceTypeOptions.map((option) => (
              <Card
                key={option.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedType === option.type
                    ? "ring-2 ring-primary shadow-md"
                    : "hover:ring-1 hover:ring-muted-foreground/25"
                }`}
                onClick={() => onTypeSelect(option.type)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        {option.icon}
                      </div>
                      {selectedType === option.type && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Selected
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-sm">{option.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {option.acceptedFormats.slice(0, 3).map((format) => (
                          <Badge
                            key={format}
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {format}
                          </Badge>
                        ))}
                        {option.acceptedFormats.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            +{option.acceptedFormats.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">Examples:</p>
                        <p>{option.examples.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedType && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  evidenceTypeOptions.find((o) => o.type === selectedType)
                    ?.color
                }`}
              >
                {evidenceTypeOptions.find((o) => o.type === selectedType)?.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">
                  {
                    evidenceTypeOptions.find((o) => o.type === selectedType)
                      ?.title
                  }{" "}
                  Selected
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You can now proceed to upload files of this type. Accepted
                  formats:{" "}
                  {evidenceTypeOptions
                    .find((o) => o.type === selectedType)
                    ?.acceptedFormats.join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
