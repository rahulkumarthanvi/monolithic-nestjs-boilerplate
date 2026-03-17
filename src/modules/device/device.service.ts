import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceDocument, DeviceModel } from './schemas/device.schema';
import { hashPassword } from '../../common/utils/password.util';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(DeviceModel.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}

  async upsertDevice(params: {
    userId: string;
    deviceId: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
    refreshToken: string;
  }): Promise<DeviceDocument> {
    const refreshTokenHash = await hashPassword(params.refreshToken);
    const now = new Date();

    const device = await this.deviceModel
      .findOneAndUpdate(
        {
          userId: params.userId,
          deviceId: params.deviceId,
        },
        {
          $set: {
            deviceName: params.deviceName,
            ipAddress: params.ipAddress,
            userAgent: params.userAgent,
            refreshTokenHash,
            isActive: true,
            lastLoginAt: now,
          },
        },
        { upsert: true, new: true },
      )
      .exec();

    return device;
  }

  async deactivateDevice(userId: string, deviceId: string): Promise<void> {
    await this.deviceModel
      .findOneAndUpdate(
        { userId, deviceId },
        { isActive: false, refreshTokenHash: null },
      )
      .exec();
  }

  async findActiveDevice(
    userId: string,
    deviceId: string,
  ): Promise<DeviceDocument | null> {
    return this.deviceModel
      .findOne({ userId, deviceId, isActive: true })
      .exec();
  }
}

