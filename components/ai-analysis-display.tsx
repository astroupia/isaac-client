import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Clock,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Car,
  User,
  MapPin,
} from "lucide-react";

interface IAiAnalysisDisplayProps {
  result: any;
}

// Helper function to format analysis text
const formatAnalysisText = (text: string): string => {
  if (!text) return "";

  return (
    text
      // Remove asterisks from headers
      .replace(/\*\*(.*?)\*\*/g, "$1")
      // Convert bullet points to proper format
      .replace(/^\s*•\s*/gm, "• ")
      .replace(/^\s*\*\s*/gm, "• ")
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, "\n\n")
      .trim()
  );
};

// Helper function to parse sections from analysis text
const parseAnalysisSections = (text: string) => {
  const sections: { title: string; content: string[] }[] = [];
  const lines = text.split("\n");
  let currentSection = { title: "General Analysis", content: [] as string[] };

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if this is a section header (ends with colon and is followed by content)
    if (trimmedLine.endsWith(":") && trimmedLine.length < 50) {
      // Save previous section if it has content
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      // Start new section
      currentSection = {
        title: trimmedLine.slice(0, -1), // Remove the colon
        content: [],
      };
    } else if (trimmedLine) {
      // Add content to current section
      currentSection.content.push(trimmedLine);
    }
  }

  // Add the last section
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
};

