import jsPDF from "jspdf";

export interface AIAnalysisResult {
  evidenceId?: string;
  reportId?: string;
  incidentId?: string;
  analysisType?: string;
  status?: string;
  confidenceScore?: number;
  processingTime?: number;
  tokensUsed?: number;
  createdAt?: string;
  updatedAt?: string;
  analysisResult?: {
    analysis?: string;
  };
  detectedObjects?: {
    vehicles?: Array<{
      type?: string;
      confidence?: number;
      position?: string;
      damage?: string[];
      damageSeverity?: string;
      licensePlate?: string;
      color?: string;
      estimatedSpeed?: string;
    }>;
    persons?: Array<{
      position?: string;
      confidence?: number;
      apparentInjuries?: string[];
      location?: string;
    }>;
    roadSigns?: Array<{
      type?: string;
      confidence?: number;
      text?: string;
      position?: string;
    }>;
  };
  sceneAnalysis?: {
    weatherConditions?: string[];
    lightingConditions?: string;
    roadType?: string;
    trafficFlow?: string;
  };
  recommendations?: {
    investigationPriority?: string;
    additionalEvidenceNeeded?: string[];
    expertConsultation?: string[];
  };
}

export interface PDFReportData {
  reportId: string;
  incidentId?: string;
  title: string;
  generatedAt: Date;
  aiResults: AIAnalysisResult[];
  processingSummary?: {
    totalEvidence: number;
    successfullyProcessed: number;
    overallConfidence: number;
  };
}

