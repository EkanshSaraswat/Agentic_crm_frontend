import { useState } from "react";
import { useApi, PageHeader, StatCard, Table, Modal, Btn, Field, Input, Select, Textarea, Alert, EmptyState } from "../components/ui";
import { conversationsApi } from "../lib/api";

const COLUMNS = [
  { key: "id", label: "ID", render: (r) => <span className="font-mono text-xs text-stone">{String(r.id ?? "").slice(0, 8)}…</span> },
  { key: "subject", label: "Subject", render: (r) => r.subject ?? <span className="text-stone italic">No subject</span> },
  { key: "status", label: "Status", render: (r) => (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase rounded ${r.status === "open" ? "bg-blue-100 text-blue-700" : "bg-stone/20 text-stone"}`}>
      {r.status ?? "open"}
    </span>
  )},
  { key: "created_at", label: "Created", render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : "—" },
];

function ConversationForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ subject: "", body: "", company_id: "", contact_id: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <Field label="Subject"><Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Follow-up on proposal" /></Field>
      <Field label="Message"><Textarea rows={4} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Hi there, I wanted to check in…" /></Field>
      <Field label="Company ID"><Input value={form.company_id} onChange={(e) => set("company_id", e.target.value)} placeholder="optional" /></Field>
      <Field label="Contact ID"><Input value={form.contact_id} onChange={(e) => set("contact_id", e.target.value)} placeholder="optional" /></Field>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Creating…" : "Create Conversation"}</Btn>
      </div>
    </form>
  );
}

export default function Conversations() {
  const { data, loading, error, reload } = useApi(() => conversationsApi.list());
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = data?.items ?? [];

  async function handleCreate(form) {
    setSaving(true);
    try {
      await conversationsApi.create(form);
      setCreating(false);
      setAlert({ type: "success", msg: "Conversation started." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="CRM / Conversations"
        title="Conversations"
        actions={<Btn onClick={() => setCreating(true)}>+ New Conversation</Btn>}
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total" value={rows.length || "—"} sub="All conversations" />
        <StatCard label="Open" value={rows.filter(r => r.status === "open" || !r.status).length || "—"} sub="Awaiting response" />
        <StatCard label="Closed" value={rows.filter(r => r.status === "closed").length || "—"} sub="Resolved threads" />
      </div>

      {error ? (
        <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} />
      ) : rows.length === 0 && !loading ? (
        <EmptyState
          icon="💬"
          title="No conversations yet"
          message="Start a conversation linked to a contact or company."
          action={<Btn onClick={() => setCreating(true)}>+ New Conversation</Btn>}
        />
      ) : (
        <Table
          columns={COLUMNS}
          rows={rows}
          loading={loading}
          onRowClick={setSelected}
          emptyText="No conversations found."
        />
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-96 bg-paper border-l border-ink/15 shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
            <h2 className="font-serif text-lg text-ink">Conversation</h2>
            <Btn variant="ghost" onClick={() => setSelected(null)}>Close</Btn>
          </div>
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="text-xs font-mono text-stone">ID: {selected.id}</div>
            {selected.subject && <div className="font-medium text-ink">{selected.subject}</div>}
            {selected.body && <p className="text-sm text-ink/70 leading-relaxed">{selected.body}</p>}
          </div>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New Conversation">
        <ConversationForm onSubmit={handleCreate} loading={saving} />
      </Modal>
    </div>
  );
}
