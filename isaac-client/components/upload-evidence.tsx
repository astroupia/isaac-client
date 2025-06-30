"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Upload,
  File,
  ImageIcon,
  Video,
  FileText,
  X,
  Check,
  AlertCircle,
  Camera,
  Mic,
  MapPin,
} from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "completed" | "error"
  preview?: string
}

export function UploadEvidence() {
  const [incidentId, setIncidentId] = useState("")
  const [evidenceType, setEvidenceType] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 100) } : f,
          ),
        )
      }, 500)

      // Complete upload after random time
      setTimeout(
        () => {
          clearInterval(interval)
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, progress: 100, status: "completed" } : f)),
          )
        },
        2000 + Math.random() * 3000,
      )
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!incidentId || !evidenceType || uploadedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one file.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Evidence Uploaded Successfully",
      description: `${uploadedFiles.length} file(s) have been uploaded and linked to incident ${incidentId}.`,
    })

    // Reset form
    setIncidentId("")
    setEvidenceType("")
    setDescription("")
    setLocation("")
    setUploadedFiles([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/traffic">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Evidence</h1>
        <p className="text-muted-foreground">
          Upload photos, videos, documents, and other evidence files for incident investigation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evidence Upload</CardTitle>
            <CardDescription>Upload and organize evidence files for incident investigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="incident-id">Incident ID *</Label>
                  <Input
                    id="incident-id"
                    placeholder="e.g., 2023-047"
                    value={incidentId}
                    onChange={(e) => setIncidentId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence-type">Evidence Type *</Label>
                  <Select value={evidenceType} onValueChange={setEvidenceType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photos">Photos</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="audio">Audio Recordings</SelectItem>
                      <SelectItem value="witness-statements">Witness Statements</SelectItem>
                      <SelectItem value="vehicle-data">Vehicle Data</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Source</Label>
                <Input
                  id="location"
                  placeholder="e.g., Traffic Camera #3, Officer Johnson's dashcam"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the evidence and its relevance to the incident..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Upload Files *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Drop files here or click to browse</h3>
                      <p className="text-sm text-muted-foreground">
                        Support for images, videos, documents, and audio files
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Maximum file size: 100MB per file</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt,.mp3,.wav"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              {file.status === "completed" && (
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                  <Check className="mr-1 h-3 w-3" />
                                  Uploaded
                                </Badge>
                              )}
                              {file.status === "error" && (
                                <Badge variant="destructive">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  Error
                                </Badge>
                              )}
                            </div>
                            {file.status === "uploading" && <Progress value={file.progress} className="h-1 mt-1" />}
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Evidence
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common evidence collection tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                Record Video
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mic className="mr-2 h-4 w-4" />
                Record Audio
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Mark Location
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
              <CardDescription>Best practices for evidence collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <p>Ensure all photos are clear and well-lit</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <p>Include multiple angles for vehicle damage</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <p>Record videos in landscape orientation</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <p>Document the scene before moving vehicles</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <p>Include reference objects for scale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Your recently uploaded evidence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Scene_Photo_001.jpg", incident: "2023-046", time: "2 hours ago" },
                { name: "Dashcam_Video.mp4", incident: "2023-045", time: "Yesterday" },
                { name: "Witness_Statement.pdf", incident: "2023-044", time: "2 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Incident {item.incident} • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
