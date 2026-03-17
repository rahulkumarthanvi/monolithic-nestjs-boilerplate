import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  roleId: string;
  permissions: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

