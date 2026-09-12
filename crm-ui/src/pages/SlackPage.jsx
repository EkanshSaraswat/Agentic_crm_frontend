import { useState } from "react";
import { PageHeader, Btn, Field, Input, Alert, useApi, Badge } from "../components/ui";
import { slackApi } from "../lib/api";
import { Hash, CheckCircle, AlertCircle } from "lucide-react";

export default function SlackPage() {
  const { data, loading, error, reload } = useApi(slackApi.get, null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("#crm-notifications");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleConnect = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await slackApi.connect({ webhook_url: webhookUrl, channel });
      setMsg({ type: "success", text: "Slack integration connected successfully!" });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Slack Integration" description="Receive real-time lead and deal updates in your team's Slack channels" />

      <Alert message={error || msg?.text} type={msg?.type || "error"} />

      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-accent-cream rounded-lg text-primary-ink">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-ink">Slack Notification Bot</h3>
              <p className="text-sm text-muted-charcoal">Post updates for deals created, stage changes, and new activities</p>
            </div>
          </div>
          <Badge variant={data?.connected ? "success" : "secondary"}>
            {data?.connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        <form onSubmit={handleConnect} className="space-y-4 pt-4 border-t border-accent-sepia/15">
          <Field label="Incoming Webhook URL">
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              required
            />
          </Field>
          <Field label="Default Channel">
            <Input
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="#crm-alerts"
              required
            />
          </Field>
          <div className="pt-2">
            <Btn type="submit" loading={saving}>
              {data?.connected ? "Update Connection" : "Connect Slack Workspace"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
