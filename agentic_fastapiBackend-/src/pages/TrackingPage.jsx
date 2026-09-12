import { useState, useEffect } from "react";
import { PageHeader, Btn, Alert, useApi, Toggle } from "../components/ui";
import { trackingApi } from "../lib/api";
import { Activity } from "lucide-react";

export default function TrackingPage() {
  const { data, loading, error, reload } = useApi(trackingApi.get, null);
  const [openTracking, setOpenTracking] = useState(true);
  const [clickTracking, setClickTracking] = useState(true);
  const [domain, setDomain] = useState("trk.yourdomain.com");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (data) {
      setOpenTracking(data.open_tracking ?? true);
      setClickTracking(data.click_tracking ?? true);
      if (data.custom_domain) setDomain(data.custom_domain);
    }
  }, [data]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await trackingApi.update({ open_tracking: openTracking, click_tracking: clickTracking, custom_domain: domain });
      setMsg({ type: "success", text: "Email tracking settings updated" });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Email Tracking & Analytics" description="Configure pixel open tracking, link clicks, and custom tracking domains" />
      <Alert message={error || msg?.text} type={msg?.type || "error"} />

      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-cream rounded-lg text-primary-ink"><Activity className="w-6 h-6" /></div>
          <div>
            <h3 className="font-semibold text-primary-ink">Engagement Tracking Preferences</h3>
            <p className="text-sm text-muted-charcoal">Track when recipients open emails or click links sent through the CRM</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-accent-sepia/15">
          <Toggle label="Enable Email Open Tracking (1x1 Transparent Pixel)" checked={openTracking} onChange={setOpenTracking} />
          <Toggle label="Enable Link Click Tracking & Redirects" checked={clickTracking} onChange={setClickTracking} />
          <div className="pt-2">
            <Btn type="submit" loading={saving}>Save Tracking Options</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
