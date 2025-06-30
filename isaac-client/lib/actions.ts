/**
 * ISAAC Platform API Actions
 *
 * This file contains the definitions of all API actions available for the ISAAC platform models.
 * Each action specifies the parameters it accepts and the expected return type.
 */

// ==============================
// User & Authentication Actions
// ==============================

export const UserActions = {
  // Authentication
  login: {
    params: {
      username: "string",
      password: "string",
      role: "UserRole (optional)",
    },
    returns: "{ user: User, token: string, refreshToken: string }",
    description: "Authenticates a user and returns a session token",
  },
  logout: {
    params: {
      token: "string (optional)",
    },
    returns: "{ success: boolean }",
    description: "Logs out the current user or invalidates the specified token",
  },
  refreshToken: {
    params: {
      refreshToken: "string",
    },
    returns: "{ token: string, expiresAt: number }",
    description: "Generates a new access token using a refresh token",
  },

  // User Management
  getCurrentUser: {
    params: {},
    returns: "User",
    description: "Retrieves the currently authenticated user's profile",
  },
  getUser: {
    params: {
      id: "string",
    },
    returns: "User",
    description: "Retrieves a user by their ID",
  },
  getUsers: {
    params: {
      role: "UserRole (optional)",
      department: "string (optional)",
      isActive: "boolean (optional)",
      search: "string (optional)",
      page: "number (optional)",
      limit: "number (optional)",
      sortBy: "string (optional)",
      sortOrder: "asc|desc (optional)",
    },
    returns: "{ users: User[], total: number, page: number, pages: number }",
    description: "Retrieves a list of users with optional filtering",
  },
  createUser: {
    params: {
      user: "Partial<User>",
    },
    returns: "User",
    description: "Creates a new user",
  },
  updateUser: {
    params: {
      id: "string",
      data: "Partial<User>",
    },
    returns: "User",
    description: "Updates an existing user",
  },
  deleteUser: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes a user",
  },
  changePassword: {
    params: {
      currentPassword: "string",
      newPassword: "string",
    },
    returns: "{ success: boolean }",
    description: "Changes the password for the current user",
  },
  resetPassword: {
    params: {
      email: "string",
    },
    returns: "{ success: boolean }",
    description: "Initiates a password reset process for a user",
  },
  completePasswordReset: {
    params: {
      token: "string",
      newPassword: "string",
    },
    returns: "{ success: boolean }",
    description: "Completes the password reset process",
  },

  // Role-specific actions
  getInvestigatorWorkload: {
    params: {
      id: "string (optional)", // If not provided, gets for current user
    },
    returns:
      "{ activeCases: number, pendingReview: number, completedThisMonth: number, averageResolutionTime: number }",
    description: "Gets workload statistics for an investigator",
  },
  getTrafficPersonnelStats: {
    params: {
      id: "string (optional)", // If not provided, gets for current user
    },
    returns: "{ reportsSubmitted: number, pendingReports: number, completedThisMonth: number }",
    description: "Gets statistics for traffic personnel",
  },
  getChiefAnalystDashboard: {
    params: {
      timeframe: "day|week|month|year (optional)",
    },
    returns:
      "{ pendingAssignments: number, pendingReviews: number, activeInvestigators: number, completedCases: number, aiInsights: AIInsight[] }",
    description: "Gets dashboard data for a chief analyst",
  },
  updateUserPreferences: {
    params: {
      preferences: "{ theme: string, notifications: object, dashboard: object }",
    },
    returns: "{ success: boolean, preferences: object }",
    description: "Updates user preferences",
  },
}

// ==============================
// Incident & Case Actions
// ==============================

