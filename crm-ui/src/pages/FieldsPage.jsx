import { useState } from "react";
import { useApi, PageHeader, StatCard, Table, Modal, Btn, Field, Input, Select, Confirm, Alert, Toggle, EmptyState } from "../components/ui";
import { fieldsApi } from "../lib/api";

const ENTITIES = ["company", "contact", "deal", "activity"];
const FIELD_TYPES = ["text", "number", "date", "boolean", "select", "url", "email", "phone"];

const COLUMNS = [
  { key: "entity", label: "Entity", render: (r) => <span className="font-mono text-xs text-stone uppercase">{r.entity}</span> },
  { key: "label", label: "Label" },
  { key: "key", label: "Key", render: (r) => <span className="font-mono text-xs text-stone">{r.key}</span> },
  { key: "type", label: "Type", render: (r) => <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-ink/10 text-ink/70">{r.type}</span> },
  { key: "required", label: "Required", render: (r) => <span className={`text-xs font-mono ${r.required ? "text-green-700" : "text-stone"}`}>{r.required ? "Yes" : "No"}</span> },
  { key: "show_on_table", label: "Table", render: (r) => <span className={`text-xs font-mono ${r.show_on_table ? "text-green-700" : "text-stone"}`}>{r.show_on_table ? "✓" : "—"}</span> },
  { key: "show_on_filter", label: "Filter", render: (r) => <span className={`text-xs font-mono ${r.show_on_filter ? "text-green-700" : "text-stone"}`}>{r.show_on_filter ? "✓" : "—"}</span> },
];

function FieldForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ entity: "company", key: "", label: "", type: "text", required: false, show_on_table: false, show_on_filter: true, sortable: false });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Entity *">
          <Select required value={form.entity} onChange={(e) => set("entity", e.target.value)}>
            {ENTITIES.map((e) => <option key={e} value={e}>{e}</option>)}
          </Select>
        </Field>
        <Field label="Type *">
          <Select required value={form.type} onChange={(e) => set("type", e.target.value)}>
            {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Key *">
        <Input required value={form.key} onChange={(e) => set("key", e.target.value.replace(/\s+/g, "_").toLowerCase())} placeholder="my_custom_field" />
      </Field>
      <Field label="Label *"><Input required value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="My Custom Field" /></Field>
      <div className="space-y-3 pt-1">
        <Toggle checked={form.required} onChange={(v) => set("required", v)} label="Required field" />
        <Toggle checked={form.show_on_table} onChange={(v) => set("show_on_table", v)} label="Show in table view" />
        <Toggle checked={form.show_on_filter} onChange={(v) => set("show_on_filter", v)} label="Show in filter panel" />
        <Toggle checked={form.sortable} onChange={(v) => set("sortable", v)} label="Sortable" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Creating…" : "Create Field"}</Btn>
      </div>
    </form>
  );
}

export default function Fields() {
  const [entity, setEntity] = useState("");
  const { data, loading, error, reload } = useApi(() => fieldsApi.list(entity), [entity]);
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = data?.rows ?? data ?? [];

  async function handleCreate(form) {
    setSaving(true);
    try {
      await fieldsApi.create(form);
      setModal(false);
      setAlert({ type: "success", msg: "Field created." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await fieldsApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "Field deleted." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="Organize / Fields"
        title="Custom Fields"
        actions={<Btn onClick={() => setModal(true)}>+ New Field</Btn>}
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {ENTITIES.map((e) => (
          <StatCard key={e} label={e} value={rows.filter(r => r.entity === e).length} sub={`${e} fields`} />
        ))}
      </div>

      {/* Filter by entity */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-stone uppercase tracking-wider">Filter:</span>
        {["", ...ENTITIES].map((e) => (
          <button
            key={e}
            onClick={() => setEntity(e)}
            className={`px-3 py-1 text-xs font-mono rounded border transition-all ${entity === e ? "bg-ink text-paper border-ink" : "border-ink/20 text-stone hover:text-ink hover:border-ink/40"}`}
          >
            {e || "All"}
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} />
      ) : (
        <Table
          columns={[...COLUMNS, {
            key: "_actions", label: "",
            render: (r) => (
              <div className="flex gap-2 justify-end">
                <Btn variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Btn>
              </div>
            )
          }]}
          rows={rows}
          loading={loading}
          emptyText="No custom fields defined yet."
        />
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New Custom Field">
        <FieldForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Field"
        message={`Delete field "${deleting?.label}"? Records using this field will lose the data.`}
        dangerous
      />
    </div>
  );
}
