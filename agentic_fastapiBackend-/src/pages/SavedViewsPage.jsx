import { useState } from "react";
import { useApi, PageHeader, Table, Btn, Modal, Field, Input, Confirm, Alert, EmptyState, Badge } from "../components/ui";
import { savedViewsApi } from "../lib/api";

const COLUMNS = [
  { key: "name", label: "View Name", render: (r) => <span className="font-semibold">{r.name}</span> },
  { key: "entity_type", label: "Entity", render: (r) => <Badge variant="secondary">{r.entity_type}</Badge> },
  { key: "filters", label: "Filter JSON", render: (r) => <code className="text-xs bg-accent-cream/50 px-2 py-1 rounded border border-accent-sepia/20">{JSON.stringify(r.filters || {})}</code> },
];

export default function SavedViewsPage() {
  const { data: views, loading, error, reload } = useApi(savedViewsApi.list, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [entityType, setEntityType] = useState("company");
  const [filters, setFilters] = useState("{}");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    try {
      let parsed = {};
      try { parsed = JSON.parse(filters); } catch { throw new Error("Invalid JSON in filters"); }
      await savedViewsApi.create({ name, entity_type: entityType, filters: parsed });
      setModalOpen(false);
      setName("");
      setFilters("{}");
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await savedViewsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Views" description="Manage custom filter presets for your entities">
        <Btn onClick={() => setModalOpen(true)}>Create View</Btn>
      </PageHeader>

      <Alert message={error || actionError} type="error" />

      {loading ? (
        <div className="p-8 text-center text-muted-charcoal">Loading saved views...</div>
      ) : !views || views.length === 0 ? (
        <EmptyState title="No saved views found" description="Create a custom saved view to quickly filter your records.">
          <Btn onClick={() => setModalOpen(true)}>Create First View</Btn>
        </EmptyState>
      ) : (
        <Table columns={COLUMNS} data={views} onDelete={(row) => setDeleteTarget(row)} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Saved View">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="View Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. High Priority Leads" />
          </Field>
          <Field label="Entity Type">
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full px-3 py-2 border border-accent-sepia/30 rounded bg-paper-white focus:outline-none focus:ring-2 focus:ring-primary-ink/20"
            >
              <option value="company">Company</option>
              <option value="contact">Contact</option>
              <option value="deal">Deal</option>
              <option value="activity">Activity</option>
            </select>
          </Field>
          <Field label="Filter JSON Rules">
            <textarea
              rows={3}
              value={filters}
              onChange={(e) => setFilters(e.target.value)}
              className="w-full px-3 py-2 border border-accent-sepia/30 rounded bg-paper-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary-ink/20"
            />
          </Field>
          <div className="flex justify-end space-x-2 pt-2">
            <Btn variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Btn>
            <Btn type="submit" loading={saving}>Save View</Btn>
          </div>
        </form>
      </Modal>

      <Confirm
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Saved View"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
