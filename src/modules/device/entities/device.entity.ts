import { Document } from 'mongoose';

export interface Device extends Document {
  userId: string;
  deviceId: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  refreshTokenHash?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

