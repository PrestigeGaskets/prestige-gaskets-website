/**
 * Rushmore workforce / project mock API.
 * Role + department + clock-in gate pool pulls. No skills matrix.
 * Jobs exist to fulfil purchase-order / sales agreements via agile scrum.
 */
(() => {
  "use strict";

  const SERVER_KEY = "rushmore-workforce-server-v2";
  const SESSION_KEY = "rushmore-server-session-v1";

  const seed = () => ({
    departments: [
      { id: "D-PUR", name: "Purchasing", code: "PUR" },
      { id: "D-SAL", name: "Sales", code: "SAL" },
      { id: "D-SHP", name: "Shipping", code: "SHP" },
      { id: "D-INV", name: "Inventory", code: "INV" },
      { id: "D-FIN", name: "Finance", code: "FIN" },
      { id: "D-PMO", name: "Project Office", code: "PMO" },
    ],
    employees: [
      {
        id: "154981",
        username: "jcraven",
        name: "James Craven",
        role: "Purchasing",
        departmentId: "D-PUR",
        title: "Buyer",
      },
      {
        id: "162204",
        username: "abuyer",
        name: "A. Buyer",
        role: "Sales",
        departmentId: "D-SAL",
        title: "Sales executive",
      },
      {
        id: "170110",
        username: "shipdesk",
        name: "Shipping Desk",
        role: "Shipping",
        departmentId: "D-SHP",
        title: "Despatch clerk",
      },
      {
        id: "180055",
        username: "stockctl",
        name: "Stock Control",
        role: "Inventory",
        departmentId: "D-INV",
        title: "Stock controller",
      },
      {
        id: "190301",
        username: "finance",
        name: "Finance Office",
        role: "Finance",
        departmentId: "D-FIN",
        title: "AR clerk",
      },
      {
        id: "200001",
        username: "manager",
        name: "Site Manager",
        role: "Manager",
        departmentId: "D-PMO",
        title: "Project manager",
      },
      {
        id: "210007",
        username: "admin",
        name: "System Admin",
        role: "Admin",
        departmentId: "D-PMO",
        title: "Scrum master",
      },
      {
        id: "100001",
        username: "viewer",
        name: "Read Only",
        role: "Viewer",
        departmentId: "D-PMO",
        title: "Observer",
      },
    ],
    projects: [
      {
        id: "PRJ-GASKET-Q3",
        name: "Q3 gasket fulfilment",
        goal: "Fulfil open sales orders and linked supplier POs for Prestige Pilot via daily scrum pulls",
        status: "Active",
        projectManagerId: "200001",
        scrumMasterId: "210007",
        approach: "pull", // assign | pull — scrum master / PM defined
        departmentIds: ["D-PUR", "D-SHP", "D-SAL", "D-INV"],
      },
    ],
    milestones: [
      {
        id: "MS-1",
        projectId: "PRJ-GASKET-Q3",
        name: "Confirm live quotes → SO ready-to-print",
        dueDate: "18/09/2026",
        status: "In progress",
        sort: 1,
      },
      {
        id: "MS-2",
        projectId: "PRJ-GASKET-Q3",
        name: "Raise replenishment POs for ROP breaches",
        dueDate: "22/09/2026",
        status: "Open",
        sort: 2,
      },
      {
        id: "MS-3",
        projectId: "PRJ-GASKET-Q3",
        name: "Issue DN + post OH for O-500",
        dueDate: "25/09/2026",
        status: "Open",
        sort: 3,
      },
    ],
    scrumRules: {
      dailyScrumMinutes: 15,
      buildsToward: "milestones",
      pullRequiresClockedIn: true,
      assignmentOverridesPool: true,
      wipLimit: 3,
      note:
        "Daily scrum confirms yesterday / today / blockers toward PO & sales-order fulfilment. PM & scrum master set approach (pull vs assign). On clock-in, pull from the department pool — role decides eligibility.",
    },
    dailyScrum: {
      date: "11/09/2026",
      projectId: "PRJ-GASKET-Q3",
      facilitatedById: "210007",
      agenda: [
        "What did we complete toward MS-1 (quote → SO)?",
        "What PO / SO fulfilment will we pull today after clock-in?",
        "Blockers on materials / carriers / agreement terms?",
      ],
      notes: "Focus despatch pull for O-500 and buyer follow-up on CITY0002 PO 70286.",
    },
    jobs: [
      {
        id: "JOB-70286-BUY",
        title: "Chase PO 70286 approval / receipt window",
        departmentId: "D-PUR",
        projectId: "PRJ-GASKET-Q3",
        milestoneId: "MS-2",
        allowedRoles: ["Purchasing", "Manager", "Admin"],
        criteria: { poNo: "70286", priority: "High" },
        link: { view: "po-entry", label: "Open PO Entry", poNo: "70286" },
        status: "Ready",
        estimatedHours: 1.5,
      },
      {
        id: "JOB-Q-9001",
        title: "Confirm quote Q-9001 (14-day window) → SO",
        departmentId: "D-SAL",
        projectId: "PRJ-GASKET-Q3",
        milestoneId: "MS-1",
        allowedRoles: ["Sales", "Manager", "Admin"],
        criteria: { quoteNo: "Q-9001", priority: "High" },
        link: { view: "quotes", label: "Open Quotes", quoteNo: "Q-9001" },
        status: "Ready",
        estimatedHours: 0.75,
      },
      {
        id: "JOB-DN-275526",
        title: "Pick / pack shipment 275526 from O-500",
        departmentId: "D-SHP",
        projectId: "PRJ-GASKET-Q3",
        milestoneId: "MS-3",
        allowedRoles: ["Shipping", "Manager", "Admin"],
        criteria: { shipmentId: "275526", orderNo: "O-500", priority: "High" },
        link: { view: "shipment", label: "Open Shipment Entry", shipmentId: "275526" },
        status: "Ready",
        estimatedHours: 2,
      },
      {
        id: "JOB-ROP-P1002",
        title: "Review ROP breach · P1002 → raise PO demand",
        departmentId: "D-INV",
        projectId: "PRJ-GASKET-Q3",
        milestoneId: "MS-2",
        allowedRoles: ["Inventory", "Purchasing", "Manager", "Admin"],
        criteria: { sku: "P1002", priority: "Medium" },
        link: { view: "products", label: "Open Inventory", sku: "P1002" },
        status: "Ready",
        estimatedHours: 0.5,
      },
      {
        id: "JOB-AR-INV1",
        title: "Chase AR for Prestige Pilot invoice (fulfilled SO)",
        departmentId: "D-FIN",
        projectId: "PRJ-GASKET-Q3",
        milestoneId: "MS-1",
        allowedRoles: ["Finance", "Manager", "Admin"],
        criteria: { customerId: "C004", priority: "Low" },
        link: { view: "invoices", label: "Open AR Invoices" },
        status: "Ready",
        estimatedHours: 0.5,
      },
      {
        id: "JOB-SCRUM-FACIL",
        title: "Facilitate daily scrum · Q3 gasket fulfilment",
        departmentId: "D-PMO",
        projectId: "PRJ-GASKET-Q3",
        milestoneId: "MS-1",
        allowedRoles: ["Admin", "Manager"],
        criteria: { priority: "High" },
        link: { view: "projects", label: "Open Projects / Scrum" },
        status: "Assigned",
        estimatedHours: 0.25,
      },
    ],
    /* Work pool rows belong to jobs — personal assignment or department pool. */
    workPool: [
      { id: "WP-1", jobId: "JOB-70286-BUY", pool: "department", departmentId: "D-PUR", assigneeId: null, status: "Queued" },
      { id: "WP-2", jobId: "JOB-Q-9001", pool: "personal", departmentId: "D-SAL", assigneeId: "162204", status: "Assigned" },
      { id: "WP-3", jobId: "JOB-DN-275526", pool: "department", departmentId: "D-SHP", assigneeId: null, status: "Queued" },
      { id: "WP-4", jobId: "JOB-ROP-P1002", pool: "department", departmentId: "D-INV", assigneeId: null, status: "Queued" },
      { id: "WP-5", jobId: "JOB-AR-INV1", pool: "department", departmentId: "D-FIN", assigneeId: null, status: "Queued" },
      { id: "WP-6", jobId: "JOB-SCRUM-FACIL", pool: "personal", departmentId: "D-PMO", assigneeId: "210007", status: "Assigned" },
    ],
    timeCards: [
      {
        id: "TC-154981-1109",
        employeeId: "154981",
        date: "11/09/2026",
        clockedIn: false,
        clockInAt: null,
        clockOutAt: null,
        entries: [],
      },
      {
        id: "TC-162204-1109",
        employeeId: "162204",
        date: "11/09/2026",
        clockedIn: true,
        clockInAt: "08:02",
        clockOutAt: null,
        entries: [{ jobId: "JOB-Q-9001", hours: 0.5, note: "Customer confirm call" }],
      },
      {
        id: "TC-170110-1109",
        employeeId: "170110",
        date: "11/09/2026",
        clockedIn: false,
        clockInAt: null,
        clockOutAt: null,
        entries: [],
      },
      {
        id: "TC-180055-1109",
        employeeId: "180055",
        date: "11/09/2026",
        clockedIn: false,
        clockInAt: null,
        clockOutAt: null,
        entries: [],
      },
      {
        id: "TC-190301-1109",
        employeeId: "190301",
        date: "11/09/2026",
        clockedIn: false,
        clockInAt: null,
        clockOutAt: null,
        entries: [],
      },
      {
        id: "TC-200001-1109",
        employeeId: "200001",
        date: "11/09/2026",
        clockedIn: true,
        clockInAt: "07:55",
        clockOutAt: null,
        entries: [],
      },
      {
        id: "TC-210007-1109",
        employeeId: "210007",
        date: "11/09/2026",
        clockedIn: true,
        clockInAt: "07:50",
        clockOutAt: null,
        entries: [{ jobId: "JOB-SCRUM-FACIL", hours: 0.25, note: "Stand-up" }],
      },
    ],
    loggedOn: ["162204", "200001", "210007"],
  });

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(SERVER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {
      /* fall through */
    }
    const fresh = seed();
    saveState(fresh);
    return fresh;
  }

  function saveState(state) {
    localStorage.setItem(SERVER_KEY, JSON.stringify(state));
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function employeeById(state, id) {
    return state.employees.find((e) => e.id === id) || null;
  }

  function jobById(state, id) {
    return state.jobs.find((j) => j.id === id) || null;
  }

  function timeCardFor(state, employeeId) {
    return state.timeCards.find((t) => t.employeeId === employeeId) || null;
  }

  /** Role gate — empty allowedRoles means any role in the department may pull. */
  function roleOk(employee, job) {
    const allowed = job.allowedRoles || [];
    if (!allowed.length) return true;
    return allowed.includes(employee.role);
  }

  function departmentOk(job, employee) {
    if (!job.departmentId) return true;
    return employee.departmentId === job.departmentId;
  }

  function refreshLoggedOnFromTimeCards(state) {
    const fromCards = state.timeCards.filter((t) => t.clockedIn).map((t) => t.employeeId);
    const sessionId = localStorage.getItem(SESSION_KEY);
    const set = new Set(fromCards);
    if (sessionId) set.add(sessionId);
    state.loggedOn = [...set];
  }

  function publicEmployee(emp) {
    if (!emp) return null;
    return {
      id: emp.id,
      username: emp.username,
      name: emp.name,
      role: emp.role,
      departmentId: emp.departmentId,
      title: emp.title,
    };
  }

  function enrichPoolRow(state, row) {
    const job = jobById(state, row.jobId);
    const assignee = row.assigneeId ? employeeById(state, row.assigneeId) : null;
    const dept = state.departments.find((d) => d.id === row.departmentId);
    return {
      ...clone(row),
      job: job ? clone(job) : null,
      assignee: publicEmployee(assignee),
      departmentName: dept ? dept.name : row.departmentId,
    };
  }

  function activeWipCount(state, employeeId) {
    return state.workPool.filter(
      (w) =>
        w.assigneeId === employeeId &&
        (w.status === "Assigned" || w.status === "In progress")
    ).length;
  }

  async function respond(payload, status = 200) {
    await delay(40 + Math.floor(Math.random() * 60));
    return { ok: status >= 200 && status < 300, status, data: payload };
  }

  const api = {
    /** Reset demo server state (keeps current session id if still valid). */
    async reset() {
      const fresh = seed();
      saveState(fresh);
      return respond({ reset: true });
    },

    async listEmployees() {
      const state = loadState();
      return respond({
        employees: state.employees.map(publicEmployee),
        departments: clone(state.departments),
      });
    },

    async getSession() {
      const state = loadState();
      refreshLoggedOnFromTimeCards(state);
      saveState(state);
      let id = localStorage.getItem(SESSION_KEY);
      if (!id || !employeeById(state, id)) {
        id = "154981";
        localStorage.setItem(SESSION_KEY, id);
      }
      const emp = employeeById(state, id);
      const tc = timeCardFor(state, id);
      const dept = state.departments.find((d) => d.id === emp.departmentId);
      return respond({
        employee: publicEmployee(emp),
        department: dept ? clone(dept) : null,
        clockedIn: !!(tc && tc.clockedIn),
        timeCard: tc ? clone(tc) : null,
        loggedOnIds: clone(state.loggedOn),
        loggedOnCount: state.loggedOn.length,
        serverTime: new Date().toISOString(),
      });
    },

    async login(employeeId) {
      const state = loadState();
      const emp = employeeById(state, employeeId);
      if (!emp) return respond({ error: "Unknown employee" }, 404);
      localStorage.setItem(SESSION_KEY, emp.id);
      // Logging on without a card clocks them in for presence / pool eligibility.
      let tc = timeCardFor(state, emp.id);
      if (!tc) {
        tc = {
          id: `TC-${emp.id}-LIVE`,
          employeeId: emp.id,
          date: "11/09/2026",
          clockedIn: true,
          clockInAt: new Date().toTimeString().slice(0, 5),
          clockOutAt: null,
          entries: [],
        };
        state.timeCards.push(tc);
      } else if (!tc.clockedIn) {
        tc.clockedIn = true;
        tc.clockInAt = new Date().toTimeString().slice(0, 5);
        tc.clockOutAt = null;
      }
      refreshLoggedOnFromTimeCards(state);
      saveState(state);
      return this.getSession();
    },

    async clock(action, jobId, hours, note) {
      const state = loadState();
      const session = await this.getSession();
      const emp = session.data.employee;
      if (!emp) return respond({ error: "Not signed in" }, 401);
      let tc = timeCardFor(state, emp.id);
      if (!tc) {
        tc = {
          id: `TC-${emp.id}-LIVE`,
          employeeId: emp.id,
          date: "11/09/2026",
          clockedIn: false,
          clockInAt: null,
          clockOutAt: null,
          entries: [],
        };
        state.timeCards.push(tc);
      }
      const now = new Date().toTimeString().slice(0, 5);
      if (action === "in") {
        tc.clockedIn = true;
        tc.clockInAt = now;
        tc.clockOutAt = null;
      } else if (action === "out") {
        tc.clockedIn = false;
        tc.clockOutAt = now;
      } else if (action === "book") {
        if (!tc.clockedIn) return respond({ error: "Clock in before booking time" }, 400);
        if (!jobId) return respond({ error: "jobId required" }, 400);
        const job = jobById(state, jobId);
        if (!job) return respond({ error: "Unknown job" }, 404);
        tc.entries.push({
          jobId,
          hours: Number(hours) || 0.25,
          note: note || "",
          at: now,
        });
        const row = state.workPool.find(
          (w) => w.jobId === jobId && (w.assigneeId === emp.id || w.pool === "personal")
        );
        if (row && row.status === "Assigned") row.status = "In progress";
        if (job.status === "Ready" || job.status === "Assigned") job.status = "In progress";
      } else {
        return respond({ error: "Unknown clock action" }, 400);
      }
      refreshLoggedOnFromTimeCards(state);
      saveState(state);
      return this.getWorkload();
    },

    async getWorkload() {
      const state = loadState();
      refreshLoggedOnFromTimeCards(state);
      saveState(state);
      const sessionRes = await this.getSession();
      const emp = sessionRes.data.employee;
      if (!emp) return respond({ error: "Not signed in" }, 401);
      const full = employeeById(state, emp.id);
      const project = state.projects[0];
      const rules = clone(state.scrumRules);
      const approach = project ? project.approach : "pull";
      const wipLimit = Number(rules.wipLimit) || 0;
      const wip = activeWipCount(state, emp.id);

      const assigned = state.workPool
        .filter((w) => w.assigneeId === emp.id && (w.status === "Assigned" || w.status === "In progress"))
        .map((w) => enrichPoolRow(state, w));

      const deptQueued = state.workPool.filter(
        (w) =>
          w.pool === "department" &&
          w.departmentId === emp.departmentId &&
          w.status === "Queued" &&
          !w.assigneeId
      );

      const eligible = [];
      const blocked = [];
      for (const row of deptQueued) {
        const job = jobById(state, row.jobId);
        if (!job) continue;
        const enriched = enrichPoolRow(state, row);
        const clockOk = !rules.pullRequiresClockedIn || sessionRes.data.clockedIn;
        const rolesMatch = roleOk(full, job);
        const deptMatch = departmentOk(job, full);
        const wipOk = !wipLimit || wip < wipLimit;
        if (approach === "assign" && rules.assignmentOverridesPool) {
          blocked.push({ ...enriched, reason: "PM approach is assign-only — wait for assignment" });
        } else if (!clockOk) {
          blocked.push({ ...enriched, reason: "Clock in (start shift) to pull from department pool" });
        } else if (!rolesMatch) {
          blocked.push({ ...enriched, reason: `Role ${full.role} not allowed for this fulfilment job` });
        } else if (!deptMatch) {
          blocked.push({ ...enriched, reason: "Job department mismatch" });
        } else if (!wipOk) {
          blocked.push({ ...enriched, reason: `WIP limit (${wipLimit}) reached — finish or clock work first` });
        } else {
          eligible.push(enriched);
        }
      }

      const loggedOnDept = state.loggedOn
        .map((id) => employeeById(state, id))
        .filter((e) => e && e.departmentId === emp.departmentId)
        .map(publicEmployee);

      const deptPoolSummary = {
        departmentId: emp.departmentId,
        departmentName: (state.departments.find((d) => d.id === emp.departmentId) || {}).name,
        queued: deptQueued.length,
        eligible: eligible.length,
        loggedOn: loggedOnDept,
        wip,
        wipLimit,
      };

      return respond({
        session: sessionRes.data,
        approach,
        scrumRules: rules,
        assigned,
        departmentPool: {
          summary: deptPoolSummary,
          eligible,
          blocked,
        },
        taskLinks: [...assigned, ...eligible]
          .map((row) => row.job && row.job.link)
          .filter(Boolean),
      });
    },

    async pullJob(workPoolId) {
      const state = loadState();
      const sessionRes = await this.getSession();
      const emp = sessionRes.data.employee;
      if (!emp) return respond({ error: "Not signed in" }, 401);
      const full = employeeById(state, emp.id);
      const project = state.projects[0];
      const rules = state.scrumRules;
      if (project && project.approach === "assign" && rules.assignmentOverridesPool) {
        return respond({ error: "Project approach is assign-only (PM/scrum master)" }, 403);
      }
      if (rules.pullRequiresClockedIn && !sessionRes.data.clockedIn) {
        return respond({ error: "Clock in (start shift) before pulling from the department pool" }, 403);
      }
      const wipLimit = Number(rules.wipLimit) || 0;
      if (wipLimit && activeWipCount(state, emp.id) >= wipLimit) {
        return respond({ error: `WIP limit (${wipLimit}) reached` }, 403);
      }
      const row = state.workPool.find((w) => w.id === workPoolId);
      if (!row || row.pool !== "department" || row.status !== "Queued") {
        return respond({ error: "Job not available in department pool" }, 404);
      }
      if (row.departmentId !== emp.departmentId) {
        return respond({ error: "Outside your department pool" }, 403);
      }
      const job = jobById(state, row.jobId);
      if (!job) return respond({ error: "Job missing" }, 404);
      if (!roleOk(full, job)) {
        return respond({ error: "Your role cannot pull this fulfilment job" }, 403);
      }
      if (!departmentOk(job, full)) {
        return respond({ error: "Job department mismatch" }, 403);
      }
      row.pool = "personal";
      row.assigneeId = emp.id;
      row.status = "Assigned";
      job.status = "Assigned";
      saveState(state);
      return this.getWorkload();
    },

    async getProjects() {
      const state = loadState();
      const sessionRes = await this.getSession();
      return respond({
        session: sessionRes.data,
        scrumRules: clone(state.scrumRules),
        dailyScrum: clone(state.dailyScrum),
        projects: state.projects.map((p) => ({
          ...clone(p),
          projectManager: publicEmployee(employeeById(state, p.projectManagerId)),
          scrumMaster: publicEmployee(employeeById(state, p.scrumMasterId)),
          milestones: state.milestones
            .filter((m) => m.projectId === p.id)
            .sort((a, b) => a.sort - b.sort)
            .map(clone),
          jobs: state.jobs.filter((j) => j.projectId === p.id).map(clone),
        })),
      });
    },

    async setApproach(projectId, approach) {
      const state = loadState();
      const sessionRes = await this.getSession();
      const emp = sessionRes.data.employee;
      if (!emp) return respond({ error: "Not signed in" }, 401);
      const project = state.projects.find((p) => p.id === projectId);
      if (!project) return respond({ error: "Unknown project" }, 404);
      const allowed =
        emp.id === project.projectManagerId ||
        emp.id === project.scrumMasterId ||
        emp.role === "Admin" ||
        emp.role === "Manager";
      if (!allowed) return respond({ error: "Only PM / scrum master may set approach" }, 403);
      if (approach !== "pull" && approach !== "assign") {
        return respond({ error: "approach must be pull or assign" }, 400);
      }
      project.approach = approach;
      saveState(state);
      return this.getProjects();
    },
  };

  window.RushmoreServer = api;
})();
