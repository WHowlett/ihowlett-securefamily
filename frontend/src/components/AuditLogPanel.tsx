type AuditLog = {
  id: string;
  action: string;
  target?: string | null;
  result?: string | null;
  createdAt: string;
};

async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch("http://localhost:3000/family-members/audit-logs", {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getTargetSummary(target?: string | null) {
  if (!target) {
    return "No target details available.";
  }

  try {
    const parsed = JSON.parse(target);
    const metadata = parsed.metadata || {};

    if (metadata.title && metadata.fileName) {
      return `${metadata.title} (${metadata.fileName})`;
    }

    if (metadata.fileName) {
      return metadata.fileName;
    }

    if (parsed.resource && parsed.resourceId) {
      return `${parsed.resource}: ${parsed.resourceId}`;
    }

    return "Document activity recorded.";
  } catch {
    return target;
  }
}

export default async function AuditLogPanel() {
  const auditLogs = await getAuditLogs();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Security Activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Audit trail for document previews, downloads, uploads, edits, and deletions.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Last {auditLogs.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {auditLogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            No activity recorded yet. Preview, download, upload, edit, or delete a document to create an audit event.
          </div>
        ) : (
          auditLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {formatAction(log.action)}
                </p>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {log.result || "RECORDED"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {getTargetSummary(log.target)}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}