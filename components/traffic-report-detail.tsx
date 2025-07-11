"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  MapPin, 
  Calendar, 
  User, 
  Car, 
  Camera, 
  Users, 
  AlertTriangle,
  Clock,
  Tag,
  Building,
  Phone,
  Mail,
  Hash,
  FileImage,
  FileVideo,
  File,
  FileAudio,
  FileText as FileDocument,
  MessageSquare,
  Thermometer,
  Cloud,
  Heart,
  Shield,
  Info
} from "lucide-react"
import Link from "next/link"
import reportService from "@/lib/api/reports"
import incidentService from "@/lib/api/incidents"
import evidenceService from "@/lib/api/evidence"
import vehicleService from "@/lib/api/vehicles"
import personService from "@/lib/api/persons"

// Import types
import { ReportStatus, ReportType, ReportPriority } from "@/types/report"
import { IncidentType, IncidentSeverity } from "@/types/incident"
import { EvidenceType } from "@/types/evidence"
import { VehicleType, DamageSeverity } from "@/types/vehicle"
import { PersonRole, PersonStatus, PersonGender } from "@/types/person"

interface TrafficReportDetailProps {
  id: string
}

export function TrafficReportDetail({ id }: TrafficReportDetailProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<any>(null)
  const [incident, setIncident] = useState<any>(null)
  const [evidence, setEvidence] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const reportData = await reportService.getReport(id)
        setReport(reportData)
        // Robustly extract incidentId as a string
        let incidentIdRaw = reportData.incidentId;
        let incidentId: string | undefined;

        if (incidentIdRaw == null) {
          incidentId = undefined;
        } else if (typeof incidentIdRaw === "string" || typeof incidentIdRaw === "number") {
          incidentId = String(incidentIdRaw);
        } else if (typeof incidentIdRaw === "object") {
          if (typeof incidentIdRaw.toString === "function" && incidentIdRaw.toString !== Object.prototype.toString) {
            incidentId = incidentIdRaw.toString();
          } else if (incidentIdRaw._id) {
            incidentId = typeof incidentIdRaw._id === "string" ? incidentIdRaw._id : incidentIdRaw._id.toString();
          } else if (incidentIdRaw.id) {
            incidentId = typeof incidentIdRaw.id === "string" ? incidentIdRaw.id : incidentIdRaw.id.toString();
          }
        }

        if (!incidentId) {
          setError("Invalid incident ID in report data.");
          setLoading(false);
          return;
        }
        const incidentData = await incidentService.getIncident(incidentId)
        setIncident(incidentData)
        const evidenceData = await evidenceService.getIncidentEvidence(incidentId)
        setEvidence(evidenceData)
        const vehiclesData = await vehicleService.getIncidentVehicles(incidentId)
        setVehicles(vehiclesData)
        
        // Load persons with better error handling
        try {
          console.log('Loading persons for incident:', incidentId);
          console.log('Incident data:', incidentData);
          console.log('Calling personService.getIncidentPersons with incidentId:', incidentId);
          const personsData = await personService.getIncidentPersons(incidentId)
          console.log('Persons data loaded:', personsData);
          console.log('Persons data type:', typeof personsData);
          console.log('Persons data length:', Array.isArray(personsData) ? personsData.length : 'Not an array');
          setPersons(personsData || [])
        } catch (personError: any) {
          console.error('Error loading persons:', personError);
          console.error('Person error response:', personError.response?.data);
          console.error('Person error status:', personError.response?.status);
          console.error('Person error message:', personError.message);
          // Don't fail the entire load if persons fail
          setPersons([])
        }
      } catch (err: any) {
        setError("Failed to load report details. " + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'published': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'needs review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high priority': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium priority': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low priority': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getIncidentTypeLabel = (type: string) => {
    switch (type) {
      case 'traffic_collision': return 'Traffic Collision'
      case 'pedestrian_accident': return 'Pedestrian Accident'
      case 'vehicle_fire': return 'Vehicle Fire'
      case 'hazmat_spill': return 'Hazmat Spill'
      case 'weather_related': return 'Weather Related'
      case 'other': return 'Other'
      default: return type
    }
  }

  const getIncidentSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <FileImage className="h-4 w-4" />
      case 'video':
        return <FileVideo className="h-4 w-4" />
      case 'audio':
        return <FileAudio className="h-4 w-4" />
      case 'document':
        return <FileDocument className="h-4 w-4" />
      case 'witness_statement':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'car': return 'Car'
      case 'truck': return 'Truck'
      case 'motorcycle': return 'Motorcycle'
      case 'bus': return 'Bus'
      case 'van': return 'Van'
      case 'suv': return 'SUV'
      case 'tractor': return 'Tractor'
      case 'other': return 'Other'
      default: return type
    }
  }

  const getDamageSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-green-100 text-green-800 border-green-200'
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'severe': return 'bg-red-100 text-red-800 border-red-200'
      case 'totaled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPersonRoleLabel = (role: string) => {
    switch (role) {
      case 'driver': return 'Driver'
      case 'passenger': return 'Passenger'
      case 'pedestrian': return 'Pedestrian'
      case 'witness': return 'Witness'
      case 'first_responder': return 'First Responder'
      case 'law_enforcement': return 'Law Enforcement'
      case 'other': return 'Other'
      default: return role
    }
  }

  const getPersonStatusColor = (status: string) => {
    switch (status) {
      case 'injured': return 'bg-red-100 text-red-800 border-red-200'
      case 'uninjured': return 'bg-green-100 text-green-800 border-green-200'
      case 'deceased': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'unknown': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPersonGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Male'
      case 'female': return 'Female'
      case 'other': return 'Other'
      case 'prefer_not_to_say': return 'Prefer not to say'
      default: return gender
    }
  }

  const formatAge = (age: number | string | Date) => {
    if (!age) return 'Unknown'
    if (typeof age === 'number') {
      return `${age} years`
    }
    if (typeof age === 'string') {
      // Try to parse as number first
      const numAge = parseInt(age)
      if (!isNaN(numAge)) {
        return `${numAge} years`
      }
      // If it's a date string, calculate age
      const birth = new Date(age)
      const today = new Date()
      const calculatedAge = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return `${calculatedAge - 1} years`
      }
      return `${calculatedAge} years`
    }
    if (age instanceof Date) {
      const today = new Date()
      const calculatedAge = today.getFullYear() - age.getFullYear()
      const monthDiff = today.getMonth() - age.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < age.getDate())) {
        return `${calculatedAge - 1} years`
      }
      return `${calculatedAge} years`
    }
    return 'Unknown'
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const renderJsonContent = (content: any) => {
    if (!content) return <p className="text-gray-500 italic">No content available</p>
    
    let parsedContent: any
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content)
      } catch {
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">{content}</p>
          </div>
        )
      }
    } else {
      parsedContent = content
    }

    // If it's a structured report content, render it nicely
    if (parsedContent.incidentDetails || parsedContent.vehicles !== undefined) {
      return (
        <div className="space-y-6">
          {/* Incident Details Section */}
          {parsedContent.incidentDetails && (
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>Incident Summary</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-blue-900">Location</p>
                      <p className="text-sm text-blue-700">{parsedContent.incidentDetails.incidentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-blue-900">Type</p>
                      <p className="text-sm text-blue-700">{getIncidentTypeLabel(parsedContent.incidentDetails.incidentType)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Badge className={`${getIncidentSeverityColor(parsedContent.incidentDetails.incidentSeverity)} border`}>
                      {parsedContent.incidentDetails.incidentSeverity}
                    </Badge>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Severity</p>
                      <p className="text-sm text-gray-600 capitalize">{parsedContent.incidentDetails.incidentSeverity}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-blue-900">Date & Time</p>
                      <p className="text-sm text-blue-700">
                        {new Date(parsedContent.incidentDetails.dateTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-blue-900">Casualties</p>
                      <p className="text-sm text-blue-700">{parsedContent.incidentDetails.numberOfCasualties}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {parsedContent.incidentDetails.incidentDescription && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-900">Description</p>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{parsedContent.incidentDetails.incidentDescription}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Statistics Section */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 flex items-center space-x-2">
              <Info className="h-4 w-4 text-green-500" />
              <span>Case Statistics</span>
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-green-900">Vehicles</p>
                <p className="text-lg font-semibold text-green-700">{parsedContent.vehicles || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-blue-900">Persons</p>
                <p className="text-lg font-semibold text-blue-700">{parsedContent.persons || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-purple-900">Evidence</p>
                <p className="text-lg font-semibold text-purple-700">{parsedContent.evidence || 0}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-red-900">Casualties</p>
                <p className="text-lg font-semibold text-red-700">{parsedContent.casualties || 0}</p>
              </div>
            </div>
          </div>

          {/* Weather & Road Conditions */}
          {(parsedContent.weatherConditions || parsedContent.roadConditions) && (
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-yellow-500" />
                <span>Environmental Conditions</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedContent.weatherConditions && parsedContent.weatherConditions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-900 flex items-center space-x-2">
                      <Cloud className="h-3 w-3" />
                      <span>Weather Conditions</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {parsedContent.weatherConditions.map((condition: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {parsedContent.roadConditions && parsedContent.roadConditions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-900 flex items-center space-x-2">
                      <Car className="h-3 w-3" />
                      <span>Road Conditions</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {parsedContent.roadConditions.map((condition: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw JSON Toggle */}
          <div className="space-y-2">
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center space-x-2">
                <FileText className="h-3 w-3" />
                <span>View Raw JSON Data</span>
              </summary>
              <div className="mt-2 bg-gray-50 rounded-lg p-4">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {JSON.stringify(parsedContent, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )
    }

    // Fallback to raw JSON display for other content
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
          {JSON.stringify(parsedContent, null, 2)}
        </pre>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">Loading report details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!report || !incident) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-lg">No report found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100">
            <Link href="/dashboard/traffic/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
          <Button variant="outline" className="hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Report #{report._id || report.id}
                </h1>
              </div>
              <p className="text-lg text-gray-600">{report.title}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor(report.status)} border`}>
                {report.status}
              </Badge>
              <Badge className={`${getPriorityColor(report.priority)} border`}>
                {report.priority}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Time</p>
                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Assigned To</p>
                <p className="text-sm text-gray-500">
                  {report.assignedTo || "Unassigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Type</p>
                <p className="text-sm text-gray-500">{report.type}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="incident" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Incident
          </TabsTrigger>
          <TabsTrigger value="evidence" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Camera className="mr-2 h-4 w-4" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Car className="mr-2 h-4 w-4" />
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="persons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mr-2 h-4 w-4" />
            Persons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Report Overview</span>
              </CardTitle>
              <CardDescription>Summary of the report details and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Report Type</p>
                      <p className="text-sm text-gray-600">{report.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Priority Level</p>
                      <p className="text-sm text-gray-600">{report.priority}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created At</p>
                      <p className="text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Assigned To</p>
                      <p className="text-sm text-gray-600">
                        {report.assignedTo || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {report.aiContribution && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>AI Analysis</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-900">AI Contribution</p>
                      <p className="text-lg font-semibold text-blue-700">{report.aiContribution}%</p>
                    </div>
                    {report.aiOverallConfidence && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-green-900">Overall Confidence</p>
                        <p className="text-lg font-semibold text-green-700">{report.aiOverallConfidence}%</p>
                      </div>
                    )}
                    {report.aiObjectDetection && (
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-purple-900">Object Detection</p>
                        <p className="text-lg font-semibold text-purple-700">{report.aiObjectDetection}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Report Content</h4>
                {renderJsonContent(report.content)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incident" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span>Incident Details</span>
              </CardTitle>
              <CardDescription>Information about the related incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{incident.incidentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Type</p>
                      <p className="text-sm text-gray-600">{getIncidentTypeLabel(incident.incidentType)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Badge className={`${getIncidentSeverityColor(incident.incidentSeverity)} border`}>
                      {incident.incidentSeverity}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Severity</p>
                      <p className="text-sm text-gray-600 capitalize">{incident.incidentSeverity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(incident.dateTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Number of Casualties</p>
                    <p className="text-sm text-gray-600">{incident.numberOfCasualties || 0}</p>
                  </div>
                </div>
              </div>
              
              {incident.weatherConditions && incident.weatherConditions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Cloud className="h-4 w-4" />
                    <span>Weather Conditions</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {incident.weatherConditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {incident.roadConditions && incident.roadConditions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <span>Road Conditions</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {incident.roadConditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-orange-50">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {incident.incidentDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-primary" />
                <span>Evidence</span>
              </CardTitle>
              <CardDescription>All evidence linked to this incident</CardDescription>
            </CardHeader>
            <CardContent>
              {evidence.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No evidence found for this incident.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {evidence.map((ev) => (
                    <div key={ev._id || ev.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getEvidenceIcon(ev.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">Type: {ev.type}</p>
                          {ev.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ev.description}</p>
                          )}
                          {ev.fileSize && (
                            <p className="text-xs text-gray-500 mt-1">Size: {formatFileSize(ev.fileSize)}</p>
                          )}
                          {ev.fileUrl && (
                            <a 
                              href={ev.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              View File
                            </a>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Uploaded: {ev.uploadedAt ? new Date(ev.uploadedAt).toLocaleString() : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-primary" />
                <span>Vehicles Involved</span>
              </CardTitle>
              <CardDescription>All vehicles linked to this incident</CardDescription>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No vehicles found for this incident.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((v) => (
                    <div key={v._id || v.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Car className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {v.make} {v.model} {v.year && `(${v.year})`}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Plate: {v.licensePlate || "No Plate"}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-600">Type: {getVehicleTypeLabel(v.vehicleType)}</p>
                            <p className="text-xs text-gray-600">Color: {v.color || "-"}</p>
                            <p className="text-xs text-gray-600">Occupants: {v.occupantsCount}</p>
                            {v.damageSeverity && (
                              <div className="flex items-center space-x-1">
                                <Badge className={`${getDamageSeverityColor(v.damageSeverity)} border text-xs`}>
                                  {v.damageSeverity}
                                </Badge>
                              </div>
                            )}
                            {v.airbagDeployed !== undefined && (
                              <p className="text-xs text-gray-600">
                                Airbag: {v.airbagDeployed ? "Deployed" : "Not Deployed"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persons" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Persons Involved ({persons.length})</span>
              </CardTitle>
              <CardDescription>All persons linked to this incident</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
                  <p>Debug: Persons array length: {persons.length}</p>
                  <p>Debug: Persons data: {JSON.stringify(persons, null, 2)}</p>
                </div>
              )}
              
              {persons.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No persons found for this incident.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {persons.map((p) => (
                    <div key={p._id || p.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {p.firstName} {p.lastName}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">Role: {getPersonRoleLabel(p.role)}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getPersonStatusColor(p.status)} border text-xs`}>
                                {p.status}
                              </Badge>
                              <span className="text-xs text-gray-600">
                                {p.age ? formatAge(p.age) : 'Age unknown'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Gender: {getPersonGenderLabel(p.gender)}</p>
                            {p.contactNumber && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-600">{p.contactNumber}</p>
                              </div>
                            )}
                            {p.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-600">{p.email}</p>
                              </div>
                            )}
                            {p.licenseNumber && (
                              <div className="flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-600">License: {p.licenseNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
