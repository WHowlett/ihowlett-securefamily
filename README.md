\# iHowlett SecureFamily



iHowlett SecureFamily is a secure family document and health information vault built as a full-stack application. The project is designed to help families organize important medical, legal, insurance, identification, and emergency documents in one place while applying security engineering practices such as controlled document access, upload validation, and audit logging.



This project is currently in active development and is being built as both a practical family-focused application and a cybersecurity/software engineering portfolio project.



\---



\## Project Purpose



Families often store important information across email, paper folders, phones, cloud drives, and separate apps. In an emergency, it can be difficult to quickly find medical details, insurance records, identification documents, expiration dates, or legal paperwork.



iHowlett SecureFamily is being built to solve that problem by providing a structured, secure, and easy-to-use family vault.



The long-term goal is to support:



\- Family member profiles

\- Medical profiles

\- Secure document storage

\- Expiration tracking for documents

\- Reminder management

\- Controlled preview and download access

\- Audit logging for sensitive actions

\- Role-based access control

\- Multi-factor authentication

\- PDF exports for emergency use

\- Security monitoring and detection use cases



\---



\## Current Features



\### Family Profiles



Users can create and view family member profiles with basic details such as name, date of birth, relationship, and profile information.



\### Medical Profiles



Each family member can have a medical profile that includes information such as:



\- Blood type

\- Allergies

\- Medical conditions

\- Medications

\- Primary doctor

\- Insurance

\- Pharmacy

\- Notes



\### Document Vault



The application includes a working document vault where users can upload and manage documents connected to a family member.



Current document features include:



\- Upload documents through the backend

\- Store files in MinIO object storage

\- Store document metadata in PostgreSQL

\- Categorize documents

\- Track expiration dates

\- Show expiration status and countdowns

\- Edit document metadata

\- Delete document records

\- Preview supported documents

\- Download documents through backend-controlled routes



\### Document Preview



The app supports document preview behavior for easier review before downloading.



Current preview behavior:



\- Images and text can preview inside the app

\- PDFs can be opened through a backend preview route

\- Unsupported file types show a safe fallback message



\### Upload Validation



The backend validates uploaded files before storing them.



Current allowed file types:



\- PDF

\- PNG

\- JPG/JPEG

\- TXT



Current maximum file size:



\- 10 MB



This prevents the vault from accepting unlimited or unsupported file uploads.



\### Reminder Management



Users can create reminders connected to a family member. Reminders support:



\- Reminder title

\- Description

\- Type

\- Severity

\- Due date

\- Completion status

\- Delete action



Reminder severity levels include:



\- Low

\- Medium

\- High

\- Critical



\### Audit Logging



The backend records document-related security events in an audit log.



Current logged actions include:



\- `DOCUMENT\_UPLOADED`

\- `DOCUMENT\_PREVIEWED`

\- `DOCUMENT\_DOWNLOADED`

\- `DOCUMENT\_UPDATED`

\- `DOCUMENT\_DELETED`



The frontend includes a Recent Security Activity panel that displays recent audit events.



\---



\## Security Engineering Concepts Demonstrated



This project is intentionally designed to demonstrate real security and software engineering concepts, including:



\- Backend-controlled file access

\- Object storage integration

\- File type validation

\- File size validation

\- Separation of file storage and metadata storage

\- Audit logging for sensitive document activity

\- Secure-by-design thinking

\- Future role-based access control planning

\- Future MFA planning

\- Future security monitoring integration



The goal is to show how cybersecurity skills can be implemented directly into a full-stack software product.



\---



\## Tech Stack



\### Frontend



\- Next.js

\- React

\- TypeScript

\- Tailwind CSS



\### Backend



\- NestJS

\- TypeScript

\- Prisma ORM



\### Database and Storage



\- PostgreSQL

\- MinIO object storage

\- Docker Compose for local services



\---



\## Local Development Setup



\### Prerequisites



Install the following before running the project:



\- Node.js

\- npm

\- Docker Desktop

\- Git



\---



\## Start Local Services



From the project root, start the local infrastructure:



```powershell

docker compose up -d

