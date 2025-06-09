/**
 * ISAAC Platform Data Models
 *
 * This file contains all the TypeScript interfaces and types for the ISAAC platform.
 * These models represent the data structures used throughout the application and
 * what needs to be fetched from the API.
 */

// ==============================
// User & Authentication Models
// ==============================

/**
 * Represents the roles available in the system
 */
export type UserRole = "traffic" | "investigator" | "chief" | "admin"

/**
 * Base user interface with common properties
 */
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  badgeId?: string
  department?: string
  profileImageUrl?: string
  phoneNumber?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Traffic Personnel specific properties
 */
export interface TrafficPersonnel extends User {
  role: "traffic"
  district?: string
  vehicleId?: string
  shift?: "morning" | "afternoon" | "night"
  reportsSubmitted: number
}

/**
 * Investigator specific properties
 */
export interface Investigator extends User {
  role: "investigator"
  specialization?: string[]
  currentCaseload: number
  maxCaseload: number
  completedCases: number
  averageResolutionTime?: number // in days
}

/**
 * Chief Analyst specific properties
 */
export interface ChiefAnalyst extends User {
  role: "chief"
  department: string
  subordinates?: string[] // IDs of investigators under supervision
  totalCasesManaged: number
  analyticsAccess: boolean
}

/**
 * Admin specific properties
 */
export interface Admin extends User {
  role: "admin"
  accessLevel: number
  systemPermissions: string[]
}

// ==============================
// Incident & Case Models
// ==============================

/**
 * Status of an incident report
 */
export type IncidentStatus = "draft" | "submitted" | "pending" | "in-progress" | "review" | "completed" | "archived"

/**
 * Priority levels for incidents
 */
export type PriorityLevel = "low" | "medium" | "high" | "critical"

/**
 * Types of incidents
 */
export type IncidentType =
  | "vehicle-collision"
  | "pedestrian-incident"
  | "traffic-violation"
  | "infrastructure-damage"
  | "traffic-signal-malfunction"
  | "other"

/**
 * Severity levels for incidents
 */
export type IncidentSeverity = "minor" | "moderate" | "severe" | "fatal"

/**
 * Weather conditions during the incident
 */
export type WeatherCondition = "clear" | "cloudy" | "rain" | "snow" | "fog" | "other"

/**
 * Road conditions during the incident
 */
export type RoadCondition = "dry" | "wet" | "icy" | "snow-covered" | "under-construction" | "potholed" | "other"

/**
 * Base incident model
 */
export interface Incident {
  id: string
  title: string
  description: string
  incidentType: IncidentType
  incidentDate: Date
  reportedDate: Date
  location: Location
  status: IncidentStatus
  priority: PriorityLevel
  severity: IncidentSeverity
  reportedBy: string // User ID
  assignedTo?: string // Investigator ID
  vehicles: Vehicle[]
  casualties: Casualty[]
  witnesses?: Witness[]
  evidence: Evidence[]
  environmentalFactors: EnvironmentalFactors
  aiAnalysis?: AIAnalysis
  timeline: TimelineEvent[]
  tags?: string[]
  relatedIncidents?: string[] // IDs of related incidents
  createdAt: Date
  updatedAt: Date
}

/**
 * Location information
 */
export interface Location {
  address?: string
  latitude: number
  longitude: number
  roadName?: string
  mileMarker?: number
  intersection?: string
  city?: string
  state?: string
  zipCode?: string
  locationType?: "highway" | "urban" | "rural" | "intersection" | "parking" | "other"
  isHotspot?: boolean
  previousIncidentsCount?: number
}

/**
 * Environmental factors during the incident
 */
export interface EnvironmentalFactors {
  weather: WeatherCondition
  temperature?: number // in Fahrenheit
  visibility?: "good" | "moderate" | "poor"
  roadCondition: RoadCondition
  lightCondition: "daylight" | "dawn" | "dusk" | "night-lit" | "night-unlit"
  trafficDensity?: "light" | "moderate" | "heavy"
  roadType?: "straight" | "curved" | "intersection" | "roundabout" | "bridge" | "tunnel"
  speedLimit?: number // in mph
  constructionZone?: boolean
  specialConditions?: string[]
}

/**
 * Timeline event in an incident
 */
export interface TimelineEvent {
  id: string
  timestamp: Date
  description: string
  addedBy: string // User ID
  evidenceIds?: string[] // IDs of related evidence
  isAIGenerated?: boolean
  confidence?: number // AI confidence score if AI-generated
}

