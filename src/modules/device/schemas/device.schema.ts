import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySoftDeleteMiddleware, baseSchemaOptions } from '../../../database/base.schema';

@Schema({
  ...baseSchemaOptions,
  collection: 'devices',
})
export class DeviceModel {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true })
  deviceId!: string;

  @Prop()
  deviceName?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  refreshTokenHash?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export type DeviceDocument = HydratedDocument<DeviceModel>;

export const DeviceSchema = SchemaFactory.createForClass(DeviceModel);

applySoftDeleteMiddleware(DeviceSchema);

