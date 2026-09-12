import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Search, Loader } from "lucide-react";

// ── Page shell ────────────────────────────────────────────────────────────────
export function PageHeader({ breadcrumb = "Module / Overview", title, actions }) {
  return (
    <div className="flex items-start justify-between pb-6 mb-8 border-b border-ink/10">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-stone mb-1">{breadcrumb}</div>
        <h1 className="font-serif text-3xl font-normal text-ink tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="p-5 border border-ink/15 rounded-lg bg-paper/50">
      <div className="text-[11px] font-mono uppercase tracking-wider text-stone mb-1">{label}</div>
      <div className="text-2xl font-serif font-medium text-ink">{value ?? "—"}</div>
      {sub && <div className="text-[11px] text-stone mt-2">{sub}</div>}
    </div>
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", type = "button", disabled, className = "" }) {
  const base = "px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-40";
  const variants = {
    primary: "bg-ink text-paper hover:bg-ink/80 border border-ink",
    secondary: "bg-transparent border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
    danger: "bg-transparent border border-red-400/50 text-red-600 hover:bg-red-600 hover:text-paper hover:border-red-600",
    ghost: "text-stone hover:text-ink border border-transparent hover:border-ink/20",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ── Table ────────────────────────────────────────────────────────────────────
export function Table({ columns, rows, loading, onRowClick, emptyText = "No records found." }) {
  return (
    <div className="border border-ink/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 border-b border-ink/10">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-stone font-normal whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-stone text-sm">
                  <Loader size={16} className="inline-block animate-spin mr-2" />Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-stone text-sm">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-ink/5 last:border-0 transition-colors ${onRowClick ? "cursor-pointer hover:bg-ink/5" : ""}`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-ink/80 whitespace-nowrap">
                      {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-paper border border-ink/15 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h2 className="font-serif text-xl text-ink">{title}</h2>
          <button onClick={onClose} className="text-stone hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Form field ───────────────────────────────────────────────────────────────
export function Field({ label, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-mono uppercase tracking-wider text-stone">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent border-b border-ink/30 pb-2 text-ink focus:outline-none focus:border-ink transition-colors text-sm ${className}`}
    />
  );
}

export function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full bg-transparent border-b border-ink/30 pb-2 text-ink focus:outline-none focus:border-ink transition-colors text-sm appearance-none ${className}`}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full bg-transparent border border-ink/20 rounded p-2 text-ink focus:outline-none focus:border-ink transition-colors text-sm resize-none ${className}`}
    />
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
const BADGE_COLORS = {
  open: "bg-blue-100 text-blue-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-600",
  qualified: "bg-purple-100 text-purple-700",
  lead: "bg-amber-100 text-amber-700",
  customer: "bg-green-100 text-green-700",
  prospect: "bg-sky-100 text-sky-700",
  call: "bg-indigo-100 text-indigo-700",
  email: "bg-teal-100 text-teal-700",
  task: "bg-orange-100 text-orange-700",
  meeting: "bg-violet-100 text-violet-700",
  note: "bg-stone/20 text-stone",
  active: "bg-green-100 text-green-700",
  inactive: "bg-stone/20 text-stone",
  default: "bg-ink/10 text-ink/70",
};

export function Badge({ label }) {
  const key = label?.toLowerCase();
  const cls = BADGE_COLORS[key] ?? BADGE_COLORS.default;
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded ${cls}`}>
      {label ?? "—"}
    </span>
  );
}

// ── Search bar ───────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 bg-transparent border border-ink/20 rounded text-sm text-ink placeholder:text-stone focus:outline-none focus:border-ink transition-colors w-64"
      />
    </div>
  );
}

// ── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-ink" : "bg-ink/20"}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-paper transition-transform ${checked ? "translate-x-5" : ""}`} />
      </div>
      {label && <span className="text-sm text-ink/70 group-hover:text-ink transition-colors">{label}</span>}
    </label>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
export function Confirm({ open, onClose, onConfirm, title, message, dangerous }) {
  return (
    <Modal open={open} onClose={onClose} title={title ?? "Confirm"}>
      <p className="text-sm text-stone mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant={dangerous ? "danger" : "primary"} onClick={onConfirm}>Confirm</Btn>
      </div>
    </Modal>
  );
}

// ── Alert banner ─────────────────────────────────────────────────────────────
export function Alert({ type = "info", children, onClose }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded border text-sm ${styles[type]}`}>
      <span className="flex-1">{children}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100"><X size={14} /></button>}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = "⌘", title, message, action }) {
  return (
    <div className="border border-dashed border-ink/20 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[280px]">
      <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center text-stone mb-4 font-mono text-sm">
        {icon}
      </div>
      <h3 className="font-serif text-xl text-ink mb-1">{title}</h3>
      {message && <p className="text-stone text-sm max-w-sm mx-auto mb-5">{message}</p>}
      {action}
    </div>
  );
}

// ── useApi hook ────────────────────────────────────────────────────────────────
export function useApi(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, deps);

  return { data, loading, error, reload: load };
}
