import { AIReportViewer } from "@/components/ai-report-viewer"

export default function AIReportPage({ params }: { params: { id: string } }) {
  return <AIReportViewer id={params.id} />
}
