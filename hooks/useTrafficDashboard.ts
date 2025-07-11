import { useState, useEffect } from 'react';
import { incidentService } from '@/lib/api/incidents';
import { reportService } from '@/lib/api/reports';
import { evidenceService } from '@/lib/api/evidence';
import { IIncident } from '@/app/types/incident';
import { IReport } from '@/app/types/report';
import { IEvidence } from '@/types/evidence';

interface DashboardStats {
  pendingReports: number;
  completedThisWeek: number;
  urgentActions: number;
  totalIncidents: number;
  totalEvidence: number;
}

interface RecentReport {
  id: string;
  title: string;
  status: string;
  date: string;
  incidentId?: string;
}

interface RecentUpload {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  evidenceType: string;
}

interface IncidentBreakdown {
  [type: string]: number;
}
interface SeverityBreakdown {
  [severity: string]: number;
}
interface EvidenceTypeBreakdown {
  [type: string]: number;
}
interface RecentIncident {
  id: string;
  location: string;
  type: string;
  severity: string;
  date: string;
  casualties: number;
  description: string;
}

export const useTrafficDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pendingReports: 0,
    completedThisWeek: 0,
    urgentActions: 0,
    totalIncidents: 0,
    totalEvidence: 0,
  });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incidentTypeBreakdown, setIncidentTypeBreakdown] = useState<IncidentBreakdown>({});
  const [incidentSeverityBreakdown, setIncidentSeverityBreakdown] = useState<SeverityBreakdown>({});
  const [evidenceTypeBreakdown, setEvidenceTypeBreakdown] = useState<EvidenceTypeBreakdown>({});
  const [totalCasualties, setTotalCasualties] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [recentIncidents, setRecentIncidents] = useState<RecentIncident[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all incidents
      const incidents = await incidentService.getAllIncidents();
      // Aggregate incident type and severity breakdown
      const typeBreakdown: IncidentBreakdown = {};
      const severityBreakdown: SeverityBreakdown = {};
      let casualties = 0;
      let vehiclesCount = 0;
      // For recent incidents
      const sortedIncidents = [...incidents].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      const recentIncidentsData: RecentIncident[] = sortedIncidents.slice(0, 5).map((incident: any) => {
        return {
          id: incident.id || incident._id,
          location: incident.incidentLocation,
          type: incident.incidentType,
          severity: incident.incidentSeverity,
          date: incident.dateTime ? new Date(incident.dateTime).toLocaleDateString() : 'Unknown',
          casualties: incident.numberOfCasualties || 0,
          description: incident.incidentDescription || '',
        };
      });
      for (const incident of incidents) {
        // Type breakdown
        typeBreakdown[incident.incidentType] = (typeBreakdown[incident.incidentType] || 0) + 1;
        // Severity breakdown
        severityBreakdown[incident.incidentSeverity] = (severityBreakdown[incident.incidentSeverity] || 0) + 1;
        // Casualties
        casualties += incident.numberOfCasualties || 0;
        // Vehicles
        vehiclesCount += Array.isArray(incident.vehicleIds) ? incident.vehicleIds.length : 0;
      }
      // Fetch all evidence
      const evidence = await evidenceService.getAllEvidence();
      // Evidence type breakdown
      const evidenceTypeCounts: EvidenceTypeBreakdown = {};
      for (const ev of evidence) {
        evidenceTypeCounts[ev.type] = (evidenceTypeCounts[ev.type] || 0) + 1;
      }
      // Fetch all reports
      const reports = await Promise.all(
        incidents.map(async (incident) => {
          try {
            return await reportService.getIncidentReport((incident as any).id || (incident as any)._id);
          } catch (err) {
            return null;
          }
        })
      );
      // Log the raw reports array for debugging
      // eslint-disable-next-line no-console
      console.log('Raw reports from API:', reports);
      // Flatten the reports array in case getIncidentReport returns arrays
      const flatReports = reports.flat().filter((r): r is IReport => !!r);
      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const pendingReports = flatReports.filter((report: IReport) => 
        report?.status === 'draft' || report?.status === 'rejected'
      ).length;
      const completedThisWeek = flatReports.filter((report: IReport) => {
        if (!report?.submittedAt) return false;
        const submittedDate = new Date(report.submittedAt);
        return submittedDate >= oneWeekAgo && 
               (report.status === 'submitted' || report.status === 'approved' || report.status === 'published');
      }).length;
      const urgentActions = flatReports.filter((report: IReport) => 
        report?.status === 'rejected'
      ).length;
      // Get recent reports (last 5)
      const recentReportsData = flatReports
        .slice(0, 5)
        .map((report: IReport, idx: number) => {
          const id = (report as any).id || (report as any)._id;
          const incidentId = report?.incidentId ? String(report.incidentId) : undefined;
          let title = typeof report?.title === 'string' ? report.title.trim() : '';
          if (!title) {
            if (incidentId) {
              title = `Report for Incident ${incidentId}`;
            } else {
              title = `Report #${idx + 1}`;
            }
          }

          // Robust date parsing
          let date = 'Date Unknown';
          if (report?.createdAt) {
            if (typeof report.createdAt === 'number') {
              date = new Date(report.createdAt).toLocaleDateString();
            } else if (typeof report.createdAt === 'string') {
              date = new Date(report.createdAt).toLocaleDateString();
            } else if (
              typeof report.createdAt === 'object' &&
              report.createdAt !== null &&
              '$date' in report.createdAt &&
              report.createdAt.$date &&
              typeof (report.createdAt.$date as any).$numberLong === 'string'
            ) {
              date = new Date(Number((report.createdAt.$date as any).$numberLong)).toLocaleDateString();
            }
          }

          // Robust status parsing and mapping with label
          const statusMap: Record<string, { value: string, label: string }> = {
            draft: { value: 'pending', label: 'Draft' },
            pending: { value: 'pending', label: 'Pending' },
            rejected: { value: 'rejected', label: 'Rejected' },
            submitted: { value: 'completed', label: 'Submitted' },
            approved: { value: 'completed', label: 'Approved' },
            published: { value: 'completed', label: 'Published' },
            completed: { value: 'completed', label: 'Completed' },
          };
          let status = 'unknown';
          let statusLabel = 'Unknown';
          if (typeof report?.status === 'string') {
            const normalized = report.status.trim().toLowerCase();
            if (statusMap[normalized]) {
              status = statusMap[normalized].value;
              statusLabel = statusMap[normalized].label;
            } else {
              status = normalized;
              statusLabel = report.status;
            }
          }

          return {
            id,
            title,
            status,
            statusLabel,
            date,
            incidentId,
          };
        });
      // Log the mapped recentReportsData for debugging
      console.log('Mapped recentReportsData:', recentReportsData);
      // Recent evidence uploads
      const recentUploadsData = evidence
        .slice(0, 5)
        .map((ev: IEvidence) => ({
          id: (ev as any).id || (ev as any)._id,
          name: ev.fileName || ev.title || 'Unknown File',
          type: ev.fileType || 'unknown',
          uploadedAt: ev.uploadedAt ? new Date(ev.uploadedAt).toLocaleDateString() : 'Unknown',
          evidenceType: ev.type || 'unknown',
          fileUrl: ev.fileUrl,
          fileType: ev.fileType,
        }));
      setStats({
        pendingReports,
        completedThisWeek,
        urgentActions,
        totalIncidents: incidents.length,
        totalEvidence: evidence.length,
      });
      setIncidentTypeBreakdown(typeBreakdown);
      setIncidentSeverityBreakdown(severityBreakdown);
      setEvidenceTypeBreakdown(evidenceTypeCounts);
      setTotalCasualties(casualties);
      setTotalVehicles(vehiclesCount);
      setRecentIncidents(recentIncidentsData);
      setRecentReports(recentReportsData);
      setRecentUploads(recentUploadsData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    stats,
    incidentTypeBreakdown,
    incidentSeverityBreakdown,
    evidenceTypeBreakdown,
    totalCasualties,
    totalVehicles,
    recentIncidents,
    recentReports,
    recentUploads,
    loading,
    error,
    refreshData,
  };
}; 