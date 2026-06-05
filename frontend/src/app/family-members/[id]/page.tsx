import MedicalProfileForm from "@/components/MedicalProfileForm";

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
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-semibold text-blue-600">
          ← Back to Dashboard
        </a>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Family Profile
              </p>
              <h1 className="mt-2 text-4xl font-bold">
                {member.firstName} {member.lastName}
              </h1>
              <p className="mt-2 text-slate-500">
                {member.relationship || "No relationship listed"}
              </p>
            </div>

            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Protected Profile
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Medical Profile</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {member.medicalProfile ? "Created" : "Missing"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Documents</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">
              {member.documents.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Reminders</p>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {member.reminders.length}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Medical Information</h2>

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
              No medical profile yet. Next we will add the form to create one.
            </div>

          )}
<MedicalProfileForm
  familyMemberId={member.id}
  existingProfile={member.medicalProfile}
/>
        </section>


      </div>
    </main>
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