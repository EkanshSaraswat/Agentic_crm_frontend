import { useState } from "react";
import { PageHeader, Btn, Field, Input, Select, Alert, useApi, StatCard } from "../components/ui";
import { backfillApi } from "../lib/api";
import { UploadCloud, Clock } from "lucide-react";

export default function BackfillPage() {
  const { data, loading, error, reload } = useApi(backfillApi.get, null);
  const [entityType, setEntityType] = useState("company");
  const [days, setDays] = useState("30");
  const [starting, setStarting] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleStart = async (e) => {
    e.preventDefault();
    setStarting(true);
    setMsg(null);
    try {
      await backfillApi.start({ entity_type: entityType, days: parseInt(days, 10) });
      setMsg({ type: "success", text: `Backfill process queued for ${entityType} (${days} days)` });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Historical Data Backfill" description="Backfill historical records from connected email, CRM, or external sources" />

      <Alert message={error || msg?.text} type={msg?.type || "error"} />

      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-cream rounded-lg text-primary-ink">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-ink">Trigger Historical Ingestion Job</h3>
            <p className="text-sm text-muted-charcoal">Run background batch sync to import past communications and contact timelines</p>
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-4 pt-4 border-t border-accent-sepia/15">
          <Field label="Target Entity">
            <Select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
              <option value="company">Companies</option>
              <option value="contact">Contacts</option>
              <option value="deal">Deals</option>
              <option value="activity">Activities</option>
            </Select>
          </Field>
          <Field label="Historical Depth (Days)">
            <Input type="number" value={days} onChange={(e) => setDays(e.target.value)} min="1" max="365" />
          </Field>
          <Btn type="submit" loading={starting}>Start Ingestion</Btn>
        </form>
      </div>
    </div>
  );
}
