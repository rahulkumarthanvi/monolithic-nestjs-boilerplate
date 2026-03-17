import { Document } from 'mongoose';

export interface ApiLog extends Document {
  method: string;
  url: string;
  headers: Record<string, any>;
  requestBody: any;
  responseBody: any;
  statusCode: number;
  error?: any;
  userId?: string;
  ipAddress?: string;
  executionTime: number;
  createdAt: Date;
}

