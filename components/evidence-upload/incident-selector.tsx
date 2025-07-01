"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Calendar,
  MapPin,
  AlertTriangle,
  Check,
  ChevronsUpDown,
  Plus,
  Filter,
} from "lucide-react";

interface Incident {
  id: string;
  title: string;
  type: string;
  severity: "minor" | "moderate" | "major" | "critical";
  location: string;
  date: string;
  status: "draft" | "submitted" | "in-progress" | "completed";
  description: string;
}

// Mock data - in real app this would come from API
const mockIncidents: Incident[] = [
  {
    id: "2023-047",
    title: "Multi-vehicle collision on I-95",
    type: "traffic_collision",
    severity: "major",
    location: "I-95 Northbound, Mile Marker 45",
    date: "2023-12-15T14:30:00Z",
    status: "in-progress",
    description: "Three-vehicle collision during rush hour traffic",
  },
  {
    id: "2023-046",
    title: "Pedestrian accident downtown",
    type: "pedestrian_accident",
    severity: "critical",
    location: "Main St & 5th Ave",
    date: "2023-12-14T09:15:00Z",
    status: "submitted",
    description: "Pedestrian struck while crossing intersection",
  },
  {
    id: "2023-045",
    title: "Vehicle fire on highway",
    type: "vehicle_fire",
    severity: "moderate",
    location: "Highway 101, Exit 23",
    date: "2023-12-13T16:45:00Z",
    status: "completed",
    description: "Single vehicle fire, no injuries reported",
  },
  {
    id: "2023-044",
    title: "Weather-related incidents",
    type: "weather_related",
    severity: "minor",
    location: "Various locations",
    date: "2023-12-12T08:00:00Z",
    status: "draft",
    description: "Multiple minor incidents due to icy conditions",
  },
  {
    id: "2023-043",
    title: "Hazmat spill cleanup",
    type: "hazmat_spill",
    severity: "major",
    location: "Industrial District, Warehouse Row",
    date: "2023-12-11T11:20:00Z",
    status: "in-progress",
    description: "Chemical spill requiring specialized cleanup",
  },
];

interface IncidentSelectorProps {
  selectedIncidentId: string | null;
  onIncidentSelect: (incidentId: string | null) => void;
}

export function IncidentSelector({
  selectedIncidentId,
  onIncidentSelect,
}: IncidentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const selectedIncident = mockIncidents.find(
    (incident) => incident.id === selectedIncidentId
  );

  const filteredIncidents = mockIncidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "major":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "minor":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "submitted":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatIncidentType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Link to Incident</span>
          <Badge variant="outline" className="text-xs">
            Optional
          </Badge>
        </CardTitle>
        <CardDescription>
          Select an existing incident to link this evidence to, or leave blank
          to upload as standalone evidence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Incident</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto p-3 bg-transparent"
              >
                {selectedIncident ? (
                  <div className="flex items-center space-x-3 text-left">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {selectedIncident.id}
                        </span>
                        <Badge
                          className={getSeverityColor(
                            selectedIncident.severity
                          )}
                        >
                          {selectedIncident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {selectedIncident.title}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Search and select an incident...
                  </span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <div className="p-3 border-b">
                  <div className="flex items-center space-x-2 mb-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <CommandInput
                      placeholder="Search incidents..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={severityFilter}
                      onValueChange={setSeverityFilter}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <CommandList className="max-h-[300px]">
                  <CommandEmpty>No incidents found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => {
                        onIncidentSelect(null);
                        setOpen(false);
                      }}
                      className="p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        <span className="text-muted-foreground">
                          No incident (standalone evidence)
                        </span>
                      </div>
                    </CommandItem>

                    {filteredIncidents.map((incident) => (
                      <CommandItem
                        key={incident.id}
                        value={incident.id}
                        onSelect={() => {
                          onIncidentSelect(incident.id);
                          setOpen(false);
                        }}
                        className="p-3"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <Check
                            className={`h-4 w-4 ${
                              selectedIncidentId === incident.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {incident.id}
                              </span>
                              <Badge
                                className={getSeverityColor(incident.severity)}
                              >
                                {incident.severity}
                              </Badge>
                              <Badge
                                className={getStatusColor(incident.status)}
                              >
                                {incident.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">
                              {incident.title}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{incident.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(incident.date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedIncident && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Selected Incident Details</h4>
              <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{selectedIncident.id}</span>
                    <Badge
                      className={getSeverityColor(selectedIncident.severity)}
                    >
                      {selectedIncident.severity}
                    </Badge>
                    <Badge className={getStatusColor(selectedIncident.status)}>
                      {selectedIncident.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onIncidentSelect(null)}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>

                <p className="text-sm font-medium">{selectedIncident.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedIncident.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedIncident.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(selectedIncident.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{formatIncidentType(selectedIncident.type)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {filteredIncidents.length} incident
            {filteredIncidents.length !== 1 ? "s" : ""} available
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-transparent"
          >
            <Plus className="mr-1 h-3 w-3" />
            Create New
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
