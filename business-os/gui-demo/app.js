/**
 * Rushmore Business OS — HTML twin of the C++ scaffold.
 * MASTER is immutable. All edits land in a working copy (localStorage).
 * Field writes + creates are gated by hierarchical role permissions.
 */

const STORAGE_KEY = "rushmore-bos-working-v3";
const ROLE_KEY = "rushmore-bos-role-v1";
const CURRENCY = "GBP";
const LOCALE = "en-GB";

const MASTER = deepFreeze({
  customers: [
    { id: "C001", name: "Acme Fab", email: "buyer@acme.example", postcode: "B1 1AA", status: "Active", extras: {} },
    { id: "C002", name: "Northline", email: "ops@northline.example", postcode: "M1 2AB", status: "Active", extras: {} },
    { id: "C003", name: "Summit Seal", email: "purchasing@summit.example", postcode: "EH1 3EG", status: "Inactive", extras: {} },
    { id: "C004", name: "Prestige Pilot", email: "pilot@prestige.example", postcode: "SW1A 1AA", status: "Active", extras: {} },
  ],
  products: [
    { sku: "P1001", description: "Flat gasket A", onHand: 120, reorderPoint: 40, leadDays: 7, cost: 2.5, sell: 4.75, extras: {} },
    { sku: "P1002", description: "Cone seal B", onHand: 18, reorderPoint: 25, leadDays: 14, cost: 3.1, sell: 5.9, extras: {} },
    { sku: "P1003", description: "Ring C", onHand: 80, reorderPoint: 30, leadDays: 5, cost: 1.2, sell: 2.4, extras: {} },
    { sku: "P1004", description: "Sleeve D", onHand: 55, reorderPoint: 20, leadDays: 10, cost: 4.0, sell: 7.5, extras: {} },
    { sku: "P1005", description: "Washer E", onHand: 200, reorderPoint: 50, leadDays: 3, cost: 0.4, sell: 0.95, extras: {} },
    { sku: "P1006", description: "Spacer F", onHand: 12, reorderPoint: 15, leadDays: 8, cost: 1.8, sell: 3.25, extras: {} },
  ],
  quotes: [
    {
      quoteNo: "Q-100",
      customerId: "C004",
      status: "Open",
      extras: {},
      lines: [
        { line: 1, sku: "P1001", qty: 10, price: 4.75 },
        { line: 2, sku: "P1002", qty: 5, price: 5.9 },
      ],
    },
    {
      quoteNo: "Q-101",
      customerId: "C001",
      status: "Open",
      extras: {},
      lines: [
        { line: 1, sku: "P1003", qty: 40, price: 2.4 },
        { line: 2, sku: "P1005", qty: 100, price: 0.95 },
      ],
    },
  ],
  orders: [
    { orderNo: "O-500", quoteNo: "Q-099", customerId: "C002", status: "Shipped", value: 312.5, extras: {} },
    { orderNo: "O-501", quoteNo: "", customerId: "C004", status: "Open", value: 88.0, extras: {} },
  ],
  customFields: [], // { entity, key, label, type } — Finance adds here
});

/**
 * Hierarchical permission network.
 * canEdit  — field keys (supports custom.<entity>.<key>)
 * canAdd   — entity creates: customers | products | quotes | quoteLines | orders | customFields
 */
