const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("crm_token");
}

async function request(path, { method = "GET", body, token } = {}) {
  const tok = token ?? getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Something went wrong");
  }
  return data;
}

export const authApi = {
  signIn: (email, password) => request("/api/auth/sign-in", { method: "POST", body: { email, password } }),
  signUp: (name, email, password) => request("/api/auth/sign-up", { method: "POST", body: { name, email, password } }),
  me: () => request("/api/auth/me"),
  signOut: () => request("/api/auth/sign-out", { method: "POST" }),
};

export const companiesApi = {
  list: (params = {}) => request(`/api/companies/?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/companies/${id}`),
  create: (data) => request("/api/companies/", { method: "POST", body: data }),
  update: (id, data) => request(`/api/companies/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/companies/${id}`, { method: "DELETE" }),
  getByDomain: (domain) => request(`/api/companies/domain/${domain}`),
};

export const contactsApi = {
  list: (params = {}) => request(`/api/contacts/?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/contacts/${id}`),
  create: (data) => request("/api/contacts/", { method: "POST", body: data }),
  update: (id, data) => request(`/api/contacts/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/contacts/${id}`, { method: "DELETE" }),
};

export const dealsApi = {
  list: (params = {}) => request(`/api/deals/?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/deals/${id}`),
  create: (data) => request("/api/deals/", { method: "POST", body: data }),
  update: (id, data) => request(`/api/deals/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/deals/${id}`, { method: "DELETE" }),
  setStage: (id, stage) => request(`/api/deals/${id}/set-stage`, { method: "POST", body: { stage } }),
};

export const activitiesApi = {
  list: (params = {}) => request(`/api/activities/?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/activities/${id}`),
  create: (data) => request("/api/activities/", { method: "POST", body: data }),
  update: (id, data) => request(`/api/activities/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/activities/${id}`, { method: "DELETE" }),
};

export const conversationsApi = {
  list: () => request("/api/conversations/"),
  get: (id) => request(`/api/conversations/${id}`),
  create: (data) => request("/api/conversations/", { method: "POST", body: data }),
};

export const fieldsApi = {
  list: (entity = "") => request(`/api/fields/?entity=${entity}`),
  create: (data) => request("/api/fields/", { method: "POST", body: data }),
  update: (id, data) => request(`/api/fields/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/fields/${id}`, { method: "DELETE" }),
};

export const savedViewsApi = {
  list: () => request("/api/saved-views/"),
  get: (id) => request(`/api/saved-views/${id}`),
  create: (data) => request("/api/saved-views/", { method: "POST", body: data }),
  delete: (id) => request(`/api/saved-views/${id}`, { method: "DELETE" }),
};

export const searchApi = {
  search: (q) => request(`/api/search/?q=${encodeURIComponent(q)}`),
};

export const archiveApi = {
  list: () => request("/api/archive/"),
  restore: (id) => request(`/api/archive/${id}`, { method: "PUT" }),
};

export const currencyApi = {
  list: () => request("/api/currency/"),
  create: (data) => request("/api/currency/", { method: "POST", body: data }),
  delete: (id) => request(`/api/currency/${id}`, { method: "DELETE" }),
};

export const usersApi = {
  list: () => request("/api/users/"),
  get: (id) => request(`/api/users/${id}`),
  create: (data) => request("/api/users/", { method: "POST", body: data }),
  update: (id, data) => request(`/api/users/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/users/${id}`, { method: "DELETE" }),
};

export const workspaceApi = {
  get: () => request("/api/workspace/"),
  update: (data) => request("/api/workspace/", { method: "PUT", body: data }),
  getProfile: () => request("/api/workspace/profile"),
};

export const settingsApi = {
  get: () => request("/api/settings/"),
  update: (data) => request("/api/settings/", { method: "PUT", body: data }),
};

export const apiKeysApi = {
  list: () => request("/api/api-keys/"),
  create: (data) => request("/api/api-keys/", { method: "POST", body: data }),
  delete: (id) => request(`/api/api-keys/${id}`, { method: "DELETE" }),
};

export const slackApi = {
  get: () => request("/api/slack/"),
  connect: (data) => request("/api/slack/", { method: "POST", body: data }),
};

export const ssoApi = {
  get: () => request("/api/sso/"),
  update: (data) => request("/api/sso/", { method: "PUT", body: data }),
};

export const syncApi = {
  get: () => request("/api/sync/"),
  trigger: () => request("/api/sync/", { method: "POST", body: {} }),
};

export const mailboxApi = {
  get: () => request("/api/mailbox/"),
  connect: (data) => request("/api/mailbox/", { method: "POST", body: data }),
};

export const googleApi = {
  get: () => request("/api/google/"),
  connect: (data) => request("/api/google/", { method: "POST", body: data }),
};

export const microsoftApi = {
  get: () => request("/api/microsoft/"),
  connect: (data) => request("/api/microsoft/", { method: "POST", body: data }),
};

export const backfillApi = {
  get: () => request("/api/backfill/"),
  start: (data) => request("/api/backfill/", { method: "POST", body: data }),
};

export const trackingApi = {
  get: () => request("/api/tracking/"),
  update: (data) => request("/api/tracking/", { method: "PUT", body: data }),
};

export const telemetryApi = {
  get: () => request("/api/telemetry/"),
};

export const cacheApi = {
  get: () => request("/api/cache/"),
  flush: () => request("/api/cache/", { method: "DELETE" }),
};