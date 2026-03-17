import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiLogModel, ApiLogSchema } from './schemas/api-log.schema';
import { AppLoggerService } from './logger.service';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiLogModel.name, schema: ApiLogSchema },
    ]),
  ],
  providers: [AppLoggerService, LoggerInterceptor],
  exports: [AppLoggerService, LoggerInterceptor],
})
export class LoggerModule {}

