import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";

// CRM core pages
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Activities from "./pages/Activities";
import Conversations from "./pages/Conversations";

// Organize pages
import FieldsPage from "./pages/FieldsPage";
import SavedViewsPage from "./pages/SavedViewsPage";
import SearchPage from "./pages/SearchPage";
import ArchivePage from "./pages/ArchivePage";
import CurrencyPage from "./pages/CurrencyPage";

// Integrations pages
import SlackPage from "./pages/SlackPage";
import SsoPage from "./pages/SsoPage";
import SyncPage from "./pages/SyncPage";
import MailboxPage from "./pages/MailboxPage";
import GooglePage from "./pages/GooglePage";
import MicrosoftPage from "./pages/MicrosoftPage";
import BackfillPage from "./pages/BackfillPage";

// Admin pages
import WorkspacePage from "./pages/WorkspacePage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import ApiKeys from "./pages/ApiKeys";
import TrackingPage from "./pages/TrackingPage";
import TelemetryPage from "./pages/TelemetryPage";
import CachePage from "./pages/CachePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/conversations" element={<Conversations />} />

            <Route path="/fields" element={<FieldsPage />} />
            <Route path="/saved-views" element={<SavedViewsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/currency" element={<CurrencyPage />} />

            <Route path="/slack" element={<SlackPage />} />
            <Route path="/sso" element={<SsoPage />} />
            <Route path="/sync" element={<SyncPage />} />
            <Route path="/mailbox" element={<MailboxPage />} />
            <Route path="/google" element={<GooglePage />} />
            <Route path="/microsoft" element={<MicrosoftPage />} />
            <Route path="/backfill" element={<BackfillPage />} />

            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/cache" element={<CachePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}