const ROLE_TREE = {
  Viewer: {
    inherits: [],
    blurb: "Read-only across the field network.",
    canEdit: [],
    canAdd: [],
  },
  Sales: {
    inherits: ["Viewer"],
    blurb: "Add customers & quotes; edit contact + quote line fields.",
    canEdit: [
      "customers.name",
      "customers.email",
      "customers.postcode",
      "customers.status",
      "quotes.status",
      "quotes.customerId",
      "quotes.lines.sku",
      "quotes.lines.qty",
      "quotes.lines.price",
    ],
    canAdd: ["customers", "quotes", "quoteLines"],
  },
  Inventory: {
    inherits: ["Viewer"],
    blurb: "Add products; edit stock OH / ROP / lead / description.",
    canEdit: [
      "products.description",
      "products.onHand",
      "products.reorderPoint",
      "products.leadDays",
    ],
    canAdd: ["products"],
  },
  Finance: {
    inherits: ["Viewer"],
    blurb: "Edit money fields, add products/orders, define custom fields.",
    canEdit: [
      "products.cost",
      "products.sell",
      "products.description",
      "orders.status",
      "orders.value",
      "orders.quoteNo",
      "orders.customerId",
      "quotes.lines.price",
      "custom.*",
    ],
    canAdd: ["products", "orders", "customFields"],
  },
  Manager: {
    inherits: ["Sales", "Inventory", "Finance"],
    blurb: "Full Sales + Inventory + Finance network (working copy only).",
    canEdit: [],
    canAdd: [],
  },
  Admin: {
    inherits: ["Manager"],
    blurb: "Entire field network on working copy. Master stays sealed.",
    canEdit: ["quotes.customerId", "orders.quoteNo", "orders.customerId"],
    canAdd: ["customers", "products", "quotes", "quoteLines", "orders", "customFields"],
  },
};

const QUOTE_STATUSES = ["Open", "Sent", "Won", "Lost"];
const ORDER_STATUSES = ["Open", "Picked", "Shipped", "Closed"];
const CUSTOMER_STATUSES = ["Active", "Inactive"];
const CUSTOM_ENTITIES = ["customers", "products", "quotes", "orders"];

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

function normalizeWorking(data) {
  const next = clone(data);
  if (!Array.isArray(next.customFields)) next.customFields = [];
  for (const c of next.customers) if (!c.extras) c.extras = {};
  for (const p of next.products) if (!p.extras) p.extras = {};
  for (const q of next.quotes) if (!q.extras) q.extras = {};
  for (const o of next.orders) if (!o.extras) o.extras = {};
  return next;
}

function loadWorking() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeWorking(JSON.parse(raw));
  } catch (_) {
    /* ignore */
  }
  return normalizeWorking(clone(MASTER));
}

function persistWorking() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(working));
  updateCopyPill();
}

function resetWorking() {
  working = normalizeWorking(clone(MASTER));
  localStorage.removeItem(STORAGE_KEY);
  persistWorking();
  renderAll();
  toast("Working copy reset to master — master untouched.");
}

function roleBag(fieldName) {
  const allowed = new Set();
  const walk = (name) => {
    const node = ROLE_TREE[name];
    if (!node) return;
    node.inherits.forEach(walk);
    (node[fieldName] || []).forEach((v) => allowed.add(v));
  };
  walk(activeRole);
  return allowed;
}

function roleCanEdit(fieldKey) {
  const allowed = roleBag("canEdit");
  if (allowed.has(fieldKey)) return true;
  if (fieldKey.startsWith("custom.") && allowed.has("custom.*")) return true;
  return false;
}

function roleCanAdd(entity) {
  return roleBag("canAdd").has(entity);
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
  return JSON.stringify(working) !== JSON.stringify(normalizeWorking(clone(MASTER)));
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
  persistWorking();
  renderAll();
  toast("Saved to working copy (master unchanged).");
}

