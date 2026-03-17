import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiLogDocument, ApiLogModel } from './schemas/api-log.schema';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger(AppLoggerService.name);

  constructor(
    @InjectModel(ApiLogModel.name)
    private readonly apiLogModel: Model<ApiLogDocument>,
  ) {}

  async logRequest(log: Partial<ApiLogModel>): Promise<void> {
    try {
      await this.apiLogModel.create(log);
    } catch (err) {
      this.logger.error('Failed to store API log', err as any);
    }
  }
}

