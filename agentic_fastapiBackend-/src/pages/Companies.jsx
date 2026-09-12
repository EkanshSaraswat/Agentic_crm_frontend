import { useState } from "react";
import { useApi, PageHeader, StatCard, Table, Modal, Btn, Field, Input, Select, Confirm, Alert, SearchBar, EmptyState } from "../components/ui";
import { companiesApi } from "../lib/api";

const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Media", "Education", "Other"];
const STAGES = ["lead", "prospect", "customer", "churned"];

const COLUMNS = [
  { key: "name", label: "Company" },
  { key: "domain", label: "Domain" },
  { key: "industry", label: "Industry" },
  { key: "lifecycle_stage", label: "Stage", render: (r) => <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-ink/10 text-ink/70">{r.lifecycle_stage ?? "—"}</span> },
  { key: "created_at", label: "Created", render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : "—" },
];

function CompanyForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", domain: "", website: "", industry: "", ...initial });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <Field label="Company name *"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Acme Inc." /></Field>
      <Field label="Domain"><Input value={form.domain} onChange={(e) => set("domain", e.target.value)} placeholder="acme.com" /></Field>
      <Field label="Website"><Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://acme.com" /></Field>
      <Field label="Industry">
        <Select value={form.industry} onChange={(e) => set("industry", e.target.value)}>
          <option value="">Select industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </Select>
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Btn>
      </div>
    </form>
  );
}

export default function Companies() {
  const { data, loading, error, reload } = useApi(() => companiesApi.list({ page_size: 50 }));
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "create" | { edit: row }
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = (data?.rows ?? []).filter(
    (r) => !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.domain?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(form) {
    setSaving(true);
    try {
      await companiesApi.create(form);
      setModal(null);
      setAlert({ type: "success", msg: "Company created." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      await companiesApi.update(modal.edit.id, form);
      setModal(null);
      setAlert({ type: "success", msg: "Company updated." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await companiesApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "Company deleted." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="CRM / Companies"
        title="Companies"
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search companies…" />
            <Btn onClick={() => setModal("create")}>+ New Company</Btn>
          </>
        }
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Companies" value={data?.total ?? "—"} sub="All workspace companies" />
        <StatCard label="With Domain" value={data?.rows?.filter(r => r.domain).length ?? "—"} sub="Matched by domain" />
        <StatCard label="Customers" value={data?.rows?.filter(r => r.lifecycle_stage === "customer").length ?? "—"} sub="Converted accounts" />
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
          emptyText="No companies yet. Create your first one."
        />
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="New Company">
        <CompanyForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Edit Company">
        {modal?.edit && <CompanyForm initial={modal.edit} onSubmit={handleEdit} loading={saving} />}
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Delete "${deleting?.name}"? This action cannot be undone.`}
        dangerous
      />
    </div>
  );
}
