/**
 * ISAAC Platform User Models
 *
 * This file contains all the TypeScript interfaces and types related to users
 * and authentication in the ISAAC platform.
 */

import mongoose, { Schema, Document } from "mongoose";

// ==============================
// User Role Type
// ==============================

export type UserRole = "traffic" | "investigator" | "chief" | "admin";

// ==============================
// User Interface
// ==============================

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  badgeId?: string;
  department?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Traffic Personnel specific fields
  district?: string;
  vehicleId?: string;
  shift?: "morning" | "afternoon" | "night";
  reportsSubmitted?: number;

  // Investigator specific fields
  specialization?: string[];
  currentCaseload?: number;
  maxCaseload?: number;
  completedCases?: number;
  averageResolutionTime?: number; // in days

  // Chief Analyst specific fields
  subordinates?: mongoose.Types.ObjectId[]; // IDs of investigators under supervision
  totalCasesManaged?: number;
  analyticsAccess?: boolean;

  // Admin specific fields
  accessLevel?: number;
  systemPermissions?: string[];

  // Virtual methods
  getDisplayName(): string;
  getFullNameWithRole(): string;
  getInitials(): string;
}

// ==============================
// User Schema
// ==============================

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      required: [true, "User role is required"],
      enum: {
        values: ["traffic", "investigator", "chief", "admin"],
        message: "Role must be traffic, investigator, chief, or admin",
      },
    },
    badgeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    profileImageUrl: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },

    // Traffic Personnel specific fields
    district: {
      type: String,
      trim: true,
    },
    vehicleId: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      enum: {
        values: ["morning", "afternoon", "night"],
        message: "Shift must be morning, afternoon, or night",
      },
    },
    reportsSubmitted: {
      type: Number,
      default: 0,
      min: [0, "Reports submitted cannot be negative"],
    },

    // Investigator specific fields
    specialization: [
      {
        type: String,
        trim: true,
      },
    ],
    currentCaseload: {
      type: Number,
      default: 0,
      min: [0, "Current caseload cannot be negative"],
    },
    maxCaseload: {
      type: Number,
      default: 10,
      min: [1, "Max caseload must be at least 1"],
    },
    completedCases: {
      type: Number,
      default: 0,
      min: [0, "Completed cases cannot be negative"],
    },
    averageResolutionTime: {
      type: Number,
      min: [0, "Average resolution time cannot be negative"],
    },

    // Chief Analyst specific fields
    subordinates: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalCasesManaged: {
      type: Number,
      default: 0,
      min: [0, "Total cases managed cannot be negative"],
    },
    analyticsAccess: {
      type: Boolean,
      default: false,
    },

    // Admin specific fields
    accessLevel: {
      type: Number,
      min: [1, "Access level must be at least 1"],
      max: [10, "Access level cannot exceed 10"],
    },
    systemPermissions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==============================
// Indexes
// ==============================

UserSchema.index({ email: 1 });
UserSchema.index({ badgeId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });
UserSchema.index({ isActive: 1 });

// ==============================
// Virtual Methods
// ==============================

UserSchema.virtual("displayName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`.trim();
});

UserSchema.virtual("fullNameWithRole").get(function (this: IUser) {
  const displayName = this.displayName;
  const roleNames = {
    traffic: "Traffic Personnel",
    investigator: "Investigator",
    chief: "Chief Analyst",
    admin: "Administrator",
  };
  return `${displayName} (${roleNames[this.role]})`;
});

UserSchema.virtual("initials").get(function (this: IUser) {
  if (this.firstName && this.lastName) {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }

  // Fallback to role-based initials
  const roleInitials = {
    traffic: "TP",
    investigator: "IN",
    chief: "CA",
    admin: "AD",
  };
  return roleInitials[this.role];
});

// ==============================
// Instance Methods
// ==============================

UserSchema.methods.getDisplayName = function (this: IUser): string {
  return this.displayName;
};

UserSchema.methods.getFullNameWithRole = function (this: IUser): string {
  return this.fullNameWithRole;
};

UserSchema.methods.getInitials = function (this: IUser): string {
  return this.initials;
};

// ==============================
// Static Methods
// ==============================

UserSchema.statics.findByRole = function (role: UserRole) {
  return this.find({ role, isActive: true });
};

UserSchema.statics.findByDepartment = function (department: string) {
  return this.find({ department, isActive: true });
};

UserSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

// ==============================
// Pre-save Middleware
// ==============================

UserSchema.pre("save", function (next) {
  // Set default values based on role
  if (this.isNew) {
    switch (this.role) {
      case "traffic":
        this.reportsSubmitted = this.reportsSubmitted || 0;
        break;
      case "investigator":
        this.currentCaseload = this.currentCaseload || 0;
        this.maxCaseload = this.maxCaseload || 10;
        this.completedCases = this.completedCases || 0;
        break;
      case "chief":
        this.totalCasesManaged = this.totalCasesManaged || 0;
        this.analyticsAccess = this.analyticsAccess || false;
        break;
      case "admin":
        this.accessLevel = this.accessLevel || 1;
        this.systemPermissions = this.systemPermissions || [];
        break;
    }
  }
  next();
});

// ==============================
// Export Model
// ==============================

export const User = mongoose.model<IUser>("User", UserSchema);

// ==============================
// Type Guards (for TypeScript usage)
// ==============================

export function isTrafficPersonnel(user: IUser): boolean {
  return user.role === "traffic";
}

export function isInvestigator(user: IUser): boolean {
  return user.role === "investigator";
}

export function isChiefAnalyst(user: IUser): boolean {
  return user.role === "chief";
}

export function isAdmin(user: IUser): boolean {
  return user.role === "admin";
}
