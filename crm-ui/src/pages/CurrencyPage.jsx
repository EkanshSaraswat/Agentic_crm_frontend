import { useState } from "react";
import { useApi, PageHeader, Table, Btn, Modal, Field, Input, Confirm, Alert, EmptyState } from "../components/ui";
import { currencyApi } from "../lib/api";

const COLUMNS = [
  { key: "code", label: "Code", render: (r) => <span className="font-mono text-sm font-medium">{r.code}</span> },
  { key: "symbol", label: "Symbol" },
  { key: "name", label: "Name" },
  { key: "exchange_rate", label: "Rate (vs USD)", render: (r) => r.exchange_rate ?? "—" },
];

function CurrencyForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ code: "", symbol: "", name: "", exchange_rate: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, exchange_rate: Number(form.exchange_rate) || null }); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Code *"><Input required value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="EUR" maxLength={3} /></Field>
        <Field label="Symbol *"><Input required value={form.symbol} onChange={(e) => set("symbol", e.target.value)} placeholder="€" /></Field>
      </div>
      <Field label="Name *"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Euro" /></Field>
      <Field label="Exchange Rate (vs USD)"><Input type="number" step="0.0001" value={form.exchange_rate} onChange={(e) => set("exchange_rate", e.target.value)} placeholder="0.9300" /></Field>
      <div className="flex justify-end pt-2"><Btn type="submit" disabled={loading}>{loading ? "Adding…" : "Add Currency"}</Btn></div>
    </form>
  );
}

export default function CurrencyPage() {
  const { data, loading, error, reload } = useApi(() => currencyApi.list());
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const rows = data?.items ?? data?.rows ?? [];

  async function handleCreate(form) {
    setSaving(true);
    try { await currencyApi.create(form); setModal(false); setAlert({ type: "success", msg: "Currency added." }); reload(); }
    catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await currencyApi.delete(deleting.id); setDeleting(null); setAlert({ type: "success", msg: "Currency removed." }); reload(); }
    catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PageHeader breadcrumb="Organize / Currency" title="Currencies" actions={<Btn onClick={() => setModal(true)}>+ Add Currency</Btn>} />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}
      {error ? <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} /> : (
        <Table
          columns={[...COLUMNS, { key: "_a", label: "", render: (r) => <Btn variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Remove</Btn> }]}
          rows={rows} loading={loading} emptyText="No currencies configured."
        />
      )}
      <Modal open={modal} onClose={() => setModal(false)} title="Add Currency"><CurrencyForm onSubmit={handleCreate} loading={saving} /></Modal>
      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Remove Currency" message={`Remove ${deleting?.code}?`} dangerous />
    </div>
  );
}
