"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Save, CheckCircle, Plus } from "lucide-react";
import Link from "next/link";
import {
  EvidenceTypeSelector,
  type EvidenceType,
} from "@/components/evidence-upload/evidence-type-selector";
import { IncidentSelector } from "@/components/evidence-upload/incident-selector";
import { EvidenceMetadataForm } from "@/components/evidence-upload/evidence-metadata-form";
import { FileUploadZone } from "@/components/evidence-upload/file-upload-zone";
import { EvidencePreview } from "@/components/evidence-upload/evidence-preview";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  evidenceType: EvidenceType;
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

interface EvidenceSubmission {
  evidenceType: EvidenceType;
  files: UploadedFile[];
  metadata: EvidenceMetadata;
}

export function UploadEvidence() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );
  const [evidenceSubmissions, setEvidenceSubmissions] = useState<
    EvidenceSubmission[]
  >([]);
  const [currentEvidenceType, setCurrentEvidenceType] =
    useState<EvidenceType | null>(null);
  const [currentFiles, setCurrentFiles] = useState<UploadedFile[]>([]);
  const [currentMetadata, setCurrentMetadata] = useState<EvidenceMetadata>({
    title: "",
    description: "",
    tags: [],
    location: "",
    timestamp: "",
    relatedVehicles: [],
    relatedPersons: [],
    priority: "medium",
    confidential: false,
    chainOfCustody: "",
    collectedBy: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      id: 1,
      title: "Select Incident",
      description: "Link to existing incident (optional)",
    },
    {
      id: 2,
      title: "Evidence Type",
      description: "Select the type of evidence",
    },
    { id: 3, title: "Upload Files", description: "Upload your evidence files" },
    {
      id: 4,
      title: "Add Details",
      description: "Provide metadata and details",
    },
    { id: 5, title: "Review", description: "Review and submit" },
  ];

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return true; // Incident selection is optional
      case 3:
        return currentEvidenceType !== null;
      case 4:
        return currentFiles.some((f) => f.status === "completed");
      case 5:
        return currentMetadata.title.trim() !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEvidenceTypeSelect = (type: EvidenceType) => {
    setCurrentEvidenceType(type);
    // Auto-advance to next step
    setTimeout(() => {
      if (canProceedToStep(3)) {
        setCurrentStep(3);
      }
    }, 500);
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setCurrentFiles(files);
  };

  const handleMetadataChange = (newMetadata: EvidenceMetadata) => {
    setCurrentMetadata(newMetadata);
  };

  const addCurrentEvidenceToSubmissions = () => {
    if (
      !currentEvidenceType ||
      currentFiles.length === 0 ||
      !currentMetadata.title.trim()
    ) {
      toast({
        title: "Incomplete Evidence",
        description:
          "Please complete all required fields before adding more evidence.",
        variant: "destructive",
      });
      return;
    }

    const newSubmission: EvidenceSubmission = {
      evidenceType: currentEvidenceType,
      files: [...currentFiles],
      metadata: { ...currentMetadata },
    };

    setEvidenceSubmissions((prev) => [...prev, newSubmission]);

    // Reset current evidence form
    setCurrentEvidenceType(null);
    setCurrentFiles([]);
    setCurrentMetadata({
      title: "",
      description: "",
      tags: [],
      location: "",
      timestamp: "",
      relatedVehicles: [],
      relatedPersons: [],
      priority: "medium",
      confidential: false,
      chainOfCustody: "",
      collectedBy: "",
    });

    // Go back to evidence type selection
    setCurrentStep(2);

    toast({
      title: "Evidence Added",
      description:
        "Evidence has been added to your submission. You can add more evidence or proceed to review.",
    });
  };

  const removeEvidenceSubmission = (index: number) => {
    setEvidenceSubmissions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    toast({
      title: "Draft Saved",
      description: "Your evidence upload has been saved as a draft.",
    });
  };

  const handleSubmit = async () => {
    const allSubmissions = [...evidenceSubmissions];

    // Add current evidence if it's complete
    if (
      currentEvidenceType &&
      currentFiles.length > 0 &&
      currentMetadata.title.trim()
    ) {
      allSubmissions.push({
        evidenceType: currentEvidenceType,
        files: currentFiles,
        metadata: currentMetadata,
      });
    }

    if (allSubmissions.length === 0) {
      toast({
        title: "No Evidence to Submit",
        description:
          "Please add at least one piece of evidence before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const totalFiles = allSubmissions.reduce(
        (sum, sub) => sum + sub.files.length,
        0
      );

      toast({
        title: "Evidence Uploaded Successfully",
        description: `${totalFiles} file(s) across ${allSubmissions.length} evidence type(s) have been uploaded and processed.`,
      });

      // Reset form
      setCurrentStep(1);
      setSelectedIncidentId(null);
      setEvidenceSubmissions([]);
      setCurrentEvidenceType(null);
      setCurrentFiles([]);
      setCurrentMetadata({
        title: "",
        description: "",
        tags: [],
        location: "",
        timestamp: "",
        relatedVehicles: [],
        relatedPersons: [],
        priority: "medium",
        confidential: false,
        chainOfCustody: "",
        collectedBy: "",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your evidence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <IncidentSelector
            selectedIncidentId={selectedIncidentId}
            onIncidentSelect={setSelectedIncidentId}
          />
        );
      case 2:
        return (
          <EvidenceTypeSelector
            selectedType={currentEvidenceType}
            onTypeSelect={handleEvidenceTypeSelect}
          />
        );
      case 3:
        return currentEvidenceType ? (
          <FileUploadZone
            evidenceType={currentEvidenceType}
            onFilesUploaded={handleFilesUploaded}
          />
        ) : null;
      case 4:
        return currentEvidenceType ? (
          <EvidenceMetadataForm
            evidenceType={currentEvidenceType}
            metadata={currentMetadata}
            onMetadataChange={handleMetadataChange}
            incidentId={selectedIncidentId}
          />
        ) : null;
      case 5:
        return (
          <div className="space-y-6">
            {/* Current Evidence Preview */}
            {currentEvidenceType &&
              currentFiles.length > 0 &&
              currentMetadata.title.trim() && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Evidence</h3>
                  <EvidencePreview
                    evidenceType={currentEvidenceType}
                    metadata={currentMetadata}
                    files={currentFiles}
                    incidentId={selectedIncidentId}
                  />
                </div>
              )}

            {/* Previous Evidence Submissions */}
            {evidenceSubmissions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Added Evidence ({evidenceSubmissions.length})
                </h3>
                <div className="space-y-4">
                  {evidenceSubmissions.map((submission, index) => (
                    <Card key={index} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {submission.metadata.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEvidenceSubmission(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <EvidencePreview
                          evidenceType={submission.evidenceType}
                          metadata={submission.metadata}
                          files={submission.files}
                          incidentId={selectedIncidentId}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getTotalFiles = () => {
    const submissionFiles = evidenceSubmissions.reduce(
      (sum, sub) => sum + sub.files.length,
      0
    );
    const currentCompletedFiles = currentFiles.filter(
      (f) => f.status === "completed"
    ).length;
    return submissionFiles + currentCompletedFiles;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/traffic">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Evidence</h1>
        <p className="text-muted-foreground">
          Upload and organize evidence files for incident investigation with
          proper documentation and chain of custody.
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-px bg-muted flex-1 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress
            value={(currentStep / steps.length) * 100}
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Evidence Summary */}
      {(evidenceSubmissions.length > 0 || getTotalFiles() > 0) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Evidence Summary</p>
                <p className="text-xs text-muted-foreground">
                  {evidenceSubmissions.length +
                    (currentEvidenceType &&
                    currentFiles.length > 0 &&
                    currentMetadata.title.trim()
                      ? 1
                      : 0)}{" "}
                  evidence type{evidenceSubmissions.length !== 0 ? "s" : ""} •{" "}
                  {getTotalFiles()} file
                  {getTotalFiles() !== 1 ? "s" : ""}
                  {selectedIncidentId &&
                    ` • Linked to incident ${selectedIncidentId}`}
                </p>
              </div>
              {currentStep === 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCurrentEvidenceToSubmissions}
                  disabled={
                    !currentEvidenceType ||
                    currentFiles.length === 0 ||
                    !currentMetadata.title.trim()
                  }
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add More Evidence
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">{renderStepContent()}</div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < 5 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedToStep(currentStep + 1)}
                >
                  Next
                </Button>
              )}
              {currentStep === 4 && canProceedToStep(5) && (
                <Button type="button" onClick={addCurrentEvidenceToSubmissions}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Evidence
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={
                  evidenceSubmissions.length === 0 && !currentEvidenceType
                }
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              {currentStep === 5 && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (evidenceSubmissions.length === 0 &&
                      (!currentEvidenceType ||
                        currentFiles.length === 0 ||
                        !currentMetadata.title.trim()))
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit All Evidence
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
