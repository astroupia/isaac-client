import { TrafficReportDetail } from "@/components/traffic-report-detail"

export default function TrafficReportDetailPage({ params }: { params: { id: string } }) {
  return <TrafficReportDetail id={params.id} />
}
