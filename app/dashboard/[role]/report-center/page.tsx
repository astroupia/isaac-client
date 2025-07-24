import { ReportCenter } from "@/components/report-center";

export default async function ReportCenterPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  return <ReportCenter role={role} />;
}