function nextCustomerId() {
  const nums = working.customers.map((c) => Number(String(c.id).replace(/\D/g, "")) || 0);
  return `C${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
}

function nextSku() {
  const nums = working.products.map((p) => Number(String(p.sku).replace(/\D/g, "")) || 1000);
  return `P${Math.max(1000, ...nums) + 1}`;
}

function nextQuoteNo() {
  const nums = working.quotes.map((q) => Number(String(q.quoteNo).replace(/\D/g, "")) || 100);
  return `Q-${Math.max(100, ...nums) + 1}`;
}

function nextOrderNo() {
  const nums = working.orders.map((o) => Number(String(o.orderNo).replace(/\D/g, "")) || 500);
  return `O-${Math.max(500, ...nums) + 1}`;
}

function addCustomer() {
  if (!roleCanAdd("customers")) {
    toast("Your role cannot add customers.");
    return;
  }
  const id = nextCustomerId();
  working.customers.push({
    id,
    name: "New customer",
    email: "",
    postcode: "",
    status: "Active",
    extras: {},
  });
  persistWorking();
  renderAll();
  showView("customers");
  toast(`Customer ${id} added to working copy.`);
}

function addProduct() {
  if (!roleCanAdd("products")) {
    toast("Your role cannot add products.");
    return;
  }
  const sku = nextSku();
  working.products.push({
    sku,
    description: "New product",
    onHand: 0,
    reorderPoint: 0,
    leadDays: 0,
    cost: 0,
    sell: 0,
    extras: {},
  });
  persistWorking();
  renderAll();
  showView("products");
  toast(`Product ${sku} added to working copy.`);
}

function addQuote() {
  if (!roleCanAdd("quotes")) {
    toast("Your role cannot add quotes.");
    return;
  }
  const quoteNo = nextQuoteNo();
  const customerId = working.customers[0]?.id || "";
  const sku = working.products[0]?.sku || "P1001";
  const price = working.products[0]?.sell || 0;
  working.quotes.push({
    quoteNo,
    customerId,
    status: "Open",
    extras: {},
    lines: [{ line: 1, sku, qty: 1, price }],
  });
  persistWorking();
  renderAll();
  showView("quotes");
  toast(`Quote ${quoteNo} added to working copy.`);
}

function addQuoteLine(quoteIndex) {
  if (!roleCanAdd("quoteLines")) {
    toast("Your role cannot add quote lines.");
    return;
  }
  const quote = working.quotes[quoteIndex];
  if (!quote) return;
  const sku = working.products[0]?.sku || "P1001";
  const price = working.products.find((p) => p.sku === sku)?.sell || 0;
  const line = (quote.lines[quote.lines.length - 1]?.line || 0) + 1;
  quote.lines.push({ line, sku, qty: 1, price });
  persistWorking();
  renderAll();
  toast(`Line L${line} added on ${quote.quoteNo}.`);
}

function addOrder() {
  if (!roleCanAdd("orders")) {
    toast("Your role cannot add orders.");
    return;
  }
  const orderNo = nextOrderNo();
  working.orders.push({
    orderNo,
    quoteNo: "",
    customerId: working.customers[0]?.id || "",
    status: "Open",
    value: 0,
    extras: {},
  });
  persistWorking();
  renderAll();
  showView("orders");
  toast(`Order ${orderNo} added to working copy.`);
}

function slugifyFieldKey(label) {
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
}

function addCustomField(entity, label, type) {
  if (!roleCanAdd("customFields")) {
    toast("Your role cannot add custom fields.");
    return;
  }
  const cleanLabel = String(label || "").trim();
  if (!cleanLabel) {
    toast("Enter a field label.");
    return;
  }
  if (!CUSTOM_ENTITIES.includes(entity)) {
    toast("Pick a valid entity.");
    return;
  }
  const key = slugifyFieldKey(cleanLabel);
  if (!key) {
    toast("Invalid field label.");
    return;
  }
  if (working.customFields.some((f) => f.entity === entity && f.key === key)) {
    toast("That custom field already exists.");
    return;
  }
  working.customFields.push({ entity, key, label: cleanLabel, type: type === "number" ? "number" : "text" });
  const collection =
    entity === "customers"
      ? working.customers
      : entity === "products"
        ? working.products
        : entity === "quotes"
          ? working.quotes
          : working.orders;
  for (const row of collection) {
    if (!row.extras) row.extras = {};
    if (row.extras[key] === undefined) row.extras[key] = type === "number" ? 0 : "";
  }
  persistWorking();
  renderAll();
  toast(`Custom field “${cleanLabel}” added on ${entity} (working copy).`);
}

function customFieldsFor(entity) {
  return working.customFields.filter((f) => f.entity === entity);
}

function renderExtras(entity, rowIndex, row, masterExtras) {
  const fields = customFieldsFor(entity);
  if (!fields.length) return "";
  return fields
    .map((f) => {
      const perm = `custom.${entity}.${f.key}`;
      const locked = !roleCanEdit(perm) && !roleCanEdit("custom.*");
      const value = row.extras?.[f.key] ?? "";
      const masterVal = masterExtras?.[f.key];
      return `
        <div class="${fieldClass(isDirty(masterVal, value), locked)}">
          <label>${f.label}</label>
          <input type="${f.type}" ${f.type === "number" ? 'step="0.01"' : ""} data-path="${entity}.${rowIndex}.extras.${f.key}" value="${value}" ${locked ? "disabled" : ""} />
        </div>`;
    })
    .join("");
}

function actionBar(buttons) {
  const visible = buttons.filter((b) => b.show);
  if (!visible.length) return "";
  return `<div class="action-bar">${visible
    .map((b) => `<button type="button" class="ghost-btn action-btn" data-action="${b.action}" ${b.arg != null ? `data-arg="${b.arg}"` : ""}>${b.label}</button>`)
    .join("")}</div>`;
}

function bindActions(root) {
  root.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const arg = btn.dataset.arg;
      if (action === "add-customer") addCustomer();
      if (action === "add-product") addProduct();
      if (action === "add-quote") addQuote();
      if (action === "add-order") addOrder();
      if (action === "add-quote-line") addQuoteLine(Number(arg));
    });
  });
}

function bindPaths(root) {
  root.querySelectorAll("[data-path]").forEach((el) => {
    bindField(el, (input) => commitPath(input.dataset.path, input.value, input.type === "number"));
  });
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
    { label: "Custom fields", value: String(working.customFields.length) },
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
    actionBar([
      { show: roleCanAdd("quotes"), action: "add-quote", label: "Add quote" },
    ]) +
    working.quotes
      .map((q, qi) => {
        const m = masterQuote(q.quoteNo);
        const statusLocked = !roleCanEdit("quotes.status");
        const custLocked = !roleCanEdit("quotes.customerId");
        const skuLocked = !roleCanEdit("quotes.lines.sku");
        const lines = q.lines
          .map((line, li) => {
            const ml = m?.lines?.[li];
            const qtyLocked = !roleCanEdit("quotes.lines.qty");
            const priceLocked = !roleCanEdit("quotes.lines.price");
            const skuOptions = working.products
              .map((p) => `<option value="${p.sku}" ${p.sku === line.sku ? "selected" : ""}>${p.sku}</option>`)
              .join("");
            return `
            <div class="line-row">
              <span class="line-no">L${line.line}</span>
              <div class="field-grid">
                <div class="${fieldClass(isDirty(ml?.sku, line.sku), skuLocked)}">
                  <label>SKU</label>
                  <select data-path="quotes.${qi}.lines.${li}.sku" ${skuLocked ? "disabled" : ""}>${skuOptions}</select>
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
            ${renderExtras("quotes", qi, q, m?.extras)}
          </div>
          <div class="lines">${lines}</div>
          ${actionBar([{ show: roleCanAdd("quoteLines"), action: "add-quote-line", arg: String(qi), label: "Add line" }])}
        </article>`;
      })
      .join("") +
    `<div class="grand-row"><span>Grand</span><span>${money(grandTotal())}</span></div>`;

  bindActions(root);
  bindPaths(root);
}

function renderProducts() {
  const root = document.getElementById("products-root");
  root.innerHTML =
    actionBar([{ show: roleCanAdd("products"), action: "add-product", label: "Add product" }]) +
    working.products
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
          ${renderExtras("products", i, p, m?.extras)}
        </div>
      </article>`;
      })
      .join("");

  bindActions(root);
  bindPaths(root);
}