// ==============================
// Vehicle Models
// ==============================

/**
 * Vehicle involved in an incident
 */
export interface Vehicle {
  id: string
  make: string
  model: string
  year?: number
  color?: string
  licensePlate?: string
  vin?: string
  vehicleType: "sedan" | "suv" | "truck" | "motorcycle" | "bicycle" | "bus" | "other"
  occupantsCount: number
  driver?: Person
  passengers?: Person[]
  damageDescription?: string
  damageSeverity?: "minor" | "moderate" | "severe" | "totaled"
  damageAreas?: ("front" | "rear" | "driver-side" | "passenger-side" | "roof" | "undercarriage")[]
  airbagDeployed?: boolean
  safetySystemsActive?: string[]
  trajectory?: VehicleTrajectory
  isAIDetected?: boolean
  aiConfidence?: number // 0-100
}

/**
 * Vehicle trajectory information
 */
export interface VehicleTrajectory {
  preIncidentDirection?: string
  preIncidentSpeed?: number // in mph
  impactSpeed?: number // in mph
  postIncidentDirection?: string
  stoppingDistance?: number // in feet
  skidMarksPresent?: boolean
  skidMarksLength?: number // in feet
  pointOfImpact?: string
  isAIGenerated?: boolean
  confidence?: number // AI confidence score if AI-generated
}

// ==============================
// Person Models
// ==============================

/**
 * Base person model
 */
export interface Person {
  id: string
  firstName?: string
  lastName?: string
  age?: number
  gender?: string
  contactInfo?: ContactInfo
  role: "driver" | "passenger" | "pedestrian" | "witness" | "other"
}

/**
 * Contact information
 */
export interface ContactInfo {
  phoneNumber?: string
  email?: string
  address?: string
}

/**
 * Witness to an incident
 */
export interface Witness extends Person {
  role: "witness"
  statement?: string
  credibilityAssessment?: "high" | "medium" | "low"
  interviewDate?: Date
  interviewedBy?: string // User ID
}

/**
 * Casualty in an incident
 */
export interface Casualty extends Person {
  role: "driver" | "passenger" | "pedestrian"
  injurySeverity: "none" | "minor" | "moderate" | "severe" | "fatal"
  injuryDescription?: string
  medicalAttention: "none" | "on-scene" | "hospitalized" | "fatal"
  hospitalName?: string
  treatmentDetails?: string
  seatbeltUsed?: boolean
  airbagDeployed?: boolean
  vehicleId?: string // ID of associated vehicle
  position?: string // Position in vehicle if applicable
}

// ==============================
// Evidence Models
// ==============================

/**
 * Types of evidence
 */
export type EvidenceType = "photo" | "video" | "audio" | "document" | "physical" | "statement" | "sensor-data" | "other"

/**
 * Evidence model
 */
export interface Evidence {
  id: string
  title: string
  description?: string
  type: EvidenceType
  fileUrl?: string
  fileName?: string
  fileSize?: number // in bytes
  fileType?: string // MIME type
  uploadedBy: string // User ID
  uploadedAt: Date
  tags?: string[]
  metadata?: Record<string, any>
  aiProcessed: boolean
  aiAnnotations?: AIAnnotation[]
  relatedTo?: {
    vehicleIds?: string[]
    casualtyIds?: string[]
    witnessIds?: string[]
  }
  chain_of_custody?: CustodyEvent[]
}

/**
 * Chain of custody event
 */
export interface CustodyEvent {
  id: string
  timestamp: Date
  action: "collected" | "transferred" | "analyzed" | "stored" | "other"
  performedBy: string // User ID
  notes?: string
}

/**
 * AI annotation on evidence
 */
export interface AIAnnotation {
  id: string
  type: "object-detection" | "scene-analysis" | "text-extraction" | "audio-transcription" | "other"
  timestamp: Date
  data: Record<string, any> // Flexible structure for different annotation types
  confidence: number // 0-100
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  labels?: string[]
  description?: string
}

// ==============================
// AI Analysis Models
// ==============================

/**
 * AI confidence levels
 */
export type AIConfidenceLevel = "low" | "medium" | "high"

/**
 * AI analysis model
 */
