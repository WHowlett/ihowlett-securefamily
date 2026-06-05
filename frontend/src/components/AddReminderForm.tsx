"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
type ReminderType =
  | "APPOINTMENT"
  | "MEDICATION_REFILL"
  | "INSURANCE_RENEWAL"
  | "LICENSE_RENEWAL"
  | "PASSPORT_EXPIRATION"
  | "LEGAL_DEADLINE"
  | "SCHOOL_EVENT"
  | "OTHER";

type ReminderSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type AddReminderFormProps = {
  familyMemberId: string;
};

export default function AddReminderForm({ familyMemberId }: AddReminderFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
const [type, setType] = useState<ReminderType>("OTHER");
const [severity, setSeverity] = useState<ReminderSeverity>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving reminder...");

    const res = await fetch(
      `http://localhost:3000/family-members/${familyMemberId}/reminders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          severity,
          dueDate: new Date(dueDate).toISOString(),
        }),
      }
    );

    if (!res.ok) {
      setMessage("Reminder could not be saved.");
      return;
    }

    setTitle("");
    setDescription("");
    setType("OTHER");
    setSeverity("MEDIUM");
    setDueDate("");
    setMessage("Reminder saved.");
    setIsOpen(false);
    router.refresh();
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
      >
        Add Reminder
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-bold text-slate-900">Add Reminder</h4>
          <p className="mt-1 text-sm text-slate-500">
            Create an appointment, renewal, medication, legal, or document reminder.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Passport renewal, doctor appointment..."
            required
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Due Date
          </span>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Type
          </span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value as ReminderType)}
          >
            <option value="APPOINTMENT">Appointment</option>
            <option value="MEDICATION_REFILL">Medication Refill</option>
            <option value="INSURANCE_RENEWAL">Insurance Renewal</option>
            <option value="LICENSE_RENEWAL">License Renewal</option>
            <option value="PASSPORT_EXPIRATION">Passport Expiration</option>
            <option value="LEGAL_DEADLINE">Legal Deadline</option>
            <option value="SCHOOL_EVENT">School Event</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Severity
          </span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as ReminderSeverity)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details, notes, instructions, or renewal information..."
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Save Reminder
        </button>

        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </form>
  );
}
