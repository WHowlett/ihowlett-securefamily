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

  createReminder(
    familyMemberId: string,
    data: {
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
    return this.prisma.reminder.create({
      data: {
        familyMemberId,
        title: data.title,
        description: data.description,
        type: data.type,
        severity: data.severity ?? 'MEDIUM',
        dueDate: new Date(data.dueDate),
      },
    });
  }

  completeReminder(reminderId: string) {
    return this.prisma.reminder.update({
      where: {
        id: reminderId,
      },
      data: {
        completed: true,
        status: 'COMPLETED',
      },
    });
  }

  deleteReminder(reminderId: string) {
    return this.prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });
  }
}