export const IncidentActions = {
  // CRUD Operations
  getIncident: {
    params: {
      id: "string",
    },
    returns: "Incident",
    description: "Retrieves an incident by ID",
  },
  getIncidents: {
    params: {
      status: "IncidentStatus (optional)",
      priority: "PriorityLevel (optional)",
      type: "IncidentType (optional)",
      severity: "IncidentSeverity (optional)",
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      assignedTo: "string (optional)",
      reportedBy: "string (optional)",
      location: "string (optional)",
      search: "string (optional)",
      page: "number (optional)",
      limit: "number (optional)",
      sortBy: "string (optional)",
      sortOrder: "asc|desc (optional)",
    },
    returns: "{ incidents: IncidentSummary[], total: number, page: number, pages: number }",
    description: "Retrieves a list of incidents with optional filtering",
  },
  createIncident: {
    params: {
      incident: "Partial<Incident>",
    },
    returns: "Incident",
    description: "Creates a new incident",
  },
  updateIncident: {
    params: {
      id: "string",
      data: "Partial<Incident>",
    },
    returns: "Incident",
    description: "Updates an existing incident",
  },
  deleteIncident: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes an incident",
  },

  // Specialized Actions
  assignIncident: {
    params: {
      id: "string",
      investigatorId: "string",
      notes: "string (optional)",
    },
    returns: "Incident",
    description: "Assigns an incident to an investigator",
  },
  updateIncidentStatus: {
    params: {
      id: "string",
      status: "IncidentStatus",
      notes: "string (optional)",
    },
    returns: "Incident",
    description: "Updates the status of an incident",
  },
  updateIncidentPriority: {
    params: {
      id: "string",
      priority: "PriorityLevel",
      reason: "string (optional)",
    },
    returns: "Incident",
    description: "Updates the priority of an incident",
  },
  addTimelineEvent: {
    params: {
      incidentId: "string",
      event: "Partial<TimelineEvent>",
    },
    returns: "TimelineEvent",
    description: "Adds a timeline event to an incident",
  },
  updateTimelineEvent: {
    params: {
      incidentId: "string",
      eventId: "string",
      data: "Partial<TimelineEvent>",
    },
    returns: "TimelineEvent",
    description: "Updates a timeline event",
  },
  deleteTimelineEvent: {
    params: {
      incidentId: "string",
      eventId: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes a timeline event",
  },

  // Query Operations
  getIncidentsByLocation: {
    params: {
      latitude: "number",
      longitude: "number",
      radiusKm: "number (optional)",
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      page: "number (optional)",
      limit: "number (optional)",
    },
    returns: "{ incidents: IncidentSummary[], total: number }",
    description: "Finds incidents near a specific location",
  },
  getIncidentHotspots: {
    params: {
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      incidentType: "IncidentType (optional)",
      minIncidents: "number (optional)",
    },
    returns: "{ hotspots: { latitude: number, longitude: number, count: number, radius: number }[] }",
    description: "Identifies incident hotspots based on location clustering",
  },
  getRelatedIncidents: {
    params: {
      incidentId: "string",
      maxResults: "number (optional)",
    },
    returns: "{ incidents: IncidentSummary[] }",
    description: "Finds incidents related to the specified incident",
  },

  // Statistics
  getIncidentStatistics: {
    params: {
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      groupBy: "day|week|month|year (optional)",
    },
    returns: "IncidentStatistics",
    description: "Gets statistics about incidents",
  },
  getIncidentTrends: {
    params: {
      timeframe: "week|month|quarter|year",
      incidentType: "IncidentType (optional)",
    },
    returns: "{ trends: { date: string, count: number }[], percentChange: number }",
    description: "Gets trend data for incidents over time",
  },
}

// ==============================
// Vehicle Actions
// ==============================

export const VehicleActions = {
  // CRUD Operations
  getVehicle: {
    params: {
      id: "string",
    },
    returns: "Vehicle",
    description: "Retrieves a vehicle by ID",
  },
  getVehiclesForIncident: {
    params: {
      incidentId: "string",
    },
    returns: "Vehicle[]",
    description: "Retrieves all vehicles involved in an incident",
  },
  addVehicle: {
    params: {
      incidentId: "string",
      vehicle: "Partial<Vehicle>",
    },
    returns: "Vehicle",
    description: "Adds a vehicle to an incident",
  },
  updateVehicle: {
    params: {
      id: "string",
      data: "Partial<Vehicle>",
    },
    returns: "Vehicle",
    description: "Updates a vehicle's information",
  },
  removeVehicle: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Removes a vehicle from an incident",
  },

  // Specialized Actions
  updateVehicleTrajectory: {
    params: {
      vehicleId: "string",
      trajectory: "Partial<VehicleTrajectory>",
    },
    returns: "VehicleTrajectory",
    description: "Updates the trajectory information for a vehicle",
  },
  updateVehicleDamage: {
    params: {
      vehicleId: "string",
      damage: "{ description: string, severity: string, areas: string[] }",
    },
    returns: "Vehicle",
    description: "Updates the damage information for a vehicle",
  },
  linkVehicleToEvidence: {
    params: {
      vehicleId: "string",
      evidenceIds: "string[]",
    },
    returns: "{ success: boolean }",
    description: "Links evidence items to a vehicle",
  },

  // Batch Operations
  batchAddVehicles: {
    params: {
      incidentId: "string",
      vehicles: "Partial<Vehicle>[]",
    },
    returns: "{ vehicles: Vehicle[], errors: any[] }",
    description: "Adds multiple vehicles to an incident",
  },
}

