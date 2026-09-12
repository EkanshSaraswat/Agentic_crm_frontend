import { useState } from "react";
import { useApi, PageHeader, Btn, Field, Input, Alert, Toggle } from "../components/ui";
import { settingsApi } from "../lib/api";

export default function Settings() {
  const { data, loading, reload } = useApi(() => settingsApi.get());
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const current = form ?? data ?? {};
  const set = (k, v) => setForm((f) => ({ ...(f ?? data ?? {}), [k]: v }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(current);
      setAlert({ type: "success", msg: "Settings saved." });
      setForm(null);
      reload();
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PageHeader breadcrumb="Admin / Settings" title="Settings" />
      {alert && <div className="mb-6"><Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert></div>}

      {loading ? (
        <p className="text-stone animate-pulse text-sm">Loading settings…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 border border-ink/10 rounded-xl space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stone">Notifications</h3>
            <Toggle checked={!!current.email_notifications} onChange={(v) => set("email_notifications", v)} label="Email notifications" />
            <Toggle checked={!!current.slack_notifications} onChange={(v) => set("slack_notifications", v)} label="Slack notifications" />
            <Toggle checked={!!current.activity_digest} onChange={(v) => set("activity_digest", v)} label="Daily activity digest" />
          </div>

          <div className="p-6 border border-ink/10 rounded-xl space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stone">CRM Defaults</h3>
            <Field label="Default currency">
              <Input value={current.default_currency ?? ""} onChange={(e) => set("default_currency", e.target.value)} placeholder="USD" />
            </Field>
            <Field label="Fiscal year start (month)">
              <Input type="number" min="1" max="12" value={current.fiscal_year_start ?? ""} onChange={(e) => set("fiscal_year_start", e.target.value)} placeholder="1" />
            </Field>
          </div>

          <div className="p-6 border border-ink/10 rounded-xl space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stone">Privacy & Data</h3>
            <Toggle checked={!!current.anonymize_data} onChange={(v) => set("anonymize_data", v)} label="Anonymize exported data" />
            <Toggle checked={!!current.gdpr_mode} onChange={(v) => set("gdpr_mode", v)} label="GDPR compliance mode" />
          </div>

          <div className="flex justify-end gap-3">
            <Btn variant="secondary" type="button" onClick={() => setForm(null)}>Reset</Btn>
            <Btn type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</Btn>
          </div>
        </form>
      )}
    </div>
  );
}
