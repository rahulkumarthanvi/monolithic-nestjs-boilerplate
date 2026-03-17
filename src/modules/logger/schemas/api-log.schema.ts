import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base.schema';

@Schema({
  ...baseSchemaOptions,
  collection: 'api_logs',
})
export class ApiLogModel {
  @Prop()
  method!: string;

  @Prop()
  url!: string;

  @Prop({ type: Object })
  headers!: Record<string, any>;

  @Prop({ type: Object })
  requestBody: any;

  @Prop({ type: Object })
  responseBody: any;

  @Prop()
  statusCode!: number;

  @Prop({ type: Object })
  error?: any;

  @Prop()
  userId?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  executionTime!: number;

  @Prop()
  createdAt!: Date;
}

export type ApiLogDocument = HydratedDocument<ApiLogModel>;

export const ApiLogSchema = SchemaFactory.createForClass(ApiLogModel);

// TTL index: 7 days
ApiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