// ==============================
// Person & Casualty Actions
// ==============================

export const PersonActions = {
  // CRUD Operations
  getPerson: {
    params: {
      id: "string",
    },
    returns: "Person",
    description: "Retrieves a person by ID",
  },
  getPersonsForIncident: {
    params: {
      incidentId: "string",
      role: "string (optional)", // driver, passenger, pedestrian, witness
    },
    returns: "Person[]",
    description: "Retrieves all persons involved in an incident",
  },
  addPerson: {
    params: {
      incidentId: "string",
      person: "Partial<Person>",
    },
    returns: "Person",
    description: "Adds a person to an incident",
  },
  updatePerson: {
    params: {
      id: "string",
      data: "Partial<Person>",
    },
    returns: "Person",
    description: "Updates a person's information",
  },
  removePerson: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Removes a person from an incident",
  },

  // Casualty-specific Actions
  getCasualty: {
    params: {
      id: "string",
    },
    returns: "Casualty",
    description: "Retrieves a casualty by ID",
  },
  getCasualtiesForIncident: {
    params: {
      incidentId: "string",
      injurySeverity: "string (optional)",
    },
    returns: "Casualty[]",
    description: "Retrieves all casualties in an incident",
  },
  updateCasualtyInjury: {
    params: {
      id: "string",
      injury: "{ severity: string, description: string, medicalAttention: string }",
    },
    returns: "Casualty",
    description: "Updates the injury information for a casualty",
  },

  // Witness-specific Actions
  getWitness: {
    params: {
      id: "string",
    },
    returns: "Witness",
    description: "Retrieves a witness by ID",
  },
  getWitnessesForIncident: {
    params: {
      incidentId: "string",
    },
    returns: "Witness[]",
    description: "Retrieves all witnesses for an incident",
  },
  addWitnessStatement: {
    params: {
      witnessId: "string",
      statement: "string",
      recordedBy: "string",
    },
    returns: "Witness",
    description: "Adds a statement from a witness",
  },

  // Batch Operations
  batchAddPersons: {
    params: {
      incidentId: "string",
      persons: "Partial<Person>[]",
    },
    returns: "{ persons: Person[], errors: any[] }",
    description: "Adds multiple persons to an incident",
  },
}

// ==============================
// Evidence Actions
// ==============================

