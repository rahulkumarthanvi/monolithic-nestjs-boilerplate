import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySoftDeleteMiddleware, baseSchemaOptions } from '../../../database/base.schema';

@Schema({
  ...baseSchemaOptions,
  collection: 'users',
})
export class UserModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  roleId!: string;

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export type UserDocument = HydratedDocument<UserModel>;

export const UserSchema = SchemaFactory.createForClass(UserModel);

applySoftDeleteMiddleware(UserSchema);

