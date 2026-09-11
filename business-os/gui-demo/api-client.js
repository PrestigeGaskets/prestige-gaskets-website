/**
 * Rushmore API client — prefers Spring Boot /api/*, falls back to in-browser mock.
 * Use ?mock=1 to force the workforce-server.js mock (htmlpreview / offline).
 * Use ?api=http://localhost:8080 when the GUI is not served by Boot.
 */
(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const forceMock = params.get("mock") === "1";
  const apiBase = (params.get("api") || "").replace(/\/$/, "");

  async function http(method, path, body) {
    const opts = {
      method,
      credentials: "include",
      headers: { Accept: "application/json" },
    };
    if (body !== undefined) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
    const employeeId = localStorage.getItem("rushmore-server-session-v1");
    if (employeeId) opts.headers["X-Employee-Id"] = employeeId;

    const res = await fetch(apiBase + path, opts);
    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_) {
      data = { error: text || res.statusText };
    }
    return { ok: res.ok, status: res.status, data };
  }

  const live = {
    async reset() {
      return { ok: true, status: 200, data: { reset: false, note: "server-managed" } };
    },
    async listEmployees() {
      return http("GET", "/api/employees");
    },
    async getSession() {
      return http("GET", "/api/session");
    },
    async login(employeeId) {
      const res = await http("POST", "/api/session/login", { employeeId });
      if (res.ok && employeeId) {
        localStorage.setItem("rushmore-server-session-v1", employeeId);
      }
      return res;
    },
    async clock(action, jobId, hours, note) {
      return http("POST", "/api/workload/clock", { action, jobId, hours, note });
    },
    async getWorkload() {
      return http("GET", "/api/workload");
    },
    async pullJob(workPoolId) {
      return http("POST", "/api/workload/pull", { workPoolId });
    },
    async getProjects() {
      return http("GET", "/api/projects");
    },
    async setApproach(projectId, approach) {
      return http("POST", `/api/projects/${encodeURIComponent(projectId)}/approach`, {
        approach,
      });
    },
    async getMaster() {
      return http("GET", "/api/master");
    },
    async post(payload) {
      return http("POST", "/api/post", payload);
    },
    async reverse(payload) {
      return http("POST", "/api/reverse", payload || {});
    },
    async listActions(query) {
      const qs = new URLSearchParams();
      Object.entries(query || {}).forEach(([k, v]) => {
        if (v != null && v !== "") qs.set(k, v);
      });
      const suffix = qs.toString() ? `?${qs}` : "";
      return http("GET", `/api/actions${suffix}`);
    },
  };

  async function probeLive() {
    if (forceMock) return false;
    try {
      const res = await fetch(apiBase + "/api/health", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  function wrapMock(mock) {
    return {
      ...mock,
      async getMaster() {
        return { ok: false, status: 0, data: { error: "mock-has-no-master" } };
      },
      async post() {
        return { ok: false, status: 0, data: { error: "mock-has-no-post" } };
      },
      async reverse() {
        return { ok: false, status: 0, data: { error: "mock-has-no-reverse" } };
      },
      async listActions() {
        return { ok: false, status: 0, data: { error: "mock-has-no-actions" } };
      },
    };
  }

  window.RushmoreApi = { live, probeLive, forceMock, apiBase };

  window.installRushmoreClient = async function installRushmoreClient() {
    const mock = window.RushmoreServer;
    const useLive = await probeLive();
    if (useLive) {
      window.RushmoreServer = live;
      window.RushmoreMode = "live";
      document.documentElement.dataset.rushmoreMode = "live";
      return "live";
    }
    window.RushmoreServer = mock ? wrapMock(mock) : live;
    window.RushmoreMode = forceMock ? "mock" : "offline-mock";
    document.documentElement.dataset.rushmoreMode = window.RushmoreMode;
    return window.RushmoreMode;
  };
})();
