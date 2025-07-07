"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Save,
  Send,
} from "lucide-react";
import Link from "next/link";
import { IncidentBasicInfo } from "@/components/incident-creation/incident-basic-info";
import { VehicleForm } from "@/components/incident-creation/vehicle-form";
import { PersonForm } from "@/components/incident-creation/person-form";
import { EvidenceForm } from "@/components/incident-creation/evidence-form";
import { useIncidentForm } from "@/hooks/useIncidentForm";
import { IncidentType, IncidentSeverity } from "@/types/incident";
import { EvidenceType } from "@/types/evidence";
import { VehicleType } from "@/types/vehicle";
import { incidentService } from "@/lib/api/incidents";
import { vehicleService } from "@/lib/api/vehicles";
import evidenceService from "@/lib/api/evidence";
import { apiService } from "@/lib/api/base";
import mediaService from "@/lib/api/media";
import { reportService } from "@/lib/api/reports";
import { ReportType, ReportStatus } from "@/app/types/report";

interface IncidentData {
  incidentLocation: string;
  incidentType: string;
  incidentSeverity: string;
  dateTime: Date;
  numberOfCasualties: number;
  incidentDescription: string;
  weatherConditions: string[];
  roadConditions: string[];
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  vehicleType: string;
  occupantsCount: number;
  damageDescription?: string;
  damageSeverity?: string;
  damageAreas: string[];
  airbagDeployed?: boolean;
}

interface Person {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  role: "driver" | "passenger" | "pedestrian" | "witness" | "other";
  contactInfo?: {
    phoneNumber?: string;
    email?: string;
    address?: string;
  };
  statement?: string;
}

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
  fileUrl?: string; // Added for existing evidence
}

const tabs = [
  { id: "basic", label: "Basic Info", icon: AlertTriangle },
  { id: "vehicles", label: "Vehicles", icon: "🚗" },
  { id: "people", label: "People", icon: "👥" },
  { id: "evidence", label: "Evidence", icon: "📁" },
  { id: "review", label: "Review", icon: CheckCircle },
];

