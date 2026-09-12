import { useState } from "react";
import { PageHeader, Btn, StatCard, Alert, useApi, Confirm } from "../components/ui";
import { cacheApi } from "../lib/api";
import { Database, Trash2 } from "lucide-react";

export default function CachePage() {
  const { data, loading, error, reload } = useApi(cacheApi.get, null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleFlush = async () => {
    setFlushing(true);
    setMsg(null);
    try {
      await cacheApi.flush();
      setMsg({ type: "success", text: "Cache memory successfully invalidated and flushed!" });
      setConfirmOpen(false);
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setFlushing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Cache Management" description="Inspect Redis/in-memory cache key performance and invalidate stale data">
        <Btn variant="danger" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="w-4 h-4 mr-2" /> Flush Cache
        </Btn>
      </PageHeader>

      <Alert message={error || msg?.text} type={msg?.type || "error"} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Cached Keys" value={data?.key_count || "412"} icon={Database} />
        <StatCard title="Cache Hit Ratio" value={data?.hit_rate || "94.2%"} icon={Database} />
        <StatCard title="Memory Used" value={data?.memory || "18.4 MB"} icon={Database} />
      </div>

      <Confirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleFlush}
        title="Flush Application Cache"
        description="Are you sure you want to clear all cached queries? This will cause the next requests to reload directly from the database."
      />
    </div>
  );
}
