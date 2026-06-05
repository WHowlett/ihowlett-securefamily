"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ReminderActionsProps = {
  reminderId: string;
  completed: boolean;
};

export default function ReminderActions({
  reminderId,
  completed,
}: ReminderActionsProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function markComplete() {
    setMessage("Updating...");

    const res = await fetch(
      `http://localhost:3000/family-members/reminders/${reminderId}/complete`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      setMessage("Could not mark complete.");
      return;
    }

    setMessage("");
    router.refresh();
  }

  async function deleteReminder() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?"
    );

    if (!confirmed) return;

    setMessage("Deleting...");

    const res = await fetch(
      `http://localhost:3000/family-members/reminders/${reminderId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      setMessage("Could not delete reminder.");
      return;
    }

    setMessage("");
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {!completed && (
        <button
          type="button"
          onClick={markComplete}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          Mark Complete
        </button>
      )}

      <button
        type="button"
        onClick={deleteReminder}
        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        Delete
      </button>

      {message && <span className="text-xs text-slate-500">{message}</span>}
    </div>
  );
}