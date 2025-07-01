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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Trash2, Plus, User, Phone } from "lucide-react";

interface Person {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  role: "driver" | "passenger" | "pedestrian" | "witness" | "other";
  contactInfo?: {
    phoneNumber?: string;
    email?: string;
    address?: string;
  };
  statement?: string;
}

interface PersonFormProps {
  persons: Person[];
  onChange: (persons: Person[]) => void;
}

const roleOptions = [
  { value: "driver", label: "Driver", icon: "🚗" },
  { value: "passenger", label: "Passenger", icon: "👥" },
  { value: "pedestrian", label: "Pedestrian", icon: "🚶" },
  { value: "witness", label: "Witness", icon: "👁️" },
  { value: "other", label: "Other", icon: "👤" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function PersonForm({ persons, onChange }: PersonFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addPerson = () => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      role: "driver",
      contactInfo: {},
    };
    onChange([...persons, newPerson]);
    setEditingIndex(persons.length);
  };

  const updatePerson = (index: number, field: string, value: any) => {
    const updatedPersons = persons.map((person, i) =>
      i === index ? { ...person, [field]: value } : person
    );
    onChange(updatedPersons);
  };

  const updateContactInfo = (index: number, field: string, value: string) => {
    const person = persons[index];
    const updatedContactInfo = { ...person.contactInfo, [field]: value };
    updatePerson(index, "contactInfo", updatedContactInfo);
  };

  const removePerson = (index: number) => {
    const updatedPersons = persons.filter((_, i) => i !== index);
    onChange(updatedPersons);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const getRoleIcon = (role: string) => {
    return roleOptions.find((option) => option.value === role)?.icon || "👤";
  };

  const getRoleColor = (role: string) => {
    const colors = {
      driver: "bg-blue-100 text-blue-800",
      passenger: "bg-green-100 text-green-800",
      pedestrian: "bg-orange-100 text-orange-800",
      witness: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || colors.other;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            People Involved ({persons.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Add details for all individuals involved in or witnessing the
            incident
          </p>
        </div>
        <Button onClick={addPerson} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Person
        </Button>
      </div>

      {persons.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No people added yet. Click &quot;Add Person&quot; to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {persons.map((person, index) => (
        <Card
          key={person.id}
          className={editingIndex === index ? "ring-2 ring-primary" : ""}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-lg">{getRoleIcon(person.role)}</span>
                Person {index + 1}
                {person.firstName && person.lastName && (
                  <Badge variant="secondary" className="ml-2">
                    {person.firstName} {person.lastName}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge className={getRoleColor(person.role)}>
                  {person.role.charAt(0).toUpperCase() + person.role.slice(1)}
                </Badge>
                {person.age && <span>Age {person.age}</span>}
                {person.contactInfo?.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {person.contactInfo.phoneNumber}
                  </span>
                )}
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
                onClick={() => removePerson(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {editingIndex === index && (
            <CardContent className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select
                  value={person.role}
                  onValueChange={(value) => updatePerson(index, "role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <span className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          {role.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={person.firstName || ""}
                      onChange={(e) =>
                        updatePerson(index, "firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={person.lastName || ""}
                      onChange={(e) =>
                        updatePerson(index, "lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      min="0"
                      max="150"
                      value={person.age || ""}
                      onChange={(e) =>
                        updatePerson(
                          index,
                          "age",
                          Number.parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={person.gender || ""}
                      onValueChange={(value) =>
                        updatePerson(index, "gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={person.contactInfo?.phoneNumber || ""}
                      onChange={(e) =>
                        updateContactInfo(index, "phoneNumber", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={person.contactInfo?.email || ""}
                      onChange={(e) =>
                        updateContactInfo(index, "email", e.target.value)
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={person.contactInfo?.address || ""}
                    onChange={(e) =>
                      updateContactInfo(index, "address", e.target.value)
                    }
                    placeholder="Street address"
                  />
                </div>
              </div>

              {/* Statement (for witnesses) */}
              {person.role === "witness" && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Witness Statement</h4>
                  <div className="space-y-2">
                    <Label>Statement</Label>
                    <Textarea
                      value={person.statement || ""}
                      onChange={(e) =>
                        updatePerson(index, "statement", e.target.value)
                      }
                      placeholder="Record the witness statement..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