function renderCustomers() {
  const root = document.getElementById("customers-root");
  root.innerHTML =
    actionBar([{ show: roleCanAdd("customers"), action: "add-customer", label: "Add customer" }]) +
    working.customers
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
          ${m ? "" : '<span class="badge badge-warn">Working only</span>'}
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
                <input type="${type}" ${key === "postcode" ? 'class="postcode" autocomplete="postal-code" spellcheck="false"' : ""} data-path="customers.${i}.${key}" value="${c[key] ?? ""}" ${locked ? "disabled" : ""} />
              </div>`;
            })
            .join("")}
          ${renderExtras("customers", i, c, m?.extras)}
        </div>
      </article>`;
      })
      .join("");

  bindActions(root);
  bindPaths(root);
}

function renderOrders() {
  const root = document.getElementById("orders-root");
  root.innerHTML =
    actionBar([{ show: roleCanAdd("orders"), action: "add-order", label: "Add order" }]) +
    working.orders
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
          ${m ? "" : '<span class="badge badge-warn">Working only</span>'}
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
          ${renderExtras("orders", i, o, m?.extras)}
        </div>
      </article>`;
      })
      .join("");

  bindActions(root);
  bindPaths(root);
}

function renderFields() {
  const root = document.getElementById("fields-root");
  const edits = [...roleBag("canEdit")].sort();
  const adds = [...roleBag("canAdd")].sort();

  const matrix = Object.keys(ROLE_TREE)
    .map((name) => {
      const edit = [];
      const add = [];
      const walk = (n) => {
        const node = ROLE_TREE[n];
        if (!node) return;
        node.inherits.forEach(walk);
        edit.push(...node.canEdit);
        add.push(...node.canAdd);
      };
      walk(name);
      return `<tr>
        <td><strong>${name}</strong></td>
        <td class="mono wrap">${[...new Set(add)].join(", ") || "—"}</td>
        <td class="mono wrap">${[...new Set(edit)].join(", ") || "—"}</td>
      </tr>`;
    })
    .join("");

  const customList = working.customFields.length
    ? working.customFields
        .map((f) => `<li><span class="mono">${f.entity}.${f.key}</span> · ${f.label} (${f.type})</li>`)
        .join("")
    : "<li>No custom fields yet.</li>";

  root.innerHTML = `
    <article class="entity-card">
      <div class="entity-head"><h2>Your role · ${activeRole}</h2></div>
      <p class="panel-note">Add: <span class="mono">${adds.join(", ") || "none"}</span></p>
      <p class="panel-note">Edit: <span class="mono wrap">${edits.join(", ") || "none"}</span></p>
    </article>
    <article class="entity-card">
      <div class="entity-head"><h2>Full field network</h2></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Role</th><th>Can add</th><th>Can edit</th></tr></thead>
          <tbody>${matrix}</tbody>
        </table>
      </div>
    </article>
    <article class="entity-card">
      <div class="entity-head"><h2>Custom fields</h2></div>
      <ul class="watch-list custom-field-list">${customList}</ul>
      ${
        roleCanAdd("customFields")
          ? `<form class="custom-field-form" id="custom-field-form">
              <div class="field-grid">
                <div class="field">
                  <label>Entity</label>
                  <select name="entity">${CUSTOM_ENTITIES.map((e) => `<option value="${e}">${e}</option>`).join("")}</select>
                </div>
                <div class="field">
                  <label>Label</label>
                  <input name="label" type="text" placeholder="e.g. Credit limit" required />
                </div>
                <div class="field">
                  <label>Type</label>
                  <select name="type"><option value="text">text</option><option value="number">number</option></select>
                </div>
              </div>
              <button type="submit" class="ghost-btn action-btn">Add field</button>
            </form>`
          : `<p class="panel-note">Switch to Finance / Manager / Admin to define new fields.</p>`
      }
    </article>`;

  const form = document.getElementById("custom-field-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      addCustomField(String(fd.get("entity")), String(fd.get("label")), String(fd.get("type")));
    });
  }
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
  renderFields();
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
    toast(`Role → ${activeRole}. Field network updated.`);
  });

  document.getElementById("reset-working").addEventListener("click", () => {
    if (confirm("Discard working-copy changes and reload master values? Master itself is never modified.")) {
      resetWorking();
    }
  });
}

boot();
