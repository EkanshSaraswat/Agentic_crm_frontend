import { useState, useEffect } from "react";
import { PageHeader, Btn, Field, Input, Alert, useApi, Toggle } from "../components/ui";
import { ssoApi } from "../lib/api";
import { ShieldCheck } from "lucide-react";

export default function SsoPage() {
  const { data, loading, error, reload } = useApi(ssoApi.get, null);
  const [enabled, setEnabled] = useState(false);
  const [domain, setDomain] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (data) {
      setEnabled(data.enabled ?? false);
      setDomain(data.domain || "");
      setMetadataUrl(data.metadata_url || "");
    }
  }, [data]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await ssoApi.update({ enabled, domain, metadata_url: metadataUrl });
      setMsg({ type: "success", text: "SSO settings updated!" });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Single Sign-On (SSO)" description="Configure SAML 2.0 / OAuth2 authentication for your enterprise domain" />

      <Alert message={error || msg?.text} type={msg?.type || "error"} />

      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-cream rounded-lg text-primary-ink">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-ink">Enterprise SSO Enforcement</h3>
            <p className="text-sm text-muted-charcoal">Restrict organization logins to your identity provider (Okta, Azure AD, Google Workspace)</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-accent-sepia/15">
          <Toggle label="Enforce SSO for team members" checked={enabled} onChange={setEnabled} />
          
          <Field label="Allowed SSO Domain">
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="acme.com" />
          </Field>

          <Field label="IdP Metadata XML URL / Endpoint">
            <Input value={metadataUrl} onChange={(e) => setMetadataUrl(e.target.value)} placeholder="https://idp.okta.com/app/exk..." />
          </Field>

          <div className="pt-2">
            <Btn type="submit" loading={saving}>Save SSO Configuration</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
