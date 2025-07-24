import { ChiefReportDetail } from "@/components/chief-report-detail";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChiefReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ChiefReportDetail reportId={id} />;
}
