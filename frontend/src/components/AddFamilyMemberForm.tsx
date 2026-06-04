"use client";

import { useState } from "react";

export default function AddFamilyMemberForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving profile...");

    const res = await fetch("http://localhost:3000/family-members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        relationship,
        dateOfBirth,
      }),
    });

    if (!res.ok) {
      setMessage("Something went wrong. Profile was not saved.");
      return;
    }

    setFirstName("");
    setLastName("");
    setRelationship("");
    setDateOfBirth("");
    setMessage("Profile saved. Refresh the page to see it.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-slate-900">Add Family Profile</h3>
        <p className="mt-1 text-sm text-slate-500">
          Create a new secure profile for a family member.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          placeholder="Relationship"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
        />

        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Save Profile
        </button>

        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </form>
  );
}