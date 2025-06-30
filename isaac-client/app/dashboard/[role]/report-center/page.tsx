import { ReportCenter } from "@/components/report-center"

export default function ReportCenterPage({ params }: { params: { role: string } }) {
  return <ReportCenter role={params.role} />
}
