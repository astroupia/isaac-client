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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Trash2, Plus, AlertCircle } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  vehicleType: string;
  occupantsCount: number;
  damageDescription?: string;
  damageSeverity?: string;
  damageAreas: string[];
  airbagDeployed?: boolean;
}

interface VehicleFormProps {
  vehicles: Vehicle[];
  onChange: (vehicles: Vehicle[]) => void;
}

const vehicleTypes = [
  { value: "car", label: "Car" },
  { value: "truck", label: "Truck" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "bus", label: "Bus" },
  { value: "van", label: "Van" },
  { value: "suv", label: "SUV" },
  { value: "tractor", label: "Tractor" },
  { value: "other", label: "Other" },
];

const damageSeverityOptions = [
  { value: "none", label: "No Damage" },
  { value: "minor", label: "Minor" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "totaled", label: "Totaled" },
];

const damageAreaOptions = [
  { id: "front", label: "Front" },
  { id: "rear", label: "Rear" },
  { id: "driver-side", label: "Driver Side" },
  { id: "passenger-side", label: "Passenger Side" },
  { id: "roof", label: "Roof" },
  { id: "undercarriage", label: "Undercarriage" },
];

export function VehicleForm({ vehicles, onChange }: VehicleFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      make: "",
      model: "",
      vehicleType: "",
      occupantsCount: 0,
      damageAreas: [],
    };
    onChange([...vehicles, newVehicle]);
    setEditingIndex(vehicles.length);
  };

  const updateVehicle = (index: number, field: string, value: any) => {
    const updatedVehicles = vehicles.map((vehicle, i) =>
      i === index ? { ...vehicle, [field]: value } : vehicle
    );
    onChange(updatedVehicles);
  };

  const removeVehicle = (index: number) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    onChange(updatedVehicles);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleDamageAreaChange = (
    vehicleIndex: number,
    areaId: string,
    checked: boolean
  ) => {
    const vehicle = vehicles[vehicleIndex];
    const newAreas = checked
      ? [...vehicle.damageAreas, areaId]
      : vehicle.damageAreas.filter((area) => area !== areaId);
    updateVehicle(vehicleIndex, "damageAreas", newAreas);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicles Involved ({vehicles.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Add details for each vehicle involved in the incident
          </p>
        </div>
        <Button onClick={addVehicle} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No vehicles added yet. Click &quot;Add Vehicle&quot; to get
              started.
            </p>
          </CardContent>
        </Card>
      )}

      {vehicles.map((vehicle, index) => (
        <Card
          key={vehicle.id}
          className={editingIndex === index ? "ring-2 ring-primary" : ""}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">
                Vehicle {index + 1}
                {vehicle.make && vehicle.model && (
                  <Badge variant="secondary" className="ml-2">
                    {vehicle.make} {vehicle.model}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {vehicle.vehicleType &&
                  `${
                    vehicle.vehicleType.charAt(0).toUpperCase() +
                    vehicle.vehicleType.slice(1)
                  }`}
                {vehicle.licensePlate && ` • ${vehicle.licensePlate}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setEditingIndex(editingIndex === index ? null : index)
                }
              >
                {editingIndex === index ? "Collapse" : "Edit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeVehicle(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {editingIndex === index && (
            <CardContent className="space-y-4">
              {/* Basic Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Make *</Label>
                  <Input
                    value={vehicle.make}
                    onChange={(e) =>
                      updateVehicle(index, "make", e.target.value)
                    }
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model *</Label>
                  <Input
                    value={vehicle.model}
                    onChange={(e) =>
                      updateVehicle(index, "model", e.target.value)
                    }
                    placeholder="e.g., Camry"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={vehicle.year || ""}
                    onChange={(e) =>
                      updateVehicle(
                        index,
                        "year",
                        Number.parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Type *</Label>
                  <Select
                    value={vehicle.vehicleType}
                    onValueChange={(value) =>
                      updateVehicle(index, "vehicleType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    value={vehicle.color || ""}
                    onChange={(e) =>
                      updateVehicle(index, "color", e.target.value)
                    }
                    placeholder="e.g., Blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label>License Plate</Label>
                  <Input
                    value={vehicle.licensePlate || ""}
                    onChange={(e) =>
                      updateVehicle(index, "licensePlate", e.target.value)
                    }
                    placeholder="e.g., ABC-1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VIN</Label>
                  <Input
                    value={vehicle.vin || ""}
                    onChange={(e) =>
                      updateVehicle(index, "vin", e.target.value)
                    }
                    placeholder="Vehicle Identification Number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Occupants *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={vehicle.occupantsCount}
                    onChange={(e) =>
                      updateVehicle(
                        index,
                        "occupantsCount",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Damage Information */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Damage Assessment
                </h4>

                <div className="space-y-2">
                  <Label>Damage Severity</Label>
                  <Select
                    value={vehicle.damageSeverity || ""}
                    onValueChange={(value) =>
                      updateVehicle(index, "damageSeverity", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select damage severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {damageSeverityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Damage Areas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {damageAreaOptions.map((area) => (
                      <div
                        key={area.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`damage-${vehicle.id}-${area.id}`}
                          checked={vehicle.damageAreas.includes(area.id)}
                          onCheckedChange={(checked) =>
                            handleDamageAreaChange(
                              index,
                              area.id,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`damage-${vehicle.id}-${area.id}`}
                          className="text-sm"
                        >
                          {area.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Damage Description</Label>
                  <Textarea
                    value={vehicle.damageDescription || ""}
                    onChange={(e) =>
                      updateVehicle(index, "damageDescription", e.target.value)
                    }
                    placeholder="Describe the damage in detail..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`airbag-${vehicle.id}`}
                    checked={vehicle.airbagDeployed || false}
                    onCheckedChange={(checked) =>
                      updateVehicle(index, "airbagDeployed", checked)
                    }
                  />
                  <Label htmlFor={`airbag-${vehicle.id}`}>
                    Airbag deployed
                  </Label>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
