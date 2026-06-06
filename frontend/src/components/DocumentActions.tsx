"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DocumentPreviewModal from "./DocumentPreviewModal";

type DocumentCategory =
  | "MEDICAL"
  | "LEGAL"
  | "INSURANCE"
  | "FINANCIAL"
  | "EDUCATION"
  | "PERSONAL"
  | "EMERGENCY";

type DocumentActionsProps = {
  document: {
    id: string;
    category: string;
    title: string;
    fileName: string;
    mimeType?: string | null;
    expiresAt?: string | null;
  };
};

export default function DocumentActions({ document }: DocumentActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState(document.title);
  const [category, setCategory] = useState<DocumentCategory>(
    document.category as DocumentCategory
  );
  const [fileName, setFileName] = useState(document.fileName);
  const [expiresAt, setExpiresAt] = useState(
    document.expiresAt ? document.expiresAt.slice(0, 10) : ""
  );

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving...");

    const res = await fetch(
      `http://localhost:3000/family-members/documents/${document.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          fileName,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      }
    );

    if (!res.ok) {
      setMessage("Could not update document.");
      return;
    }

    setMessage("");
    setIsEditing(false);
    router.refresh();
  }

  async function deleteDocument() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document record?"
    );

    if (!confirmed) return;

    setMessage("Deleting...");

    const res = await fetch(
      `http://localhost:3000/family-members/documents/${document.id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      setMessage("Could not delete document.");
      return;
    }

    setMessage("");
    router.refresh();
  }

  if (isEditing) {
    return (
      <form
        onSubmit={saveEdit}
        className="mt-4 rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            required
          />

          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
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

          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File name"
            required
          />

          <input
            type="date"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          {message && <span className="text-xs text-slate-500">{message}</span>}
        </div>
      </form>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <DocumentPreviewModal document={document} />
       <a
  href={`http://localhost:3000/family-members/documents/${document.id}/download`}
  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
>
  Download
</a>

       <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={deleteDocument}
        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        Delete
      </button>

      {message && <span className="text-xs text-slate-500">{message}</span>}
    </div>
  );
}