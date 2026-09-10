/**
 * Rushmore Business OS — HTML twin of the C++ scaffold.
 * MASTER is immutable. All edits land in a working copy (localStorage).
 * Field writes are gated by hierarchical role permissions.
 */

const STORAGE_KEY = "rushmore-bos-working-v2";
const ROLE_KEY = "rushmore-bos-role-v1";
const CURRENCY = "GBP";
const LOCALE = "en-GB";

const MASTER = deepFreeze({
  customers: [
    { id: "C001", name: "Acme Fab", email: "buyer@acme.example", postcode: "B1 1AA", status: "Active" },
    { id: "C002", name: "Northline", email: "ops@northline.example", postcode: "M1 2AB", status: "Active" },
    { id: "C003", name: "Summit Seal", email: "purchasing@summit.example", postcode: "EH1 3EG", status: "Inactive" },
    { id: "C004", name: "Prestige Pilot", email: "pilot@prestige.example", postcode: "SW1A 1AA", status: "Active" },
  ],
  products: [
    { sku: "P1001", description: "Flat gasket A", onHand: 120, reorderPoint: 40, leadDays: 7, cost: 2.5, sell: 4.75 },
    { sku: "P1002", description: "Cone seal B", onHand: 18, reorderPoint: 25, leadDays: 14, cost: 3.1, sell: 5.9 },
    { sku: "P1003", description: "Ring C", onHand: 80, reorderPoint: 30, leadDays: 5, cost: 1.2, sell: 2.4 },
    { sku: "P1004", description: "Sleeve D", onHand: 55, reorderPoint: 20, leadDays: 10, cost: 4.0, sell: 7.5 },
    { sku: "P1005", description: "Washer E", onHand: 200, reorderPoint: 50, leadDays: 3, cost: 0.4, sell: 0.95 },
    { sku: "P1006", description: "Spacer F", onHand: 12, reorderPoint: 15, leadDays: 8, cost: 1.8, sell: 3.25 },
  ],
  quotes: [
    {
      quoteNo: "Q-100",
      customerId: "C004",
      status: "Open",
      lines: [
        { line: 1, sku: "P1001", qty: 10, price: 4.75 },
        { line: 2, sku: "P1002", qty: 5, price: 5.9 },
      ],
    },
    {
      quoteNo: "Q-101",
      customerId: "C001",
      status: "Open",
      lines: [
        { line: 1, sku: "P1003", qty: 40, price: 2.4 },
        { line: 2, sku: "P1005", qty: 100, price: 0.95 },
      ],
    },
  ],
  orders: [
    { orderNo: "O-500", quoteNo: "Q-099", customerId: "C002", status: "Shipped", value: 312.5 },
    { orderNo: "O-501", quoteNo: "", customerId: "C004", status: "Open", value: 88.0 },
  ],
});

/** Hierarchical roles: each role inherits canEdit from its parents. */
const ROLE_TREE = {
  Viewer: {
    inherits: [],
    blurb: "Read-only across all entities.",
    canEdit: [],
  },
  Sales: {
    inherits: ["Viewer"],
    blurb: "Quote lines & customer contact fields.",
    canEdit: [
      "quotes.status",
      "quotes.lines.qty",
      "quotes.lines.price",
      "customers.email",
      "customers.postcode",
    ],
  },
  Inventory: {
    inherits: ["Viewer"],
    blurb: "On-hand, reorder point, and lead time.",
    canEdit: ["products.onHand", "products.reorderPoint", "products.leadDays"],
  },
  Finance: {
    inherits: ["Viewer"],
    blurb: "Cost, sell price, and order value/status.",
    canEdit: ["products.cost", "products.sell", "orders.status", "orders.value"],
  },
  Manager: {
    inherits: ["Sales", "Inventory", "Finance"],
    blurb: "Sales + Inventory + Finance, plus customer name/status & product description.",
    canEdit: ["customers.name", "customers.status", "products.description"],
  },
  Admin: {
    inherits: ["Manager"],
    blurb: "All working-copy fields. Still cannot mutate master.",
    canEdit: ["quotes.customerId", "orders.quoteNo", "orders.customerId"],
  },
};

const QUOTE_STATUSES = ["Open", "Sent", "Won", "Lost"];
const ORDER_STATUSES = ["Open", "Picked", "Shipped", "Closed"];
const CUSTOMER_STATUSES = ["Active", "Inactive"];

let working = loadWorking();
let activeRole = localStorage.getItem(ROLE_KEY) || "Sales";

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  }
  return value;
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadWorking() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {
    /* ignore */
  }
  return clone(MASTER);
}

function persistWorking() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(working));
  updateCopyPill();
}

