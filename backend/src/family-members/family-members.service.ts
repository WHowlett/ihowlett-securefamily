import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

type DocumentAction = 'DOCUMENT_PREVIEWED' | 'DOCUMENT_DOWNLOADED';

@Injectable()
export class FamilyMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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
        documents: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        reminders: {
          orderBy: {
            dueDate: 'asc',
          },
        },
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

  createDocument(
    familyMemberId: string,
    data: {
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
      expiresAt?: string | null;
    },
  ) {
    return this.prisma.document.create({
      data: {
        familyMemberId,
        category: data.category,
        title: data.title,
        fileName: data.fileName,
        storagePath: data.storagePath ?? `placeholder/${data.fileName}`,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async updateDocument(
    documentId: string,
    data: {
      category?:
        | 'MEDICAL'
        | 'LEGAL'
        | 'INSURANCE'
        | 'FINANCIAL'
        | 'EDUCATION'
        | 'PERSONAL'
        | 'EMERGENCY';
      title?: string;
      fileName?: string;
      storagePath?: string;
      mimeType?: string;
      sizeBytes?: number;
      expiresAt?: string | null;
    },
  ) {
    const document = await this.prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        category: data.category,
        title: data.title,
        fileName: data.fileName,
        storagePath: data.storagePath,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        expiresAt:
          data.expiresAt === undefined
            ? undefined
            : data.expiresAt
              ? new Date(data.expiresAt)
              : null,
      },
    });

    await this.createAuditLog({
      action: 'DOCUMENT_UPDATED',
      resource: 'Document',
      resourceId: document.id,
      metadata: {
        title: document.title,
        fileName: document.fileName,
        category: document.category,
        expiresAt: document.expiresAt,
      },
    });

    return document;
  }

  async deleteDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return this.prisma.document.delete({
        where: {
          id: documentId,
        },
      });
    }

    await this.createAuditLog({
      action: 'DOCUMENT_DELETED',
      resource: 'Document',
      resourceId: document.id,
      metadata: {
        title: document.title,
        fileName: document.fileName,
        familyMemberId: document.familyMemberId,
      },
    });

    return this.prisma.document.delete({
      where: {
        id: documentId,
      },
    });
  }

  async uploadDocument(
    familyMemberId: string,
    file: Express.Multer.File,
    data: {
      category:
        | 'MEDICAL'
        | 'LEGAL'
        | 'INSURANCE'
        | 'FINANCIAL'
        | 'EDUCATION'
        | 'PERSONAL'
        | 'EMERGENCY';
      title: string;
      expiresAt?: string | null;
    },
  ) {
    const uploadedFile = await this.storageService.uploadFile({
      familyMemberId,
      file,
    });

    const document = await this.prisma.document.create({
      data: {
        familyMemberId,
        category: data.category,
        title: data.title,
        fileName: uploadedFile.fileName,
        storagePath: uploadedFile.storagePath,
        mimeType: uploadedFile.mimeType,
        sizeBytes: uploadedFile.sizeBytes,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });

    await this.createAuditLog({
      action: 'DOCUMENT_UPLOADED',
      resource: 'Document',
      resourceId: document.id,
      metadata: {
        familyMemberId,
        title: document.title,
        fileName: document.fileName,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes,
      },
    });

    return document;
  }

  async getDocumentForDownload(
    documentId: string,
    action: DocumentAction = 'DOCUMENT_DOWNLOADED',
  ) {
    const document = await this.prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    const objectName = document.storagePath.replace(
      'securefamily-documents/',
      '',
    );

    const fileStream = await this.storageService.getFileStream(objectName);

    await this.createAuditLog({
      action,
      resource: 'Document',
      resourceId: document.id,
      metadata: {
        title: document.title,
        fileName: document.fileName,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes,
      },
    });

    return {
      document,
      fileStream,
    };
  }

  findRecentAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 25,
    });
  }

    private createAuditLog(data: {
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: data.action,
        target: JSON.stringify({
          resource: data.resource,
          resourceId: data.resourceId,
          metadata: data.metadata,
        }),
        result: 'SUCCESS',
      },
    });
  }
}