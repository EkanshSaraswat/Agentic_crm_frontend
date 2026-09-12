import { useState } from "react";
import { PageHeader, Btn, Alert, useApi, Field, Input, EmptyState } from "../components/ui";
import { searchApi } from "../lib/api";
import { Search, Building2, Users, Handshake } from "lucide-react";

function ResultGroup({ label, items, icon: Icon }) {
  if (!items?.length) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-stone" />
        <span className="text-xs font-mono uppercase tracking-wider text-stone">{label}</span>
        <span className="text-xs text-stone/60">({items.length})</span>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-3 border border-ink/10 rounded-lg hover:bg-ink/5 cursor-pointer transition-colors">
            <div className="text-sm font-medium text-ink">
              {item.name ?? `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ?? item.id}
            </div>
            {(item.email || item.domain || item.stage) && (
              <div className="text-xs text-stone mt-0.5">{item.email ?? item.domain ?? item.stage}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSubmitted(q);
    try {
      const data = await searchApi.search(q);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalResults = (results?.companies?.length ?? 0) + (results?.contacts?.length ?? 0) + (results?.deals?.length ?? 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PageHeader breadcrumb="Organize / Search" title="Global Search" />

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies, contacts, deals…"
            className="w-full pl-10 pr-4 py-3 border border-ink/20 rounded-lg text-ink bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
          />
        </div>
        <Btn type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</Btn>
      </form>

      {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

      {results && submitted && (
        <div>
          <div className="text-xs font-mono text-stone mb-6">
            {totalResults} result{totalResults !== 1 ? "s" : ""} for "{submitted}"
          </div>
          {totalResults === 0 ? (
            <EmptyState icon="🔍" title="No results" message={`Nothing matched "${submitted}". Try a different search term.`} />
          ) : (
            <>
              <ResultGroup label="Companies" items={results.companies} icon={Building2} />
              <ResultGroup label="Contacts" items={results.contacts} icon={Users} />
              <ResultGroup label="Deals" items={results.deals} icon={Handshake} />
            </>
          )}
        </div>
      )}

      {!submitted && (
        <div className="text-center py-16 text-stone text-sm">
          <Search size={32} className="mx-auto mb-4 opacity-20" />
          <p>Start typing to search across your CRM data.</p>
        </div>
      )}
    </div>
  );
}
