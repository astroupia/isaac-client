import { Types } from 'mongoose';

export enum UserRole {
  TRAFFIC = 'traffic',
  INVESTIGATOR = 'investigator',
  CHIEF = 'chief',
  ADMIN = 'admin',
}

export enum UserShift {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
}

export interface IUser {
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
  // Traffic Personnel specific fields
  
  district?: string;
  vehicleId?: string;
  shift?: UserShift;
  reportsSubmitted?: number;

  // Investigator specific fields
  specialization?: string[];
  currentCaseload?: number;
  maxCaseload?: number;
  completedCases?: number;
  averageResolutionTime?: number;

  // Chief Analyst specific fields
  subordinates?: Types.ObjectId[];
  totalCasesManaged?: number;
  analyticsAccess?: boolean;

  // Admin specific fields
  accessLevel?: number;
  systemPermissions?: string[];

  // Computed fields
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  badgeId?: string;
  department?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  isActive?: boolean;

  // Traffic Personnel specific fields
  district?: string;
  vehicleId?: string;
  shift?: UserShift;
  reportsSubmitted?: number;

  // Investigator specific fields
  specialization?: string[];
  currentCaseload?: number;
  maxCaseload?: number;
  completedCases?: number;
  averageResolutionTime?: number;

  // Chief Analyst specific fields
  subordinates?: string[];
  totalCasesManaged?: number;
  analyticsAccess?: boolean;

  // Admin specific fields
  accessLevel?: number;
  systemPermissions?: string[];
}