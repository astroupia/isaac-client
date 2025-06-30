import { ChiefAIInsights } from "@/components/chief-ai-insights"

interface PageProps {
  params: {
    id: string
  }
}

export default function ChiefAIInsightsPage({ params }: PageProps) {
  return <ChiefAIInsights reportId={params.id} />
}
