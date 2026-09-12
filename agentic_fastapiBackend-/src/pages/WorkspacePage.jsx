import { useState } from "react";
import { PageHeader, Btn, Field, Input, Alert, useApi, Toggle } from "../components/ui";
import { workspaceApi } from "../lib/api";

export default function Workspace() {
  const { data, loading, reload } = useApi(() => workspaceApi.get());
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const current = form ?? data ?? {};
  const set = (k, v) => setForm((f) => ({ ...(f ?? data ?? {}), [k]: v }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await workspaceApi.update(current);
      setForm(null);
      setAlert({ type: "success", msg: "Workspace updated." });
      reload();
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PageHeader breadcrumb="Admin / Workspace" title="Workspace" />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      {loading ? (
        <p className="text-stone animate-pulse text-sm">Loading workspace…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 border border-ink/10 rounded-xl space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stone">General</h3>
            <Field label="Workspace Name">
              <Input value={current.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="My Company" />
            </Field>
            <Field label="Subdomain">
              <Input value={current.subdomain ?? ""} onChange={(e) => set("subdomain", e.target.value)} placeholder="mycompany" />
            </Field>
            <Field label="Website">
              <Input type="url" value={current.website ?? ""} onChange={(e) => set("website", e.target.value)} placeholder="https://mycompany.com" />
            </Field>
          </div>

          <div className="p-6 border border-ink/10 rounded-xl space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stone">Preferences</h3>
            <Toggle
              checked={!!current.allow_signup}
              onChange={(v) => set("allow_signup", v)}
              label="Allow public sign-up"
            />
            <Toggle
              checked={!!current.require_email_verification}
              onChange={(v) => set("require_email_verification", v)}
              label="Require email verification"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Btn variant="secondary" type="button" onClick={() => setForm(null)}>Reset</Btn>
            <Btn type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Btn>
          </div>
        </form>
      )}
    </div>
  );
}
