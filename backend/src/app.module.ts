import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FamilyMembersModule } from './family-members/family-members.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [PrismaModule, FamilyMembersModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
