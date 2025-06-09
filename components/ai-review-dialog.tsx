"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle } from "lucide-react"

interface AIReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: "approve" | "flag"
  reportId: string
}

export function AIReviewDialog({ open, onOpenChange, action, reportId }: AIReviewDialogProps) {
  const { toast } = useToast()
  const [feedback, setFeedback] = useState("")
  const [reason, setReason] = useState(action === "approve" ? "accurate" : "inaccurate")

  const handleSubmit = () => {
    if (action === "approve") {
      toast({
        title: "AI Analysis Approved",
        description: `Report #${reportId} analysis has been approved and marked as validated.`,
      })
    } else {
      toast({
        title: "AI Analysis Flagged for Review",
        description: `Report #${reportId} analysis has been flagged for further review.`,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {action === "approve" ? (
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Approve AI Analysis
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-500" />
                Flag AI Analysis for Review
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? "Confirm approval of the AI analysis for this report. This will mark the analysis as validated."
              : "Flag this AI analysis for further review. This will notify the AI team to improve the model."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{action === "approve" ? "Approval Reason" : "Flag Reason"}</h4>
            <RadioGroup value={reason} onValueChange={setReason}>
              {action === "approve" ? (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accurate" id="accurate" />
                    <Label htmlFor="accurate">Analysis is accurate and complete</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thorough" id="thorough" />
                    <Label htmlFor="thorough">Evidence processing is thorough</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recommendations" id="recommendations" />
                    <Label htmlFor="recommendations">Recommendations are appropriate</Label>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inaccurate" id="inaccurate" />
                    <Label htmlFor="inaccurate">Analysis contains inaccuracies</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="incomplete" id="incomplete" />
                    <Label htmlFor="incomplete">Evidence processing is incomplete</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inappropriate" id="inappropriate" />
                    <Label htmlFor="inappropriate">Recommendations are inappropriate</Label>
                  </div>
                </>
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Comments</Label>
            <Textarea
              id="feedback"
              placeholder="Add any additional comments or feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant={action === "approve" ? "default" : "destructive"}>
            {action === "approve" ? "Confirm Approval" : "Confirm Flag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
