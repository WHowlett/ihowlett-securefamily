"use client";

import { useState } from "react";

type DocumentPreviewModalProps = {
  document: {
    id: string;
    title: string;
    fileName: string;
    mimeType?: string | null;
  };
};

export default function DocumentPreviewModal({
  document,
}: DocumentPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const previewUrl = `http://localhost:3000/family-members/documents/${document.id}/preview`;
  const downloadUrl = `http://localhost:3000/family-members/documents/${document.id}/download`;

  const isImage = document.mimeType?.startsWith("image/");
  const isText = document.mimeType?.startsWith("text/");
  const isPdf = document.mimeType === "application/pdf";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100"
      >
        Preview
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {document.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {document.fileName}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {document.mimeType || "Unknown file type"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="min-h-[420px] overflow-auto bg-slate-100 p-4">
              {isImage && (
                <div className="flex h-[60vh] items-center justify-center">
                  <img
                    src={previewUrl}
                    alt={document.title}
                    className="max-h-full max-w-full rounded-xl border border-slate-200 bg-white object-contain"
                  />
                </div>
              )}

              {isText && (
                <iframe
                  src={previewUrl}
                  title={`Preview ${document.title}`}
                  className="h-[60vh] w-full rounded-xl border border-slate-200 bg-white"
                />
              )}

              {isPdf && (
                <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    PDF preview is ready.
                  </p>
                  <p className="mt-2 max-w-xl text-sm text-slate-500">
                    Open the PDF in a new browser tab for a cleaner preview.
                    This keeps download separate from preview.
                  </p>

                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Open Preview in New Tab
                  </a>
                </div>
              )}

              {!isImage && !isText && !isPdf && (
                <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    Preview is not available for this file type.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    You can still download the file securely.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 p-4">
              <p className="text-xs text-slate-500">
                Preview and download are served through backend-controlled document routes.
              </p>

              <a
                href={downloadUrl}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}