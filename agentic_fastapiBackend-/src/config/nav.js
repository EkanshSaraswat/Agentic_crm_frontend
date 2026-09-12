import {
  LayoutDashboard, Building2, Users, Handshake, ListChecks, MessageSquare,
  SlidersHorizontal, Bookmark, Search, Archive, DollarSign,
  Hash, ShieldCheck, RefreshCw, Mail, Globe, AppWindow, UploadCloud,
  Building, UserCog, Settings, KeyRound, Activity, Radio, Database,
} from "lucide-react";

export const navSections = [
  {
    label: null,
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Companies", path: "/companies", icon: Building2 },
      { label: "Contacts", path: "/contacts", icon: Users },
      { label: "Deals", path: "/deals", icon: Handshake },
      { label: "Activities", path: "/activities", icon: ListChecks },
      { label: "Conversations", path: "/conversations", icon: MessageSquare },
    ],
  },
  {
    label: "Organize",
    items: [
      { label: "Fields", path: "/fields", icon: SlidersHorizontal },
      { label: "Saved Views", path: "/saved-views", icon: Bookmark },
      { label: "Search", path: "/search", icon: Search },
      { label: "Archive", path: "/archive", icon: Archive },
      { label: "Currency", path: "/currency", icon: DollarSign },
    ],
  },
  {
    label: "Integrations",
    items: [
      { label: "Slack", path: "/slack", icon: Hash },
      { label: "SSO", path: "/sso", icon: ShieldCheck },
      { label: "Sync", path: "/sync", icon: RefreshCw },
      { label: "Mailbox", path: "/mailbox", icon: Mail },
      { label: "Google", path: "/google", icon: Globe },
      { label: "Microsoft", path: "/microsoft", icon: AppWindow },
      { label: "Backfill", path: "/backfill", icon: UploadCloud },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Workspace", path: "/workspace", icon: Building },
      { label: "Users", path: "/users", icon: UserCog },
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "API Keys", path: "/api-keys", icon: KeyRound },
      { label: "Tracking", path: "/tracking", icon: Activity },
      { label: "Telemetry", path: "/telemetry", icon: Radio },
      { label: "Cache", path: "/cache", icon: Database },
    ],
  },
];