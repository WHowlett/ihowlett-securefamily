import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FamilyMembersModule } from './family-members/family-members.module';

@Module({
  imports: [PrismaModule, FamilyMembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
