"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { X, Plus, MapPin, User, Car } from "lucide-react";
import type { EvidenceType } from "./evidence-type-selector";

interface EvidenceMetadata {
  title: string;
  description: string;
  tags: string[];
  location: string;
  timestamp: string;
  relatedVehicles: string[];
  relatedPersons: string[];
  priority: "low" | "medium" | "high" | "critical";
  confidential: boolean;
  chainOfCustody: string;
  collectedBy: string;
}

interface EvidenceMetadataFormProps {
  evidenceType: EvidenceType;
  metadata: EvidenceMetadata;
  onMetadataChange: (metadata: EvidenceMetadata) => void;
  incidentId?: string;
}

export function EvidenceMetadataForm({
  evidenceType,
  metadata,
  onMetadataChange,
  incidentId,
}: EvidenceMetadataFormProps) {
  const [newTag, setNewTag] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [newPerson, setNewPerson] = useState("");

  const updateMetadata = (field: keyof EvidenceMetadata, value: any) => {
    onMetadataChange({ ...metadata, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      updateMetadata("tags", [...metadata.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateMetadata(
      "tags",
      metadata.tags.filter((t) => t !== tag)
    );
  };

  const addVehicle = () => {
    if (
      newVehicle.trim() &&
      !metadata.relatedVehicles.includes(newVehicle.trim())
    ) {
      updateMetadata("relatedVehicles", [
        ...metadata.relatedVehicles,
        newVehicle.trim(),
      ]);
      setNewVehicle("");
    }
  };

  const removeVehicle = (vehicle: string) => {
    updateMetadata(
      "relatedVehicles",
      metadata.relatedVehicles.filter((v) => v !== vehicle)
    );
  };

  const addPerson = () => {
    if (
      newPerson.trim() &&
      !metadata.relatedPersons.includes(newPerson.trim())
    ) {
      updateMetadata("relatedPersons", [
        ...metadata.relatedPersons,
        newPerson.trim(),
      ]);
      setNewPerson("");
    }
  };

  const removePerson = (person: string) => {
    updateMetadata(
      "relatedPersons",
      metadata.relatedPersons.filter((p) => p !== person)
    );
  };

  const getEvidenceTypeTitle = (type: EvidenceType) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Evidence Details</span>
          <Badge variant="outline">{getEvidenceTypeTitle(evidenceType)}</Badge>
        </CardTitle>
        <CardDescription>
          Provide detailed information about this evidence for proper
          documentation and processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Evidence Title *</Label>
              <Input
                id="title"
                placeholder={`Enter ${evidenceType} title...`}
                value={metadata.title}
                onChange={(e) => updateMetadata("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident-id">Incident ID</Label>
              <Input
                id="incident-id"
                placeholder="e.g., 2023-047"
                value={incidentId || ""}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={`Describe the ${evidenceType} and its relevance to the incident...`}
              value={metadata.description}
              onChange={(e) => updateMetadata("description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <Separator />

        {/* Location and Time */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Location & Time Information</span>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Collection Location</Label>
              <Input
                id="location"
                placeholder="Where was this evidence collected?"
                value={metadata.location}
                onChange={(e) => updateMetadata("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timestamp">Collection Time</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={metadata.timestamp}
                onChange={(e) => updateMetadata("timestamp", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tags</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTag()}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Related Items */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Related Items</h4>

          {/* Related Vehicles */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Related Vehicles</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Vehicle ID or License Plate..."
                value={newVehicle}
                onChange={(e) => setNewVehicle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addVehicle()}
              />
              <Button type="button" onClick={addVehicle} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {metadata.relatedVehicles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metadata.relatedVehicles.map((vehicle) => (
                  <Badge
                    key={vehicle}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Car className="h-3 w-3" />
                    <span>{vehicle}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeVehicle(vehicle)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Related Persons */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Related Persons</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Person name or ID..."
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPerson()}
              />
              <Button type="button" onClick={addPerson} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {metadata.relatedPersons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metadata.relatedPersons.map((person) => (
                  <Badge
                    key={person}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <User className="h-3 w-3" />
                    <span>{person}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removePerson(person)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Chain of Custody & Priority */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Chain of Custody & Priority</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="collected-by">Collected By</Label>
              <Input
                id="collected-by"
                placeholder="Officer name or ID..."
                value={metadata.collectedBy}
                onChange={(e) => updateMetadata("collectedBy", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={metadata.priority}
                onValueChange={(value) => updateMetadata("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="critical">Critical Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chain-of-custody">Chain of Custody Notes</Label>
            <Textarea
              id="chain-of-custody"
              placeholder="Document the chain of custody for this evidence..."
              value={metadata.chainOfCustody}
              onChange={(e) => updateMetadata("chainOfCustody", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="confidential"
              checked={metadata.confidential}
              onCheckedChange={(checked) =>
                updateMetadata("confidential", checked)
              }
            />
            <Label htmlFor="confidential" className="text-sm">
              Mark as confidential evidence
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
