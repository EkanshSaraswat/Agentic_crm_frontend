import { useState, useEffect } from "react";
import { PageHeader, StatCard, Btn, Alert, useApi, EmptyState } from "../components/ui";
import { companiesApi, contactsApi, dealsApi, activitiesApi } from "../lib/api";

function MiniTimeline({ items }) {
  if (!items.length) return <p className="text-sm text-stone">No recent activity.</p>;
  return (
    <div className="space-y-3">
      {items.slice(0, 8).map((a, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-ink/30 mt-1.5 shrink-0" />
          <div>
            <div className="text-sm text-ink font-medium">{a.subject || a.type || "Activity"}</div>
            <div className="text-xs text-stone">{a.occurred_at ? new Date(a.occurred_at).toLocaleDateString() : "Recently"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineBar({ deals }) {
  const stages = ["prospect", "qualified", "proposal", "negotiation", "won", "lost"];
  const total = deals.length || 1;
  const colors = ["bg-sky-400", "bg-violet-400", "bg-amber-400", "bg-orange-400", "bg-green-400", "bg-red-400"];

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const count = deals.filter(d => d.stage === stage).length;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={stage} className="flex items-center gap-3">
            <div className="text-xs font-mono text-stone w-24 capitalize">{stage}</div>
            <div className="flex-1 bg-ink/5 rounded-full h-2">
              <div className={`${colors[i]} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs font-mono text-ink w-8 text-right">{count}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { data: companies, loading: lc } = useApi(() => companiesApi.list({ page_size: 5 }));
  const { data: contacts, loading: lct } = useApi(() => contactsApi.list({ page_size: 5 }));
  const { data: deals, loading: ld } = useApi(() => dealsApi.list({ page_size: 50 }));
  const { data: activities, loading: la } = useApi(() => activitiesApi.list({ page_size: 10 }));

  const dealRows = deals?.rows ?? [];
  const totalValue = dealRows.reduce((s, d) => s + (d.amount ?? 0), 0);
  const wonValue = dealRows.filter(d => d.stage === "won").reduce((s, d) => s + (d.amount ?? 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader breadcrumb="Workspace / Dashboard" title="Dashboard" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Companies" value={companies?.total ?? "—"} sub="Total accounts" />
        <StatCard label="Contacts" value={contacts?.total ?? "—"} sub="People in CRM" />
        <StatCard label="Open Deals" value={dealRows.filter(d => !["won","lost"].includes(d.stage)).length || "—"} sub={`Pipeline: $${totalValue.toLocaleString()}`} />
        <StatCard label="Won Revenue" value={wonValue ? `$${wonValue.toLocaleString()}` : "—"} sub={`${dealRows.filter(d=>d.stage==="won").length} deals closed`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Deal pipeline */}
        <div className="p-6 border border-ink/10 rounded-xl">
          <h3 className="font-mono text-xs uppercase tracking-wider text-stone mb-5">Deal Pipeline</h3>
          {ld ? (
            <p className="text-sm text-stone animate-pulse">Loading…</p>
          ) : (
            <PipelineBar deals={dealRows} />
          )}
        </div>

        {/* Recent activities */}
        <div className="p-6 border border-ink/10 rounded-xl">
          <h3 className="font-mono text-xs uppercase tracking-wider text-stone mb-5">Recent Activities</h3>
          {la ? (
            <p className="text-sm text-stone animate-pulse">Loading…</p>
          ) : (
            <MiniTimeline items={activities?.rows ?? []} />
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="p-6 border border-ink/10 rounded-xl">
        <h3 className="font-mono text-xs uppercase tracking-wider text-stone mb-5">Activity Breakdown</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {["call", "email", "task", "meeting", "note", "sms"].map((type) => {
            const n = (activities?.rows ?? []).filter(a => a.type === type).length;
            return (
              <div key={type} className="text-center p-3 border border-ink/10 rounded-lg">
                <div className="text-xl font-serif font-medium text-ink">{n}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone mt-1">{type}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
