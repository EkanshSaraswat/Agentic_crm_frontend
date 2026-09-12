import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { navSections } from "../config/nav";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <aside
      className={`bg-ink flex flex-col justify-between shrink-0 transition-all duration-200 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="overflow-y-auto flex-1 py-4">
        <div className="flex items-center justify-between px-4 pb-4 mb-2 border-b border-paper/10">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <span className="font-serif text-paper text-2xl tracking-tight font-medium">Ledger</span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-paper/10 text-stone">CRM</span>
            </div>
          ) : (
            <span className="font-serif text-paper text-xl mx-auto font-bold">L</span>
          )}
        </div>

        <nav className="space-y-4 px-2">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.label && !collapsed && (
                <div className="px-3 mb-1.5 text-[11px] font-mono uppercase tracking-wider text-stone/80">
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150 ${
                        isActive
                          ? "bg-paper text-ink font-medium shadow-sm"
                          : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                      } ${collapsed ? "justify-center px-0" : ""}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} strokeWidth={1.8} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-paper/10 space-y-1">
        {user && !collapsed && (
          <div className="px-3 py-2 text-xs text-stone truncate font-mono">
            {user.email || user.name || "Signed in"}
          </div>
        )}
        <div className="flex items-center justify-between gap-1">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`flex items-center gap-2 p-2 rounded text-stone hover:text-paper hover:bg-paper/10 text-xs transition-colors ${
              collapsed ? "w-full justify-center" : "flex-1"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          
          <button
            onClick={signOut}
            className="p-2 rounded text-stone hover:text-paper hover:bg-paper/10 text-xs transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}