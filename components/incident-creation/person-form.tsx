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
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Trash2, Plus, User, Phone, Car, Shield, Heart } from "lucide-react";
import { 
  IPerson, 
  ICreatePersonDto, 
  PersonRole, 
  PersonGender, 
  PersonStatus 
} from "@/types/person";

interface PersonFormProps {
  persons: ICreatePersonDto[];
  onChange: (persons: ICreatePersonDto[]) => void;
}

const roleOptions = [
  { value: PersonRole.DRIVER, label: "Driver", icon: "🚗" },
  { value: PersonRole.PASSENGER, label: "Passenger", icon: "👥" },
  { value: PersonRole.PEDESTRIAN, label: "Pedestrian", icon: "🚶" },
  { value: PersonRole.WITNESS, label: "Witness", icon: "👁️" },
  { value: PersonRole.FIRST_RESPONDER, label: "First Responder", icon: "🚑" },
  { value: PersonRole.LAW_ENFORCEMENT, label: "Law Enforcement", icon: "👮" },
  { value: PersonRole.OTHER, label: "Other", icon: "👤" },
];

const genderOptions = [
  { value: PersonGender.MALE, label: "Male" },
  { value: PersonGender.FEMALE, label: "Female" },
  { value: PersonGender.OTHER, label: "Other" },
  { value: PersonGender.PREFER_NOT_TO_SAY, label: "Prefer not to say" },
];

const statusOptions = [
  { value: PersonStatus.INJURED, label: "Injured", color: "bg-red-100 text-red-800" },
  { value: PersonStatus.UNINJURED, label: "Uninjured", color: "bg-green-100 text-green-800" },
  { value: PersonStatus.DECEASED, label: "Deceased", color: "bg-gray-100 text-gray-800" },
  { value: PersonStatus.UNKNOWN, label: "Unknown", color: "bg-yellow-100 text-yellow-800" },
];

export function PersonForm({ persons, onChange }: PersonFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addPerson = () => {
    const newPerson: ICreatePersonDto = {
      firstName: "",
      lastName: "",
      age: 0,
      gender: PersonGender.MALE,
      role: PersonRole.DRIVER,
      status: PersonStatus.UNKNOWN,
      contactNumber: "",
      email: "",
      address: "",
      licenseNumber: "",
      insuranceInfo: "",
      medicalConditions: [],
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
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

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const person = persons[index];
    const updatedEmergencyContact = { 
      ...person.emergencyContact, 
      [field]: value 
    };
    updatePerson(index, "emergencyContact", updatedEmergencyContact);
  };

  const updateMedicalConditions = (index: number, condition: string, checked: boolean) => {
    const person = persons[index];
    const currentConditions = person.medicalConditions || [];
    const updatedConditions = checked 
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition);
    updatePerson(index, "medicalConditions", updatedConditions);
  };

  const removePerson = (index: number) => {
    const updatedPersons = persons.filter((_, i) => i !== index);
    onChange(updatedPersons);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const getRoleIcon = (role: PersonRole) => {
    return roleOptions.find((option) => option.value === role)?.icon || "👤";
  };

  const getRoleColor = (role: PersonRole) => {
    const colors = {
      [PersonRole.DRIVER]: "bg-blue-100 text-blue-800",
      [PersonRole.PASSENGER]: "bg-green-100 text-green-800",
      [PersonRole.PEDESTRIAN]: "bg-orange-100 text-orange-800",
      [PersonRole.WITNESS]: "bg-purple-100 text-purple-800",
      [PersonRole.FIRST_RESPONDER]: "bg-red-100 text-red-800",
      [PersonRole.LAW_ENFORCEMENT]: "bg-indigo-100 text-indigo-800",
      [PersonRole.OTHER]: "bg-gray-100 text-gray-800",
    };
    return colors[role] || colors[PersonRole.OTHER];
  };

  const getStatusColor = (status: PersonStatus) => {
    return statusOptions.find((option) => option.value === status)?.color || "bg-gray-100 text-gray-800";
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
          key={index}
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
                  {roleOptions.find(r => r.value === person.role)?.label}
                </Badge>
                <Badge className={getStatusColor(person.status)}>
                  {statusOptions.find(s => s.value === person.status)?.label}
                </Badge>
                {person.age && (
                  <span>Age {person.age}</span>
                )}
                {person.contactNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {person.contactNumber}
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
              {/* Role and Status Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={person.status}
                    onValueChange={(value) => updatePerson(index, "status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input
                      value={person.firstName || ""}
                      onChange={(e) =>
                        updatePerson(index, "firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
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
                    <Label>Age *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="150"
                      value={person.age || ""}
                      onChange={(e) =>
                        updatePerson(index, "age", Number.parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select
                      value={person.gender}
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
                      value={person.contactNumber || ""}
                      onChange={(e) =>
                        updatePerson(index, "contactNumber", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={person.email || ""}
                      onChange={(e) =>
                        updatePerson(index, "email", e.target.value)
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={person.address || ""}
                    onChange={(e) =>
                      updatePerson(index, "address", e.target.value)
                    }
                    placeholder="Street address"
                  />
                </div>
              </div>

              {/* Driver Information */}
              {(person.role === PersonRole.DRIVER) && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Driver Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>License Number</Label>
                      <Input
                        value={person.licenseNumber || ""}
                        onChange={(e) =>
                          updatePerson(index, "licenseNumber", e.target.value)
                        }
                        placeholder="Driver's license number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Insurance Information</Label>
                      <Input
                        value={person.insuranceInfo || ""}
                        onChange={(e) =>
                          updatePerson(index, "insuranceInfo", e.target.value)
                        }
                        placeholder="Insurance details"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Information */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Medical Information
                </h4>

                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Diabetes", "Heart Condition", "Asthma", "Allergies", "Epilepsy", "None"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${index}-${condition}`}
                          checked={person.medicalConditions?.includes(condition) || false}
                          onCheckedChange={(checked) =>
                            updateMedicalConditions(index, condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={`${index}-${condition}`} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Emergency Contact
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={person.emergencyContact?.name || ""}
                      onChange={(e) =>
                        updateEmergencyContact(index, "name", e.target.value)
                      }
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input
                      value={person.emergencyContact?.relationship || ""}
                      onChange={(e) =>
                        updateEmergencyContact(index, "relationship", e.target.value)
                      }
                      placeholder="e.g., Spouse, Parent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={person.emergencyContact?.phone || ""}
                      onChange={(e) =>
                        updateEmergencyContact(index, "phone", e.target.value)
                      }
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
