import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';
import { hashPassword } from '../../common/utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const passwordHash = await hashPassword(dto.password);
    const user = new this.userModel({
      ...dto,
      password: passwordHash,
    });
    return user.save();
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort(pagination.sort ?? '-createdAt')
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    const meta = buildPaginationMeta(pagination, total);
    return { items, meta };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true, isActive: false })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}

