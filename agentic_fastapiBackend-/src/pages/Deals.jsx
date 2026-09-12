import { useState } from "react";
import { useApi, PageHeader, StatCard, Table, Modal, Btn, Field, Input, Select, Confirm, Alert, SearchBar, EmptyState, Badge } from "../components/ui";
import { dealsApi } from "../lib/api";

const STAGES = ["prospect", "qualified", "proposal", "negotiation", "won", "lost"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];
const FORECAST_CATS = ["pipeline", "best_case", "commit", "omit"];

const COLUMNS = [
  { key: "name", label: "Deal" },
  { key: "stage", label: "Stage", render: (r) => <Badge label={r.stage} /> },
  { key: "amount", label: "Amount", render: (r) => r.amount != null ? `${r.currency ?? "USD"} ${Number(r.amount).toLocaleString()}` : "—" },
  { key: "forecast_category", label: "Forecast", render: (r) => <Badge label={r.forecast_category} /> },
  { key: "company_id", label: "Company" },
  { key: "stage_changed_at", label: "Stage Changed", render: (r) => r.stage_changed_at ? new Date(r.stage_changed_at).toLocaleDateString() : "—" },
];

function DealForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "", company_id: "", amount: "", currency: "USD", expected_close_date: "", ...initial,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, amount: form.amount ? Number(form.amount) : null }); }} className="space-y-5">
      <Field label="Deal Name *"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Acme Enterprise Deal" /></Field>
      <Field label="Company ID *"><Input required value={form.company_id} onChange={(e) => set("company_id", e.target.value)} placeholder="company UUID" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount"><Input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0.00" /></Field>
        <Field label="Currency">
          <Select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Expected Close Date"><Input type="date" value={form.expected_close_date} onChange={(e) => set("expected_close_date", e.target.value)} /></Field>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Btn>
      </div>
    </form>
  );
}

function StageModal({ deal, onClose, onSave }) {
  const [stage, setStage] = useState(deal?.stage ?? "prospect");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try { await onSave(deal.id, stage); onClose(); }
    finally { setSaving(false); }
  }

  return (
    <Modal open={!!deal} onClose={onClose} title="Change Stage">
      <div className="space-y-4">
        <Field label="Stage">
          <Select value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <div className="flex justify-end gap-3">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? "Updating…" : "Update Stage"}</Btn>
        </div>
      </div>
    </Modal>
  );
}

export default function Deals() {
  const { data, loading, error, reload } = useApi(() => dealsApi.list({ page_size: 50 }));
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [stageDeal, setStageDeal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = (data?.rows ?? []).filter(
    (r) => !search || r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = (data?.rows ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);
  const wonDeals = (data?.rows ?? []).filter(r => r.stage === "won");
  const wonValue = wonDeals.reduce((s, r) => s + (r.amount ?? 0), 0);

  async function handleCreate(form) {
    setSaving(true);
    try {
      await dealsApi.create(form);
      setModal(null);
      setAlert({ type: "success", msg: "Deal created." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      await dealsApi.update(modal.edit.id, form);
      setModal(null);
      setAlert({ type: "success", msg: "Deal updated." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await dealsApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "Deal deleted." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  async function handleStage(id, stage) {
    await dealsApi.setStage(id, stage);
    setAlert({ type: "success", msg: "Stage updated." });
    reload();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="CRM / Deals"
        title="Deals"
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search deals…" />
            <Btn onClick={() => setModal("create")}>+ New Deal</Btn>
          </>
        }
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Deals" value={data?.total ?? "—"} sub="All pipeline deals" />
        <StatCard label="Pipeline Value" value={totalValue ? `$${totalValue.toLocaleString()}` : "—"} sub="Sum of all amounts" />
        <StatCard label="Won" value={wonDeals.length} sub={wonValue ? `$${wonValue.toLocaleString()} closed` : "No closed deals yet"} />
        <StatCard label="Stages" value={STAGES.length} sub="Deal pipeline steps" />
      </div>

      {error ? (
        <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} />
      ) : (
        <Table
          columns={[...COLUMNS, {
            key: "_actions", label: "",
            render: (r) => (
              <div className="flex gap-2 justify-end">
                <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); setStageDeal(r); }}>Stage</Btn>
                <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); setModal({ edit: r }); }}>Edit</Btn>
                <Btn variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Btn>
              </div>
            )
          }]}
          rows={rows}
          loading={loading}
          emptyText="No deals yet. Start your pipeline."
        />
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="New Deal">
        <DealForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Edit Deal">
        {modal?.edit && <DealForm initial={modal.edit} onSubmit={handleEdit} loading={saving} />}
      </Modal>
      <StageModal deal={stageDeal} onClose={() => setStageDeal(null)} onSave={handleStage} />
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
        dangerous
      />
    </div>
  );
}