export interface AIAnalysis {
  id: string
  incidentId: string
  generatedAt: Date
  processingTime: number // in milliseconds
  modelVersion: string
  overallConfidence: number // 0-100
  confidenceLevel: AIConfidenceLevel
  summary: string
  keyFindings: string[]
  vehicleAnalysis: VehicleAIAnalysis[]
  casualtyAnalysis: CasualtyAIAnalysis[]
  environmentalAnalysis: EnvironmentalAIAnalysis
  reconstructedTimeline: TimelineEvent[]
  contributingFactors: ContributingFactor[]
  recommendations?: string[]
  similarIncidents?: SimilarIncident[]
  evidenceProcessed: {
    evidenceId: string
    confidenceScore: number
    findings: string[]
  }[]
  feedback?: AIFeedback
}

/**
 * Vehicle AI analysis
 */
export interface VehicleAIAnalysis {
  vehicleId: string
  detectionConfidence: number // 0-100
  damageAssessment: {
    areas: string[]
    severity: "minor" | "moderate" | "severe" | "totaled"
    confidence: number // 0-100
  }
  trajectoryAnalysis?: {
    preIncidentSpeed?: number
    impactSpeed?: number
    postIncidentDirection?: string
    confidence: number // 0-100
  }
  faultAssessment?: {
    faultPercentage: number // 0-100
    confidence: number // 0-100
    reasoning: string
  }
}

/**
 * Casualty AI analysis
 */
export interface CasualtyAIAnalysis {
  casualtyId: string
  injurySeverityAssessment: {
    severity: "none" | "minor" | "moderate" | "severe" | "fatal"
    confidence: number // 0-100
  }
  positionAnalysis?: {
    likelyPosition: string
    confidence: number // 0-100
  }
  safetyEquipmentAssessment?: {
    seatbeltUsed?: boolean
    airbagDeployed?: boolean
    effectiveness?: string
    confidence: number // 0-100
  }
}

/**
 * Environmental AI analysis
 */
export interface EnvironmentalAIAnalysis {
  weatherImpact: {
    impact: "none" | "minor" | "significant" | "major"
    confidence: number // 0-100
    details: string
  }
  roadConditionImpact: {
    impact: "none" | "minor" | "significant" | "major"
    confidence: number // 0-100
    details: string
  }
  visibilityImpact: {
    impact: "none" | "minor" | "significant" | "major"
    confidence: number // 0-100
    details: string
  }
  infrastructureImpact?: {
    impact: "none" | "minor" | "significant" | "major"
    confidence: number // 0-100
    details: string
  }
}

/**
 * Contributing factor to an incident
 */
export interface ContributingFactor {
  factor: string
  impact: "primary" | "secondary" | "minor"
  confidence: number // 0-100
  relatedTo?: {
    vehicleIds?: string[]
    environmentalFactors?: string[]
    infrastructureIssues?: string[]
  }
  evidence?: string[] // Evidence IDs supporting this factor
}

/**
 * Similar incident identified by AI
 */
export interface SimilarIncident {
  incidentId: string
  similarityScore: number // 0-100
  keySimilarities: string[]
  date: Date
  outcome?: string
}

/**
 * AI feedback model
 */
export interface AIFeedback {
  providedBy?: string // User ID
  providedAt?: Date
  rating?: "helpful" | "not-helpful"
  comments?: string
  accuracyAssessment?: number // 0-100
  usefulnessAssessment?: number // 0-100
  improvementSuggestions?: string[]
}

// ==============================
// Report Models
// ==============================

/**
 * Report model
 */
export interface Report {
  id: string
  incidentId: string
  title: string
  type: "preliminary" | "investigation" | "final" | "ai-generated"
  status: "draft" | "submitted" | "in-review" | "approved" | "returned" | "published"
  createdBy: string // User ID
  assignedTo?: string // User ID
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
  approvedAt?: Date
  approvedBy?: string // User ID
  content: ReportContent
  aiContribution?: number // 0-100, percentage of AI-generated content
  comments?: ReportComment[]
  revisionHistory?: ReportRevision[]
  relatedReports?: string[] // IDs of related reports
  tags?: string[]
}

/**
 * Report content
 */
export interface ReportContent {
  summary: string
  sections: ReportSection[]
  conclusion?: string
  recommendations?: string[]
}

/**
 * Report section
 */
export interface ReportSection {
  id: string
  title: string
  content: string
  evidenceRefs?: string[] // IDs of referenced evidence
  isAIGenerated?: boolean
  confidence?: number // AI confidence score if AI-generated
}

/**
 * Report comment
 */
export interface ReportComment {
  id: string
  userId: string
  timestamp: Date
  content: string
  section?: string // Section ID if applicable
  resolved: boolean
  resolvedBy?: string // User ID
  resolvedAt?: Date
}

/**
 * Report revision
 */
