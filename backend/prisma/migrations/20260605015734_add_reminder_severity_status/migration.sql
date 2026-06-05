-- CreateEnum
CREATE TYPE "ReminderSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('OPEN', 'COMPLETED', 'SNOOZED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "severity" "ReminderSeverity" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'OPEN';