export const EvidenceActions = {
  // CRUD Operations
  getEvidence: {
    params: {
      id: "string",
    },
    returns: "Evidence",
    description: "Retrieves evidence by ID",
  },
  getEvidenceForIncident: {
    params: {
      incidentId: "string",
      type: "EvidenceType (optional)",
      aiProcessed: "boolean (optional)",
      page: "number (optional)",
      limit: "number (optional)",
    },
    returns: "{ evidence: Evidence[], total: number, page: number, pages: number }",
    description: "Retrieves evidence for an incident",
  },
  uploadEvidence: {
    params: {
      incidentId: "string",
      file: "File",
      metadata: "{ title: string, description: string, type: EvidenceType, tags: string[] }",
    },
    returns: "Evidence",
    description: "Uploads a new evidence file",
  },
  updateEvidence: {
    params: {
      id: "string",
      data: "Partial<Evidence>",
    },
    returns: "Evidence",
    description: "Updates evidence metadata",
  },
  deleteEvidence: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes evidence",
  },

  // Specialized Actions
  processEvidenceWithAI: {
    params: {
      id: "string",
      processingTypes: "string[] (optional)", // e.g., ['object-detection', 'text-extraction']
    },
    returns: "{ jobId: string, estimatedCompletionTime: number }",
    description: "Submits evidence for AI processing",
  },
  getAIProcessingStatus: {
    params: {
      jobId: "string",
    },
    returns: "{ status: 'pending'|'processing'|'completed'|'failed', progress: number, result: AIAnnotation[] }",
    description: "Gets the status of an AI processing job",
  },
  addEvidenceAnnotation: {
    params: {
      evidenceId: "string",
      annotation: "Partial<AIAnnotation>",
    },
    returns: "AIAnnotation",
    description: "Adds an annotation to evidence",
  },
  updateEvidenceAnnotation: {
    params: {
      evidenceId: "string",
      annotationId: "string",
      data: "Partial<AIAnnotation>",
    },
    returns: "AIAnnotation",
    description: "Updates an evidence annotation",
  },
  deleteEvidenceAnnotation: {
    params: {
      evidenceId: "string",
      annotationId: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes an evidence annotation",
  },

  // Chain of Custody
  addCustodyEvent: {
    params: {
      evidenceId: "string",
      event: "Partial<CustodyEvent>",
    },
    returns: "CustodyEvent",
    description: "Adds a custody event to the evidence chain",
  },
  getCustodyChain: {
    params: {
      evidenceId: "string",
    },
    returns: "CustodyEvent[]",
    description: "Gets the complete chain of custody for evidence",
  },

  // Batch Operations
  batchUploadEvidence: {
    params: {
      incidentId: "string",
      files: "File[]",
      metadata: "{ title: string, description: string, type: EvidenceType }[]",
    },
    returns: "{ evidence: Evidence[], errors: any[] }",
    description: "Uploads multiple evidence files",
  },
  batchProcessEvidence: {
    params: {
      evidenceIds: "string[]",
      processingTypes: "string[] (optional)",
    },
    returns: "{ jobs: { evidenceId: string, jobId: string }[] }",
    description: "Submits multiple evidence items for AI processing",
  },
}

// ==============================
// AI Analysis Actions
// ==============================

export const AIAnalysisActions = {
  // Core Operations
  getAnalysis: {
    params: {
      id: "string",
    },
    returns: "AIAnalysis",
    description: "Retrieves an AI analysis by ID",
  },
  getAnalysisForIncident: {
    params: {
      incidentId: "string",
    },
    returns: "AIAnalysis",
    description: "Retrieves the AI analysis for an incident",
  },
  requestAnalysis: {
    params: {
      incidentId: "string",
      options: "{ priority: 'low'|'normal'|'high', notifyUserId: string }",
    },
    returns: "{ jobId: string, estimatedCompletionTime: number }",
    description: "Requests a new AI analysis for an incident",
  },
  getAnalysisStatus: {
    params: {
      jobId: "string",
    },
    returns:
      "{ status: 'pending'|'processing'|'completed'|'failed', progress: number, estimatedCompletionTime: number }",
    description: "Gets the status of an AI analysis job",
  },

  // Feedback and Refinement
  provideFeedback: {
    params: {
      analysisId: "string",
      feedback:
        "{ rating: 'helpful'|'not-helpful', comments: string, accuracyAssessment: number, usefulnessAssessment: number }",
    },
    returns: "{ success: boolean }",
    description: "Provides feedback on an AI analysis",
  },
  requestAnalysisRefinement: {
    params: {
      analysisId: "string",
      areas: "string[]", // e.g., ['vehicleAnalysis', 'environmentalAnalysis']
      comments: "string",
    },
    returns: "{ jobId: string, estimatedCompletionTime: number }",
    description: "Requests refinement of specific areas of an AI analysis",
  },

  // Component-specific Operations
  getVehicleAnalysis: {
    params: {
      analysisId: "string",
      vehicleId: "string",
    },
    returns: "VehicleAIAnalysis",
    description: "Gets AI analysis for a specific vehicle",
  },
  getCasualtyAnalysis: {
    params: {
      analysisId: "string",
      casualtyId: "string",
    },
    returns: "CasualtyAIAnalysis",
    description: "Gets AI analysis for a specific casualty",
  },
  getEnvironmentalAnalysis: {
    params: {
      analysisId: "string",
    },
    returns: "EnvironmentalAIAnalysis",
    description: "Gets environmental analysis from AI",
  },
  getContributingFactors: {
    params: {
      analysisId: "string",
    },
    returns: "ContributingFactor[]",
    description: "Gets contributing factors identified by AI",
  },
  getSimilarIncidents: {
    params: {
      incidentId: "string",
      maxResults: "number (optional)",
      minSimilarity: "number (optional)", // 0-100
    },
    returns: "SimilarIncident[]",
    description: "Gets incidents similar to the specified incident",
  },

  // System Status
  getAISystemStatus: {
    params: {},
    returns:
      "{ status: 'optimal'|'degraded'|'offline', subsystems: { name: string, status: string, performance: number }[], queueLength: number }",
    description: "Gets the current status of the AI system",
  },
  getAIPerformanceMetrics: {
    params: {
      period: "day|week|month|year (optional)",
    },
    returns: "AIPerformanceMetrics",
    description: "Gets performance metrics for the AI system",
  },
}

