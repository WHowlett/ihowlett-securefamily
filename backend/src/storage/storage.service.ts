import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.MINIO_BUCKET || 'securefamily-documents';

    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT || 9000),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'securefamily_admin',
      secretKey:
        process.env.MINIO_SECRET_KEY || 'securefamily_minio_password',
    });
  }

  async onModuleInit() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);

    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async uploadFile(params: {
    familyMemberId: string;
    file: Express.Multer.File;
  }) {
    const fileExtension = params.file.originalname.includes('.')
      ? params.file.originalname.split('.').pop()
      : 'bin';

    const objectName = `${params.familyMemberId}/${randomUUID()}.${fileExtension}`;

    await this.minioClient.putObject(
      this.bucketName,
      objectName,
      params.file.buffer,
      params.file.size,
      {
        'Content-Type': params.file.mimetype,
      },
    );

    return {
      bucket: this.bucketName,
      objectName,
      storagePath: `${this.bucketName}/${objectName}`,
      fileName: params.file.originalname,
      mimeType: params.file.mimetype,
      sizeBytes: params.file.size,
    };
  }
}