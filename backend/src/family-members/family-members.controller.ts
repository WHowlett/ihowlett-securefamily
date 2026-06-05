import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FamilyMembersService } from './family-members.service';

@Controller('family-members')
export class FamilyMembersController {
  constructor(private readonly familyMembersService: FamilyMembersService) {}

  @Get()
  findAll() {
    return this.familyMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyMembersService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      dateOfBirth?: string;
      relationship?: string;
      photoUrl?: string;
    },
  ) {
    return this.familyMembersService.create(body);
  }

  @Post(':id/medical-profile')
  upsertMedicalProfile(
    @Param('id') id: string,
    @Body()
    body: {
      bloodType?: string;
      allergies?: string;
      conditions?: string;
      medications?: string;
      primaryDoctor?: string;
      insurance?: string;
      pharmacy?: string;
      notes?: string;
    },
  ) {
    return this.familyMembersService.upsertMedicalProfile(id, body);
  }

  @Post(':id/reminders')
  createReminder(
    @Param('id') id: string,
    @Body()
    body: {
      title: string;
      description?: string;
      type:
        | 'APPOINTMENT'
        | 'MEDICATION_REFILL'
        | 'INSURANCE_RENEWAL'
        | 'LICENSE_RENEWAL'
        | 'PASSPORT_EXPIRATION'
        | 'LEGAL_DEADLINE'
        | 'SCHOOL_EVENT'
        | 'OTHER';
      severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      dueDate: string;
    },
  ) {
    return this.familyMembersService.createReminder(id, body);
  }

  @Patch('reminders/:reminderId/complete')
  completeReminder(@Param('reminderId') reminderId: string) {
    return this.familyMembersService.completeReminder(reminderId);
  }

  @Delete('reminders/:reminderId')
  deleteReminder(@Param('reminderId') reminderId: string) {
    return this.familyMembersService.deleteReminder(reminderId);
  }

  @Post(':id/documents')
  createDocument(
    @Param('id') id: string,
    @Body()
    body: {
      category:
        | 'MEDICAL'
        | 'LEGAL'
        | 'INSURANCE'
        | 'FINANCIAL'
        | 'EDUCATION'
        | 'PERSONAL'
        | 'EMERGENCY';
      title: string;
      fileName: string;
      storagePath?: string;
      mimeType?: string;
      sizeBytes?: number;
      expiresAt?: string;
    },
  ) {
    return this.familyMembersService.createDocument(id, body);
  }
}