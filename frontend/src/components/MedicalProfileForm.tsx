"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MedicalProfileFormProps = {
  familyMemberId: string;
  existingProfile?: {
    bloodType?: string | null;
    allergies?: string | null;
    conditions?: string | null;
    medications?: string | null;
    primaryDoctor?: string | null;
    insurance?: string | null;
    pharmacy?: string | null;
    notes?: string | null;
  } | null;
};

export default function MedicalProfileForm({
  familyMemberId,
  existingProfile,
}: MedicalProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [bloodType, setBloodType] = useState(existingProfile?.bloodType || "");
  const [allergies, setAllergies] = useState(existingProfile?.allergies || "");
  const [conditions, setConditions] = useState(existingProfile?.conditions || "");
  const [medications, setMedications] = useState(existingProfile?.medications || "");
  const [primaryDoctor, setPrimaryDoctor] = useState(existingProfile?.primaryDoctor || "");
  const [insurance, setInsurance] = useState(existingProfile?.insurance || "");
  const [pharmacy, setPharmacy] = useState(existingProfile?.pharmacy || "");
  const [notes, setNotes] = useState(existingProfile?.notes || "");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving medical profile...");

    const res = await fetch(
      `http://localhost:3000/family-members/${familyMemberId}/medical-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloodType,
          allergies,
          conditions,
          medications,
          primaryDoctor,
          insurance,
          pharmacy,
          notes,
        }),
      }
    );

    if (!res.ok) {
      setMessage("Medical profile could not be saved.");
      return;
    }

    setMessage("Medical profile saved.");
    setIsEditing(false);
    router.refresh();
  }

  if (!isEditing) {
    return (
      <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div>
          <p className="font-semibold text-slate-900">
            {existingProfile ? "Medical profile is saved" : "No medical profile yet"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add or update blood type, allergies, medications, doctor, insurance, pharmacy, and notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          {existingProfile ? "Edit Medical Profile" : "Create Medical Profile"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Edit Medical Profile
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Store important health information for emergency and family reference.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Blood Type" value={bloodType} setValue={setBloodType} />
        <Input label="Allergies" value={allergies} setValue={setAllergies} />
        <Input label="Conditions" value={conditions} setValue={setConditions} />
        <Input label="Medications" value={medications} setValue={setMedications} />
        <Input label="Primary Doctor" value={primaryDoctor} setValue={setPrimaryDoctor} />
        <Input label="Insurance" value={insurance} setValue={setInsurance} />
        <Input label="Pharmacy" value={pharmacy} setValue={setPharmacy} />

        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Notes
          </span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Emergency notes, care instructions, restrictions..."
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Save Medical Profile
        </button>

        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
      />
    </label>
  );
}