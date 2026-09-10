/**
 * Rushmore Business OS — HTML twin of the C++ scaffold.
 * MASTER is immutable. All edits land in a working copy (localStorage).
 * Field writes + creates are gated by hierarchical role permissions.
 *
 * OOP note: strict encapsulation/polymorphism lives in the C++ layer
 * (include/I*.h → concrete classes). This JS file mirrors behaviour for
 * browser preview; it is intentionally procedural, not a second hierarchy.
 */

const STORAGE_KEY = "rushmore-bos-working-v4";
const ROLE_KEY = "rushmore-bos-role-v1";
const CURRENCY = "GBP";
const LOCALE = "en-GB";

/**
 * Master tables + cardinalities (mirrors C++ DemoSeed / RelationService):
 * 1:1  Customer↔CustomerAccount, Order↔Invoice, Quote↔Order (when quoteNo set)
 * 1:N  Customer→Quotes/Orders, Quote→QuoteLines, Order→OrderLines
 * M:N  Product↔Tag (productTags), Product↔Supplier (productSuppliers),
 *      Quote↔Product (quoteLines), Order↔Product (orderLines)
 */
const MASTER = deepFreeze({
  customers: [
    { id: "C001", name: "Acme Fab", email: "buyer@acme.example", postcode: "B1 1AA", status: "Active", extras: {} },
    { id: "C002", name: "Northline", email: "ops@northline.example", postcode: "M1 2AB", status: "Active", extras: {} },
    { id: "C003", name: "Summit Seal", email: "purchasing@summit.example", postcode: "EH1 3EG", status: "Inactive", extras: {} },
    { id: "C004", name: "Prestige Pilot", email: "pilot@prestige.example", postcode: "SW1A 1AA", status: "Active", extras: {} },
  ],
  accounts: [
    { customerId: "C001", accountCode: "ACC-C001", creditLimit: 5000, paymentTerms: "Net-30" },
    { customerId: "C002", accountCode: "ACC-C002", creditLimit: 12000, paymentTerms: "Net-45" },
    { customerId: "C003", accountCode: "ACC-C003", creditLimit: 2500, paymentTerms: "Net-15" },
    { customerId: "C004", accountCode: "ACC-C004", creditLimit: 20000, paymentTerms: "Net-30" },
  ],
  products: [
    { sku: "P1001", description: "Flat gasket A", onHand: 120, reorderPoint: 40, leadDays: 7, cost: 2.5, sell: 4.75, extras: {} },
    { sku: "P1002", description: "Cone seal B", onHand: 18, reorderPoint: 25, leadDays: 14, cost: 3.1, sell: 5.9, extras: {} },
    { sku: "P1003", description: "Ring C", onHand: 80, reorderPoint: 30, leadDays: 5, cost: 1.2, sell: 2.4, extras: {} },
    { sku: "P1004", description: "Sleeve D", onHand: 55, reorderPoint: 20, leadDays: 10, cost: 4.0, sell: 7.5, extras: {} },
    { sku: "P1005", description: "Washer E", onHand: 200, reorderPoint: 50, leadDays: 3, cost: 0.4, sell: 0.95, extras: {} },
    { sku: "P1006", description: "Spacer F", onHand: 12, reorderPoint: 15, leadDays: 8, cost: 1.8, sell: 3.25, extras: {} },
  ],
  tags: [
    { id: "T-SEAL", name: "Sealing" },
    { id: "T-FAST", name: "Fastener" },
    { id: "T-STOCK", name: "Stocked" },
  ],
  productTags: [
    { sku: "P1001", tagId: "T-SEAL" },
    { sku: "P1001", tagId: "T-STOCK" },
    { sku: "P1002", tagId: "T-SEAL" },
    { sku: "P1005", tagId: "T-FAST" },
    { sku: "P1005", tagId: "T-STOCK" },
    { sku: "P1006", tagId: "T-FAST" },
  ],
  suppliers: [
    { id: "S-01", name: "Midlands Rubber", postcode: "B1 2AA" },
    { id: "S-02", name: "Clyde Components", postcode: "G1 1AA" },
  ],
  productSuppliers: [
    { sku: "P1001", supplierId: "S-01", leadDays: 7, unitCost: 2.4 },
    { sku: "P1001", supplierId: "S-02", leadDays: 10, unitCost: 2.55 },
    { sku: "P1002", supplierId: "S-01", leadDays: 14, unitCost: 3.0 },
    { sku: "P1003", supplierId: "S-02", leadDays: 5, unitCost: 1.1 },
    { sku: "P1006", supplierId: "S-01", leadDays: 8, unitCost: 1.7 },
    { sku: "P1006", supplierId: "S-02", leadDays: 12, unitCost: 1.75 },
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
    {
      orderNo: "O-500",
      quoteNo: "Q-100",
      customerId: "C004",
      status: "Shipped",
      extras: {},
      lines: [
        { line: 1, sku: "P1001", qty: 10, price: 4.75 },
        { line: 2, sku: "P1002", qty: 5, price: 5.9 },
      ],
    },
    {
      orderNo: "O-501",
      quoteNo: "",
      customerId: "C002",
      status: "Open",
      extras: {},
      lines: [
        { line: 1, sku: "P1005", qty: 80, price: 0.95 },
        { line: 2, sku: "P1006", qty: 10, price: 3.25 },
      ],
    },
  ],
  invoices: [
    { invoiceNo: "INV-500", orderNo: "O-500", status: "Paid", amount: 77.0 },
    { invoiceNo: "INV-501", orderNo: "O-501", status: "Draft", amount: 108.5 },
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
let editMode = sessionStorage.getItem("rushmore-edit-mode") === "1";
let undoStack = [];
let redoStack = [];
const MAX_UNDO = 40;
const ACTIVITY_KEY = "rushmore-bos-activity-v1";
const POSTED_KEY = "rushmore-bos-posted-v1";
let activityLog = loadActivity();
let postedSnapshot = loadPosted();

function loadActivity() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {
    /* ignore */
  }
  return [];
}

function saveActivity() {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog.slice(0, 40)));
}

