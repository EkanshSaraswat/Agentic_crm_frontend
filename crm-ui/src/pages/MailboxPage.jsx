import { useState } from "react";
import { PageHeader, Btn, Field, Input, Alert, useApi, Badge } from "../components/ui";
import { mailboxApi } from "../lib/api";
import { Mail } from "lucide-react";

export default function MailboxPage() {
  const { data, loading, error, reload } = useApi(mailboxApi.get, null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleConnect = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await mailboxApi.connect({ email });
      setMsg({ type: "success", text: `Connected mailbox for ${email}` });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Mailbox Integration" description="Connect IMAP/SMTP or custom mailboxes for automated email logging" />
      <Alert message={error || msg?.text} type={msg?.type || "error"} />
      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-accent-cream rounded-lg text-primary-ink"><Mail className="w-6 h-6" /></div>
            <div>
              <h3 className="font-semibold text-primary-ink">Connected Email Sync</h3>
              <p className="text-sm text-muted-charcoal">Automatically link incoming client communications to Contacts and Deals</p>
            </div>
          </div>
          <Badge variant={data?.connected ? "success" : "secondary"}>{data?.connected ? "Active" : "Not Configured"}</Badge>
        </div>
        <form onSubmit={handleConnect} className="space-y-4 pt-4 border-t border-accent-sepia/15">
          <Field label="Business Email Address">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@company.com" required />
          </Field>
          <Btn type="submit" loading={saving}>Connect Mailbox</Btn>
        </form>
      </div>
    </div>
  );
}
