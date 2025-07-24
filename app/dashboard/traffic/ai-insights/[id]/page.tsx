import { AIInsightsDetail } from "@/components/ai-insights-detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TrafficAIInsightsPage({ params }: PageProps) {
  const { id } = await params;
  return <AIInsightsDetail incidentId={id} />;
}