export const AiAnalysisDisplay: React.FC<IAiAnalysisDisplayProps> = ({
  result,
}) => {
  if (!result) return null;

  const analysisText =
    result.analysisResult?.analysis || result.analysisResult || "";
  const formattedText = formatAnalysisText(analysisText);
  const sections = parseAnalysisSections(formattedText);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case "image_analysis":
        return <Target className="h-4 w-4" />;
      case "video_analysis":
        return <Brain className="h-4 w-4" />;
      case "audio_analysis":
        return <Brain className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getAnalysisTypeIcon(result.analysisType)}
              <div>
                <CardTitle className="text-lg">AI Analysis Results</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Evidence #
                  {result.evidenceId?.toString().slice(-6) || "Unknown"} •{" "}
                  {result.analysisType?.replace("_", " ").toUpperCase()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {((result.confidenceScore || 0) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Confidence Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              {getStatusIcon(result.status)}
              <div>
                <p className="font-medium">Status</p>
                <Badge
                  variant="outline"
                  className={
                    result.status === "completed"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : result.status === "processing"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }
                >
                  {result.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="font-medium">Processing Time</p>
              <p className="text-muted-foreground">
                {result.processingTime
                  ? `${(result.processingTime / 1000).toFixed(1)}s`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="font-medium">Tokens Used</p>
              <p className="text-muted-foreground">
                {result.tokensUsed?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">
                {result.createdAt
                  ? new Date(result.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Analysis Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.content.map((line, lineIndex) => {
                    // Check if this is a bullet point
                    if (line.startsWith("• ")) {
                      return (
                        <div
                          key={lineIndex}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {line.substring(2)}
                          </span>
                        </div>
                      );
                    }
                    // Check if this is a numbered list item
                    if (/^\d+\.\s/.test(line)) {
                      return (
                        <div
                          key={lineIndex}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-blue-500 mt-1 font-medium">
                            {line.match(/^\d+/)?.[0]}.
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {line.replace(/^\d+\.\s/, "")}
                          </span>
                        </div>
                      );
                    }
                    // Regular paragraph
                    return (
                      <p
                        key={lineIndex}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
                {index < sections.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300">
                {formattedText || "No analysis content available."}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Objects */}
      {result.detectedObjects && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Detected Objects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicles */}
              {result.detectedObjects.vehicles &&
                Array.isArray(result.detectedObjects.vehicles) &&
                result.detectedObjects.vehicles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Car className="h-4 w-4" />
                      <span>
                        Vehicles ({result.detectedObjects.vehicles.length})
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {result.detectedObjects.vehicles.map(
                        (vehicle: any, index: number) => (
                          <div key={index} className="bg-muted p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {vehicle.type || "Unknown Vehicle"}
                                </p>
                                {vehicle.color && (
                                  <p className="text-sm text-muted-foreground">
                                    Color: {vehicle.color}
                                  </p>
                                )}
                                {vehicle.position && (
                                  <p className="text-sm text-muted-foreground">
                                    Position: {vehicle.position}
                                  </p>
                                )}
                                {vehicle.licensePlate && (
                                  <p className="text-sm text-muted-foreground">
                                    Plate: {vehicle.licensePlate}
                                  </p>
                                )}
                                {vehicle.estimatedSpeed && (
                                  <p className="text-sm text-muted-foreground">
                                    Speed: {vehicle.estimatedSpeed}
                                  </p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {((vehicle.confidence || 0) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            {vehicle.damage && vehicle.damage.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-red-600">
                                  Damage:
                                </p>
                                <ul className="text-sm text-muted-foreground">
                                  {vehicle.damage.map(
                                    (damage: string, damageIndex: number) => (
                                      <li key={damageIndex}>• {damage}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Persons */}
              {result.detectedObjects.persons &&
                Array.isArray(result.detectedObjects.persons) &&
                result.detectedObjects.persons.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>
                        Persons ({result.detectedObjects.persons.length})
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {result.detectedObjects.persons.map(
                        (person: any, index: number) => (
                          <div key={index} className="bg-muted p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Person {index + 1}
                                </p>
                                {person.position && (
                                  <p className="text-sm text-muted-foreground">
                                    Position: {person.position}
                                  </p>
                                )}
                                {person.location && (
                                  <p className="text-sm text-muted-foreground">
                                    Location: {person.location}
                                  </p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {((person.confidence || 0) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            {person.apparentInjuries &&
                              person.apparentInjuries.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-red-600">
                                    Apparent Injuries:
                                  </p>
                                  <ul className="text-sm text-muted-foreground">
                                    {person.apparentInjuries.map(
                                      (injury: string, injuryIndex: number) => (
                                        <li key={injuryIndex}>• {injury}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Road Signs */}
              {result.detectedObjects.roadSigns &&
                Array.isArray(result.detectedObjects.roadSigns) &&
                result.detectedObjects.roadSigns.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Road Signs ({result.detectedObjects.roadSigns.length})
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {result.detectedObjects.roadSigns.map(
                        (sign: any, index: number) => (
                          <div key={index} className="bg-muted p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {sign.type || "Unknown Sign"}
                                </p>
                                {sign.text && (
                                  <p className="text-sm text-muted-foreground">
                                    Text: {sign.text}
                                  </p>
                                )}
                                {sign.position && (
                                  <p className="text-sm text-muted-foreground">
                                    Position: {sign.position}
                                  </p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {((sign.confidence || 0) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scene Analysis */}
      {result.sceneAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Scene Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sceneAnalysis.weatherConditions && (
                <div>
                  <h4 className="font-medium mb-2">Weather Conditions</h4>
                  <div className="space-y-1">
                    {result.sceneAnalysis.weatherConditions.map(
                      (condition: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="mr-1 mb-1"
                        >
                          {condition}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
              {result.sceneAnalysis.lightingConditions && (
                <div>
                  <h4 className="font-medium mb-2">Lighting Conditions</h4>
                  <p className="text-muted-foreground">
                    {result.sceneAnalysis.lightingConditions}
                  </p>
                </div>
              )}
              {result.sceneAnalysis.roadType && (
                <div>
                  <h4 className="font-medium mb-2">Road Type</h4>
                  <p className="text-muted-foreground">
                    {result.sceneAnalysis.roadType}
                  </p>
                </div>
              )}
              {result.sceneAnalysis.trafficFlow && (
                <div>
                  <h4 className="font-medium mb-2">Traffic Flow</h4>
                  <p className="text-muted-foreground">
                    {result.sceneAnalysis.trafficFlow}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.investigationPriority && (
                <div>
                  <h4 className="font-medium mb-2">Investigation Priority</h4>
                  <Badge
                    variant={
                      result.recommendations.investigationPriority === "high"
                        ? "destructive"
                        : result.recommendations.investigationPriority ===
                          "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {result.recommendations.investigationPriority.toUpperCase()}
                  </Badge>
                </div>
              )}
              {result.recommendations.additionalEvidenceNeeded &&
                Array.isArray(
                  result.recommendations.additionalEvidenceNeeded
                ) && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Additional Evidence Needed
                    </h4>
                    <ul className="space-y-1">
                      {result.recommendations.additionalEvidenceNeeded.map(
                        (evidence: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-muted-foreground">
                              {evidence}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {result.recommendations.expertConsultation &&
                Array.isArray(result.recommendations.expertConsultation) && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Expert Consultation Required
                    </h4>
                    <ul className="space-y-1">
                      {result.recommendations.expertConsultation.map(
                        (expert: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-muted-foreground">
                              {expert}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