function loadPosted() {
  try {
    const raw = localStorage.getItem(POSTED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {
    /* ignore */
  }
  return null;
}

function logActivity(message, kind = "info") {
  activityLog.unshift({
    at: new Date().toISOString(),
    role: activeRole,
    kind,
    message,
  });
  activityLog = activityLog.slice(0, 40);
  saveActivity();
}

function snapshotWorking() {
  return clone(working);
}

function pushUndo(label) {
  undoStack.push({ label, data: snapshotWorking() });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack = [];
}

function mutate(label, fn) {
  if (!editMode) {
    toast("Turn on Edit to make changes.");
    return false;
  }
  pushUndo(label);
  fn();
  persistWorking();
  logActivity(label, "edit");
  renderAll();
  return true;
}

function setEditMode(on) {
  editMode = Boolean(on);
  sessionStorage.setItem("rushmore-edit-mode", editMode ? "1" : "0");
  logActivity(editMode ? "Edit mode on" : "Edit mode off", "mode");
  renderAll();
  toast(editMode ? "Edit mode on — fields unlocked by role." : "Edit mode off — fields locked.");
}

function toggleEditMode() {
  setEditMode(!editMode);
}

function undoChange() {
  if (!undoStack.length) {
    toast("Nothing to undo.");
    return;
  }
  const prev = undoStack.pop();
  redoStack.push({ label: prev.label, data: snapshotWorking() });
  working = normalizeWorking(prev.data);
  persistWorking();
  logActivity(`Undo · ${prev.label}`, "undo");
  renderAll();
  toast(`Undid: ${prev.label}`);
}

function redoChange() {
  if (!redoStack.length) {
    toast("Nothing to redo.");
    return;
  }
  const next = redoStack.pop();
  undoStack.push({ label: next.label, data: snapshotWorking() });
  working = normalizeWorking(next.data);
  persistWorking();
  logActivity(`Redo · ${next.label}`, "redo");
  renderAll();
  toast(`Redid: ${next.label}`);
}

function postWorking() {
  if (!differsFromPosted() && !workingDiffersFromMaster()) {
    toast("Nothing new to post.");
    return;
  }
  postedSnapshot = {
    at: new Date().toISOString(),
    role: activeRole,
    data: snapshotWorking(),
  };
  localStorage.setItem(POSTED_KEY, JSON.stringify(postedSnapshot));
  logActivity(`Posted journal · ${new Date().toLocaleString(LOCALE)}`, "post");
  renderAll();
  toast("Posted to journal (master still sealed).");
}

function discardWorking() {
  if (!workingDiffersFromMaster() && !undoStack.length) {
    toast("Working copy already matches master.");
    return;
  }
  if (!confirm("Discard working-copy changes and reload master values? Master itself is never modified.")) {
    return;
  }
  pushUndo("Discard (before)");
  working = normalizeWorking(clone(MASTER));
  localStorage.removeItem(STORAGE_KEY);
  persistWorking();
  undoStack = [];
  redoStack = [];
  logActivity("Discarded working copy → master reload", "discard");
  renderAll();
  toast("Working copy discarded — master untouched.");
}

function clearActivity() {
  activityLog = [];
  saveActivity();
  renderAll();
  toast("Activity cleared.");
}

function countPendingChanges() {
  return summarizeChanges().length;
}

function summarizeChanges() {
  const changes = [];
  const masterNorm = normalizeWorking(clone(MASTER));

  for (const c of working.customers) {
    const m = masterNorm.customers.find((x) => x.id === c.id);
    if (!m) {
      changes.push({ entity: "customers", id: c.id, detail: "New customer" });
      continue;
    }
    for (const key of ["name", "email", "postcode", "status"]) {
      if (isDirty(m[key], c[key])) changes.push({ entity: "customers", id: c.id, detail: `${key}: ${m[key]} → ${c[key]}` });
    }
  }
  for (const p of working.products) {
    const m = masterNorm.products.find((x) => x.sku === p.sku);
    if (!m) {
      changes.push({ entity: "products", id: p.sku, detail: "New product" });
      continue;
    }
    for (const key of ["description", "onHand", "reorderPoint", "leadDays", "cost", "sell"]) {
      if (isDirty(m[key], p[key])) changes.push({ entity: "products", id: p.sku, detail: `${key}: ${m[key]} → ${p[key]}` });
    }
  }
  for (const q of working.quotes) {
    const m = masterNorm.quotes.find((x) => x.quoteNo === q.quoteNo);
    if (!m) {
      changes.push({ entity: "quotes", id: q.quoteNo, detail: "New quote" });
      continue;
    }
    if (isDirty(m.status, q.status)) changes.push({ entity: "quotes", id: q.quoteNo, detail: `status: ${m.status} → ${q.status}` });
    if (isDirty(m.customerId, q.customerId)) changes.push({ entity: "quotes", id: q.quoteNo, detail: `customer: ${m.customerId} → ${q.customerId}` });
    if (JSON.stringify(m.lines) !== JSON.stringify(q.lines)) {
      changes.push({ entity: "quotes", id: q.quoteNo, detail: "Line items changed" });
    }
  }
  for (const o of working.orders) {
    const m = masterNorm.orders.find((x) => x.orderNo === o.orderNo);
    if (!m) {
      changes.push({ entity: "orders", id: o.orderNo, detail: "New order" });
      continue;
    }
    for (const key of ["status", "quoteNo", "customerId"]) {
      if (isDirty(m[key], o[key])) changes.push({ entity: "orders", id: o.orderNo, detail: `${key}: ${m[key]} → ${o[key]}` });
    }
    if (JSON.stringify(m.lines || []) !== JSON.stringify(o.lines || [])) {
      changes.push({ entity: "orders", id: o.orderNo, detail: "Line items changed" });
    }
  }
  if (JSON.stringify(working.customFields) !== JSON.stringify(masterNorm.customFields)) {
    changes.push({ entity: "fields", id: "custom", detail: `${working.customFields.length} custom field(s)` });
  }
  return changes;
}

function differsFromPosted() {
  if (!postedSnapshot) return workingDiffersFromMaster();
  return JSON.stringify(working) !== JSON.stringify(postedSnapshot.data);
}

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
  if (!Array.isArray(next.accounts)) next.accounts = clone(MASTER.accounts);
  if (!Array.isArray(next.invoices)) next.invoices = clone(MASTER.invoices);
  if (!Array.isArray(next.tags)) next.tags = clone(MASTER.tags);
  if (!Array.isArray(next.productTags)) next.productTags = clone(MASTER.productTags);
  if (!Array.isArray(next.suppliers)) next.suppliers = clone(MASTER.suppliers);
  if (!Array.isArray(next.productSuppliers)) next.productSuppliers = clone(MASTER.productSuppliers);
  for (const c of next.customers) if (!c.extras) c.extras = {};
  for (const p of next.products) if (!p.extras) p.extras = {};
  for (const q of next.quotes) {
    if (!q.extras) q.extras = {};
    if (!Array.isArray(q.lines)) q.lines = [];
  }
  for (const o of next.orders) {
    if (!o.extras) o.extras = {};
    if (!Array.isArray(o.lines)) o.lines = [];
    o.value = o.lines.reduce((sum, line) => sum + Number(line.qty) * Number(line.price), 0);
  }
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
  if (!editMode) return false;
  const allowed = roleBag("canEdit");
  if (allowed.has(fieldKey)) return true;
  if (fieldKey.startsWith("custom.") && allowed.has("custom.*")) return true;
  return false;
}

function roleCanAdd(entity) {
  if (!editMode) return false;
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
  if (!pill) return;
  const dirty = workingDiffersFromMaster();
  const unposted = differsFromPosted();
  if (!dirty) {
    pill.textContent = postedSnapshot ? "Working · matches master · posted" : "Working · matches master";
    pill.classList.add("is-clean");
  } else if (unposted) {
    pill.textContent = `Working · ${countPendingChanges()} change(s) · unposted`;
    pill.classList.remove("is-clean");
  } else {
    pill.textContent = `Working · ${countPendingChanges()} change(s) · posted`;
    pill.classList.remove("is-clean");
  }
  syncCommandButtons();
}

function syncCommandButtons() {
  const dirty = workingDiffersFromMaster();
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;
  const canPost = dirty || differsFromPosted();

  document.querySelectorAll("#btn-edit, [data-cmd='edit']").forEach((btn) => {
    btn.classList.toggle("is-active", editMode);
    btn.textContent = editMode ? "Editing" : "Edit";
  });
  document.querySelectorAll("#btn-undo, [data-cmd='undo']").forEach((btn) => {
    btn.disabled = !canUndo;
  });
  document.querySelectorAll("#btn-redo, [data-cmd='redo']").forEach((btn) => {
    btn.disabled = !canRedo;
  });
  document.querySelectorAll("#btn-post, [data-cmd='post']").forEach((btn) => {
    btn.disabled = !canPost;
  });
  document.querySelectorAll("#btn-discard, [data-cmd='discard']").forEach((btn) => {
    btn.disabled = !dirty && !canUndo;
  });
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
  mutate(`Edit ${path}`, () => {
    cursor[key] = next;
  });
  if (editMode) toast("Saved to working copy (master unchanged).");
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
  if (!editMode) {
    toast("Turn on Edit to add customers.");
    return;
  }
  if (!roleBag("canAdd").has("customers")) {
    toast("Your role cannot add customers.");
    return;
  }
  const id = nextCustomerId();
  if (!mutate(`Add customer ${id}`, () => {
    working.customers.push({
      id,
      name: "New customer",
      email: "",
      postcode: "",
      status: "Active",
      extras: {},
    });
  })) return;
  showView("customers");
  toast(`Customer ${id} added to working copy.`);
}

function addProduct() {
  if (!editMode) { toast("Turn on Edit to add products."); return; }
  if (!roleBag("canAdd").has("products")) { toast("Your role cannot add products."); return; }
  const sku = nextSku();
  if (!mutate(`Add product ${sku}`, () => {
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
  })) return;
  showView("products");
  toast(`Product ${sku} added to working copy.`);
}

function addQuote() {
  if (!editMode) { toast("Turn on Edit to add quotes."); return; }
  if (!roleBag("canAdd").has("quotes")) { toast("Your role cannot add quotes."); return; }
  const quoteNo = nextQuoteNo();
  const customerId = working.customers[0]?.id || "";
  const sku = working.products[0]?.sku || "P1001";
  const price = working.products[0]?.sell || 0;
  if (!mutate(`Add quote ${quoteNo}`, () => {
    working.quotes.push({
      quoteNo,
      customerId,
      status: "Open",
      extras: {},
      lines: [{ line: 1, sku, qty: 1, price }],
    });
  })) return;
  showView("quotes");
  toast(`Quote ${quoteNo} added to working copy.`);
}

function addQuoteLine(quoteIndex) {
  if (!editMode) { toast("Turn on Edit to add quote lines."); return; }
  if (!roleBag("canAdd").has("quoteLines")) { toast("Your role cannot add quote lines."); return; }
  const quote = working.quotes[quoteIndex];
  if (!quote) return;
  const sku = working.products[0]?.sku || "P1001";
  const price = working.products.find((p) => p.sku === sku)?.sell || 0;
  const line = (quote.lines[quote.lines.length - 1]?.line || 0) + 1;
  if (!mutate(`Add line L${line} on ${quote.quoteNo}`, () => {
    quote.lines.push({ line, sku, qty: 1, price });
  })) return;
  toast(`Line L${line} added on ${quote.quoteNo}.`);
}

function addOrder() {
  if (!editMode) { toast("Turn on Edit to add orders."); return; }
  if (!roleBag("canAdd").has("orders")) { toast("Your role cannot add orders."); return; }
  const orderNo = nextOrderNo();
  if (!mutate(`Add order ${orderNo}`, () => {
    working.orders.push({
      orderNo,
      quoteNo: "",
      customerId: working.customers[0]?.id || "",
      status: "Open",
      extras: {},
      lines: [],
      value: 0,
    });
  })) return;
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
  if (!editMode) { toast("Turn on Edit to add fields."); return; }
  if (!roleBag("canAdd").has("customFields")) {
    toast("Your role cannot add custom fields.");
    return;
  }
  const cleanLabel = String(label || "").trim();
  if (!cleanLabel) { toast("Enter a field label."); return; }
  if (!CUSTOM_ENTITIES.includes(entity)) { toast("Pick a valid entity."); return; }
  const key = slugifyFieldKey(cleanLabel);
  if (!key) { toast("Invalid field label."); return; }
  if (working.customFields.some((f) => f.entity === entity && f.key === key)) {
    toast("That custom field already exists.");
    return;
  }
  if (!mutate(`Add custom field ${entity}.${key}`, () => {
    working.customFields.push({ entity, key, label: cleanLabel, type: type === "number" ? "number" : "text" });
    const collection =
      entity === "customers" ? working.customers
      : entity === "products" ? working.products
      : entity === "quotes" ? working.quotes
      : working.orders;
    for (const row of collection) {
      if (!row.extras) row.extras = {};
      if (row.extras[key] === undefined) row.extras[key] = type === "number" ? 0 : "";
    }
  })) return;
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
  const pending = summarizeChanges();
  const reorderCount = working.products.filter(needsReorder).length;
  const status = document.getElementById("dash-status");
  if (status) {
    status.textContent = editMode
      ? `Editing as ${activeRole} · ${pending.length} pending change(s) vs master.`
      : `Viewing as ${activeRole} · turn on Edit to change fields.`;
  }

  const strip = document.getElementById("status-strip");
  if (strip) {
    const postedLabel = postedSnapshot
      ? `Last post ${new Date(postedSnapshot.at).toLocaleString(LOCALE)}`
      : "Never posted";
    strip.innerHTML = `
      <span class="status-chip ${editMode ? "is-live" : ""}">${editMode ? "EDIT MODE" : "READ ONLY"}</span>
      <span class="status-chip">${activeRole}</span>
      <span class="status-chip ${pending.length ? "is-warn" : "is-ok"}">${pending.length} pending</span>
      <span class="status-chip">${undoStack.length} undo · ${redoStack.length} redo</span>
      <span class="status-chip">${postedLabel}</span>`;
  }

  const metrics = [
    { label: "Customers", value: String(working.customers.length) },
    { label: "Products", value: String(working.products.length) },
    { label: "Open quote value", value: money(grandTotal()) },
    { label: "Orders", value: String(working.orders.length) },
    { label: "Pending edits", value: String(pending.length) },
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

  const quick = document.getElementById("quick-actions");
  if (quick) {
    const actions = [
      { id: "qa-edit", label: editMode ? "Stop editing" : "Start editing", run: "edit" },
      { id: "qa-post", label: "Post journal", run: "post" },
      { id: "qa-undo", label: "Undo", run: "undo" },
      { id: "qa-customer", label: "Add customer", run: "add-customer", need: "customers" },
      { id: "qa-quote", label: "Add quote", run: "add-quote", need: "quotes" },
      { id: "qa-product", label: "Add product", run: "add-product", need: "products" },
      { id: "qa-order", label: "Add order", run: "add-order", need: "orders" },
      { id: "qa-fields", label: "Field network", run: "fields" },
    ];
    quick.innerHTML = actions
      .map((a) => {
        const locked = a.need && !roleBag("canAdd").has(a.need);
        return `<button type="button" class="ghost-btn action-btn" data-quick="${a.run}" ${locked ? "disabled title=\"Role cannot do this\"" : ""}>${a.label}</button>`;
      })
      .join("");
    quick.querySelectorAll("[data-quick]").forEach((btn) => {
      btn.addEventListener("click", () => runQuick(btn.dataset.quick));
    });
  }

  const changeList = document.getElementById("change-list");
  if (changeList) {
    changeList.innerHTML = pending.length
      ? pending
          .slice(0, 12)
          .map((c) => `<li><span class="mono">${c.entity}/${c.id}</span><span>${c.detail}</span></li>`)
          .join("")
      : `<li><span class="mono">—</span><span>No pending differences vs master</span></li>`;
  }

  const activity = document.getElementById("activity-list");
  if (activity) {
    activity.innerHTML = activityLog.length
      ? activityLog
          .slice(0, 14)
          .map((a) => {
            const when = new Date(a.at).toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            return `<li class="activity-item kind-${a.kind}"><span class="mono">${when}</span><span>${a.message}</span><span class="activity-role">${a.role}</span></li>`;
          })
          .join("")
      : `<li><span class="mono">—</span><span>No activity yet — Edit, Post, or Undo to begin</span></li>`;
  }

  syncCommandButtons();
}

function runQuick(action) {
  if (action === "edit") return toggleEditMode();
  if (action === "post") return postWorking();
  if (action === "undo") return undoChange();
  if (action === "add-customer") return addCustomer();
  if (action === "add-quote") return addQuote();
  if (action === "add-product") return addProduct();
  if (action === "add-order") return addOrder();
  if (action === "fields") return showView("fields");
}

function runCommand(cmd) {
  if (cmd === "edit") return toggleEditMode();
  if (cmd === "post") return postWorking();
  if (cmd === "undo") return undoChange();
  if (cmd === "redo") return redoChange();
  if (cmd === "discard") return discardWorking();
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

function orderValue(o) {
  return (o.lines || []).reduce((sum, line) => sum + Number(line.qty) * Number(line.price), 0);
}

function renderOrders() {
  const root = document.getElementById("orders-root");
  root.innerHTML =
    actionBar([{ show: roleCanAdd("orders"), action: "add-order", label: "Add order" }]) +
    working.orders
      .map((o, i) => {
        const m = masterOrder(o.orderNo);
        const statusLocked = !roleCanEdit("orders.status");
        const quoteLocked = !roleCanEdit("orders.quoteNo");
        const custLocked = !roleCanEdit("orders.customerId");
        const custOptions = working.customers
          .map((c) => `<option value="${c.id}" ${c.id === o.customerId ? "selected" : ""}>${c.name}</option>`)
          .join("");
        const lines = (o.lines || [])
          .map(
            (line) =>
              `<li class="mono">${line.sku} × ${line.qty} @ ${money(line.price)} = ${money(line.qty * line.price)}</li>`
          )
          .join("");
        return `
      <article class="entity-card">
        <div class="entity-head">
          <h2 class="mono">${o.orderNo}</h2>
          <span class="entity-meta">${customerName(o.customerId)} · ${money(orderValue(o))}</span>
          ${m ? "" : '<span class="badge badge-warn">Working only</span>'}
        </div>
        <div class="field-grid">
          <div class="${fieldClass(isDirty(m?.quoteNo, o.quoteNo), quoteLocked)}">
            <label>Quote (1:1 when set)</label>
            <input data-path="orders.${i}.quoteNo" value="${o.quoteNo}" ${quoteLocked ? "disabled" : ""} />
          </div>
          <div class="${fieldClass(isDirty(m?.customerId, o.customerId), custLocked)}">
            <label>Customer (N:1)</label>
            <select data-path="orders.${i}.customerId" ${custLocked ? "disabled" : ""}>${custOptions}</select>
          </div>
          <div class="${fieldClass(isDirty(m?.status, o.status), statusLocked)}">
            <label>Status</label>
            <select data-path="orders.${i}.status" ${statusLocked ? "disabled" : ""}>
              ${ORDER_STATUSES.map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
          ${renderExtras("orders", i, o, m?.extras)}
        </div>
        <ul class="line-list" aria-label="Order lines (M:N to products)">${lines || "<li>No lines</li>"}</ul>
      </article>`;
      })
      .join("");

  bindActions(root);
  bindPaths(root);
}

function renderRelations() {
  const root = document.getElementById("relations-root");
  if (!root) return;
  const accountRows = (MASTER.accounts || [])
    .map((a) => `<tr><td class="mono">${a.customerId}</td><td class="mono">${a.accountCode}</td><td>${money(a.creditLimit)}</td><td>${a.paymentTerms}</td></tr>`)
    .join("");
  const invoiceRows = (MASTER.invoices || [])
    .map((inv) => `<tr><td class="mono">${inv.invoiceNo}</td><td class="mono">${inv.orderNo}</td><td>${inv.status}</td><td>${money(inv.amount)}</td></tr>`)
    .join("");
  const tagRows = (MASTER.productTags || [])
    .map((pt) => {
      const tag = MASTER.tags.find((t) => t.id === pt.tagId);
      return `<tr><td class="mono">${pt.sku}</td><td class="mono">${pt.tagId}</td><td>${tag?.name || ""}</td></tr>`;
    })
    .join("");
  const supplyRows = (MASTER.productSuppliers || [])
    .map((ps) => {
      const s = MASTER.suppliers.find((x) => x.id === ps.supplierId);
      return `<tr><td class="mono">${ps.sku}</td><td>${s?.name || ps.supplierId}</td><td>${ps.leadDays}d</td><td>${money(ps.unitCost)}</td></tr>`;
    })
    .join("");
  root.innerHTML = `
    <div class="relation-block">
      <h2>Cardinalities</h2>
      <ul class="relation-catalog">
        <li><strong>1:1</strong> Customer ↔ Account · Order ↔ Invoice · Quote ↔ Order (when quoteNo set)</li>
        <li><strong>1:N</strong> Customer → Quotes / Orders · Quote → Lines · Order → Lines</li>
        <li><strong>M:N</strong> Product ↔ Tag · Product ↔ Supplier · Quote/Order ↔ Product via lines</li>
      </ul>
    </div>
    <div class="relation-block">
      <h2>1:1 CustomerAccount</h2>
      <table class="data-table"><thead><tr><th>Customer</th><th>Account</th><th>Credit</th><th>Terms</th></tr></thead><tbody>${accountRows}</tbody></table>
    </div>
    <div class="relation-block">
      <h2>1:1 Invoice</h2>
      <table class="data-table"><thead><tr><th>Invoice</th><th>Order</th><th>Status</th><th>Amount</th></tr></thead><tbody>${invoiceRows}</tbody></table>
    </div>
    <div class="relation-block">
      <h2>M:N ProductTag</h2>
      <table class="data-table"><thead><tr><th>SKU</th><th>Tag</th><th>Name</th></tr></thead><tbody>${tagRows}</tbody></table>
    </div>
    <div class="relation-block">
      <h2>M:N ProductSupplier</h2>
      <table class="data-table"><thead><tr><th>SKU</th><th>Supplier</th><th>Lead</th><th>Cost</th></tr></thead><tbody>${supplyRows}</tbody></table>
    </div>`;
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
  const shell = document.querySelector(".app-shell");
  if (shell) shell.classList.toggle("is-editing", editMode);
  updateCopyPill();
  renderDashboard();
  renderQuotes();
  renderProducts();
  renderCustomers();
  renderOrders();
  renderRelations();
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
    logActivity(`Role switched to ${activeRole}`, "mode");
    renderAll();
    toast(`Role → ${activeRole}. Field network updated.`);
  });

  document.querySelectorAll("#btn-edit, #btn-post, #btn-undo, #btn-redo, #btn-discard").forEach((btn) => {
    btn.addEventListener("click", () => {
      const map = {
        "btn-edit": "edit",
        "btn-post": "post",
        "btn-undo": "undo",
        "btn-redo": "redo",
        "btn-discard": "discard",
      };
      runCommand(map[btn.id]);
    });
  });

  document.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => runCommand(btn.dataset.cmd));
  });

  const clearAct = document.getElementById("btn-clear-activity");
  if (clearAct) clearAct.addEventListener("click", () => clearActivity());
}

boot();
