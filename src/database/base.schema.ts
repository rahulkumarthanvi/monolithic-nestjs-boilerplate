import { SchemaOptions, Schema } from 'mongoose';

export const baseSchemaOptions: SchemaOptions = {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
};

export interface BaseDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export function applySoftDeleteMiddleware(schema: Schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false },
  });

  const excludeDeletedQuery = function (this: any) {
    const query = this;
    if (!query.getQuery().includeDeleted) {
      query.where({ isDeleted: { $ne: true } });
    } else {
      const q = query.getQuery();
      delete q.includeDeleted;
      query.setQuery(q);
    }
  };

  schema.pre('find', excludeDeletedQuery);
  schema.pre('findOne', excludeDeletedQuery);
  schema.pre('countDocuments', excludeDeletedQuery);
  schema.pre('findOneAndUpdate', excludeDeletedQuery);
}

