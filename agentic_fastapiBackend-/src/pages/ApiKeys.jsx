import { useState } from "react";
import { useApi, PageHeader, Table, Btn, Modal, Field, Input, Confirm, Alert, EmptyState } from "../components/ui";
import { apiKeysApi } from "../lib/api";
import { Eye, EyeOff, Copy } from "lucide-react";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "prefix", label: "Prefix", render: (r) => <span className="font-mono text-xs text-stone">{r.prefix ?? r.key_preview ?? "sk-…"}</span> },
  { key: "created_at", label: "Created", render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : "—" },
  { key: "last_used_at", label: "Last Used", render: (r) => r.last_used_at ? new Date(r.last_used_at).toLocaleDateString() : "Never" },
];

function NewKeyModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await apiKeysApi.create({ name });
      setNewKey(result.key ?? result.raw_key ?? "sk-xxxxxxxxxxxx");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setName("");
    setNewKey(null);
    setVisible(false);
    onClose();
    if (newKey) onCreated?.();
  }

  return (
    <Modal open={open} onClose={handleClose} title="New API Key">
      {!newKey ? (
        <form onSubmit={handleCreate} className="space-y-5">
          <Field label="Key name *">
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Production integration" />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Btn type="submit" disabled={saving}>{saving ? "Creating…" : "Create Key"}</Btn>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            ⚠ Copy this key now. You won't be able to see it again.
          </div>
          <div className="flex items-center gap-2 p-3 bg-ink/5 rounded border border-ink/10">
            <code className="text-xs font-mono text-ink flex-1 select-all">{visible ? newKey : "•".repeat(32)}</code>
            <button onClick={() => setVisible(v => !v)} className="text-stone hover:text-ink">
              {visible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button onClick={copy} className="text-stone hover:text-ink">
              <Copy size={14} />
            </button>
          </div>
          {copied && <p className="text-xs text-green-600 font-mono">Copied to clipboard!</p>}
          <div className="flex justify-end">
            <Btn onClick={handleClose}>Done</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function ApiKeys() {
  const { data, loading, error, reload } = useApi(() => apiKeysApi.list());
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState(null);

  const rows = data?.items ?? data?.rows ?? data ?? [];

  async function handleDelete() {
    try {
      await apiKeysApi.delete(deleting.id);
      setDeleting(null);
      setAlert({ type: "success", msg: "API key revoked." });
      reload();
    } catch (e) { setAlert({ type: "error", msg: e.message }); }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        breadcrumb="Admin / API Keys"
        title="API Keys"
        actions={<Btn onClick={() => setModal(true)}>+ New API Key</Btn>}
      />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      <div className="mb-6 p-4 border border-ink/10 rounded-lg text-sm text-stone">
        API keys grant programmatic access to your Ledger CRM workspace. Keep them secret. Never commit them to source control.
      </div>

      {error ? (
        <EmptyState icon="⚠" title="Failed to load" message={error} action={<Btn onClick={reload}>Retry</Btn>} />
      ) : (
        <Table
          columns={[...COLUMNS, {
            key: "_actions", label: "",
            render: (r) => (
              <Btn variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Revoke</Btn>
            )
          }]}
          rows={rows}
          loading={loading}
          emptyText="No API keys yet."
        />
      )}

      <NewKeyModal open={modal} onClose={() => setModal(false)} onCreated={reload} />
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Revoke API Key"
        message={`Revoke "${deleting?.name}"? Any integrations using this key will break immediately.`}
        dangerous
      />
    </div>
  );
}
