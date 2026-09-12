import { useState } from "react";
import { PageHeader, Btn, Alert, useApi, Badge } from "../components/ui";
import { googleApi } from "../lib/api";
import { Globe } from "lucide-react";

export default function GooglePage() {
  const { data, loading, error, reload } = useApi(googleApi.get, null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleConnect = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await googleApi.connect({});
      setMsg({ type: "success", text: "Google Workspace OAuth connection initiated!" });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Google Workspace Integration" description="Sync Gmail messages and Google Calendar meetings directly into CRM" />
      <Alert message={error || msg?.text} type={msg?.type || "error"} />
      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-accent-cream rounded-lg text-primary-ink"><Globe className="w-6 h-6" /></div>
            <div>
              <h3 className="font-semibold text-primary-ink">Google Workspace OAuth</h3>
              <p className="text-sm text-muted-charcoal">Two-way sync for meetings, contact notes, and email history</p>
            </div>
          </div>
          <Badge variant={data?.connected ? "success" : "secondary"}>{data?.connected ? "Connected" : "Disconnected"}</Badge>
        </div>
        <div className="pt-4 border-t border-accent-sepia/15">
          <Btn onClick={handleConnect} loading={saving}>Sign in with Google Workspace</Btn>
        </div>
      </div>
    </div>
  );
}
