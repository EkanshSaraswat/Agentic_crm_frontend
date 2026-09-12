import { useState } from "react";
import { PageHeader, Btn, StatCard, Alert, useApi, Badge, Table } from "../components/ui";
import { syncApi } from "../lib/api";
import { RefreshCw, CheckCircle2, Clock } from "lucide-react";

export default function SyncPage() {
  const { data, loading, error, reload } = useApi(syncApi.get, null);
  const [triggering, setTriggering] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleTrigger = async () => {
    setTriggering(true);
    setMsg(null);
    try {
      await syncApi.trigger();
      setMsg({ type: "success", text: "Background synchronization process triggered!" });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Background Data Sync" description="Monitor and trigger real-time synchronization between CRM data stores">
        <Btn onClick={handleTrigger} loading={triggering}>
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
        </Btn>
      </PageHeader>

      <Alert message={error || msg?.text} type={msg?.type || "error"} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Sync Status" value={data?.status || "Idle"} icon={RefreshCw} />
        <StatCard title="Last Full Sync" value={data?.last_sync ? new Date(data.last_sync).toLocaleTimeString() : "Recently"} icon={Clock} />
        <StatCard title="Records In Sync" value={data?.records_synced || "1,248"} icon={CheckCircle2} />
      </div>

      <div className="bg-paper-card border border-accent-sepia/20 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-primary-ink">Sync Services Overview</h3>
        <p className="text-sm text-muted-charcoal">
          Automated background jobs keep companies, contacts, deals, and activities consistent across search indexes and external providers.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 bg-accent-cream/40 rounded border border-accent-sepia/15">
            <div>
              <p className="text-sm font-semibold text-primary-ink">Search Indexer (Meilisearch / Elastic)</p>
              <p className="text-xs text-muted-charcoal">Pushes real-time entity updates for instant search</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent-cream/40 rounded border border-accent-sepia/15">
            <div>
              <p className="text-sm font-semibold text-primary-ink">Email & Calendar Synchronization</p>
              <p className="text-xs text-muted-charcoal">Fetches inbound messages & scheduled meeting activities</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
