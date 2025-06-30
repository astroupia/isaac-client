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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, FileText, MapPin, User } from "lucide-react"

interface UnassignedCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseId: string
  caseTitle: string
}

export function UnassignedCaseDialog({ open, onOpenChange, caseId, caseTitle }: UnassignedCaseDialogProps) {
  const { toast } = useToast()
  const [selectedInvestigator, setSelectedInvestigator] = useState<string | null>(null)

  const investigators = [
    {
      id: "inv-001",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      cases: 3,
      specialization: "Traffic Analysis",
      availability: "High",
    },
    {
      id: "inv-002",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      cases: 5,
      specialization: "Vehicle Forensics",
      availability: "Medium",
    },
    {
      id: "inv-003",
      name: "Aisha Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      cases: 2,
      specialization: "Witness Interviews",
      availability: "High",
    },
    {
      id: "inv-004",
      name: "Robert Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      cases: 6,
      specialization: "Evidence Collection",
      availability: "Low",
    },
  ]

  const handleAssign = () => {
    if (!selectedInvestigator) return

    const investigator = investigators.find((inv) => inv.id === selectedInvestigator)

    toast({
      title: "Case Assigned Successfully",
      description: `Case #${caseId} has been assigned to ${investigator?.name}.`,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Unassigned Case</DialogTitle>
          <DialogDescription>Review case details and assign to an available investigator.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Case Details</TabsTrigger>
            <TabsTrigger value="investigators">Available Investigators</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Case #{caseId}</h3>
                  <p className="text-sm text-muted-foreground">{caseTitle}</p>
                </div>
                <Badge>Unassigned</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reported: April 24, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Time: 08:45 AM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Location: Highway 280, Bridge Section</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Evidence Items: 6</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Case Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Multi-vehicle collision involving 3 vehicles on Highway 280 bridge section. Occurred during morning
                  rush hour with moderate fog conditions. Initial reports indicate following distance may have been a
                  factor. No serious injuries reported, but significant property damage.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">AI Preliminary Assessment</h4>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Complexity:</span> Medium
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Estimated Time:</span> 3-5 days
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Recommended Specialization:</span> Traffic Analysis
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investigators" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {investigators.map((investigator) => (
                  <div
                    key={investigator.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedInvestigator === investigator.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedInvestigator(investigator.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={investigator.avatar || "/placeholder.svg"} alt={investigator.name} />
                          <AvatarFallback>{investigator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{investigator.name}</p>
                          <p className="text-xs text-muted-foreground">{investigator.specialization}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          investigator.availability === "High"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : investigator.availability === "Medium"
                              ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                              : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                        }
                      >
                        {investigator.availability} Availability
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Current Caseload: {investigator.cases} cases
                        </span>
                      </div>
                      {investigator.specialization === "Traffic Analysis" && (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                          Recommended Match
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedInvestigator}>
            Assign Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
