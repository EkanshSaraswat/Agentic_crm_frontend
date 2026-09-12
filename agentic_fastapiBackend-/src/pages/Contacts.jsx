import { useState } from "react";
import { useApi, PageHeader, StatCard, Table, Modal, Btn, Field, Input, Select, Confirm, Alert, SearchBar, EmptyState, Badge } from "../components/ui";
import { contactsApi } from "../lib/api";

const STAGES = ["lead", "prospect", "customer", "churned"];
const LEAD_STATUSES = ["new", "open", "in_progress", "qualified", "unqualified"];

const COLUMNS = [
  { key: "name", label: "Name", render: (r) => `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "title", label: "Title" },
  { key: "lifecycle_stage", label: "Stage", render: (r) => <Badge label={r.lifecycle_stage} /> },
  { key: "lead_status", label: "Lead Status", render: (r) => <Badge label={r.lead_status} /> },
];

function ContactForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", title: "", company_id: "", ...initial });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name *"><Input required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="Jane" /></Field>
        <Field label="Last Name"><Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Doe" /></Field>
      </div>
      <Field label="Email"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@acme.com" /></Field>
      <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" /></Field>
      <Field label="Title"><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="VP of Engineering" /></Field>
      <Field label="Company ID"><Input value={form.company_id} onChange={(e) => set("company_id", e.target.value)} placeholder="company UUID" /></Field>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Btn>
      </div>
    </form>
  );
}

export default function Contacts() {
  const { data, loading, error, reload } = useApi(() => contactsApi.list({ page_size: 50 }));
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = (data?.rows ?? []).filter((r) => {
    const q = search.toLowerCase();
    return !q || `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
  });

  async function handleCreate(form) {
    setSaving(true);
    try {
      await contactsApi.create(form);
      setModal(null);
      setAlert({ type: "success", msg: "Contact created." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      await contactsApi.update(modal.edit.id, form);
      setModal(null);
      setAlert({ type: "success", msg: "Contact updated." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await contactsApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "Contact deleted." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="CRM / Contacts"
        title="Contacts"
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search contacts…" />
            <Btn onClick={() => setModal("create")}>+ New Contact</Btn>
          </>
        }
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Contacts" value={data?.total ?? "—"} sub="All contacts" />
        <StatCard label="Leads" value={data?.rows?.filter(r => r.lifecycle_stage === "lead").length ?? "—"} sub="Top of funnel" />
        <StatCard label="Customers" value={data?.rows?.filter(r => r.lifecycle_stage === "customer").length ?? "—"} sub="Converted contacts" />
      </div>

      {error ? (
        <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} />
      ) : (
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
          emptyText="No contacts yet. Create your first one."
        />
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="New Contact">
        <ContactForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Edit Contact">
        {modal?.edit && <ContactForm initial={modal.edit} onSubmit={handleEdit} loading={saving} />}
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={`Delete "${deleting?.first_name} ${deleting?.last_name}"? This cannot be undone.`}
        dangerous
      />
    </div>
  );
}
