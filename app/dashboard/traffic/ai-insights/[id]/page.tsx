import { AIInsightsDetail } from "@/components/ai-insights-detail"

interface PageProps {
  params: {
    id: string
  }
}

export default function TrafficAIInsightsPage({ params }: PageProps) {
  return <AIInsightsDetail incidentId={params.id} />
}
