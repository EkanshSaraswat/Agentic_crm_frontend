import { useState } from "react";
import { useApi, PageHeader, StatCard, Table, Modal, Btn, Field, Input, Select, Textarea, Confirm, Alert, SearchBar, Badge } from "../components/ui";
import { activitiesApi } from "../lib/api";

const TYPES = ["call", "email", "task", "meeting", "note", "sms"];

const COLUMNS = [
  { key: "type", label: "Type", render: (r) => <Badge label={r.type} /> },
  { key: "subject", label: "Subject" },
  { key: "body", label: "Notes", render: (r) => <span className="max-w-xs truncate block text-stone/80 text-xs">{r.body ?? "—"}</span> },
  { key: "company_id", label: "Company" },
  { key: "contact_id", label: "Contact" },
  { key: "deal_id", label: "Deal" },
  { key: "occurred_at", label: "Date", render: (r) => r.occurred_at ? new Date(r.occurred_at).toLocaleDateString() : "—" },
];

function ActivityForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    type: "call", subject: "", body: "", company_id: "", contact_id: "", deal_id: "",
    occurred_at: new Date().toISOString().slice(0, 10), due_at: "", ...initial,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <Field label="Type *">
        <Select required value={form.type} onChange={(e) => set("type", e.target.value)}>
          {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </Select>
      </Field>
      <Field label="Subject"><Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Quick sync with Acme" /></Field>
      <Field label="Notes"><Textarea rows={3} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Discussed renewal pricing…" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date"><Input type="date" value={form.occurred_at} onChange={(e) => set("occurred_at", e.target.value)} /></Field>
        <Field label="Due Date"><Input type="date" value={form.due_at} onChange={(e) => set("due_at", e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Field label="Company ID"><Input value={form.company_id} onChange={(e) => set("company_id", e.target.value)} placeholder="optional" /></Field>
        <Field label="Contact ID"><Input value={form.contact_id} onChange={(e) => set("contact_id", e.target.value)} placeholder="optional" /></Field>
        <Field label="Deal ID"><Input value={form.deal_id} onChange={(e) => set("deal_id", e.target.value)} placeholder="optional" /></Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Btn>
      </div>
    </form>
  );
}

export default function Activities() {
  const { data, loading, error, reload } = useApi(() => activitiesApi.list({ page_size: 50 }));
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = (data?.rows ?? []).filter(
    (r) => !search || r.subject?.toLowerCase().includes(search.toLowerCase()) || r.type?.toLowerCase().includes(search.toLowerCase())
  );

  const byType = (type) => (data?.rows ?? []).filter(r => r.type === type).length;

  async function handleCreate(form) {
    setSaving(true);
    try {
      await activitiesApi.create(form);
      setModal(null);
      setAlert({ type: "success", msg: "Activity logged." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      await activitiesApi.update(modal.edit.id, form);
      setModal(null);
      setAlert({ type: "success", msg: "Activity updated." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await activitiesApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "Activity deleted." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="CRM / Activities"
        title="Activities"
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search activities…" />
            <Btn onClick={() => setModal("create")}>+ Log Activity</Btn>
          </>
        }
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total" value={data?.total ?? "—"} sub="All logged activities" />
        <StatCard label="Calls" value={byType("call")} sub="Phone calls" />
        <StatCard label="Emails" value={byType("email")} sub="Email threads" />
        <StatCard label="Tasks" value={byType("task")} sub="Pending tasks" />
      </div>

      <Table
        columns={[...COLUMNS, {
          key: "_actions", label: "",
          render: (r) => (
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); setModal({ edit: r }); }}>Edit</Btn>
              <Btn variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Btn>
            </div>
          )
        }]}
        rows={rows}
        loading={loading}
        emptyText="No activities logged yet."
      />

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Log Activity">
        <ActivityForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Edit Activity">
        {modal?.edit && <ActivityForm initial={modal.edit} onSubmit={handleEdit} loading={saving} />}
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Activity"
        message={`Delete this activity? This cannot be undone.`}
        dangerous
      />
    </div>
  );
}