export interface ReportRevision {
  id: string
  timestamp: Date
  userId: string
  changes: {
    sectionId: string
    previousContent: string
    newContent: string
  }[]
  reason?: string
}

// ==============================
// Analytics & Dashboard Models
// ==============================

/**
 * System performance metrics
 */
export interface SystemPerformance {
  timestamp: Date
  aiSubsystems: {
    name: string
    status: "online" | "degraded" | "offline"
    performance: number // 0-100
    responseTime: number // in milliseconds
    errorRate: number // percentage
  }[]
  processingQueue: {
    totalItems: number
    estimatedCompletionTime: number // in minutes
  }
  modelVersions: {
    subsystem: string
    version: string
    lastUpdated: Date
  }[]
  overallHealth: "optimal" | "good" | "degraded" | "critical"
}

/**
 * AI performance metrics
 */
export interface AIPerformanceMetrics {
  period: {
    start: Date
    end: Date
  }
  accuracyByCategory: {
    category: string
    accuracy: number // percentage
    sampleSize: number
    trend: "improving" | "stable" | "declining"
  }[]
  processingTimes: {
    date: Date
    averageTime: number // in minutes
  }[]
  confidenceDistribution: {
    high: number // percentage
    medium: number // percentage
    low: number // percentage
  }
  reportVolume: {
    date: Date
    count: number
  }[]
  userFeedback: {
    positive: number // percentage
    negative: number // percentage
    suggestions: number
  }
}

/**
 * Incident statistics
 */
export interface IncidentStatistics {
  period: {
    start: Date
    end: Date
  }
  totalIncidents: number
  byType: {
    type: IncidentType
    count: number
    percentChange: number // compared to previous period
  }[]
  bySeverity: {
    severity: IncidentSeverity
    count: number
    percentChange: number // compared to previous period
  }[]
  byLocation: {
    location: string
    count: number
    isHotspot: boolean
  }[]
  byTimeOfDay: {
    hour: number // 0-23
    count: number
  }[]
  byWeatherCondition: {
    condition: WeatherCondition
    count: number
  }[]
  contributingFactors: {
    factor: string
    count: number
    percentChange: number // compared to previous period
  }[]
}

/**
 * User performance metrics
 */
export interface UserPerformanceMetrics {
  userId: string
  period: {
    start: Date
    end: Date
  }
  reportsSubmitted: number
  averageCompletionTime: number // in days
  qualityScore?: number // 0-100
  caseload: number
  caseResolutionRate: number // percentage
  feedback?: {
    fromSupervisors: number // average rating 0-5
    fromPeers: number // average rating 0-5
  }
}

/**
 * AI insight
 */
export interface AIInsight {
  id: string
  generatedAt: Date
  type: "hotspot" | "pattern" | "trend" | "anomaly" | "recommendation"
  title: string
  description: string
  confidence: number // 0-100
  impactAssessment: "low" | "medium" | "high"
  relatedIncidents?: string[] // Incident IDs
  supportingData: {
    dataType: string
    summary: string
    details: Record<string, any>
  }[]
  recommendations?: string[]
  status: "new" | "reviewed" | "actioned" | "dismissed"
  reviewedBy?: string // User ID
  reviewedAt?: Date
  actions?: {
    description: string
    assignedTo?: string // User ID
    status: "pending" | "in-progress" | "completed"
    completedAt?: Date
  }[]
}

/**
 * AI query and response
 */
export interface AIQuery {
  id: string
  userId: string
  timestamp: Date
  query: string
  response: {
    text: string
    generatedAt: Date
    processingTime: number // in milliseconds
    confidence: number // 0-100
    dataPoints: {
      type: string
      value: any
      source: string
      confidence: number // 0-100
    }[]
    visualizations?: {
      type: "bar" | "line" | "pie" | "map" | "other"
      title: string
      data: Record<string, any>
    }[]
  }
  feedback?: {
    helpful: boolean
    comments?: string
  }
}

/**
 * Notification model
 */
export interface Notification {
  id: string
  userId: string
  timestamp: Date
  type: "assignment" | "ai" | "alert" | "update" | "comment" | "system"
  title: string
  description: string
  read: boolean
  readAt?: Date
  priority: "low" | "medium" | "high"
  action?: {
    type: "link" | "button"
    label: string
    url?: string
    payload?: Record<string, any>
  }
  relatedTo?: {
    incidentId?: string
    reportId?: string
    userId?: string
    aiInsightId?: string
  }
  expiresAt?: Date
}
