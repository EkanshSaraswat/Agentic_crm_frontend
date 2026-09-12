import { useState } from "react";
import { useApi, PageHeader, Table, Btn, Modal, Field, Input, Select, Confirm, Alert, EmptyState, Badge } from "../components/ui";
import { usersApi } from "../lib/api";

const ROLES = ["member", "manager", "owner"];

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (r) => <Badge label={r.role} /> },
  { key: "created_at", label: "Joined", render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : "—" },
];

function UserForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", email: "", role: "member", password: "", ...initial });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <Field label="Full Name *"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" /></Field>
      <Field label="Email *"><Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" /></Field>
      {!initial.id && (
        <Field label="Password *"><Input required type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" /></Field>
      )}
      <Field label="Role">
        <Select value={form.role} onChange={(e) => set("role", e.target.value)}>
          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </Select>
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Btn type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Btn>
      </div>
    </form>
  );
}

export default function Users() {
  const { data, loading, error, reload } = useApi(() => usersApi.list());
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const rows = data?.items ?? data?.rows ?? [];

  async function handleCreate(form) {
    setSaving(true);
    try {
      await usersApi.create(form);
      setModal(null);
      setAlert({ type: "success", msg: "User invited." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      await usersApi.update(modal.edit.id, form);
      setModal(null);
      setAlert({ type: "success", msg: "User updated." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await usersApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "User removed." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        breadcrumb="Admin / Users"
        title="Users"
        actions={<Btn onClick={() => setModal("create")}>+ Invite User</Btn>}
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      {error ? (
        <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} />
      ) : (
        <Table
          columns={[...COLUMNS, {
            key: "_actions", label: "",
            render: (r) => (
              <div className="flex gap-2 justify-end">
                <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); setModal({ edit: r }); }}>Edit</Btn>
                <Btn variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Remove</Btn>
              </div>
            )
          }]}
          rows={rows}
          loading={loading}
          emptyText="No users found. Invite someone to collaborate."
        />
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Invite User">
        <UserForm onSubmit={handleCreate} loading={saving} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Edit User">
        {modal?.edit && <UserForm initial={modal.edit} onSubmit={handleEdit} loading={saving} />}
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Remove User"
        message={`Remove "${deleting?.name}" from the workspace?`}
        dangerous
      />
    </div>
  );
}