// ==============================
// Report Actions
// ==============================

export const ReportActions = {
  // CRUD Operations
  getReport: {
    params: {
      id: "string",
    },
    returns: "Report",
    description: "Retrieves a report by ID",
  },
  getReports: {
    params: {
      incidentId: "string (optional)",
      status: "string (optional)",
      createdBy: "string (optional)",
      assignedTo: "string (optional)",
      type: "string (optional)",
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      page: "number (optional)",
      limit: "number (optional)",
      sortBy: "string (optional)",
      sortOrder: "asc|desc (optional)",
    },
    returns: "{ reports: Report[], total: number, page: number, pages: number }",
    description: "Retrieves reports with optional filtering",
  },
  createReport: {
    params: {
      report: "Partial<Report>",
    },
    returns: "Report",
    description: "Creates a new report",
  },
  updateReport: {
    params: {
      id: "string",
      data: "Partial<Report>",
    },
    returns: "Report",
    description: "Updates an existing report",
  },
  deleteReport: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes a report",
  },

  // Report Workflow
  submitReportForReview: {
    params: {
      id: "string",
      notes: "string (optional)",
    },
    returns: "Report",
    description: "Submits a report for review",
  },
  approveReport: {
    params: {
      id: "string",
      notes: "string (optional)",
    },
    returns: "Report",
    description: "Approves a report",
  },
  returnReportForRevision: {
    params: {
      id: "string",
      comments: "string",
      sections: "string[] (optional)", // IDs of sections needing revision
    },
    returns: "Report",
    description: "Returns a report for revision",
  },
  publishReport: {
    params: {
      id: "string",
    },
    returns: "Report",
    description: "Publishes an approved report",
  },

  // Report Content
  addReportSection: {
    params: {
      reportId: "string",
      section: "Partial<ReportSection>",
    },
    returns: "ReportSection",
    description: "Adds a section to a report",
  },
  updateReportSection: {
    params: {
      reportId: "string",
      sectionId: "string",
      data: "Partial<ReportSection>",
    },
    returns: "ReportSection",
    description: "Updates a report section",
  },
  deleteReportSection: {
    params: {
      reportId: "string",
      sectionId: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes a report section",
  },
  reorderReportSections: {
    params: {
      reportId: "string",
      sectionIds: "string[]", // Ordered array of section IDs
    },
    returns: "{ success: boolean }",
    description: "Reorders sections in a report",
  },

  // Comments and Collaboration
  addReportComment: {
    params: {
      reportId: "string",
      comment: "{ content: string, sectionId: string (optional) }",
    },
    returns: "ReportComment",
    description: "Adds a comment to a report",
  },
  updateReportComment: {
    params: {
      reportId: "string",
      commentId: "string",
      content: "string",
    },
    returns: "ReportComment",
    description: "Updates a report comment",
  },
  deleteReportComment: {
    params: {
      reportId: "string",
      commentId: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes a report comment",
  },
  resolveReportComment: {
    params: {
      reportId: "string",
      commentId: "string",
    },
    returns: "ReportComment",
    description: "Marks a report comment as resolved",
  },

  // AI-Assisted Reporting
  generateReportFromAI: {
    params: {
      incidentId: "string",
      options: "{ sections: string[], includeEvidence: boolean, includeAIAnalysis: boolean }",
    },
    returns: "Report",
    description: "Generates a report draft using AI",
  },
  enhanceReportSection: {
    params: {
      reportId: "string",
      sectionId: "string",
      instructions: "string (optional)",
    },
    returns: "ReportSection",
    description: "Enhances a report section using AI",
  },

  // Export and Sharing
  exportReport: {
    params: {
      id: "string",
      format: "pdf|docx|json",
      options: "{ includeEvidenceAttachments: boolean, includeAIAnalysis: boolean }",
    },
    returns: "{ url: string, expiresAt: Date }",
    description: "Exports a report in the specified format",
  },
  shareReport: {
    params: {
      id: "string",
      recipients: "string[]", // Email addresses
      message: "string (optional)",
      expiresAfterDays: "number (optional)",
    },
    returns: "{ success: boolean, shareUrl: string, expiresAt: Date }",
    description: "Shares a report with specified recipients",
  },

  // Version Control
  getReportVersions: {
    params: {
      reportId: "string",
    },
    returns: "ReportRevision[]",
    description: "Gets the revision history for a report",
  },
  compareReportVersions: {
    params: {
      reportId: "string",
      version1: "string",
      version2: "string",
    },
    returns: "{ differences: { sectionId: string, title: string, before: string, after: string }[] }",
    description: "Compares two versions of a report",
  },
  revertToVersion: {
    params: {
      reportId: "string",
      versionId: "string",
    },
    returns: "Report",
    description: "Reverts a report to a previous version",
  },
}

// ==============================
// Location Actions
// ==============================

export const LocationActions = {
  // Core Operations
  getLocation: {
    params: {
      id: "string",
    },
    returns: "Location",
    description: "Retrieves a location by ID",
  },
  searchLocations: {
    params: {
      query: "string",
      limit: "number (optional)",
    },
    returns: "Location[]",
    description: "Searches for locations by address or description",
  },
  createLocation: {
    params: {
      location: "Partial<Location>",
    },
    returns: "Location",
    description: "Creates a new location",
  },
  updateLocation: {
    params: {
      id: "string",
      data: "Partial<Location>",
    },
    returns: "Location",
    description: "Updates a location",
  },

  // Geocoding
  geocodeAddress: {
    params: {
      address: "string",
    },
    returns: "{ latitude: number, longitude: number, formattedAddress: string, components: object }",
    description: "Converts an address to coordinates",
  },
  reverseGeocode: {
    params: {
      latitude: "number",
      longitude: "number",
    },
    returns: "{ address: string, components: object }",
    description: "Converts coordinates to an address",
  },

  // Analysis
  getIncidentsByLocation: {
    params: {
      locationId: "string",
      radius: "number (optional)", // in kilometers
      startDate: "Date (optional)",
      endDate: "Date (optional)",
    },
    returns: "{ incidents: IncidentSummary[], total: number }",
    description: "Gets incidents that occurred at or near a specific location",
  },
  getLocationHotspots: {
    params: {
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      incidentType: "IncidentType (optional)",
      minIncidentCount: "number (optional)",
    },
    returns:
      "{ hotspots: { id: string, latitude: number, longitude: number, incidentCount: number, radius: number, riskLevel: string }[] }",
    description: "Identifies location hotspots based on incident frequency",
  },
  getLocationRiskAssessment: {
    params: {
      locationId: "string",
    },
    returns:
      "{ riskLevel: 'low'|'medium'|'high'|'critical', factors: string[], historicalIncidents: number, recommendations: string[] }",
    description: "Gets a risk assessment for a specific location",
  },

  // Visualization
  getMapVisualizationData: {
    params: {
      bounds: "{ north: number, south: number, east: number, west: number }",
      filters: "{ incidentTypes: string[], startDate: Date, endDate: Date, severity: string[] }",
      options: "{ showHotspots: boolean, showRiskAreas: boolean, clusterMarkers: boolean }",
    },
    returns: "{ incidents: object[], hotspots: object[], riskAreas: object[] }",
    description: "Gets data for map visualization",
  },
  getLocationTimeline: {
    params: {
      locationId: "string",
      timeframe: "month|quarter|year|all",
    },
    returns: "{ timeline: { date: string, incidentCount: number, byType: object }[] }",
    description: "Gets a timeline of incidents at a specific location",
  },
}

// ==============================
// Notification Actions
// ==============================

export const NotificationActions = {
  // Core Operations
  getNotifications: {
    params: {
      read: "boolean (optional)",
      type: "string[] (optional)",
      priority: "string (optional)",
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      page: "number (optional)",
      limit: "number (optional)",
    },
    returns: "{ notifications: Notification[], total: number, unreadCount: number }",
    description: "Gets notifications for the current user",
  },
  getNotification: {
    params: {
      id: "string",
    },
    returns: "Notification",
    description: "Gets a specific notification",
  },
  markAsRead: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Marks a notification as read",
  },
  markAllAsRead: {
    params: {
      type: "string (optional)", // Filter by notification type
    },
    returns: "{ success: boolean, count: number }",
    description: "Marks all notifications as read",
  },
  deleteNotification: {
    params: {
      id: "string",
    },
    returns: "{ success: boolean }",
    description: "Deletes a notification",
  },

  // Preferences
  getNotificationPreferences: {
    params: {},
    returns:
      "{ email: boolean, inApp: boolean, sms: boolean, types: { [key: string]: boolean }, doNotDisturb: object }",
    description: "Gets notification preferences for the current user",
  },
  updateNotificationPreferences: {
    params: {
      preferences: "{ email: boolean, inApp: boolean, sms: boolean, types: object, doNotDisturb: object }",
    },
    returns: "{ success: boolean, preferences: object }",
    description: "Updates notification preferences",
  },

  // Admin Operations
  sendNotification: {
    params: {
      recipients: "string[]", // User IDs
      notification: "{ type: string, title: string, description: string, priority: string, action: object }",
    },
    returns: "{ success: boolean, sent: number, failed: number }",
    description: "Sends a notification to specified users",
  },
  sendBroadcastNotification: {
    params: {
      roles: "string[]", // User roles to target
      notification: "{ type: string, title: string, description: string, priority: string, action: object }",
    },
    returns: "{ success: boolean, recipientCount: number }",
    description: "Sends a notification to all users with specified roles",
  },
}