function resetWorking() {
  working = clone(MASTER);
  localStorage.removeItem(STORAGE_KEY);
  persistWorking();
  renderAll();
  toast("Working copy reset to master — master untouched.");
}

function roleCanEdit(fieldKey) {
  const allowed = new Set();
  const walk = (name) => {
    const node = ROLE_TREE[name];
    if (!node) return;
    node.inherits.forEach(walk);
    node.canEdit.forEach((field) => allowed.add(field));
  };
  walk(activeRole);
  return allowed.has(fieldKey);
}

function money(n) {
  return Number(n).toLocaleString(LOCALE, { style: "currency", currency: CURRENCY });
}

function needsReorder(p) {
  return Number(p.onHand) <= Number(p.reorderPoint);
}

function lineTotal(line) {
  return Number(line.qty) * Number(line.price);
}

function totalsByQuote() {
  const totals = {};
  for (const q of working.quotes) {
    totals[q.quoteNo] = q.lines.reduce((sum, line) => sum + lineTotal(line), 0);
  }
  return totals;
}

function grandTotal() {
  return Object.values(totalsByQuote()).reduce((a, b) => a + b, 0);
}

function customerName(id) {
  return working.customers.find((c) => c.id === id)?.name ?? id;
}

function masterCustomer(id) {
  return MASTER.customers.find((c) => c.id === id);
}

function masterProduct(sku) {
  return MASTER.products.find((p) => p.sku === sku);
}

function masterQuote(no) {
  return MASTER.quotes.find((q) => q.quoteNo === no);
}

function masterOrder(no) {
  return MASTER.orders.find((o) => o.orderNo === no);
}

function isDirty(masterVal, workVal) {
  return String(masterVal ?? "") !== String(workVal ?? "");
}

function workingDiffersFromMaster() {
  return JSON.stringify(working) !== JSON.stringify(MASTER);
}

function updateCopyPill() {
  const pill = document.getElementById("copy-pill");
  const resetBtn = document.getElementById("reset-working");
  const dirty = workingDiffersFromMaster();
  pill.textContent = dirty ? "Working copy · unsaved vs master" : "Working copy · matches master";
  pill.classList.toggle("is-clean", !dirty);
  resetBtn.disabled = !dirty;
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2800);
}

function fieldClass(dirty, locked) {
  return ["field", dirty ? "is-dirty" : "", locked ? "is-locked" : ""].filter(Boolean).join(" ");
}

function bindField(el, onCommit) {
  el.addEventListener("change", () => onCommit(el));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      el.blur();
    }
  });
}

function commitPath(path, raw, asNumber) {
  const parts = path.split(".");
  let cursor = working;
  for (let i = 0; i < parts.length - 1; i += 1) {
    cursor = cursor[parts[i]];
  }
  const key = parts[parts.length - 1];
  let next = asNumber ? Number(raw) : raw;
  if (asNumber && Number.isNaN(next)) {
    toast("Invalid number — change ignored.");
    renderAll();
    return;
  }
  if (key === "postcode" && typeof next === "string") {
    next = next.trim().toUpperCase();
  }
  cursor[key] = next;
  // Master is never written — only working + localStorage.
  persistWorking();
  renderAll();
  toast("Saved to working copy (master unchanged).");
}

function renderRoleSelect() {
  const select = document.getElementById("role-select");
  select.innerHTML = Object.keys(ROLE_TREE)
    .map((name) => `<option value="${name}" ${name === activeRole ? "selected" : ""}>${name}</option>`)
    .join("");
  document.getElementById("role-blurb").textContent = ROLE_TREE[activeRole].blurb;
}

function renderDashboard() {
  const reorderCount = working.products.filter(needsReorder).length;
  const metrics = [
    { label: "Customers", value: String(working.customers.length) },
    { label: "Products", value: String(working.products.length) },
    { label: "Open quote value", value: money(grandTotal()) },
    { label: "Orders", value: String(working.orders.length) },
    { label: "SKUs ≤ ROP", value: String(reorderCount) },
  ];
  document.getElementById("metric-strip").innerHTML = metrics
    .map((m) => `<div class="metric"><span class="label">${m.label}</span><span class="value">${m.value}</span></div>`)
    .join("");
  document.getElementById("grand-total").textContent = money(grandTotal());
  document.getElementById("reorder-watch").innerHTML =
    working.products
      .filter(needsReorder)
      .map(
        (p) =>
          `<li><span class="sku">${p.sku}</span><span>${p.description} · OH ${p.onHand} / ROP ${p.reorderPoint}</span><span class="flag">Reorder</span></li>`
      )
      .join("") ||
    `<li><span class="sku">—</span><span>None below ROP</span><span class="flag" style="color:var(--ok)">OK</span></li>`;
}

