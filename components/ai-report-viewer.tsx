"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Brain,
  Car,
  Check,
  Download,
  FileText,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Loader2,
  Send,
} from "lucide-react";
import Link from "next/link";
import {
  getReportResults,
  startConversation,
  sendMessage,
  getReportConversations,
  enhanceReport,
} from "@/lib/api/aiProcessing";
import { IAiAnalysisResult, IAiConversation } from "@/types/ai_processing";
import { AiAnalysisDisplay } from "./ai-analysis-display";
import { AiChatMessage } from "./ai-chat-message";
import { PDFGenerator, PDFReportData } from "@/lib/pdf-generator";

interface AIReportViewerProps {
  id: string;
}

export function AIReportViewer({ id }: AIReportViewerProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [aiResults, setAiResults] = useState<IAiAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<IAiConversation | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Predefined enhancement prompts
  const predefinedPrompts = {
    vehicleDamage:
      "Focus specifically on vehicle damage assessment and provide detailed cost estimates for repairs.",
    weatherImpact:
      "Analyze the impact of weather conditions on the accident and how it affected vehicle handling.",
    casualtyAssessment:
      "Provide detailed casualty assessment including injury severity and medical implications.",
    sceneReconstruction:
      "Reconstruct the sequence of events leading to the accident with timeline analysis.",
    trafficFlow:
      "Analyze the traffic flow and road conditions at the time of the incident.",
    humanFactors:
      "Assess the role of human factors in this incident including driver behavior and decision making.",
  };
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setUserLoading(true);
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          console.log("🔍 Current User Data:", userData);
          setCurrentUser(userData);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch AI analysis results on component mount
  useEffect(() => {
    const fetchAIResults = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching AI analysis results for report:", id);
        const results = await getReportResults(id);
        console.log("✅ AI analysis results fetched:", results);
        setAiResults(results);
      } catch (error: any) {
        console.error("❌ Failed to fetch AI analysis results:", error);
        setError(error.message || "Failed to load AI analysis results");
        toast({
          title: "Error Loading Results",
          description: "Failed to load the AI analysis results.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAIResults();
  }, [id, toast]);

  // Start AI conversation
  const handleStartConversation = async () => {
    if (!conversation && currentUser?._id) {
      setConversationLoading(true);
      try {
        console.log("🔍 Starting AI conversation for report:", id);
        const newConversation = await startConversation(currentUser._id, {
          reportId: id,
          title: `AI Analysis Discussion - Report ${id}`,
          initialMessage:
            "What are the key findings from the AI analysis of this incident?",
        });
        console.log("✅ AI conversation started:", newConversation);

        // Handle the nested API response structure
        let conversationData: any;
        if (newConversation && typeof newConversation === "object") {
          if ("success" in newConversation && "data" in newConversation) {
            // API returned { success: true, data: {...}, message: "..." }
            conversationData = (newConversation as any).data;
            console.log(
              "📊 Extracted conversation data from nested response:",
              conversationData
            );
          } else {
            // API returned conversation directly
            conversationData = newConversation;
          }
        }

        if (!conversationData) {
          throw new Error("Invalid conversation response structure");
        }

        // Ensure the conversation has the expected structure
        const conversationWithDefaults: IAiConversation = {
          ...conversationData,
          messages: conversationData.messages || [],
        };
        setConversation(conversationWithDefaults);
        toast({
          title: "AI Conversation Started",
          description:
            "You can now ask follow-up questions about the analysis.",
        });
      } catch (error: any) {
        console.error("❌ Failed to start AI conversation:", error);
        toast({
          title: "Conversation Failed",
          description: error.message || "Failed to start AI conversation",
          variant: "destructive",
        });
      } finally {
        setConversationLoading(false);
      }
    }
  };

  // Send message in conversation
  const handleSendMessage = async () => {
    if (!message.trim() || !conversation || !currentUser?._id) return;

    setSendingMessage(true);
    try {
      console.log("🔍 Sending message in conversation:", message);
      // Use the conversation ID from the conversation object
      const conversationId =
        (conversation as any)._id ||
        (conversation as any).id ||
        conversation.reportId?.toString();

      console.log("🔍 Conversation object:", conversation);
      console.log("🔍 Extracted conversation ID:", conversationId);

      if (!conversationId) {
        throw new Error("No conversation ID available");
      }

      const response = await sendMessage(conversationId, currentUser._id, {
        message: message.trim(),
      });
      console.log("✅ Message sent successfully:", response);

      // Handle nested response structure for sendMessage
      let messageResponse: any;
      if (response && typeof response === "object") {
        if ("success" in response && "data" in response) {
          messageResponse = (response as any).data;
        } else {
          messageResponse = response;
        }
      }

      console.log("📊 Message response data:", messageResponse);

      // Update conversation with new messages
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [
            ...(prev.messages || []),
            messageResponse?.userMessage,
            messageResponse?.aiResponse,
          ].filter(Boolean), // Remove any undefined messages
        };
      });

      setMessage("");
      toast({
        title: "Message Sent",
        description: "Your question has been sent to the AI assistant.",
      });
    } catch (error: any) {
      console.error("❌ Failed to send message:", error);
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const [feedbackSubmitted, setFeedbackSubmitted] = useState<
    "positive" | "negative" | null
  >(null);

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedbackSubmitted(type);
    toast({
      title: "Feedback submitted",
      description: `Thank you for your ${type} feedback on this AI analysis.`,
    });
  };

  const handleDownloadReport = async () => {
    try {
      // Prepare PDF data - convert ObjectId types to strings
      const pdfData: PDFReportData = {
        reportId: id,
        title: `AI Analysis Report #${id}`,
        generatedAt: new Date(),
        aiResults: aiResults.map((result) => ({
          ...result,
          evidenceId: result.evidenceId?.toString(),
          reportId: result.reportId?.toString(),
          incidentId: result.incidentId?.toString(),
          createdAt: result.createdAt
            ? typeof result.createdAt === "string"
              ? result.createdAt
              : result.createdAt instanceof Date
              ? result.createdAt.toISOString()
              : new Date(result.createdAt).toISOString()
            : new Date().toISOString(),
          updatedAt: result.updatedAt
            ? typeof result.updatedAt === "string"
              ? result.updatedAt
              : result.updatedAt instanceof Date
              ? result.updatedAt.toISOString()
              : new Date(result.updatedAt).toISOString()
            : new Date().toISOString(),
        })),
        processingSummary: {
          totalEvidence: aiResults.length,
          successfullyProcessed: aiResults.length,
          overallConfidence:
            aiResults.length > 0
              ? aiResults.reduce(
                  (sum, result) => sum + (result.confidenceScore || 0),
                  0
                ) / aiResults.length
              : 0,
        },
      };

      // Show loading toast
      toast({
        title: "Generating PDF Report",
        description: "Please wait while we prepare your report...",
      });

      // Generate and download PDF
      await PDFGenerator.downloadPDF(pdfData);

      // Success toast
      toast({
        title: "AI Analysis Report Downloaded",
        description:
          "Your AI analysis report has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Error downloading report:", error);
      toast({
        title: "Download Failed",
        description:
          error.message || "Failed to download the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnhanceReport = async () => {
    if (!enhancePrompt.trim()) {
      toast({
        title: "Enhancement Prompt Required",
        description: "Please enter a custom prompt for the enhancement.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      console.log(
        "🔍 [AI Report Viewer] Enhancing report with custom prompt:",
        enhancePrompt
      );
      console.log("🔍 [AI Report Viewer] Report ID:", id);

      const enhancedResult = await enhanceReport(id, enhancePrompt);
      console.log(
        "✅ [AI Report Viewer] Report enhanced successfully:",
        enhancedResult
      );

      // Refresh the AI results
      console.log("🔄 [AI Report Viewer] Refreshing AI results...");
      const updatedResults = await getReportResults(id);
      console.log("✅ [AI Report Viewer] Updated AI results:", updatedResults);
      setAiResults(updatedResults);

      // Clear the prompt
      setEnhancePrompt("");

      toast({
        title: "Report Enhanced",
        description: "The report has been enhanced with your custom prompt.",
      });
    } catch (error: any) {
      console.error("❌ [AI Report Viewer] Error enhancing report:", error);
      toast({
        title: "Enhancement Failed",
        description: error.message || "Failed to enhance the report.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const quickEnhance = async (promptType: keyof typeof predefinedPrompts) => {
    setIsEnhancing(true);
    try {
      const prompt = predefinedPrompts[promptType];
      console.log("🔍 Quick enhancing report with prompt type:", promptType);
      console.log("📝 Using prompt:", prompt);

      const enhancedResult = await enhanceReport(id, prompt);
      console.log("✅ Quick enhancement completed:", enhancedResult);

      // Refresh the AI results
      const updatedResults = await getReportResults(id);
      setAiResults(updatedResults);

      toast({
        title: "Quick Enhancement Completed",
        description: `Report enhanced with ${promptType
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} analysis.`,
      });
    } catch (error: any) {
      console.error("❌ Quick enhancement failed:", error);
      toast({
        title: "Quick Enhancement Failed",
        description: error.message || "Failed to enhance the report.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const batchEnhance = async (prompts: string[]) => {
    setIsEnhancing(true);
    const results = [];

    try {
      for (const prompt of prompts) {
        try {
          console.log("🔍 Batch enhancing with prompt:", prompt);
          const result = await enhanceReport(id, prompt);
          results.push({ prompt, success: true, result });
          console.log("✅ Batch enhancement success for prompt:", prompt);
        } catch (error) {
          console.error(
            "❌ Batch enhancement failed for prompt:",
            prompt,
            error
          );
          results.push({ prompt, success: false, error });
        }
      }

      // Refresh the AI results after batch enhancement
      const updatedResults = await getReportResults(id);
      setAiResults(updatedResults);

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      toast({
        title: "Batch Enhancement Completed",
        description: `Successfully enhanced ${successCount} out of ${
          prompts.length
        } prompts.${failureCount > 0 ? ` ${failureCount} failed.` : ""}`,
        variant: failureCount > 0 ? "destructive" : "default",
      });

      console.log("📊 Batch enhancement results:", results);
      return results;
    } catch (error: any) {
      console.error("❌ Batch enhancement failed:", error);
      toast({
        title: "Batch Enhancement Failed",
        description: error.message || "Failed to complete batch enhancement.",
        variant: "destructive",
      });
      return results;
    } finally {
      setIsEnhancing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-4 text-muted-foreground">
          Loading AI analysis results...
        </span>
      </div>
    );
  }

  if (error || !aiResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 font-medium mb-4">
          {error || "AI analysis results not found."}
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/investigator/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/investigator">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Analysis Report #{id}
          </h1>
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            {aiResults.length > 0
              ? `${aiResults.length} Analysis Results`
              : "No Results"}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          AI-powered analysis of incident evidence and findings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>
                Comprehensive AI analysis of incident #{id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="analysis">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
                  <TabsTrigger value="conversation">
                    AI Conversation
                  </TabsTrigger>
                  <TabsTrigger value="enhance">Enhance Report</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    {(!aiResults || aiResults.length === 0) && (
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          No AI analysis results found for this report.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Start an AI analysis to get detailed insights about
                          this case.
                        </p>
                      </div>
                    )}
                    {Array.isArray(aiResults) &&
                      aiResults.map((result, index) => (
                        <AiAnalysisDisplay
                          key={result.evidenceId?.toString() || index}
                          result={result}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="conversation" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    {!conversation ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          Start a conversation with AI about this analysis
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Ask follow-up questions and get detailed explanations
                        </p>
                        <Button
                          onClick={handleStartConversation}
                          disabled={conversationLoading || !currentUser?._id}
                          className="mt-4"
                        >
                          {conversationLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Brain className="mr-2 h-4 w-4" />
                          )}
                          {conversationLoading
                            ? "Starting..."
                            : !currentUser?._id
                            ? "Loading User..."
                            : "Start AI Conversation"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {(conversation.messages || [])
                            .filter((msg) => msg.role !== "system")
                            .map((msg, index) => (
                              <AiChatMessage key={index} message={msg} />
                            ))}
                        </div>

                        {/* Suggested prompts */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Suggested questions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "What are the key findings from this analysis?",
                              "Can you explain the damage patterns?",
                              "What environmental factors contributed to this incident?",
                              "What recommendations do you have for prevention?",
                              "How confident is the AI in these results?",
                              "What additional evidence would improve the analysis?",
                            ].map((prompt, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setMessage(prompt)}
                                className="text-xs"
                              >
                                {prompt}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Ask a follow-up question about the analysis..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              !e.shiftKey &&
                              handleSendMessage()
                            }
                            className="flex-1"
                            rows={2}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={
                              !message.trim() ||
                              sendingMessage ||
                              !currentUser?._id
                            }
                            size="sm"
                          >
                            {sendingMessage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="enhance" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="enhance-prompt"
                        className="text-sm font-medium"
                      >
                        Custom Enhancement Prompt
                      </label>
                      <Textarea
                        id="enhance-prompt"
                        placeholder="Enter a custom prompt to enhance the AI analysis. For example: 'Focus specifically on vehicle damage assessment and provide detailed cost estimates for repairs.'"
                        value={enhancePrompt}
                        onChange={(e) => setEnhancePrompt(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide specific instructions to enhance the existing AI
                        analysis with new insights or focus areas.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Quick Enhancement Options:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(predefinedPrompts).map(
                          ([key, prompt]) => (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                quickEnhance(
                                  key as keyof typeof predefinedPrompts
                                )
                              }
                              disabled={isEnhancing}
                              className="text-xs h-auto p-2 text-left"
                            >
                              <div className="flex flex-col items-start">
                                <span className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {prompt.length > 60
                                    ? prompt.substring(0, 60) + "..."
                                    : prompt}
                                </span>
                              </div>
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Or Use Custom Prompt:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Focus specifically on vehicle damage assessment and provide detailed cost estimates for repairs.",
                          "Analyze the environmental conditions and their impact on the incident.",
                          "Provide detailed recommendations for preventing similar incidents.",
                          "Assess the role of human factors in this incident.",
                          "Analyze the traffic flow and road conditions at the time of the incident.",
                          "Provide a detailed timeline reconstruction of the events.",
                        ].map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setEnhancePrompt(prompt)}
                            disabled={isEnhancing}
                            className="text-xs"
                          >
                            {prompt.length > 40
                              ? prompt.substring(0, 40) + "..."
                              : prompt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleEnhanceReport}
                        disabled={!enhancePrompt.trim() || isEnhancing}
                        className="flex-1"
                      >
                        {isEnhancing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Brain className="mr-2 h-4 w-4" />
                        )}
                        {isEnhancing
                          ? "Enhancing Report..."
                          : "Enhance with Custom Prompt"}
                      </Button>
                      <Button
                        onClick={() =>
                          batchEnhance(Object.values(predefinedPrompts))
                        }
                        disabled={isEnhancing}
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        {isEnhancing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Brain className="mr-2 h-4 w-4" />
                        )}
                        {isEnhancing ? "Enhancing..." : "Batch Enhance"}
                      </Button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        How Enhancement Works:
                      </h4>
                      <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                        <li>
                          • Updates existing analysis results with your custom
                          prompt
                        </li>
                        <li>
                          • Re-analyzes evidence using the new focus areas
                        </li>
                        <li>
                          • Generates enhanced insights and recommendations
                        </li>
                        <li>• Maintains all previous analysis data</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={
                    feedbackSubmitted === "positive" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFeedback("positive")}
                  disabled={feedbackSubmitted !== null}
                  className={
                    feedbackSubmitted === "positive"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {feedbackSubmitted === "positive" ? "Thank you!" : "Helpful"}
                </Button>
                <Button
                  variant={
                    feedbackSubmitted === "negative" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFeedback("negative")}
                  disabled={feedbackSubmitted !== null}
                  className={
                    feedbackSubmitted === "negative"
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                  }
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  {feedbackSubmitted === "negative" ? "Noted" : "Not Helpful"}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Actions</CardTitle>
              <CardDescription>Actions for this AI report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href={`/dashboard/investigator/cases/${id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Case
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleStartConversation}
                disabled={conversationLoading || !!conversation}
              >
                {conversationLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-4 w-4" />
                )}
                {conversationLoading
                  ? "Starting..."
                  : conversation
                  ? "Conversation Active"
                  : "Ask AI Follow-up Questions"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download AI Analysis Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>Overview of AI analysis results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Total Results</p>
                  <p className="text-sm font-medium">{aiResults.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Evidence Analyzed
                  </p>
                  <p className="text-sm font-medium">
                    {aiResults.reduce(
                      (total, result) => total + (result.evidenceId ? 1 : 0),
                      0
                    )}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Average Confidence
                  </p>
                  <p className="text-sm font-medium">
                    {aiResults.length > 0
                      ? `${(
                          (aiResults.reduce(
                            (total, result) =>
                              total + (result.confidenceScore || 0),
                            0
                          ) /
                            aiResults.length) *
                          100
                        ).toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-2 bg-green-500/10 rounded-md">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-xs text-green-600 dark:text-green-400">
                  AI analysis completed successfully with {aiResults.length}{" "}
                  results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