// ==============================
// Analytics & Dashboard Actions
// ==============================

export const AnalyticsActions = {
  // Dashboard Data
  getDashboardData: {
    params: {
      role: "UserRole",
      timeframe: "day|week|month|year (optional)",
    },
    returns: "{ summary: object, charts: object[], recentItems: object[] }",
    description: "Gets role-specific dashboard data",
  },
  getSystemPerformance: {
    params: {
      timeframe: "day|week|month (optional)",
    },
    returns: "SystemPerformance",
    description: "Gets system performance metrics",
  },

  // AI Insights
  getAIInsights: {
    params: {
      type: "string[] (optional)", // e.g., ['hotspot', 'pattern', 'trend']
      status: "string (optional)", // e.g., 'new', 'reviewed'
      limit: "number (optional)",
    },
    returns: "AIInsight[]",
    description: "Gets AI-generated insights",
  },
  updateAIInsightStatus: {
    params: {
      id: "string",
      status: "string",
      notes: "string (optional)",
    },
    returns: "AIInsight",
    description: "Updates the status of an AI insight",
  },

  // AI Query Interface
  queryAI: {
    params: {
      query: "string",
      context: "{ incidentIds: string[], timeRange: object, filters: object }",
    },
    returns: "AIQuery",
    description: "Submits a natural language query to the AI system",
  },
  getSuggestedQueries: {
    params: {
      context: "{ incidentId: string, userId: string, userRole: string }",
    },
    returns: "string[]",
    description: "Gets suggested queries based on context",
  },

  // Reports and Statistics
  getIncidentStatistics: {
    params: {
      startDate: "Date (optional)",
      endDate: "Date (optional)",
      groupBy: "day|week|month|year",
    },
    returns: "IncidentStatistics",
    description: "Gets comprehensive incident statistics",
  },
  getUserPerformanceMetrics: {
    params: {
      userId: "string (optional)", // If not provided, gets for current user
      timeframe: "month|quarter|year",
    },
    returns: "UserPerformanceMetrics",
    description: "Gets performance metrics for a user",
  },
  generateReport: {
    params: {
      type: "string", // e.g., 'incident-summary', 'user-performance', 'ai-effectiveness'
      parameters: "object",
      format: "pdf|xlsx|json",
    },
    returns: "{ url: string, expiresAt: Date }",
    description: "Generates an analytics report",
  },
}

// ==============================
// Export all actions
// ==============================

export const Actions = {
  User: UserActions,
  Incident: IncidentActions,
  Vehicle: VehicleActions,
  Person: PersonActions,
  Evidence: EvidenceActions,
  AIAnalysis: AIAnalysisActions,
  Report: ReportActions,
  Location: LocationActions,
  Notification: NotificationActions,
  Analytics: AnalyticsActions,
}
