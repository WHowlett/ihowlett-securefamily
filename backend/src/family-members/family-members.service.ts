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
}