export class PDFGenerator {
  private static addHeader(doc: jsPDF, title: string) {
    // ISAAC Logo and branding
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(0, 0, 210, 30, "F");

    // ISAAC Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ISAAC Intelligent System", 20, 20);

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("AI-Powered Traffic Accident Investigation", 20, 28);

    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, 50);

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60);
  }

  private static addFooter(doc: jsPDF, pageNumber: number) {
    const pageHeight = doc.internal.pageSize.height;

    doc.setFillColor(59, 130, 246);
    doc.rect(0, pageHeight - 20, 210, 20, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "ISAAC Intelligent System - Confidential Report",
      20,
      pageHeight - 12
    );
    doc.text(`Page ${pageNumber}`, 180, pageHeight - 12);
  }

  private static addExecutiveSummary(
    doc: jsPDF,
    data: PDFReportData,
    yPosition: number
  ) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", 20, yPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let currentY = yPosition + 10;

    // Report ID
    doc.text(`Report ID: ${data.reportId}`, 20, currentY);
    currentY += 6;

    if (data.incidentId) {
      doc.text(`Incident ID: ${data.incidentId}`, 20, currentY);
      currentY += 6;
    }

    // Processing Summary
    if (data.processingSummary) {
      doc.text(
        `Evidence Processed: ${data.processingSummary.totalEvidence} items`,
        20,
        currentY
      );
      currentY += 6;
      doc.text(
        `Success Rate: ${(
          (data.processingSummary.successfullyProcessed /
            data.processingSummary.totalEvidence) *
          100
        ).toFixed(1)}%`,
        20,
        currentY
      );
      currentY += 6;
      doc.text(
        `Overall AI Confidence: ${(
          data.processingSummary.overallConfidence * 100
        ).toFixed(1)}%`,
        20,
        currentY
      );
      currentY += 6;
    }

    return currentY + 10;
  }

  private static addAnalysisHeader(
    doc: jsPDF,
    result: AIAnalysisResult,
    yPosition: number
  ): number {
    // Analysis header card style
    doc.setFillColor(248, 250, 252); // Light gray background
    doc.rect(15, yPosition - 5, 180, 25, "F");
    doc.setDrawColor(226, 232, 240); // Border color
    doc.rect(15, yPosition - 5, 180, 25, "S");

    // Analysis type and evidence ID
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(
      `AI Analysis Results - ${
        result.analysisType?.replace("_", " ").toUpperCase() || "UNKNOWN"
      }`,
      20,
      yPosition
    );

    // Evidence ID
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Evidence #${result.evidenceId?.toString().slice(-6) || "Unknown"}`,
      20,
      yPosition + 6
    );

    // Confidence score (right side)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text(
      `${((result.confidenceScore || 0) * 100).toFixed(1)}%`,
      170,
      yPosition + 8
    );
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Confidence", 165, yPosition + 12);

    // Status and processing info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`Status: ${result.status || "Unknown"}`, 20, yPosition + 15);

    if (result.processingTime) {
      doc.text(
        `Processing Time: ${(result.processingTime / 1000).toFixed(1)}s`,
        80,
        yPosition + 15
      );
    }

    if (result.tokensUsed) {
      doc.text(
        `Tokens: ${result.tokensUsed.toLocaleString()}`,
        140,
        yPosition + 15
      );
    }

    return yPosition + 30;
  }

  private static addAnalysisContent(
    doc: jsPDF,
    result: AIAnalysisResult,
    yPosition: number
  ): number {
    let currentY = yPosition;

    // Analysis content
    const analysisText =
      result.analysisResult?.analysis || result.analysisResult || "";
    if (analysisText) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Analysis Results", 20, currentY);
      currentY += 8;

      // Format and add analysis text
      const formattedText = this.formatAnalysisText(analysisText as string);
      const lines = doc.splitTextToSize(formattedText, 170);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);

      lines.forEach((line: string) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 40;
          this.addFooter(doc, doc.getCurrentPageInfo().pageNumber);
        }

        // Handle bullet points
        if (line.startsWith("• ")) {
          doc.text("•", 20, currentY);
          doc.text(line.substring(2), 25, currentY);
        } else if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.+)/);
          if (match) {
            doc.setFont("helvetica", "bold");
            doc.text(`${match[1]}.`, 20, currentY);
            doc.setFont("helvetica", "normal");
            doc.text(match[2], 30, currentY);
          } else {
            doc.text(line, 20, currentY);
          }
        } else {
          doc.text(line, 20, currentY);
        }
        currentY += 5;
      });

      currentY += 10;
    }

    return currentY;
  }

  private static addDetectedObjects(
    doc: jsPDF,
    result: AIAnalysisResult,
    yPosition: number
  ): number {
    if (!result.detectedObjects) return yPosition;

    let currentY = yPosition;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Detected Objects", 20, currentY);
    currentY += 10;

    // Vehicles
    if (
      result.detectedObjects.vehicles &&
      result.detectedObjects.vehicles.length > 0
    ) {
      currentY = this.addVehicleSection(
        doc,
        result.detectedObjects.vehicles,
        currentY
      );
    }

    // Persons
    if (
      result.detectedObjects.persons &&
      result.detectedObjects.persons.length > 0
    ) {
      currentY = this.addPersonSection(
        doc,
        result.detectedObjects.persons,
        currentY
      );
    }

    // Road Signs
    if (
      result.detectedObjects.roadSigns &&
      result.detectedObjects.roadSigns.length > 0
    ) {
      currentY = this.addRoadSignSection(
        doc,
        result.detectedObjects.roadSigns,
        currentY
      );
    }

    return currentY;
  }

  private static addVehicleSection(
    doc: jsPDF,
    vehicles: any[],
    yPosition: number
  ): number {
    let currentY = yPosition;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Vehicles (${vehicles.length})`, 25, currentY);
    currentY += 6;

    vehicles.forEach((vehicle, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 40;
        this.addFooter(doc, doc.getCurrentPageInfo().pageNumber);
      }

      // Vehicle box
      doc.setFillColor(248, 250, 252);
      doc.rect(25, currentY - 2, 160, 25, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(25, currentY - 2, 160, 25, "S");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(vehicle.type || "Unknown Vehicle", 30, currentY + 3);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);

      let detailY = currentY + 8;
      if (vehicle.color) {
        doc.text(`Color: ${vehicle.color}`, 30, detailY);
        detailY += 4;
      }
      if (vehicle.position) {
        doc.text(`Position: ${vehicle.position}`, 30, detailY);
        detailY += 4;
      }
      if (vehicle.licensePlate) {
        doc.text(`Plate: ${vehicle.licensePlate}`, 30, detailY);
        detailY += 4;
      }
      if (vehicle.estimatedSpeed) {
        doc.text(`Speed: ${vehicle.estimatedSpeed}`, 30, detailY);
        detailY += 4;
      }

      // Confidence score
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text(
        `${((vehicle.confidence || 0) * 100).toFixed(1)}%`,
        170,
        currentY + 8
      );

      // Damage section
      if (vehicle.damage && vehicle.damage.length > 0) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(220, 38, 38);
        doc.text("Damage:", 30, detailY);
        detailY += 4;

        doc.setFont("helvetica", "normal");
        vehicle.damage.forEach((damage: string) => {
          doc.text(`• ${damage}`, 35, detailY);
          detailY += 4;
        });
      }

      currentY += 30;
    });

    return currentY + 5;
  }

  private static addPersonSection(
    doc: jsPDF,
    persons: any[],
    yPosition: number
  ): number {
    let currentY = yPosition;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Persons (${persons.length})`, 25, currentY);
    currentY += 6;

    persons.forEach((person, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 40;
        this.addFooter(doc, doc.getCurrentPageInfo().pageNumber);
      }

      // Person box
      doc.setFillColor(248, 250, 252);
      doc.rect(25, currentY - 2, 160, 20, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(25, currentY - 2, 160, 20, "S");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`Person ${index + 1}`, 30, currentY + 3);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);

      let detailY = currentY + 8;
      if (person.position) {
        doc.text(`Position: ${person.position}`, 30, detailY);
        detailY += 4;
      }
      if (person.location) {
        doc.text(`Location: ${person.location}`, 30, detailY);
        detailY += 4;
      }

      // Confidence score
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text(
        `${((person.confidence || 0) * 100).toFixed(1)}%`,
        170,
        currentY + 8
      );

      // Injuries section
      if (person.apparentInjuries && person.apparentInjuries.length > 0) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(220, 38, 38);
        doc.text("Injuries:", 30, detailY);
        detailY += 4;

        doc.setFont("helvetica", "normal");
        person.apparentInjuries.forEach((injury: string) => {
          doc.text(`• ${injury}`, 35, detailY);
          detailY += 4;
        });
      }

      currentY += 25;
    });

    return currentY + 5;
  }

  private static addRoadSignSection(
    doc: jsPDF,
    roadSigns: any[],
    yPosition: number
  ): number {
    let currentY = yPosition;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Road Signs (${roadSigns.length})`, 25, currentY);
    currentY += 6;

    roadSigns.forEach((sign, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 40;
        this.addFooter(doc, doc.getCurrentPageInfo().pageNumber);
      }

      // Sign box
      doc.setFillColor(248, 250, 252);
      doc.rect(25, currentY - 2, 160, 15, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(25, currentY - 2, 160, 15, "S");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(sign.type || "Unknown Sign", 30, currentY + 3);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);

      if (sign.text) {
        doc.text(`Text: ${sign.text}`, 30, currentY + 8);
      }
      if (sign.position) {
        doc.text(`Position: ${sign.position}`, 30, currentY + 12);
      }

      // Confidence score
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text(
        `${((sign.confidence || 0) * 100).toFixed(1)}%`,
        170,
        currentY + 8
      );

      currentY += 20;
    });

    return currentY + 5;
  }

  private static addSceneAnalysis(
    doc: jsPDF,
    result: AIAnalysisResult,
    yPosition: number
  ): number {
    if (!result.sceneAnalysis) return yPosition;

    let currentY = yPosition;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Scene Analysis", 20, currentY);
    currentY += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);

    if (result.sceneAnalysis.weatherConditions) {
      doc.setFont("helvetica", "bold");
      doc.text("Weather Conditions:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      result.sceneAnalysis.weatherConditions.forEach((condition: string) => {
        doc.text(`• ${condition}`, 30, currentY);
        currentY += 4;
      });
      currentY += 2;
    }

    if (result.sceneAnalysis.lightingConditions) {
      doc.setFont("helvetica", "bold");
      doc.text("Lighting Conditions:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.text(result.sceneAnalysis.lightingConditions, 30, currentY);
      currentY += 8;
    }

    if (result.sceneAnalysis.roadType) {
      doc.setFont("helvetica", "bold");
      doc.text("Road Type:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.text(result.sceneAnalysis.roadType, 30, currentY);
      currentY += 8;
    }

    if (result.sceneAnalysis.trafficFlow) {
      doc.setFont("helvetica", "bold");
      doc.text("Traffic Flow:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.text(result.sceneAnalysis.trafficFlow, 30, currentY);
      currentY += 8;
    }

    return currentY;
  }

  private static addRecommendations(
    doc: jsPDF,
    result: AIAnalysisResult,
    yPosition: number
  ): number {
    if (!result.recommendations) return yPosition;

    let currentY = yPosition;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Recommendations", 20, currentY);
    currentY += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);

    if (result.recommendations.investigationPriority) {
      doc.setFont("helvetica", "bold");
      doc.text("Investigation Priority:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");

      // Priority badge style
      const priority = result.recommendations.investigationPriority;
      const priorityColor =
        priority === "high"
          ? [220, 38, 38]
          : priority === "medium"
          ? [245, 158, 11]
          : [34, 197, 94];

      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.rect(30, currentY - 2, 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(priority.toUpperCase(), 35, currentY + 3);
      currentY += 12;
    }

    if (
      result.recommendations.additionalEvidenceNeeded &&
      result.recommendations.additionalEvidenceNeeded.length > 0
    ) {
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Additional Evidence Needed:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      result.recommendations.additionalEvidenceNeeded.forEach(
        (evidence: string) => {
          doc.text(`• ${evidence}`, 30, currentY);
          currentY += 4;
        }
      );
      currentY += 2;
    }

    if (
      result.recommendations.expertConsultation &&
      result.recommendations.expertConsultation.length > 0
    ) {
      doc.setFont("helvetica", "bold");
      doc.text("Expert Consultation Required:", 25, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      result.recommendations.expertConsultation.forEach((expert: string) => {
        doc.text(`• ${expert}`, 30, currentY);
        currentY += 4;
      });
      currentY += 2;
    }

    return currentY;
  }

  private static formatAnalysisText(text: string): string {
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
  }

  static async generateAIReportPDF(data: PDFReportData): Promise<Blob> {
    const doc = new jsPDF("p", "mm", "a4");

    // Add header
    this.addHeader(doc, data.title);

    // Add footer to first page
    this.addFooter(doc, 1);

    let currentY = 80;

    // Executive Summary
    currentY = this.addExecutiveSummary(doc, data, currentY);

    // Process each AI result
    data.aiResults.forEach((result, index) => {
      // Check if we need a new page
      if (currentY > 60) {
        doc.addPage();
        currentY = 40;
        this.addFooter(doc, doc.getCurrentPageInfo().pageNumber);
      }

      // Analysis Header
      currentY = this.addAnalysisHeader(doc, result, currentY);

      // Analysis Content
      currentY = this.addAnalysisContent(doc, result, currentY);

      // Detected Objects
      currentY = this.addDetectedObjects(doc, result, currentY);

      // Scene Analysis
      currentY = this.addSceneAnalysis(doc, result, currentY);

      // Recommendations
      currentY = this.addRecommendations(doc, result, currentY);

      // Add spacing between results
      currentY += 15;
    });

    // Generate PDF blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  }

  static async downloadPDF(data: PDFReportData, filename?: string) {
    try {
      const pdfBlob = await this.generateAIReportPDF(data);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        filename ||
        `ISAAC_AI_Analysis_Report_${data.reportId}_${
          new Date().toISOString().split("T")[0]
        }.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }
}
