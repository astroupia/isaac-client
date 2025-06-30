"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Brain, Send, Sparkles, MessageSquare, Loader2 } from "lucide-react"

interface AIFollowUpDialogProps {
  trigger?: React.ReactNode
  reportId?: string
  context?: string
}

export function AIFollowUpDialog({ trigger, reportId, context }: AIFollowUpDialogProps) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<Array<{ type: "user" | "ai"; content: string; timestamp: string }>>(
    [],
  )
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    const userMessage = {
      type: "user" as const,
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    }

    setConversation((prev) => [...prev, userMessage])
    setQuestion("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "ai" as const,
        content: generateAIResponse(question, reportId, context),
        timestamp: new Date().toLocaleTimeString(),
      }
      setConversation((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string, reportId?: string, context?: string) => {
    const responses = [
      `Based on the analysis of ${reportId || "this incident"}, I can provide additional insights. The vehicle trajectory data suggests that the primary factor was excessive speed combined with poor visibility conditions. Would you like me to elaborate on any specific aspect?`,
      `Looking at the evidence patterns in ${context || "this case"}, I've identified several key factors that contributed to the incident. The AI confidence level is high (94%) for vehicle detection and moderate (78%) for environmental factors. What specific area would you like me to focus on?`,
      `The reconstruction analysis shows interesting patterns in the collision dynamics. Based on the physical evidence and witness statements, I can provide more detailed information about the sequence of events. Which aspect interests you most?`,
      `I've cross-referenced this incident with similar cases in our database. There are 3 comparable incidents in the past 6 months with similar characteristics. Would you like me to highlight the common factors?`,
      `The AI analysis indicates potential contributing factors that weren't immediately apparent. Environmental conditions, vehicle maintenance records, and driver behavior patterns all play a role. What would you like to explore further?`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const suggestedQuestions = [
    "What were the primary contributing factors?",
    "Can you explain the vehicle trajectory analysis?",
    "Are there similar incidents in the database?",
    "What environmental factors played a role?",
    "How confident is the AI in this analysis?",
    "What additional evidence should I look for?",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <Brain className="mr-2 h-4 w-4" />
            Ask AI Follow-up Questions
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Assistant</span>
            {reportId && (
              <Badge variant="outline" className="ml-2">
                Report #{reportId}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Ask the AI system follow-up questions about this {context || "incident"} for deeper insights and analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {conversation.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">AI Assistant Ready</h3>
                  <p className="text-sm text-muted-foreground">Ask me anything about this incident analysis</p>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 max-h-[300px] pr-4">
              <div className="space-y-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "ai" && <Brain className="h-4 w-4 mt-0.5 text-primary" />}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {conversation.length === 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Suggested Questions:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto p-2"
                      onClick={() => setQuestion(suggestion)}
                    >
                      <MessageSquare className="mr-2 h-3 w-3" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col space-y-2">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Textarea
              placeholder="Ask a follow-up question about this incident..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="submit" disabled={!question.trim() || isLoading} className="self-end">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex justify-between w-full">
            <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
