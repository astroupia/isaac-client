import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AIInsightsSummary() {
  const insights = [
    {
      category: "Vehicle Detection",
      confidence: 94,
      description: "AI accurately detected vehicles in 94% of incidents",
    },
    {
      category: "Incident Reconstruction",
      confidence: 87,
      description: "87% accuracy in reconstructing incident sequences",
    },
    {
      category: "Context Analysis",
      confidence: 82,
      description: "82% accuracy in analyzing environmental factors",
    },
    {
      category: "Casualty Assessment",
      confidence: 91,
      description: "91% accuracy in assessing casualty severity",
    },
  ]

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{insight.category}</h4>
            <span className="text-sm font-medium">{insight.confidence}%</span>
          </div>
          <Progress value={insight.confidence} className="h-2" />
          <p className="text-xs text-muted-foreground">{insight.description}</p>
        </div>
      ))}

      <Card className="bg-primary/5 border-primary/10 mt-4">
        <CardContent className="p-3">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
                <path d="M12 2a10 10 0 0 1 10 10h-10V2Z" />
                <path d="M12 12 2 12" />
                <path d="M12 12v10" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">AI System Performance</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Overall AI system performance has improved by 8% this month, with notable gains in vehicle detection
                accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
