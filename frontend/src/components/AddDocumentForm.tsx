"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DocumentCategory =
  | "MEDICAL"
  | "LEGAL"
  | "INSURANCE"
  | "FINANCIAL"
  | "EDUCATION"
  | "PERSONAL"
  | "EMERGENCY";

type AddDocumentFormProps = {
  familyMemberId: string;
};

export default function AddDocumentForm({
  familyMemberId,
}: AddDocumentFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("LEGAL");
  const [fileName, setFileName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving document...");

    const cleanFileName =
      fileName.trim() || `${title.trim().toLowerCase().replaceAll(" ", "-")}.pdf`;

    const res = await fetch(
      `http://localhost:3000/family-members/${familyMemberId}/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          fileName: cleanFileName,
          storagePath: `placeholder/${cleanFileName}`,
          mimeType: "application/pdf",
          sizeBytes: 0,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      }
    );

    if (!res.ok) {
      setMessage("Document could not be saved.");
      return;
    }

    setTitle("");
    setCategory("LEGAL");
    setFileName("");
    setExpiresAt("");
    setMessage("");
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
        Add Document
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
          <h4 className="text-lg font-bold text-slate-900">Add Document</h4>
          <p className="mt-1 text-sm text-slate-500">
            Add document metadata now. Secure file upload will be connected next.
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
            Document Title
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Passport, Birth Certificate, Insurance Card..."
            required
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          >
            <option value="MEDICAL">Medical</option>
            <option value="LEGAL">Legal</option>
            <option value="INSURANCE">Insurance</option>
            <option value="FINANCIAL">Financial</option>
            <option value="EDUCATION">Education</option>
            <option value="PERSONAL">Personal</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            File Name
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="passport.pdf"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Expiration Date
          </span>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Save Document
        </button>

        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </form>
  );
}