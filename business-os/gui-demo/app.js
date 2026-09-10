/**
 * Rushmore Business OS — HTML twin of the C++ scaffold.
 * MASTER is immutable. All edits land in a working copy (localStorage).
 * Field writes + creates are gated by hierarchical role permissions.
 *
 * OOP note: strict encapsulation/polymorphism lives in the C++ layer
 * (include/I*.h → concrete classes). This JS file mirrors behaviour for
 * browser preview; it is intentionally procedural, not a second hierarchy.
 */

const STORAGE_KEY = "rushmore-bos-working-v5";
const ROLE_KEY = "rushmore-bos-role-v1";
const CURRENCY = "GBP";
const LOCALE = "en-GB";

/**
 * Master tables + cardinalities (mirrors C++ DemoSeed / RelationService):
 * 1:1  Customer↔CustomerAccount, Order↔Invoice, Quote↔Order (when quoteNo set)
 * 1:N  Customer→Quotes/Orders, Quote→QuoteLines, Order→OrderLines,
 *      Supplier→PurchaseOrders, PurchaseOrder→PoLines
 * M:N  Product↔Tag, Product↔Supplier, Quote/Order/PO↔Product via lines
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
    {
      id: "CITY0002",
      name: "CITY TODAY COURIERS LTD",
      postcode: "SK1 2ND",
      line1: "UNIT 1 NEWBRIDGE LANE",
      line2: "",
      city: "STOCKPORT",
      phone: "0161 477 9800",
      fax: "0161 477 4409",
    },
    { id: "S-01", name: "Midlands Rubber", postcode: "B1 2AA", line1: "12 Forge Way", line2: "", city: "Birmingham", phone: "0121 555 0101", fax: "" },
    { id: "S-02", name: "Clyde Components", postcode: "G1 1AA", line1: "4 Quay Street", line2: "", city: "Glasgow", phone: "0141 555 0202", fax: "" },
  ],
  productSuppliers: [
    { sku: "P1001", supplierId: "S-01", leadDays: 7, unitCost: 2.4 },
    { sku: "P1001", supplierId: "CITY0002", leadDays: 5, unitCost: 2.45 },
    { sku: "P1001", supplierId: "S-02", leadDays: 10, unitCost: 2.55 },
    { sku: "P1002", supplierId: "S-01", leadDays: 14, unitCost: 3.0 },
    { sku: "P1002", supplierId: "CITY0002", leadDays: 10, unitCost: 3.05 },
    { sku: "P1003", supplierId: "S-02", leadDays: 5, unitCost: 1.1 },
    { sku: "P1006", supplierId: "S-01", leadDays: 8, unitCost: 1.7 },
    { sku: "P1006", supplierId: "S-02", leadDays: 12, unitCost: 1.75 },
  ],
  purchaseOrders: [
    {
      poNo: "70286",
      supplierId: "CITY0002",
      invLocation: "",
      purLocation: "",
      orgAccountId: "",
      dropShipOrgId: "",
      dropShipLocation: "",
      apContact: "",
      purchasingContact: "",
      dropShipContact: "",
      invAddress: {
        name: "CITY TODAY COURIERS LTD",
        line1: "UNIT 1 NEWBRIDGE LANE",
        line2: "",
        city: "STOCKPORT",
        postcode: "SK1 2ND",
        phone: "0161 477 9800",
        fax: "0161 477 4409",
      },
      purAddress: {
        name: "CITY TODAY COURIERS LTD",
        line1: "UNIT 1 NEWBRIDGE LANE",
        line2: "",
        city: "STOCKPORT",
        postcode: "SK1 2ND",
        phone: "0161 477 9800",
        fax: "0161 477 4409",
      },
      dropShipAddress: { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" },
      paymentTerms: "30 DAYS EOM",
      dueDate: "09/09/2026",
      shipMethod: "CARRIER",
      fob: "",
      supplierRating: "",
      landedCost: false,
      orderDate: "09/09/2026",
      buyer: "JAMES CRAVEN",
      standardMessage: "Purchasing additional terms and conditions apply.",
      comments: "",
      readyToPrint: true,
      currency: "GBP",
      exchangeRate: 1,
      customRate: false,
      status: "Approved",
      lines: [
        { line: 1, sku: "P1001", qty: 100, unitCost: 2.45 },
        { line: 2, sku: "P1002", qty: 40, unitCost: 3.05 },
      ],
      memos: [{ id: 1, text: "Confirm carrier booking before print." }],
      attachments: [{ id: 1, fileName: "vendor-quote-city.pdf", note: "Supplier quote" }],
      extras: {},
    },
    {
      poNo: "70290",
      supplierId: "S-01",
      invLocation: "",
      purLocation: "",
      orgAccountId: "",
      dropShipOrgId: "",
      dropShipLocation: "",
      apContact: "",
      purchasingContact: "",
      dropShipContact: "",
      invAddress: {
        name: "Midlands Rubber",
        line1: "12 Forge Way",
        line2: "",
        city: "Birmingham",
        postcode: "B1 2AA",
        phone: "0121 555 0101",
        fax: "",
      },
      purAddress: {
        name: "Midlands Rubber",
        line1: "12 Forge Way",
        line2: "",
        city: "Birmingham",
        postcode: "B1 2AA",
        phone: "0121 555 0101",
        fax: "",
      },
      dropShipAddress: { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" },
      paymentTerms: "Net-30",
      dueDate: "20/09/2026",
      shipMethod: "CARRIER",
      fob: "",
      supplierRating: "",
      landedCost: false,
      orderDate: "10/09/2026",
      buyer: "JAMES CRAVEN",
      standardMessage: "Standard purchasing terms.",
      comments: "",
      readyToPrint: false,
      currency: "GBP",
      exchangeRate: 1,
      customRate: false,
      status: "Draft",
      lines: [{ line: 1, sku: "P1006", qty: 25, unitCost: 1.7 }],
      memos: [],
      attachments: [],
      extras: {},
    },
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
  Purchasing: {
    inherits: ["Viewer"],
    blurb: "Own purchase orders, lines, and supplier terms on the working copy.",
    canEdit: [
      "purchaseOrders.status",
      "purchaseOrders.buyer",
      "purchaseOrders.paymentTerms",
      "purchaseOrders.dueDate",
      "purchaseOrders.shipMethod",
      "purchaseOrders.comments",
      "purchaseOrders.currency",
      "purchaseOrders.readyToPrint",
      "purchaseOrders.lines.qty",
      "purchaseOrders.lines.unitCost",
      "purchaseOrders.lines.sku",
    ],
    canAdd: ["purchaseOrders", "poLines"],
  },
  Manager: {
    inherits: ["Sales", "Inventory", "Finance", "Purchasing"],
    blurb: "Full Sales + Inventory + Finance + Purchasing (working copy only).",
    canEdit: [],
    canAdd: [],
  },
  Admin: {
    inherits: ["Manager"],
    blurb: "Entire field network on working copy. Master stays sealed.",
    canEdit: ["quotes.customerId", "orders.quoteNo", "orders.customerId"],
    canAdd: ["customers", "products", "quotes", "quoteLines", "orders", "purchaseOrders", "poLines", "customFields"],
  },
};

const QUOTE_STATUSES = ["Open", "Sent", "Won", "Lost"];
const ORDER_STATUSES = ["Open", "Picked", "Shipped", "Closed"];
const CUSTOMER_STATUSES = ["Active", "Inactive"];
const PO_STATUSES = ["Draft", "Pending Approval", "Approved", "Closed"];
const PAYMENT_TERMS = ["30 DAYS EOM", "Net-30", "Net-45", "Net-15"];
const SHIP_METHODS = ["CARRIER", "COLLECT", "COURIER"];
const BUYERS = ["JAMES CRAVEN", "A. BUYER"];
const CUSTOM_ENTITIES = ["customers", "products", "quotes", "orders", "purchaseOrders"];

let activeHub = localStorage.getItem("rushmore-hub") || "purchasing";
let activePoNo = "70286";
let poTreeTab = "lines";

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
  if (!Array.isArray(next.purchaseOrders)) next.purchaseOrders = clone(MASTER.purchaseOrders);
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
  for (const po of next.purchaseOrders) {
    if (!po.extras) po.extras = {};
    if (!Array.isArray(po.lines)) po.lines = [];
    if (!Array.isArray(po.memos)) po.memos = [];
    if (!Array.isArray(po.attachments)) po.attachments = [];
    if (!po.invAddress) po.invAddress = { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" };
    if (!po.purAddress) po.purAddress = { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" };
    if (!po.dropShipAddress) po.dropShipAddress = { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" };
    po.value = po.lines.reduce((sum, line) => sum + Number(line.qty) * Number(line.unitCost), 0);
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
  const compact = window.matchMedia("(max-width: 860px)").matches;
  if (!dirty) {
    pill.textContent = postedSnapshot
      ? compact
        ? "Clean · posted"
        : "Working · matches master · posted"
      : compact
        ? "Clean · master"
        : "Working · matches master";
    pill.classList.add("is-clean");
  } else if (unposted) {
    pill.textContent = compact
      ? `${countPendingChanges()} Δ · unposted`
      : `Working · ${countPendingChanges()} change(s) · unposted`;
    pill.classList.remove("is-clean");
  } else {
    pill.textContent = compact
      ? `${countPendingChanges()} Δ · posted`
      : `Working · ${countPendingChanges()} change(s) · posted`;
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
    bindField(el, (input) => {
      if (input.type === "checkbox") {
        commitPath(input.dataset.path, input.checked, false);
      } else {
        commitPath(input.dataset.path, input.value, input.type === "number");
      }
    });
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
  const hubTitle = document.getElementById("hub-title");
  const status = document.getElementById("dash-status");
  const hubs = {
    home: "My Start Page",
    sales: "Sales Order Management",
    purchasing: "Purchasing Management",
  };
  if (hubTitle) hubTitle.textContent = hubs[activeHub] || "Purchasing Management";
  if (status) {
    status.textContent = editMode
      ? `Editing as ${activeRole} · ${pending.length} pending · M1 hub`
      : `Viewing as ${activeRole} · Entry · Reports · Maintenance · Analysis`;
  }

  const strip = document.getElementById("status-strip");
  if (strip) {
    const openPos = working.purchaseOrders.filter((p) => p.status !== "Closed").length;
    strip.innerHTML = `
      <span class="status-chip ${editMode ? "is-live" : ""}">${editMode ? "EDIT" : "VIEW"}</span>
      <span class="status-chip">${activeRole}</span>
      <span class="status-chip is-ok">${openPos} open POs</span>
      <span class="status-chip">${working.suppliers.length} suppliers</span>
      <span class="status-chip">${pending.length} pending</span>`;
  }

  const grid = document.getElementById("hub-grid");
  if (!grid) return;

  const packs = hubPacks(activeHub);
  grid.innerHTML = `
    <section class="hub-panel">
      <header class="hub-panel-head">Entry Screens</header>
      <ul class="hub-list">${packs.entry.map(hubItem).join("")}</ul>
    </section>
    <section class="hub-panel hub-panel-analysis">
      <header class="hub-panel-head">Business Analysis</header>
      <div class="hub-explorer">
        <input type="search" placeholder="${packs.explorerPlaceholder}" disabled />
      </div>
      <ul class="hub-list">${packs.analysis.map(hubItem).join("")}</ul>
    </section>
    <section class="hub-panel">
      <header class="hub-panel-head">Reports</header>
      <ul class="hub-list">${packs.reports.map(hubItem).join("")}</ul>
    </section>
    <section class="hub-panel">
      <header class="hub-panel-head">Maintenance</header>
      <ul class="hub-list">${packs.maintenance.map(hubItem).join("")}</ul>
    </section>
    <section class="hub-panel hub-panel-wide">
      <header class="hub-panel-head">Live pulse</header>
      <div class="hub-pulse">
        <div><span class="label">Open quote value</span><strong>${money(grandTotal())}</strong></div>
        <div><span class="label">Open PO value</span><strong>${money(poGrandTotal())}</strong></div>
        <div><span class="label">SKUs ≤ ROP</span><strong>${working.products.filter(needsReorder).length}</strong></div>
        <div><span class="label">Sales orders</span><strong>${working.orders.length}</strong></div>
      </div>
    </section>`;

  grid.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });
  grid.querySelectorAll("[data-hub]").forEach((btn) => {
    btn.addEventListener("click", () => setHub(btn.dataset.hub));
  });
  syncCommandButtons();
}

function hubItem(item) {
  const attrs = item.view
    ? `data-view="${item.view}"`
    : item.hub
      ? `data-hub="${item.hub}"`
      : `data-toast="${item.toast || "Scaffold link"}"`;
  return `<li><button type="button" class="hub-link" ${attrs}><span class="hub-ico" aria-hidden="true">${item.icon}</span><span>${item.label}</span></button></li>`;
}

function hubPacks(hub) {
  if (hub === "sales") {
    return {
      explorerPlaceholder: "Sales Order Explorer",
      entry: [
        { icon: "✎", label: "Quote Entry", view: "quotes" },
        { icon: "☰", label: "Sales Order Entry", view: "orders" },
        { icon: "☺", label: "Customer Maintenance", view: "customers" },
      ],
      reports: [
        { icon: "🖨", label: "Order Acknowledgment", toast: "Report scaffold" },
        { icon: "🖨", label: "Open Sales Orders", view: "orders" },
        { icon: "🖨", label: "Quote Totals", view: "quotes" },
      ],
      maintenance: [
        { icon: "⚙", label: "Field Network", view: "fields" },
        { icon: "⚙", label: "Relations Graph", view: "relations" },
      ],
      analysis: [
        { icon: "🔎", label: "Open quote value · " + money(grandTotal()), view: "quotes" },
        { icon: "📊", label: "Orders requiring attention", view: "orders" },
        { icon: "📅", label: "Customer list", view: "customers" },
      ],
    };
  }
  if (hub === "home") {
    return {
      explorerPlaceholder: "Business Explorer",
      entry: [
        { icon: "📋", label: "PO Entry", view: "po-entry" },
        { icon: "☰", label: "Sales Order Entry", view: "orders" },
        { icon: "✎", label: "Quote Entry", view: "quotes" },
      ],
      reports: [
        { icon: "🖨", label: "Open PO Report", view: "purchasing" },
        { icon: "🖨", label: "Reorder Watch", view: "products" },
      ],
      maintenance: [
        { icon: "⚙", label: "Suppliers / Relations", view: "relations" },
        { icon: "⚙", label: "Field Network", view: "fields" },
      ],
      analysis: [
        { icon: "🔎", label: "Purchasing Management", hub: "purchasing" },
        { icon: "🔎", label: "Sales Order Management", hub: "sales" },
        { icon: "📊", label: "Dashboard pulse below", hub: "home" },
      ],
    };
  }
  // purchasing (default)
  return {
    explorerPlaceholder: "Purchase Order Explorer",
    entry: [
      { icon: "📋", label: "Purchase Order Entry", view: "po-entry" },
      { icon: "📋", label: "Open Purchase Orders", view: "purchasing" },
      { icon: "▦", label: "Inventory / Products", view: "products" },
      { icon: "⇄", label: "Vendor (Supplier) Links", view: "relations" },
    ],
    reports: [
      { icon: "🖨", label: "Purchase Order Print", view: "po-entry" },
      { icon: "🖨", label: "Open PO Report", view: "purchasing" },
      { icon: "🖨", label: "Vendor Performance", toast: "Report scaffold" },
      { icon: "🖨", label: "Expected Receipts", toast: "Report scaffold" },
    ],
    maintenance: [
      { icon: "⚙", label: "Vendor Maintenance", view: "relations" },
      { icon: "⚙", label: "Buyer / Terms Lists", view: "fields" },
      { icon: "⚙", label: "Payment Terms", toast: "List: PaymentTerms" },
      { icon: "⚙", label: "Ship Method Maintenance", toast: "List: ShipMethod" },
    ],
    analysis: [
      { icon: "🔎", label: "POs requiring approval", view: "purchasing" },
      { icon: "📊", label: "Open PO value · " + money(poGrandTotal()), view: "purchasing" },
      { icon: "📊", label: "Price vs ProductSupplier", view: "relations" },
      { icon: "📅", label: "PO 70286 · CITY0002", view: "po-entry" },
      { icon: "📈", label: "Spend by supplier", toast: "Analysis scaffold" },
    ],
  };
}

function poGrandTotal() {
  return working.purchaseOrders.reduce((sum, po) => {
    return sum + po.lines.reduce((s, l) => s + Number(l.qty) * Number(l.unitCost), 0);
  }, 0);
}

function setHub(name) {
  activeHub = name;
  localStorage.setItem("rushmore-hub", name);
  document.querySelectorAll(".tree-leaf").forEach((el) => {
    el.classList.toggle("is-selected", el.dataset.hub === name);
  });
  showView("dashboard");
  renderDashboard();
}

function supplierName(id) {
  return working.suppliers.find((s) => s.id === id)?.name || id;
}

function poValue(po) {
  return (po.lines || []).reduce((sum, l) => sum + Number(l.qty) * Number(l.unitCost), 0);
}

function renderPurchasing() {
  const root = document.getElementById("purchasing-root");
  if (!root) return;
  root.innerHTML = working.purchaseOrders
    .map((po) => {
      return `<article class="entity-card">
        <div class="entity-head">
          <h2 class="mono">${po.poNo}</h2>
          <span class="entity-meta">${supplierName(po.supplierId)} · ${po.status} · ${money(poValue(po))}</span>
        </div>
        <p class="panel-note">${po.orderDate} · ${po.buyer} · ${po.paymentTerms} · ${po.shipMethod}</p>
        <button type="button" class="cmd-btn cmd-primary" data-open-po="${po.poNo}">Open PO Entry</button>
      </article>`;
    })
    .join("");
  root.querySelectorAll("[data-open-po]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activePoNo = btn.dataset.openPo;
      showView("po-entry");
      renderPoEntry();
    });
  });
}

function renderPoEntry() {
  const select = document.getElementById("po-select");
  const form = document.getElementById("po-form");
  const tree = document.getElementById("po-tree");
  if (!form || !select || !tree) return;

  if (!working.purchaseOrders.find((p) => p.poNo === activePoNo) && working.purchaseOrders[0]) {
    activePoNo = working.purchaseOrders[0].poNo;
  }
  const po = working.purchaseOrders.find((p) => p.poNo === activePoNo);
  const idx = working.purchaseOrders.findIndex((p) => p.poNo === activePoNo);
  select.innerHTML = working.purchaseOrders
    .map((p) => `<option value="${p.poNo}" ${p.poNo === activePoNo ? "selected" : ""}>${p.poNo} — ${p.supplierId}</option>`)
    .join("");

  if (!po) {
    form.innerHTML = `<p class="panel-note">No purchase orders in working copy.</p>`;
    tree.innerHTML = "";
    return;
  }

  const locked = !editMode;
  const canEdit = (field) => editMode && roleCanEdit(`purchaseOrders.${field}`);

  tree.innerHTML = `
    <div class="po-tree-root">Purchase Orders</div>
    <div class="po-tree-active mono">${po.poNo} — ${po.supplierId}</div>
    <button type="button" class="po-tree-node ${poTreeTab === "lines" ? "is-active" : ""}" data-po-tab="lines">Purchase Order Lines</button>
    <button type="button" class="po-tree-node ${poTreeTab === "followups" ? "is-active" : ""}" data-po-tab="followups">Follow-ups</button>
    <button type="button" class="po-tree-node ${poTreeTab === "calls" ? "is-active" : ""}" data-po-tab="calls">Calls</button>
    <button type="button" class="po-tree-node ${poTreeTab === "memos" ? "is-active" : ""}" data-po-tab="memos">Purchase Order Memos</button>
    <button type="button" class="po-tree-node ${poTreeTab === "attachments" ? "is-active" : ""}" data-po-tab="attachments">Attachments</button>
    <div class="po-msg-pane">
      <div class="po-msg-tabs"><span>0 Requirements</span><span>0 Warnings</span><span>1 Messages</span></div>
      <p>Order ID '${po.poNo}' · supplier ${po.supplierId} · ${po.orderDate}</p>
    </div>`;

  const addr = (block, title) => `
    <div class="addr-col">
      <h3>${title}</h3>
      <p><strong>${block.name || "—"}</strong></p>
      <p>${block.line1 || ""}</p>
      <p>${block.line2 || ""}</p>
      <p>${block.city || ""} ${block.postcode || ""}</p>
      <p>Phone: ${block.phone || "—"}</p>
      <p>Fax: ${block.fax || "—"}</p>
    </div>`;

  const linesHtml = (po.lines || [])
    .map(
      (l, li) => `<tr>
        <td class="mono">${l.line}</td>
        <td><input data-path="purchaseOrders.${idx}.lines.${li}.sku" value="${l.sku}" ${canEdit("lines.sku") ? "" : "disabled"} /></td>
        <td><input type="number" data-path="purchaseOrders.${idx}.lines.${li}.qty" value="${l.qty}" ${canEdit("lines.qty") ? "" : "disabled"} /></td>
        <td><input type="number" step="0.01" data-path="purchaseOrders.${idx}.lines.${li}.unitCost" value="${l.unitCost}" ${canEdit("lines.unitCost") ? "" : "disabled"} /></td>
        <td class="mono">${money(l.qty * l.unitCost)}</td>
      </tr>`
    )
    .join("");

  let childPanel = "";
  if (poTreeTab === "lines") {
    childPanel = `<div class="po-section"><div class="po-section-head">Purchase Order Lines</div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Line</th><th>SKU</th><th>Qty</th><th>Unit cost</th><th>Total</th></tr></thead><tbody>${linesHtml}</tbody></table></div>
      <p class="panel-note">PO total ${money(poValue(po))}</p></div>`;
  } else if (poTreeTab === "memos") {
    childPanel = `<div class="po-section"><div class="po-section-head">Memos</div>
      <ul>${(po.memos || []).map((m) => `<li>${m.text}</li>`).join("") || "<li>No memos</li>"}</ul></div>`;
  } else if (poTreeTab === "attachments") {
    childPanel = `<div class="po-section"><div class="po-section-head">Attachments</div>
      <ul>${(po.attachments || []).map((a) => `<li class="mono">${a.fileName}</li>`).join("") || "<li>No attachments</li>"}</ul></div>`;
  } else {
    childPanel = `<div class="po-section"><div class="po-section-head">${poTreeTab}</div><p class="panel-note">Scaffold — log entries land in a later increment.</p></div>`;
  }

  form.innerHTML = `
    <div class="po-section"><div class="po-section-head">ID Info</div>
      <div class="field-grid"><div class="field"><label>Order ID *</label><input class="mono" value="${po.poNo}" disabled /></div></div>
    </div>
    <div class="po-section"><div class="po-section-head">Supplier Info</div>
      <div class="field-grid">
        <div class="field"><label>Supplier ID *</label>
          <select data-path="purchaseOrders.${idx}.supplierId" ${locked ? "disabled" : ""}>
            ${working.suppliers.map((s) => `<option value="${s.id}" ${s.id === po.supplierId ? "selected" : ""}>${s.id} — ${s.name}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Inv. Location</label><input data-path="purchaseOrders.${idx}.invLocation" value="${po.invLocation || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Pur. Location</label><input data-path="purchaseOrders.${idx}.purLocation" value="${po.purLocation || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Org Account ID</label><input data-path="purchaseOrders.${idx}.orgAccountId" value="${po.orgAccountId || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Drop Ship Org ID</label><input data-path="purchaseOrders.${idx}.dropShipOrgId" value="${po.dropShipOrgId || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Drop Ship Location</label><input data-path="purchaseOrders.${idx}.dropShipLocation" value="${po.dropShipLocation || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Accounting Contact (AP)</label><input value="${po.apContact || "<None>"}" ${locked ? "disabled" : ""} data-path="purchaseOrders.${idx}.apContact" /></div>
        <div class="field"><label>Purchasing Contact</label><input value="${po.purchasingContact || "<None>"}" ${locked ? "disabled" : ""} data-path="purchaseOrders.${idx}.purchasingContact" /></div>
        <div class="field"><label>Drop Ship Contact</label><input value="${po.dropShipContact || "<None>"}" ${locked ? "disabled" : ""} data-path="purchaseOrders.${idx}.dropShipContact" /></div>
      </div>
    </div>
    <div class="po-section"><div class="po-section-head">Supplier Address Info</div>
      <div class="addr-grid">${addr(po.invAddress, "Invoice")}${addr(po.purAddress, "Purchase")}${addr(po.dropShipAddress, "Drop ship")}</div>
    </div>
    <div class="po-section"><div class="po-section-head">Shipping Info</div>
      <div class="field-grid">
        <div class="field"><label>Payment Terms</label>
          <select data-path="purchaseOrders.${idx}.paymentTerms" ${canEdit("paymentTerms") ? "" : "disabled"}>
            ${PAYMENT_TERMS.map((t) => `<option ${t === po.paymentTerms ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Due Date</label><input data-path="purchaseOrders.${idx}.dueDate" value="${po.dueDate}" ${canEdit("dueDate") ? "" : "disabled"} /></div>
        <div class="field"><label>Ship Method</label>
          <select data-path="purchaseOrders.${idx}.shipMethod" ${canEdit("shipMethod") ? "" : "disabled"}>
            ${SHIP_METHODS.map((t) => `<option ${t === po.shipMethod ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>FOB Description</label><input data-path="purchaseOrders.${idx}.fob" value="${po.fob || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Supplier Rating</label><input data-path="purchaseOrders.${idx}.supplierRating" value="${po.supplierRating || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Landed Cost?</label><input type="checkbox" data-path="purchaseOrders.${idx}.landedCost" ${po.landedCost ? "checked" : ""} ${locked ? "disabled" : ""} /></div>
      </div>
    </div>
    <div class="po-section"><div class="po-section-head">Other Info</div>
      <div class="field-grid">
        <div class="field"><label>Order Date *</label><input data-path="purchaseOrders.${idx}.orderDate" value="${po.orderDate}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Buyer</label>
          <select data-path="purchaseOrders.${idx}.buyer" ${canEdit("buyer") ? "" : "disabled"}>
            ${BUYERS.map((t) => `<option ${t === po.buyer ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Standard Message</label><input data-path="purchaseOrders.${idx}.standardMessage" value="${po.standardMessage || ""}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Ready to Print?</label><input type="checkbox" data-path="purchaseOrders.${idx}.readyToPrint" ${po.readyToPrint ? "checked" : ""} ${canEdit("readyToPrint") ? "" : "disabled"} /></div>
        <div class="field field-span"><label>Order Comments</label><textarea data-path="purchaseOrders.${idx}.comments" ${canEdit("comments") ? "" : "disabled"}>${po.comments || ""}</textarea></div>
      </div>
    </div>
    <div class="po-section"><div class="po-section-head">Currency Info</div>
      <div class="field-grid">
        <div class="field"><label>Currency *</label><input data-path="purchaseOrders.${idx}.currency" value="${po.currency}" ${canEdit("currency") ? "" : "disabled"} /></div>
        <div class="field"><label>Exchange Rate</label><input type="number" step="0.000001" data-path="purchaseOrders.${idx}.exchangeRate" value="${po.exchangeRate}" ${locked ? "disabled" : ""} /></div>
        <div class="field"><label>Custom Rate?</label><input type="checkbox" data-path="purchaseOrders.${idx}.customRate" ${po.customRate ? "checked" : ""} ${locked ? "disabled" : ""} /></div>
      </div>
    </div>
    <div class="po-section"><div class="po-section-head">Related Documents</div>
      <div class="cmd-bar"><button type="button" class="cmd-btn" disabled>Add</button><button type="button" class="cmd-btn" disabled>Delete</button><button type="button" class="cmd-btn" disabled>Open</button><button type="button" class="cmd-btn" disabled>Print</button></div>
      <p class="panel-note">Document library scaffold — use Attachments in the tree for file metadata.</p>
    </div>
    <div class="po-section"><div class="po-section-head">Status Info</div>
      <div class="field-grid">
        <div class="field"><label>Status *</label>
          <select data-path="purchaseOrders.${idx}.status" ${canEdit("status") ? "" : "disabled"}>
            ${PO_STATUSES.map((t) => `<option ${t === po.status ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
    ${childPanel}`;

  tree.querySelectorAll("[data-po-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      poTreeTab = btn.dataset.poTab;
      renderPoEntry();
    });
  });
  bindPaths(form);
}

function addPurchaseOrder() {
  if (!editMode) { toast("Turn on Edit to add purchase orders."); return; }
  if (!roleBag("canAdd").has("purchaseOrders") && activeRole !== "Admin" && activeRole !== "Manager") {
    // Manager inherits Purchasing via roleBag
  }
  if (!roleBag("canAdd").has("purchaseOrders")) { toast("Your role cannot add purchase orders."); return; }
  const nums = working.purchaseOrders.map((p) => Number(p.poNo) || 70000);
  const poNo = String(Math.max(70000, ...nums) + 1);
  const supplier = working.suppliers[0];
  if (!mutate(`Add PO ${poNo}`, () => {
    working.purchaseOrders.push({
      poNo,
      supplierId: supplier?.id || "",
      invLocation: "",
      purLocation: "",
      orgAccountId: "",
      dropShipOrgId: "",
      dropShipLocation: "",
      apContact: "",
      purchasingContact: "",
      dropShipContact: "",
      invAddress: {
        name: supplier?.name || "",
        line1: supplier?.line1 || "",
        line2: supplier?.line2 || "",
        city: supplier?.city || "",
        postcode: supplier?.postcode || "",
        phone: supplier?.phone || "",
        fax: supplier?.fax || "",
      },
      purAddress: {
        name: supplier?.name || "",
        line1: supplier?.line1 || "",
        line2: supplier?.line2 || "",
        city: supplier?.city || "",
        postcode: supplier?.postcode || "",
        phone: supplier?.phone || "",
        fax: supplier?.fax || "",
      },
      dropShipAddress: { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" },
      paymentTerms: "Net-30",
      dueDate: "",
      shipMethod: "CARRIER",
      fob: "",
      supplierRating: "",
      landedCost: false,
      orderDate: new Date().toLocaleDateString("en-GB"),
      buyer: "JAMES CRAVEN",
      standardMessage: "Standard purchasing terms.",
      comments: "",
      readyToPrint: false,
      currency: "GBP",
      exchangeRate: 1,
      customRate: false,
      status: "Draft",
      lines: [],
      memos: [],
      attachments: [],
      extras: {},
    });
  })) return;
  activePoNo = poNo;
  showView("po-entry");
  renderAll();
  toast(`PO ${poNo} added to working copy.`);
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
  document.querySelectorAll(".icon-rail-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.hubLink === name || (name === "dashboard" && btn.dataset.hubLink === "po-entry" && activeHub === "purchasing"));
  });
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    const active = panel.dataset.viewPanel === name;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  if (name === "po-entry") renderPoEntry();
}

function renderAll() {
  const shell = document.querySelector(".app-shell");
  if (shell) shell.classList.toggle("is-editing", editMode);
  updateCopyPill();
  renderDashboard();
  renderPurchasing();
  renderPoEntry();
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
  showView("dashboard");

  document.querySelectorAll(".icon-rail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const link = btn.dataset.hubLink;
      if (link === "po-entry") {
        activeHub = "purchasing";
        localStorage.setItem("rushmore-hub", "purchasing");
        showView("po-entry");
      } else {
        showView(link);
      }
      document.querySelectorAll(".icon-rail-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });

  document.querySelectorAll(".tree-leaf").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tree-leaf").forEach((el) => el.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      if (btn.dataset.hub) setHub(btn.dataset.hub);
      if (btn.dataset.view) showView(btn.dataset.view);
    });
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

  document.body.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-action]");
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    if (action === "new-po") return addPurchaseOrder();
    if (action === "save-po") return toast(editMode ? "PO fields auto-save to working copy." : "Turn on Edit to change the PO.");
    if (action === "print-po") return toast("Print preview scaffold.");
    if (action === "request-approval") {
      if (!editMode) return toast("Turn on Edit first.");
      const po = working.purchaseOrders.find((p) => p.poNo === activePoNo);
      if (!po) return;
      if (!roleCanEdit("purchaseOrders.status")) return toast("Role cannot change PO status.");
      mutate(`Request approval ${po.poNo}`, () => {
        po.status = "Pending Approval";
      });
      renderAll();
      toast(`PO ${po.poNo} → Pending Approval`);
      return;
    }
    if (action === "prev-po" || action === "next-po") {
      const list = working.purchaseOrders;
      const i = list.findIndex((p) => p.poNo === activePoNo);
      const next = action === "next-po" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
      activePoNo = list[next].poNo;
      showView("po-entry");
      renderPoEntry();
    }
  });

  const poSelect = document.getElementById("po-select");
  if (poSelect) {
    poSelect.addEventListener("change", (e) => {
      activePoNo = e.target.value;
      renderPoEntry();
    });
  }

  document.getElementById("hub-grid")?.addEventListener("click", (e) => {
    const toastBtn = e.target.closest("[data-toast]");
    if (toastBtn) toast(toastBtn.dataset.toast);
  });
}

boot();
