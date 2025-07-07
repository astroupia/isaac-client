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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch incidents
      const incidents = await incidentService.getAllIncidents();
      
      // Fetch reports
      const reports = await Promise.all(
        incidents.map(async (incident) => {
          try {
            return await reportService.getIncidentReport((incident as any).id || (incident as any)._id);
          } catch (err) {
            // Report might not exist for this incident
            return null;
          }
        })
      );

      // Filter out null reports and get valid ones
      const validReports = reports.filter(report => report !== null);

      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const pendingReports = validReports.filter((report: IReport) => 
        report?.status === 'draft' || report?.status === 'rejected'
      ).length;

      const completedThisWeek = validReports.filter((report: IReport) => {
        if (!report?.submittedAt) return false;
        const submittedDate = new Date(report.submittedAt);
        return submittedDate >= oneWeekAgo && 
               (report.status === 'submitted' || report.status === 'approved' || report.status === 'published');
      }).length;

      const urgentActions = validReports.filter((report: IReport) => 
        report?.status === 'rejected'
      ).length;

      // Get recent reports (last 5)
      const recentReportsData = validReports
        .slice(0, 5)
        .map((report: IReport) => ({
          id: (report as any).id || (report as any)._id,
          title: report?.title || 'Untitled Report',
          status: report?.status?.toLowerCase() || 'unknown',
          date: report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown',
          incidentId: report?.incidentId ? String(report.incidentId) : undefined,
        }));

      // Fetch recent evidence uploads
      const evidence = await evidenceService.getAllEvidence();
      const recentUploadsData = evidence
        .slice(0, 5)
        .map((ev: IEvidence) => ({
          id: (ev as any).id || (ev as any)._id,
          name: ev.fileName || ev.title || 'Unknown File',
          type: ev.fileType || 'unknown',
          uploadedAt: ev.uploadedAt ? new Date(ev.uploadedAt).toLocaleDateString() : 'Unknown',
          evidenceType: ev.type || 'unknown',
        }));

      setStats({
        pendingReports,
        completedThisWeek,
        urgentActions,
        totalIncidents: incidents.length,
        totalEvidence: evidence.length,
      });

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
    recentReports,
    recentUploads,
    loading,
    error,
    refreshData,
  };
}; 