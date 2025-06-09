import { ChiefReportDetail } from "@/components/chief-report-detail"

interface PageProps {
  params: {
    id: string
  }
}

export default function ChiefReportDetailPage({ params }: PageProps) {
  return <ChiefReportDetail reportId={params.id} />
}
