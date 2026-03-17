import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UserService } from '../../modules/user/user.service';
import { hashPassword } from '../../common/utils/password.util';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    const existing = await userService.findByEmail('admin@example.com');

    if (existing) {
      // eslint-disable-next-line no-console
      console.log('Admin user already exists, skipping seeding.');
      return;
    }

    const passwordHash = await hashPassword('Admin@123');

    await userService.create({
      name: 'Initial Super Admin',
      email: 'admin@example.com',
      password: passwordHash,
      roleId: 'SUPER_ADMIN',
      permissions: ['FULL_ACCESS'],
      isActive: true,
    });

    // eslint-disable-next-line no-console
    console.log(
      'Initial SUPER_ADMIN user seeded (email: admin@example.com / password: Admin@123).',
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed admin user', err);
  } finally {
    await app.close();
  }
}

bootstrap();

