import { AIReportViewer } from "@/components/ai-report-viewer";

export default async function AIReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AIReportViewer id={id} />;
}
