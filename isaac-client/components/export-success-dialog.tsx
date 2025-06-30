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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Download, FileText, Share2, Copy, Loader2 } from "lucide-react"

interface ExportSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exportType: string
  fileName: string
  fileSize?: string
  downloadUrl?: string
}

export function ExportSuccessDialog({
  open,
  onOpenChange,
  exportType,
  fileName,
  fileSize = "2.4 MB",
  downloadUrl = "#",
}: ExportSuccessDialogProps) {
  const [progress, setProgress] = useState(100)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      toast({
        title: "Download started",
        description: `${fileName} is being downloaded to your device.`,
      })
    }, 1000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl)
    toast({
      title: "Link copied",
      description: "Download link has been copied to your clipboard.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${exportType} Export`,
        text: `${exportType} has been successfully exported.`,
        url: downloadUrl,
      })
    } else {
      handleCopyLink()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <DialogTitle className="text-xl">Export Successful!</DialogTitle>
          <DialogDescription>
            Your {exportType.toLowerCase()} has been successfully exported and is ready for download.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">{fileSize}</p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    Ready
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Export Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              <Copy className="mr-1 h-3 w-3" />
              Copy Link
            </Button>
            <span>•</span>
            <span>Expires in 7 days</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
