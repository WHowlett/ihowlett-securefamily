import AddFamilyMemberForm from "@/components/AddFamilyMemberForm";
import Link from "next/link";

type FamilyMember = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  relationship?: string;
  photoUrl?: string;
  medicalProfile?: unknown;
  documents: unknown[];
  reminders: unknown[];
};

async function getFamilyMembers(): Promise<FamilyMember[]> {
  const res = await fetch("http://localhost:3000/family-members", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch family members");
  }

  return res.json();
}

export default async function Home() {
  const familyMembers = await getFamilyMembers();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
              SF
            </div>
            <h1 className="text-2xl font-bold text-blue-700">
              iHowlett SecureFamily
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Secure. Healthy. Organized.
            </p>
          </div>

          <nav className="space-y-2 text-sm font-medium">
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-blue-700">
              Dashboard
            </div>
            <div className="rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
              Family Members
            </div>
            <div className="rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
              Medical Profiles
            </div>
            <div className="rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
              Documents
            </div>
            <div className="rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
              Reminders
            </div>
            <div className="rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
              PDF Requests
            </div>
            <div className="rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
              Audit Logs
            </div>
          </nav>

          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-700">Protected Access</p>
            <p className="mt-1 text-sm text-emerald-700">
              MFA, encryption, and role-based access enabled.
            </p>
          </div>
        </aside>

        <section className="p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                Family Health & Records
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Secure Family Dashboard
              </h2>
              <p className="mt-2 max-w-3xl text-slate-500">
                Manage family profiles, medical information, legal records,
                reminders, and controlled PDF exports in one private place.
              </p>
            </div>

            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              MFA Protected
            </div>
          </header>

          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Family Members</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">
                {familyMembers.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Documents</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {familyMembers.reduce(
                  (total, member) => total + member.documents.length,
                  0
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Reminders</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {familyMembers.reduce(
                  (total, member) => total + member.reminders.length,
                  0
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Pending PDF Requests</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">0</p>
            </div>
          </div>
		<AddFamilyMemberForm />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Family Profiles
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Each profile will contain medical, legal, emergency, and
                  document information.
                </p>
              </div>
		
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                Add Profile
              </button>
            </div>

            {familyMembers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No family members yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {familyMembers.map((member) => (
                  <Link
  key={member.id}
  href={`/family-members/${member.id}`}
  className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50"
>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </div>

                    <h4 className="text-lg font-semibold text-slate-900">
                      {member.firstName} {member.lastName}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {member.relationship || "No relationship listed"}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-white p-2 shadow-sm">
                        <p className="font-bold text-emerald-600">
                          {member.medicalProfile ? "Yes" : "No"}
                        </p>
                        <p className="text-slate-500">Medical</p>
                      </div>

                      <div className="rounded-xl bg-white p-2 shadow-sm">
                        <p className="font-bold text-blue-700">
                          {member.documents.length}
                        </p>
                        <p className="text-slate-500">Docs</p>
                      </div>

                      <div className="rounded-xl bg-white p-2 shadow-sm">
                        <p className="font-bold text-indigo-600">
                          {member.reminders.length}
                        </p>
                        <p className="text-slate-500">Tasks</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}