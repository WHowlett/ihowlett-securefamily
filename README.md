# iHowlett SecureFamily

iHowlett SecureFamily is a secure family document and health information vault built as a full-stack application. The project helps families organize important medical, legal, insurance, identification, and emergency documents in one place while applying security engineering practices such as controlled document access, upload validation, and audit logging.

This project is currently in active development and is being built as both a practical family-focused application and a cybersecurity/software engineering portfolio project.

---

## Project Purpose

Families often store important information across email, paper folders, phones, cloud drives, and separate apps. In an emergency, it can be difficult to quickly find medical details, insurance records, identification documents, expiration dates, or legal paperwork.

iHowlett SecureFamily is being built to solve that problem by providing a structured, secure, and easy-to-use family vault.

The long-term goal is to support family profiles, medical profiles, secure document storage, expiration tracking, reminders, controlled preview/download access, audit logging, role-based access control, multi-factor authentication, PDF exports, and security monitoring use cases.

---

## Current Features

### Family Profiles

Users can create and view family member profiles with basic details such as name, date of birth, relationship, and profile information.

### Medical Profiles

Each family member can have a medical profile that includes blood type, allergies, conditions, medications, primary doctor, insurance, pharmacy, and notes.

### Document Vault

The application includes a working document vault where users can upload and manage documents connected to a family member.

Current document features include:

- Upload documents through the backend
- Store files in MinIO object storage
- Store document metadata in PostgreSQL
- Categorize documents
- Track expiration dates
- Show expiration status and countdowns
- Edit document metadata
- Delete document records
- Preview supported documents
- Download documents through backend-controlled routes

### Document Preview

The app supports document preview behavior for easier review before downloading.

Current preview behavior:

- Images and text can preview inside the app
- PDFs can be opened through a backend preview route
- Unsupported file types show a safe fallback message

### Upload Validation

The backend validates uploaded files before storing them.

Current allowed file types:

- PDF
- PNG
- JPG/JPEG
- TXT

Current maximum file size:

- 10 MB

This prevents the vault from accepting unlimited or unsupported file uploads.

### Reminder Management

Users can create reminders connected to a family member. Reminders support title, description, type, severity, due date, completion status, and delete actions.

Reminder severity levels include Low, Medium, High, and Critical.

### Audit Logging

The backend records document-related security events in an audit log.

Current logged actions include:

- `DOCUMENT_UPLOADED`
- `DOCUMENT_PREVIEWED`
- `DOCUMENT_DOWNLOADED`
- `DOCUMENT_UPDATED`
- `DOCUMENT_DELETED`

The frontend includes a Recent Security Activity panel that displays recent audit events.

---

## Security Engineering Concepts Demonstrated

This project is intentionally designed to demonstrate real security and software engineering concepts, including:

- Backend-controlled file access
- Object storage integration
- File type validation
- File size validation
- Separation of file storage and metadata storage
- Audit logging for sensitive document activity
- Secure-by-design thinking
- Future role-based access control planning
- Future MFA planning
- Future security monitoring integration

The goal is to show how cybersecurity skills can be implemented directly into a full-stack software product.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- Prisma ORM

### Database and Storage

- PostgreSQL
- MinIO object storage
- Docker Compose for local services

---

## Local Development Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Docker Desktop
- Git

### Start Local Services

From the project root, start the local infrastructure:

```powershell
docker compose up -d
```

This starts PostgreSQL and MinIO.

### Backend Setup

Navigate to the backend folder:

```powershell
cd backend
```

Install dependencies:

```powershell
npm install
```

Generate Prisma client:

```powershell
npx prisma generate
```

Run database migrations:

```powershell
npx prisma migrate dev
```

Start the backend:

```powershell
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

### Frontend Setup

Open another terminal and navigate to the frontend folder:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

The frontend currently runs on:

```text
http://localhost:3002
```

### MinIO Console

MinIO is used for local object storage.

Open the MinIO console:

```text
http://localhost:9001
```

Documents are stored in the MinIO bucket:

```text
securefamily-documents
```

---

## Main Backend Routes

### Family Members

```text
GET    /family-members
GET    /family-members/:id
POST   /family-members
```

### Medical Profiles

```text
POST   /family-members/:id/medical-profile
```

### Reminders

```text
POST   /family-members/:id/reminders
PATCH  /family-members/reminders/:reminderId/complete
DELETE /family-members/reminders/:reminderId
```

### Documents

```text
POST   /family-members/:id/documents
POST   /family-members/:id/documents/upload
PATCH  /family-members/documents/:documentId
DELETE /family-members/documents/:documentId
GET    /family-members/documents/:documentId/preview
GET    /family-members/documents/:documentId/download
```

### Audit Logs

```text
GET    /family-members/audit-logs
```

---

## Project Status

This project is in active development.

Completed foundation:

- Full-stack app structure
- Family profile dashboard
- Family member detail pages
- Medical profile editing
- Reminder creation and completion
- Document upload to MinIO
- Document preview and download routes
- Document expiration tracking
- Backend upload validation
- Audit logging
- Frontend security activity panel

Planned improvements:

- Authentication
- Multi-factor authentication
- Role-based access control
- More detailed audit logging with actor, IP address, and user agent
- Secure document authorization checks
- PDF export workflow
- Emergency access mode
- Notification system for expiring documents
- Production deployment
- Wazuh/SIEM monitoring integration

---

## Portfolio Focus

This project highlights a combination of full-stack software engineering, backend API design, database modeling, object storage integration, secure document handling, audit logging, security architecture planning, and practical cybersecurity implementation.

The project is intended to demonstrate how security can be built into an application from the early design phase instead of added later.

---

## Important Note

This is a development-stage project. It should not be used to store real sensitive family, medical, legal, or identification documents until authentication, authorization, encryption, secure deployment, and production security controls are fully implemented.