export function NewIncidentForm() {
  const { toast } = useToast();
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const router = useRouter();
  const {
    createIncident,
    uploadMedia,
    addEvidence,
    isSubmitting: isHookSubmitting,
  } = useIncidentForm();

  // Form data state
  const [incidentData, setIncidentData] = useState<IncidentData>({
    incidentLocation: "",
    incidentType: "",
    incidentSeverity: "",
    dateTime: new Date(),
    numberOfCasualties: 0,
    incidentDescription: "",
    weatherConditions: [],
    roadConditions: [],
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) setUserId(data._id);
        else if (data && data.id) setUserId(data.id);
      });
  }, []);

  const updateIncidentData = (field: string, value: any) => {
    setIncidentData((prev) => ({ ...prev, [field]: value }));
  };

  const getTabIndex = (tabId: string) =>
    tabs.findIndex((tab) => tab.id === tabId);
  const getCurrentTabIndex = () => getTabIndex(currentTab);
  const getProgress = () => ((getCurrentTabIndex() + 1) / tabs.length) * 100;

  const canProceedToNext = () => {
    switch (currentTab) {
      case "basic":
        return (
          incidentData.incidentLocation &&
          incidentData.incidentType &&
          incidentData.incidentSeverity &&
          incidentData.incidentDescription
        );
      case "vehicles":
        return true; // Vehicles are optional
      case "people":
        return true; // People are optional
      case "evidence":
        return true; // Evidence is optional
      default:
        return true;
    }
  };

  const nextTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  const prevTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const saveDraft = () => {
    setIsDraft(true);
    toast({
      title: "Draft saved",
      description: "Your incident report has been saved as a draft.",
    });
  };

  const getValidationSummary = () => {
    const issues = [];
    if (!incidentData.incidentLocation)
      issues.push("Incident location is required");
    if (!incidentData.incidentType) issues.push("Incident type is required");
    if (!incidentData.incidentSeverity)
      issues.push("Incident severity is required");
    if (!incidentData.incidentDescription)
      issues.push("Incident description is required");
  
    return issues;
  };

  const getPriorityFromSeverity = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'severe':
        return 'High Priority';
      case 'moderate':
        return 'Medium Priority';
      case 'minor':
      case 'low':
        return 'Low Priority';
      default:
        return 'Medium Priority';
    }
  };

  const submitReport = async () => {
    console.log('Starting submitReport');
    // (validation and userId checks can be added here if needed)

    if (!userId) {
      toast({
        title: "User Error",
        description: "Could not determine current user. Please re-login.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Upload all evidence files first and collect upload results
      const evidenceUploadResults = await Promise.all(
        evidence.map(async (ev) => {
          console.log('Processing evidence item:', ev);
          console.log('Evidence has file:', !!ev.file);
          if (ev.file) {
            console.log('Uploading file:', ev.file.name);
            const uploadRes = await mediaService.uploadFile(ev.file);
            return { ...ev, ...uploadRes };
          }
          console.log('No file to upload for evidence:', ev.title);
          return ev;
        })
      );

      // Debugging step: log evidenceUploadResults
      console.log('evidenceUploadResults:', evidenceUploadResults);

      // 2. Create evidence records and collect their IDs
      const evidenceIds: string[] = [];
      for (const ev of evidenceUploadResults) {
        const uploadData = ev as typeof ev & {
          url?: string;
          publicId?: string;
          resourceType?: string;
          format?: string;
          size?: number;
          width?: number;
          height?: number;
        };
        const evidencePayload = {
          title: uploadData.title || uploadData.fileName || "Evidence",
          description: uploadData.description || "",
          type: uploadData.type as EvidenceType,
          fileUrl: uploadData.url || uploadData.fileUrl,
          fileName: uploadData.fileName,
          fileSize: uploadData.size ?? uploadData.fileSize,
          fileType: uploadData.format ?? uploadData.fileType,
          tags: uploadData.tags || [],
          uploadedBy: userId,
          publicId: uploadData.publicId,
          resourceType: uploadData.resourceType,
          format: uploadData.format,
          size: uploadData.size,
          width: uploadData.width,
          height: uploadData.height,
        };
        console.log('Creating evidence...', evidencePayload);
        const createdEvidence = await evidenceService.createEvidence(evidencePayload);
        evidenceIds.push((createdEvidence as any).id || (createdEvidence as any)._id);
      }

      // 3. Create vehicle records
      console.log('Creating vehicles...');
      const vehicleIds: string[] = [];
      for (const v of vehicles) {
        const vehiclePayload = {
          ...v,
          vehicleType: v.vehicleType as VehicleType,
          damageSeverity: v.damageSeverity as import("@/types/vehicle").DamageSeverity,
        };
        const createdVehicle = await vehicleService.createVehicle(vehiclePayload);
        vehicleIds.push((createdVehicle as any).id || (createdVehicle as any)._id);
      }

      // 4. Create person records
      console.log('Creating persons...');
      const personIds: string[] = [];
      for (const p of persons) {
        const personPayload = { ...p };
        const createdPerson = await apiService.post("/persons", personPayload);
        personIds.push((createdPerson as any).id || (createdPerson as any)._id);
      }

      // 5. Create the incident with all IDs
      console.log('Creating incident...');
      const incidentPayload = {
        ...incidentData,
        incidentType: incidentData.incidentType as IncidentType,
        incidentSeverity: incidentData.incidentSeverity as IncidentSeverity,
        evidenceIds,
        vehicleIds,
        personIds,
      };
      const createdIncident = await incidentService.createIncident(incidentPayload);
      console.log('Incident created, navigating...');

      // 6. Create a report for the incident
      console.log('Creating report for incident...');
      const incidentId = (createdIncident as any).id || (createdIncident as any)._id;
      
      const reportPayload = {
        incidentId,
        title: `Incident Report - ${incidentData.incidentType} at ${incidentData.incidentLocation}`,
        type: 'Incident' as any,
        status: 'Submitted' as any,
        priority: getPriorityFromSeverity(incidentData.incidentSeverity),
        createdBy: userId,
        content: {
          incidentDetails: incidentData,
          vehicles: vehicles.length,
          persons: persons.length,
          evidence: evidence.length,
          casualties: incidentData.numberOfCasualties,
          weatherConditions: incidentData.weatherConditions,
          roadConditions: incidentData.roadConditions,
        },
        tags: [
          incidentData.incidentType,
          incidentData.incidentSeverity,
          'traffic-incident',
          'auto-generated'
        ],
      };
      
      await reportService.createReport(reportPayload);
      console.log('Report created successfully');

      toast({
        title: "Success!",
        description: "Your incident report has been submitted successfully.",
      });
      router.push("/dashboard/traffic");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/traffic">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Incident Report
            </h1>
            <p className="text-muted-foreground">
              Complete all sections to create a comprehensive incident report
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={saveDraft}
            className="flex items-center gap-2 bg-transparent"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              Step {getCurrentTabIndex() + 1} of {tabs.length}
            </span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Form */}
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab, index) => {
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
                disabled={index > getCurrentTabIndex() + 1}
              >
                {typeof tab.icon === "string" ? (
                  <span className="text-lg">{tab.icon}</span>
                ) : (
                  <tab.icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <IncidentBasicInfo
            data={incidentData}
            onChange={updateIncidentData}
          />
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <VehicleForm vehicles={vehicles} onChange={setVehicles} />
        </TabsContent>

        <TabsContent value="people" className="space-y-6">
          <PersonForm persons={persons} onChange={setPersons} />
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <EvidenceForm evidence={evidence} onChange={setEvidence} />
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Review & Submit
              </CardTitle>
              <CardDescription>
                Review all information before submitting your incident report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Validation Summary */}
              {getValidationSummary().length > 0 && (
                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                  <h4 className="font-medium text-destructive mb-2">
                    Please address the following issues:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                    {getValidationSummary().map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{vehicles.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Vehicles Involved
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{persons.length}</div>
                    <p className="text-xs text-muted-foreground">
                      People Involved
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{evidence.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Evidence Items
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {incidentData.numberOfCasualties}
                    </div>
                    <p className="text-xs text-muted-foreground">Casualties</p>
                  </CardContent>
                </Card>
              </div>

              {/* Incident Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Incident Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Location:</span>{" "}
                      {incidentData.incidentLocation || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {incidentData.incidentType || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Severity:</span>{" "}
                      {incidentData.incidentSeverity || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Date/Time:</span>{" "}
                      {incidentData.dateTime.toLocaleString()}
                    </div>
                  </div>
                  {incidentData.incidentDescription && (
                    <div className="pt-2 border-t">
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-muted-foreground">
                        {incidentData.incidentDescription}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
            {getCurrentTabIndex() > 0 && (
              <Button
                variant="outline"
                onClick={prevTab}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentTab !== "review" ? (
              <Button
                onClick={nextTab}
                disabled={!canProceedToNext()}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submitReport}
                disabled={getValidationSummary().length > 0 || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Draft Status */}
      {isDraft && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Save className="h-4 w-4" />
            Draft saved automatically
          </p>
        </div>
      )}
    </div>
  );
}
