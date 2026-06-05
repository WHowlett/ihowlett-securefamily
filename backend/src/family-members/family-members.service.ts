import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FamilyMembersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.familyMember.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        medicalProfile: true,
        documents: true,
        reminders: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.familyMember.findUnique({
      where: { id },
      include: {
        medicalProfile: true,
        documents: true,
        reminders: true,
      },
    });
  }

  create(data: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    relationship?: string;
    photoUrl?: string;
  }) {
    return this.prisma.familyMember.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        relationship: data.relationship,
        photoUrl: data.photoUrl,
      },
    });
  }

  upsertMedicalProfile(
    familyMemberId: string,
    data: {
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
    return this.prisma.medicalProfile.upsert({
      where: {
        familyMemberId,
      },
      update: {
        bloodType: data.bloodType,
        allergies: data.allergies,
        conditions: data.conditions,
        medications: data.medications,
        primaryDoctor: data.primaryDoctor,
        insurance: data.insurance,
        pharmacy: data.pharmacy,
        notes: data.notes,
      },
      create: {
        familyMemberId,
        bloodType: data.bloodType,
        allergies: data.allergies,
        conditions: data.conditions,
        medications: data.medications,
        primaryDoctor: data.primaryDoctor,
        insurance: data.insurance,
        pharmacy: data.pharmacy,
        notes: data.notes,
      },
    });
  }
}