function renderQuotes() {
  const totals = totalsByQuote();
  const root = document.getElementById("quotes-root");
  root.innerHTML =
    working.quotes
      .map((q, qi) => {
        const m = masterQuote(q.quoteNo);
        const statusLocked = !roleCanEdit("quotes.status");
        const custLocked = !roleCanEdit("quotes.customerId");
        const lines = q.lines
          .map((line, li) => {
            const ml = m?.lines?.[li];
            const qtyLocked = !roleCanEdit("quotes.lines.qty");
            const priceLocked = !roleCanEdit("quotes.lines.price");
            return `
            <div class="line-row">
              <span class="line-no">L${line.line}</span>
              <div class="field-grid">
                <div class="field is-locked">
                  <label>SKU</label>
                  <input value="${line.sku}" disabled />
                </div>
                <div class="${fieldClass(isDirty(ml?.qty, line.qty), qtyLocked)}">
                  <label>Qty</label>
                  <input type="number" min="0" step="1" data-path="quotes.${qi}.lines.${li}.qty" value="${line.qty}" ${qtyLocked ? "disabled" : ""} />
                </div>
                <div class="${fieldClass(isDirty(ml?.price, line.price), priceLocked)}">
                  <label>Price (£)</label>
                  <input type="number" min="0" step="0.01" data-path="quotes.${qi}.lines.${li}.price" value="${line.price}" ${priceLocked ? "disabled" : ""} />
                </div>
                <div class="field is-locked">
                  <label>Line total</label>
                  <input value="${money(lineTotal(line))}" disabled />
                </div>
              </div>
            </div>`;
          })
          .join("");

        const custOptions = working.customers
          .map((c) => `<option value="${c.id}" ${c.id === q.customerId ? "selected" : ""}>${c.name}</option>`)
          .join("");

        return `
        <article class="entity-card">
          <div class="entity-head">
            <h2>${q.quoteNo}</h2>
            <span class="entity-meta">${money(totals[q.quoteNo])}</span>
          </div>
          <div class="field-grid">
            <div class="${fieldClass(isDirty(m?.customerId, q.customerId), custLocked)}">
              <label>Customer</label>
              <select data-path="quotes.${qi}.customerId" ${custLocked ? "disabled" : ""}>${custOptions}</select>
            </div>
            <div class="${fieldClass(isDirty(m?.status, q.status), statusLocked)}">
              <label>Status</label>
              <select data-path="quotes.${qi}.status" ${statusLocked ? "disabled" : ""}>
                ${QUOTE_STATUSES.map((s) => `<option ${s === q.status ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="lines">${lines}</div>
        </article>`;
      })
      .join("") +
    `<div class="grand-row"><span>Grand</span><span>${money(grandTotal())}</span></div>`;

  root.querySelectorAll("[data-path]").forEach((el) => {
    bindField(el, (input) => commitPath(input.dataset.path, input.value, input.type === "number"));
  });
}

function renderProducts() {
  const root = document.getElementById("products-root");
  root.innerHTML = working.products
    .map((p, i) => {
      const m = masterProduct(p.sku);
      const flag = needsReorder(p);
      const fields = [
        ["description", "Description", "text", "products.description"],
        ["onHand", "On hand", "number", "products.onHand"],
        ["reorderPoint", "ROP", "number", "products.reorderPoint"],
        ["leadDays", "Lead days", "number", "products.leadDays"],
        ["cost", "Cost (£)", "number", "products.cost"],
        ["sell", "Sell (£)", "number", "products.sell"],
      ];
      return `
      <article class="entity-card">
        <div class="entity-head">
          <h2 class="mono">${p.sku}</h2>
          <span class="badge ${flag ? "badge-warn" : "badge-ok"}">${flag ? "Reorder" : "ok"}</span>
        </div>
        <div class="field-grid">
          ${fields
            .map(([key, label, type, perm]) => {
              const locked = !roleCanEdit(perm);
              const step = key === "cost" || key === "sell" ? "0.01" : "1";
              return `
              <div class="${fieldClass(isDirty(m?.[key], p[key]), locked)}">
                <label>${label}</label>
                <input type="${type}" ${type === "number" ? `step="${step}" min="0"` : ""} data-path="products.${i}.${key}" value="${p[key]}" ${locked ? "disabled" : ""} />
              </div>`;
            })
            .join("")}
        </div>
      </article>`;
    })
    .join("");

  root.querySelectorAll("[data-path]").forEach((el) => {
    bindField(el, (input) => commitPath(input.dataset.path, input.value, input.type === "number"));
  });
}

function renderCustomers() {
  const root = document.getElementById("customers-root");
  root.innerHTML = working.customers
    .map((c, i) => {
      const m = masterCustomer(c.id);
      const fields = [
        ["name", "Name", "text", "customers.name"],
        ["status", "Status", "select", "customers.status"],
        ["email", "Email", "email", "customers.email"],
        ["postcode", "Postcode", "text", "customers.postcode"],
      ];
      return `
      <article class="entity-card">
        <div class="entity-head">
          <h2 class="mono">${c.id}</h2>
        </div>
        <div class="field-grid">
          ${fields
            .map(([key, label, type, perm]) => {
              const locked = !roleCanEdit(perm);
              if (type === "select") {
                return `
                <div class="${fieldClass(isDirty(m?.[key], c[key]), locked)}">
                  <label>${label}</label>
                  <select data-path="customers.${i}.${key}" ${locked ? "disabled" : ""}>
                    ${CUSTOMER_STATUSES.map((s) => `<option ${s === c[key] ? "selected" : ""}>${s}</option>`).join("")}
                  </select>
                </div>`;
              }
              return `
              <div class="${fieldClass(isDirty(m?.[key], c[key]), locked)}">
                <label>${label}</label>
                <input type="${type}" ${key === "postcode" ? 'class="postcode" autocomplete="postal-code" inputmode="text" spellcheck="false"' : ""} data-path="customers.${i}.${key}" value="${c[key] ?? ""}" ${locked ? "disabled" : ""} />
              </div>`;
            })
            .join("")}
        </div>
      </article>`;
    })
    .join("");

  root.querySelectorAll("[data-path]").forEach((el) => {
    bindField(el, (input) => commitPath(input.dataset.path, input.value, false));
  });
}

function renderOrders() {
  const root = document.getElementById("orders-root");
  root.innerHTML = working.orders
    .map((o, i) => {
      const m = masterOrder(o.orderNo);
      const statusLocked = !roleCanEdit("orders.status");
      const valueLocked = !roleCanEdit("orders.value");
      const quoteLocked = !roleCanEdit("orders.quoteNo");
      const custLocked = !roleCanEdit("orders.customerId");
      const custOptions = working.customers
        .map((c) => `<option value="${c.id}" ${c.id === o.customerId ? "selected" : ""}>${c.name}</option>`)
        .join("");
      return `
      <article class="entity-card">
        <div class="entity-head">
          <h2 class="mono">${o.orderNo}</h2>
          <span class="entity-meta">${customerName(o.customerId)}</span>
        </div>
        <div class="field-grid">
          <div class="${fieldClass(isDirty(m?.quoteNo, o.quoteNo), quoteLocked)}">
            <label>Quote</label>
            <input data-path="orders.${i}.quoteNo" value="${o.quoteNo}" ${quoteLocked ? "disabled" : ""} />
          </div>
          <div class="${fieldClass(isDirty(m?.customerId, o.customerId), custLocked)}">
            <label>Customer</label>
            <select data-path="orders.${i}.customerId" ${custLocked ? "disabled" : ""}>${custOptions}</select>
          </div>
          <div class="${fieldClass(isDirty(m?.status, o.status), statusLocked)}">
            <label>Status</label>
            <select data-path="orders.${i}.status" ${statusLocked ? "disabled" : ""}>
              ${ORDER_STATUSES.map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
          <div class="${fieldClass(isDirty(m?.value, o.value), valueLocked)}">
            <label>Value (£)</label>
            <input type="number" min="0" step="0.01" data-path="orders.${i}.value" value="${o.value}" ${valueLocked ? "disabled" : ""} />
          </div>
        </div>
      </article>`;
    })
    .join("");

  root.querySelectorAll("[data-path]").forEach((el) => {
    bindField(el, (input) => commitPath(input.dataset.path, input.value, input.type === "number"));
  });
}

function showView(name) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === name);
  });
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    const active = panel.dataset.viewPanel === name;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
}

function renderAll() {
  updateCopyPill();
  renderDashboard();
  renderQuotes();
  renderProducts();
  renderCustomers();
  renderOrders();
}

function boot() {
  renderRoleSelect();
  renderAll();

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  document.getElementById("role-select").addEventListener("change", (e) => {
    activeRole = e.target.value;
    localStorage.setItem(ROLE_KEY, activeRole);
    document.getElementById("role-blurb").textContent = ROLE_TREE[activeRole].blurb;
    renderAll();
    toast(`Role → ${activeRole}. Fields locked/unlocked by hierarchy.`);
  });

  document.getElementById("reset-working").addEventListener("click", () => {
    if (confirm("Discard working-copy changes and reload master values? Master itself is never modified.")) {
      resetWorking();
    }
  });
}

boot();
