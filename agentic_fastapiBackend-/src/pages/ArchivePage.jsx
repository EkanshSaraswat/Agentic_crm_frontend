import { useApi, PageHeader, Table, Btn, Alert, EmptyState } from "../components/ui";
import { useState } from "react";
import { archiveApi } from "../lib/api";

const COLUMNS = [
  { key: "entity_type", label: "Type", render: (r) => <span className="font-mono text-xs uppercase text-stone">{r.entity_type ?? "record"}</span> },
  { key: "name", label: "Name" },
  { key: "archived_at", label: "Archived", render: (r) => r.archived_at ? new Date(r.archived_at).toLocaleDateString() : "—" },
];

export default function ArchivePage() {
  const { data, loading, error, reload } = useApi(() => archiveApi.list());
  const [alert, setAlert] = useState(null);
  const rows = data?.items ?? data?.rows ?? [];

  async function restore(row) {
    try { await archiveApi.restore(row.id); setAlert({ type: "success", msg: `"${row.name}" restored.` }); reload(); }
    catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader breadcrumb="Organize / Archive" title="Archive" />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}
      <div className="mb-6 p-4 border border-ink/10 rounded-lg text-sm text-stone">
        Archived records are hidden from main views but not permanently deleted. Restore them at any time.
      </div>
      {error ? <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} /> :
        rows.length === 0 && !loading ? (
          <EmptyState icon="📦" title="Archive is empty" message="Records you archive from Companies, Contacts or Deals will appear here." />
        ) : (
          <Table
            columns={[...COLUMNS, { key: "_a", label: "", render: (r) => <Btn variant="secondary" onClick={(e) => { e.stopPropagation(); restore(r); }}>Restore</Btn> }]}
            rows={rows} loading={loading} emptyText="No archived records."
          />
        )
      }
    </div>
  );
}
