import { TrafficReportDetail } from "@/components/traffic-report-detail"

export default async function TrafficReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TrafficReportDetail id={id} />
}
