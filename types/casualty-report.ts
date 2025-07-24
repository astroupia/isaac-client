// Comprehensive type definitions for Casualty Report
// These types match exactly what the ai-report-viewer.tsx component expects

export interface ICasualtyReport {
  reportId: string;
  incidentId: string;
  generatedAt: string;
  processingSummary: IProcessingSummary;
  casualtyAssessment: ICasualtyAssessment;
  vehicleAnalysis: IVehicleAnalysis;
  environmentalAnalysis: IEnvironmentalAnalysis;
  incidentTimeline: IIncidentTimelineEvent[];
  recommendations: string[];
  aiConfidence: IAiConfidence;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IProcessingSummary {
  totalEvidence: number;
  successfullyProcessed: number;
  failedProcessing: number;
  overallConfidence: number; // 0.0 to 1.0
}

export interface ICasualtyAssessment {
  totalCasualties: number;
  casualties: ICasualty[];
  injuryBreakdown: IInjuryBreakdown;
}

export interface ICasualty {
  position: string; // "driver", "passenger", "pedestrian", etc.
  location?: string; // "front seat", "back seat", "sidewalk", etc.
  injurySeverity?: string; // "minor", "serious", "fatal"
  injuries?: string[]; // ["broken arm", "head injury", etc.]
  confidence: number; // 0.0 to 1.0
}

export interface IInjuryBreakdown {
  fatalities: number;
  seriousInjuries: number;
  minorInjuries: number;
}

export interface IVehicleAnalysis {
  totalVehicles: number;
  vehicles: IVehicle[];
  damageAssessment: IDamageAssessment;
}

export interface IVehicle {
  type: string; // "car", "truck", "motorcycle", "bus", etc.
  make?: string; // "Toyota", "Ford", etc.
  model?: string; // "Camry", "F-150", etc.
  year?: number; // 2020, 2021, etc.
  color?: string; // "red", "blue", "white", etc.
  damage?: string[]; // ["front bumper", "side panel", etc.]
  damageSeverity?: string; // "minor", "moderate", "severe"
  position?: string; // "lead vehicle", "following vehicle", etc.
  licensePlate?: string; // "ABC123"
  estimatedSpeed?: string; // "45 mph", "60 km/h", etc.
  confidence: number; // 0.0 to 1.0
}

export interface IDamageAssessment {
  vehicleDamage: IVehicleDamage[];
  propertyDamage: IPropertyDamage[];
  totalEstimatedCost?: string; // "$15,000", "unknown", etc.
}

export interface IVehicleDamage {
  vehicleId?: string; // Reference to specific vehicle
  severity: string; // "minor", "moderate", "severe"
  areas: string[]; // ["front bumper", "hood", "windshield"]
  description?: string; // Detailed description of damage
  estimatedCost?: string; // "$5,000", "unknown", etc.
}

export interface IPropertyDamage {
  type: string; // "guardrail", "traffic light", "building", etc.
  severity: string; // "minor", "moderate", "severe"
  description?: string; // Detailed description
  estimatedCost?: string; // "$2,000", "unknown", etc.
}

export interface IEnvironmentalAnalysis {
  factors: string[]; // ["rain", "fog", "construction", "poor lighting"]
  weatherConditions: string[]; // ["clear", "rain", "snow", "fog"]
  roadConditions: string[]; // ["dry", "wet", "icy", "potholed"]
  lightingConditions?: string; // "daylight", "night", "dusk", "dawn"
  roadType?: string; // "highway", "city street", "intersection"
  trafficFlow?: string; // "heavy", "light", "moderate"
}

export interface IIncidentTimelineEvent {
  time: string; // ISO date string
  description: string; // "Evidence collected: video", "Witness statement recorded"
  source: string; // "https://...", "Witness: John Doe", etc.
}

export interface IAiConfidence {
  overall: number; // 0.0 to 1.0
  vehicleDetection: number; // 0.0 to 1.0
  casualtyAssessment: number; // 0.0 to 1.0
  sceneReconstruction: number; // 0.0 to 1.0
}

// API Response wrapper
export interface ICasualtyReportResponse {
  success: boolean;
  data: {
    reportId: string;
    incidentId: string;
    casualtyReport: ICasualtyReport;
    evidenceProcessed: number;
    analysisResultsUsed: number;
    usedExistingAnalysis: boolean;
    updatedReport?: any; // The updated incident report
    generatedAt: string;
  };
  message: string;
}

// Helper types for better data validation
export interface IEnhancedCasualtyReport extends ICasualtyReport {
  // Enhanced fields with better defaults
  processingSummary: IProcessingSummary & {
    successRate: number; // Calculated percentage
  };
  casualtyAssessment: ICasualtyAssessment & {
    hasInjuries: boolean;
    hasFatalities: boolean;
  };
  vehicleAnalysis: IVehicleAnalysis & {
    hasDamage: boolean;
    damageCount: number;
  };
  environmentalAnalysis: IEnvironmentalAnalysis & {
    hasWeatherFactors: boolean;
    hasRoadFactors: boolean;
  };
}

// Type guards for validation
export const isValidCasualtyReport = (data: any): data is ICasualtyReport => {
  return (
    data &&
    typeof data.reportId === "string" &&
    typeof data.incidentId === "string" &&
    typeof data.generatedAt === "string" &&
    data.processingSummary &&
    data.casualtyAssessment &&
    data.vehicleAnalysis &&
    data.environmentalAnalysis &&
    Array.isArray(data.incidentTimeline) &&
    Array.isArray(data.recommendations) &&
    data.aiConfidence &&
    typeof data.aiConfidence.overall === "number"
  );
};

export const isValidCasualtyReportResponse = (
  data: any
): data is ICasualtyReportResponse => {
  return (
    data &&
    typeof data.success === "boolean" &&
    data.data &&
    data.data.casualtyReport &&
    isValidCasualtyReport(data.data.casualtyReport)
  );
};

// Utility functions for data transformation
export const transformCasualtyReport = (data: any): ICasualtyReport => {
  // If it's already a valid casualty report, return it
  if (isValidCasualtyReport(data)) {
    return data;
  }

  // If it's the full API response with nested structure
  if (data?.success === true && data?.data?.casualtyReport) {
    return data.data.casualtyReport;
  }

  // If it's just the casualty report part
  if (data?.reportId && data?.incidentId && data?.casualtyAssessment) {
    return data;
  }

  // If we can't transform it, provide a default structure
  console.warn(
    "Unable to transform casualty report data, using default structure"
  );
  return getDefaultCasualtyReport("unknown", "unknown");
};

// Default values for missing data
export const getDefaultCasualtyReport = (
  reportId: string,
  incidentId: string
): ICasualtyReport => ({
  reportId,
  incidentId,
  generatedAt: new Date().toISOString(),
  processingSummary: {
    totalEvidence: 0,
    successfullyProcessed: 0,
    failedProcessing: 0,
    overallConfidence: 0.0,
  },
  casualtyAssessment: {
    totalCasualties: 0,
    casualties: [],
    injuryBreakdown: {
      fatalities: 0,
      seriousInjuries: 0,
      minorInjuries: 0,
    },
  },
  vehicleAnalysis: {
    totalVehicles: 0,
    vehicles: [],
    damageAssessment: {
      vehicleDamage: [],
      propertyDamage: [],
      totalEstimatedCost: "unknown",
    },
  },
  environmentalAnalysis: {
    factors: [],
    weatherConditions: [],
    roadConditions: [],
  },
  incidentTimeline: [],
  recommendations: [],
  aiConfidence: {
    overall: 0.0,
    vehicleDetection: 0.0,
    casualtyAssessment: 0.0,
    sceneReconstruction: 0.0,
  },
  _id: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  __v: 0,
});
