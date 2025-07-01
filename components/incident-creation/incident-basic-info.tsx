"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ModernDateTimePicker } from "@/components/modern-date-time-picker";
import { MapPin, Calendar, AlertTriangle } from "lucide-react";

interface IncidentBasicInfoProps {
  data: {
    incidentLocation: string;
    incidentType: string;
    incidentSeverity: string;
    dateTime: Date;
    numberOfCasualties: number;
    incidentDescription: string;
    weatherConditions: string[];
    roadConditions: string[];
  };
  onChange: (field: string, value: any) => void;
}

const weatherOptions = [
  { id: "clear", label: "Clear" },
  { id: "cloudy", label: "Cloudy" },
  { id: "rain", label: "Rain" },
  { id: "snow", label: "Snow" },
  { id: "fog", label: "Fog" },
  { id: "wind", label: "High Wind" },
  { id: "hail", label: "Hail" },
  { id: "other", label: "Other" },
];

const roadConditionOptions = [
  { id: "dry", label: "Dry" },
  { id: "wet", label: "Wet" },
  { id: "icy", label: "Icy" },
  { id: "snow-covered", label: "Snow Covered" },
  { id: "under-construction", label: "Under Construction" },
  { id: "potholed", label: "Potholed" },
  { id: "debris", label: "Debris Present" },
  { id: "other", label: "Other" },
];

export function IncidentBasicInfo({ data, onChange }: IncidentBasicInfoProps) {
  const handleWeatherChange = (conditionId: string, checked: boolean) => {
    const newConditions = checked
      ? [...data.weatherConditions, conditionId]
      : data.weatherConditions.filter((c) => c !== conditionId);
    onChange("weatherConditions", newConditions);
  };

  const handleRoadConditionChange = (conditionId: string, checked: boolean) => {
    const newConditions = checked
      ? [...data.roadConditions, conditionId]
      : data.roadConditions.filter((c) => c !== conditionId);
    onChange("roadConditions", newConditions);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Basic Incident Information
          </CardTitle>
          <CardDescription>
            Provide the fundamental details about the incident
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date and Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Incident Date & Time
            </Label>
            <ModernDateTimePicker
              value={data.dateTime}
              onChange={(date) => onChange("dateTime", date)}
              placeholder="Select incident date and time"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Incident Location
            </Label>
            <Input
              value={data.incidentLocation}
              onChange={(e) => onChange("incidentLocation", e.target.value)}
              placeholder="Enter detailed location (street address, intersection, mile marker)"
              className="w-full"
            />
          </div>

          {/* Type and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Incident Type</Label>
              <Select
                value={data.incidentType}
                onValueChange={(value) => onChange("incidentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic_collision">
                    Traffic Collision
                  </SelectItem>
                  <SelectItem value="pedestrian_accident">
                    Pedestrian Accident
                  </SelectItem>
                  <SelectItem value="vehicle_fire">Vehicle Fire</SelectItem>
                  <SelectItem value="hazmat_spill">Hazmat Spill</SelectItem>
                  <SelectItem value="weather_related">
                    Weather Related
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Incident Severity</Label>
              <Select
                value={data.incidentSeverity}
                onValueChange={(value) => onChange("incidentSeverity", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">
                    Minor - Property damage only
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderate - Minor injuries
                  </SelectItem>
                  <SelectItem value="major">
                    Major - Serious injuries
                  </SelectItem>
                  <SelectItem value="critical">
                    Critical - Life-threatening
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Casualties */}
          <div className="space-y-2">
            <Label>Number of Casualties</Label>
            <Input
              type="number"
              min="0"
              value={data.numberOfCasualties}
              onChange={(e) =>
                onChange(
                  "numberOfCasualties",
                  Number.parseInt(e.target.value) || 0
                )
              }
              placeholder="Enter number of casualties"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Incident Description</Label>
            <Textarea
              value={data.incidentDescription}
              onChange={(e) => onChange("incidentDescription", e.target.value)}
              placeholder="Provide a detailed description of what happened..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Environmental Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Conditions</CardTitle>
          <CardDescription>
            Select all conditions that were present at the time of the incident
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weather Conditions */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Weather Conditions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {weatherOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`weather-${option.id}`}
                    checked={data.weatherConditions.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleWeatherChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`weather-${option.id}`}
                    className="text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Road Conditions */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Road Conditions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roadConditionOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`road-${option.id}`}
                    checked={data.roadConditions.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleRoadConditionChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`road-${option.id}`}
                    className="text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
