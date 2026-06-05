import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}