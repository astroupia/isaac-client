import { ChiefAIInsights } from "@/components/chief-ai-insights";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChiefAIInsightsPage({ params }: PageProps) {
  const { id } = await params;
  return <ChiefAIInsights reportId={id} />;
}
