import { TrafficReportDetail } from "@/components/traffic-report-detail"

export default async function TrafficReportDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { id } = await params
  const { mode } = await searchParams
  return <TrafficReportDetail id={id} mode={mode} />
}
