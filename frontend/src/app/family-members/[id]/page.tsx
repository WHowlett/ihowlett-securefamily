import MedicalProfileForm from "@/components/MedicalProfileForm";
import Link from "next/link";

type FamilyMember = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  relationship?: string;
  photoUrl?: string;
  medicalProfile?: {
    bloodType?: string;
    allergies?: string;
    conditions?: string;
    medications?: string;
    primaryDoctor?: string;
    insurance?: string;
    pharmacy?: string;
    notes?: string;
  } | null;
  documents: unknown[];
  reminders: unknown[];
};

async function getFamilyMember(id: string): Promise<FamilyMember> {
  const res = await fetch(`http://localhost:3000/family-members/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch family member");
  }

  return res.json();
}

export default async function FamilyMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getFamilyMember(id);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-semibold text-blue-600">
          ← Back to Dashboard
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Secure Family Profile
              </p>
              <h1 className="mt-2 text-4xl font-bold">
                {member.firstName} {member.lastName}
              </h1>
              <p className="mt-2 text-slate-500">
                {member.relationship || "No relationship listed"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Protected Profile
              </span>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                Role-Based Access
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-4">
          <SummaryCard
            label="Medical Profile"
            value={member.medicalProfile ? "Created" : "Missing"}
            color="text-emerald-600"
          />
          <SummaryCard
            label="Documents"
            value={String(member.documents.length)}
            color="text-blue-700"
          />
          <SummaryCard
            label="Reminders"
            value={String(member.reminders.length)}
            color="text-indigo-600"
          />
          <SummaryCard
            label="PDF Requests"
            value="0"
            color="text-amber-600"
          />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Medical Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                Critical health information, allergies, medications, doctor,
                pharmacy, and insurance details.
              </p>
            </div>
          </div>

          {member.medicalProfile ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Info label="Blood Type" value={member.medicalProfile.bloodType} />
              <Info label="Allergies" value={member.medicalProfile.allergies} />
              <Info label="Conditions" value={member.medicalProfile.conditions} />
              <Info label="Medications" value={member.medicalProfile.medications} />
              <Info label="Primary Doctor" value={member.medicalProfile.primaryDoctor} />
              <Info label="Insurance" value={member.medicalProfile.insurance} />
              <Info label="Pharmacy" value={member.medicalProfile.pharmacy} />
              <Info label="Notes" value={member.medicalProfile.notes} />
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
              No medical profile yet.
            </div>
          )}

          <MedicalProfileForm
            familyMemberId={member.id}
            existingProfile={member.medicalProfile}
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <FeaturePanel
            title="Legal Records"
            description="Birth certificates, passports, wills, power of attorney, guardianship papers, court records, vehicle titles, and property documents."
            button="Manage Legal Records"
          />

          <FeaturePanel
            title="Document Vault"
            description="Upload and organize medical, legal, insurance, financial, education, personal, and emergency documents."
            button="Open Document Vault"
          />

          <FeaturePanel
            title="Emergency Contacts"
            description="Primary contact, secondary contact, emergency-only access contacts, doctors, lawyers, and trusted family members."
            button="Manage Contacts"
          />

          <FeaturePanel
            title="Reminders"
            description="Track appointments, medication refills, insurance renewals, license expirations, passport dates, legal deadlines, and school events."
            button="Add Reminder"
          />

          <FeaturePanel
            title="PDF Export Requests"
            description="Create custom emergency packets, medical summaries, legal packets, insurance summaries, or selected profile exports with admin approval."
            button="Request PDF Export"
          />

          <FeaturePanel
            title="Activity & Audit Log"
            description="Track profile views, edits, document uploads, downloads, PDF requests, approvals, and permission changes."
            button="View Activity"
          />
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-medium text-slate-800">{value || "Not listed"}</p>
    </div>
  );
}

function FeaturePanel({
  title,
  description,
  button,
}: {
  title: string;
  description: string;
  button: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <button className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
        {button}
      </button>
    </div>
  );
}