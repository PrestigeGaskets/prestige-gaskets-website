/**
 * Rushmore Business OS — full M1-style GUI (built as one app, not a patch).
 * Master sealed; edits go to working copy (localStorage). GBP / UK postcode.
 */

(() => {
  "use strict";

  const STORAGE = "rushmore-bos-v6";
  const ROLE_KEY = "rushmore-role-v2";
  const HUB_KEY = "rushmore-hub-v2";
  const EDIT_KEY = "rushmore-edit-v2";
  const POSTED_KEY = "rushmore-posted-v2";
  const ACTIVITY_KEY = "rushmore-activity-v2";
  const LOCALE = "en-GB";
  const CURRENCY = "GBP";

  const cityAddr = {
    name: "CITY TODAY COURIERS LTD",
    line1: "UNIT 1 NEWBRIDGE LANE",
    line2: "",
    city: "STOCKPORT",
    postcode: "SK1 2ND",
    phone: "0161 477 9800",
    fax: "0161 477 4409",
  };

  const MASTER = freeze({
    customers: [
      { id: "C001", name: "Acme Fab", email: "buyer@acme.example", postcode: "B1 1AA", status: "Active" },
      { id: "C002", name: "Northline", email: "ops@northline.example", postcode: "M1 2AB", status: "Active" },
      { id: "C003", name: "Summit Seal", email: "purchasing@summit.example", postcode: "EH1 3EG", status: "Inactive" },
      { id: "C004", name: "Prestige Pilot", email: "pilot@prestige.example", postcode: "SW1A 1AA", status: "Active" },
    ],
    accounts: [
      { customerId: "C001", accountCode: "ACC-C001", creditLimit: 5000, paymentTerms: "Net-30" },
      { customerId: "C002", accountCode: "ACC-C002", creditLimit: 12000, paymentTerms: "Net-45" },
      { customerId: "C003", accountCode: "ACC-C003", creditLimit: 2500, paymentTerms: "Net-15" },
      { customerId: "C004", accountCode: "ACC-C004", creditLimit: 20000, paymentTerms: "Net-30" },
    ],
    products: [
      { sku: "P1001", description: "Flat gasket A", onHand: 120, reorderPoint: 40, leadDays: 7, cost: 2.5, sell: 4.75 },
      { sku: "P1002", description: "Cone seal B", onHand: 18, reorderPoint: 25, leadDays: 14, cost: 3.1, sell: 5.9 },
      { sku: "P1003", description: "Ring C", onHand: 80, reorderPoint: 30, leadDays: 5, cost: 1.2, sell: 2.4 },
      { sku: "P1004", description: "Sleeve D", onHand: 55, reorderPoint: 20, leadDays: 10, cost: 4.0, sell: 7.5 },
      { sku: "P1005", description: "Washer E", onHand: 200, reorderPoint: 50, leadDays: 3, cost: 0.4, sell: 0.95 },
      { sku: "P1006", description: "Spacer F", onHand: 12, reorderPoint: 15, leadDays: 8, cost: 1.8, sell: 3.25 },
    ],
    suppliers: [
      { id: "CITY0002", name: "CITY TODAY COURIERS LTD", postcode: "SK1 2ND", line1: "UNIT 1 NEWBRIDGE LANE", line2: "", city: "STOCKPORT", phone: "0161 477 9800", fax: "0161 477 4409" },
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
      {
        orderNo: "O-500",
        quoteNo: "Q-100",
        customerId: "C004",
        status: "Shipped",
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
        lines: [
          { line: 1, sku: "P1005", qty: 80, price: 0.95 },
          { line: 2, sku: "P1006", qty: 10, price: 3.25 },
        ],
      },
    ],
    invoices: [
      { invoiceNo: "INV-500", orderNo: "O-500", status: "Paid", amount: 77 },
      { invoiceNo: "INV-501", orderNo: "O-501", status: "Draft", amount: 108.5 },
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
        invAddress: { ...cityAddr },
        purAddress: { ...cityAddr },
        dropShipAddress: emptyAddr(),
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
        dropShipAddress: emptyAddr(),
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
      },
    ],
  });

  const ROLES = {
    Viewer: { inherits: [], blurb: "Read-only.", canEdit: [], canAdd: [] },
    Sales: {
      inherits: ["Viewer"],
      blurb: "Customers, quotes, quote lines.",
      canEdit: ["customers.name", "customers.email", "customers.postcode", "customers.status", "quotes.status", "quotes.customerId", "quotes.lines.qty", "quotes.lines.price", "quotes.lines.sku"],
      canAdd: ["customers", "quotes", "quoteLines"],
    },
    Inventory: {
      inherits: ["Viewer"],
      blurb: "Product stock and descriptions.",
      canEdit: ["products.description", "products.onHand", "products.reorderPoint", "products.leadDays"],
      canAdd: ["products"],
    },
    Finance: {
      inherits: ["Viewer"],
      blurb: "Money fields, orders, products.",
      canEdit: ["products.cost", "products.sell", "orders.status", "orders.customerId", "orders.quoteNo"],
      canAdd: ["products", "orders"],
    },
    Purchasing: {
      inherits: ["Viewer"],
      blurb: "Purchase orders, lines, supplier terms.",
      canEdit: [
        "purchaseOrders.status", "purchaseOrders.buyer", "purchaseOrders.paymentTerms",
        "purchaseOrders.dueDate", "purchaseOrders.shipMethod", "purchaseOrders.comments",
        "purchaseOrders.currency", "purchaseOrders.readyToPrint", "purchaseOrders.supplierId",
        "purchaseOrders.lines.qty", "purchaseOrders.lines.unitCost", "purchaseOrders.lines.sku",
      ],
      canAdd: ["purchaseOrders", "poLines"],
    },
    Manager: {
      inherits: ["Sales", "Inventory", "Finance", "Purchasing"],
      blurb: "Full network on working copy.",
      canEdit: [],
      canAdd: [],
    },
    Admin: {
      inherits: ["Manager"],
      blurb: "Entire working-copy field network.",
      canEdit: ["*"],
      canAdd: ["*"],
    },
  };

  const PO_STATUSES = ["Draft", "Pending Approval", "Approved", "Closed"];
  const PAYMENT_TERMS = ["30 DAYS EOM", "Net-30", "Net-45", "Net-15"];
  const SHIP_METHODS = ["CARRIER", "COLLECT", "COURIER"];
  const BUYERS = ["JAMES CRAVEN", "A. BUYER"];
  const QUOTE_STATUSES = ["Open", "Sent", "Won", "Lost"];
  const ORDER_STATUSES = ["Open", "Picked", "Shipped", "Closed"];
  const CUSTOMER_STATUSES = ["Active", "Inactive"];

  const ICONS = [
    { id: "quotes", label: "Quote Entry", ico: "✎" },
    { id: "orders", label: "Sales Order", ico: "☰" },
    { id: "po-entry", label: "PO Entry", ico: "📋" },
    { id: "products", label: "Inventory", ico: "▦" },
    { id: "customers", label: "Customers", ico: "☺" },
    { id: "relations", label: "Relations", ico: "⇄" },
    { id: "fields", label: "Fields", ico: "⚙" },
  ];

  const TREE = [
    {
      title: "My Start Page",
      open: true,
      items: [{ label: "Home Hub", hub: "home" }],
    },
    {
      title: "Sales",
      open: true,
      items: [
        { label: "Sales Order Management", hub: "sales" },
        { label: "Quote Entry", view: "quotes" },
        { label: "Sales Order Entry", view: "orders" },
        { label: "Customers", view: "customers" },
      ],
    },
    {
      title: "Production",
      open: true,
      items: [
        { label: "Purchasing Management", hub: "purchasing" },
        { label: "PO Entry", view: "po-entry" },
        { label: "Open Purchase Orders", view: "purchasing" },
        { label: "Inventory", view: "products" },
      ],
    },
    {
      title: "Financial",
      open: false,
      items: [
        { label: "AR / Sales Orders", view: "orders" },
        { label: "AP / Purchasing", hub: "purchasing" },
      ],
    },
    {
      title: "Tools",
      open: false,
      items: [
        { label: "Relations", view: "relations" },
        { label: "Field Network", view: "fields" },
      ],
    },
  ];

  let working = loadWorking();
  let role = localStorage.getItem(ROLE_KEY) || "Purchasing";
  let hub = localStorage.getItem(HUB_KEY) || "purchasing";
  let view = "hub";
  let editMode = sessionStorage.getItem(EDIT_KEY) === "1";
  let poNo = "70286";
  let poTab = "lines";
  let undoStack = [];
  let redoStack = [];
  let posted = loadJson(POSTED_KEY, null);
  let activity = loadJson(ACTIVITY_KEY, []);

  function emptyAddr() {
    return { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" };
  }

  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      Object.getOwnPropertyNames(value).forEach((k) => freeze(value[k]));
    }
    return value;
  }

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return fallback;
  }

  function normalize(data) {
    const next = clone(data);
    for (const key of Object.keys(MASTER)) {
      if (!Array.isArray(next[key])) next[key] = clone(MASTER[key]);
    }
    for (const po of next.purchaseOrders) {
      if (!po.invAddress) po.invAddress = emptyAddr();
      if (!po.purAddress) po.purAddress = emptyAddr();
      if (!po.dropShipAddress) po.dropShipAddress = emptyAddr();
      if (!Array.isArray(po.lines)) po.lines = [];
      if (!Array.isArray(po.memos)) po.memos = [];
      if (!Array.isArray(po.attachments)) po.attachments = [];
    }
    for (const q of next.quotes) if (!Array.isArray(q.lines)) q.lines = [];
    for (const o of next.orders) if (!Array.isArray(o.lines)) o.lines = [];
    return next;
  }

  function loadWorking() {
    return normalize(loadJson(STORAGE, clone(MASTER)));
  }

  function persist() {
    localStorage.setItem(STORAGE, JSON.stringify(working));
    updatePill();
    syncButtons();
  }

  function money(n) {
    return Number(n).toLocaleString(LOCALE, { style: "currency", currency: CURRENCY });
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2600);
  }

  function log(message, kind = "edit") {
    activity.unshift({ at: Date.now(), message, kind, role });
    activity = activity.slice(0, 40);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
  }

  function roleBag(key) {
    const out = new Set();
    const walk = (name) => {
      const node = ROLES[name];
      if (!node) return;
      node.inherits.forEach(walk);
      (node[key] || []).forEach((x) => out.add(x));
    };
    walk(role);
    return out;
  }

  function canEdit(field) {
    const set = roleBag("canEdit");
    return set.has("*") || set.has(field) || (field.startsWith("custom.") && set.has("custom.*"));
  }

  function canAdd(entity) {
    const set = roleBag("canAdd");
    return set.has("*") || set.has(entity);
  }

  function isDirty() {
    return JSON.stringify(working) !== JSON.stringify(normalize(clone(MASTER)));
  }

  function mutate(label, fn) {
    if (!editMode) {
      toast("Turn on Edit first.");
      return false;
    }
    undoStack.push({ label, data: clone(working) });
    if (undoStack.length > 40) undoStack.shift();
    redoStack = [];
    fn();
    persist();
    log(label);
    return true;
  }

  function sumLines(lines, priceKey) {
    return (lines || []).reduce((s, l) => s + Number(l.qty) * Number(l[priceKey]), 0);
  }

  function quoteTotal() {
    return working.quotes.reduce((s, q) => s + sumLines(q.lines, "price"), 0);
  }

  function poTotal() {
    return working.purchaseOrders.reduce((s, po) => s + sumLines(po.lines, "unitCost"), 0);
  }

  function supplierName(id) {
    return working.suppliers.find((s) => s.id === id)?.name || id;
  }

  function customerName(id) {
    return working.customers.find((c) => c.id === id)?.name || id;
  }

  function updatePill() {
    const pill = document.getElementById("copyPill");
    const dirty = isDirty();
    pill.classList.toggle("is-dirty", dirty);
    pill.textContent = dirty ? `Working · ${countChanges()} Δ` : "Working · clean";
  }

  function countChanges() {
    let n = 0;
    const m = normalize(clone(MASTER));
    if (JSON.stringify(working.purchaseOrders) !== JSON.stringify(m.purchaseOrders)) n += 1;
    if (JSON.stringify(working.quotes) !== JSON.stringify(m.quotes)) n += 1;
    if (JSON.stringify(working.orders) !== JSON.stringify(m.orders)) n += 1;
    if (JSON.stringify(working.products) !== JSON.stringify(m.products)) n += 1;
    if (JSON.stringify(working.customers) !== JSON.stringify(m.customers)) n += 1;
    return n;
  }

  function syncButtons() {
    const dirty = isDirty();
    document.getElementById("btnEdit").classList.toggle("is-active", editMode);
    document.getElementById("btnEdit").textContent = editMode ? "Editing" : "Edit";
    document.getElementById("btnUndo").disabled = !undoStack.length;
    document.getElementById("btnRedo").disabled = !redoStack.length;
    document.getElementById("btnPost").disabled = !dirty;
    document.getElementById("btnDiscard").disabled = !dirty && !undoStack.length;
  }

  function setPath(path, value) {
    const parts = path.split(".");
    let cur = working;
    for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
    const key = parts[parts.length - 1];
    mutate(`Edit ${path}`, () => { cur[key] = value; });
    render();
  }

  function bindPaths(root) {
    root.querySelectorAll("[data-path]").forEach((el) => {
      const commit = () => {
        let value;
        if (el.type === "checkbox") value = el.checked;
        else if (el.type === "number") value = Number(el.value);
        else value = el.value;
        setPath(el.dataset.path, value);
      };
      el.addEventListener("change", commit);
    });
  }

  /* —— chrome —— */
  function renderChrome() {
    const rail = document.getElementById("iconRail");
    rail.innerHTML = ICONS.map(
      (i) => `<button type="button" class="icon-btn ${view === i.id || (view === "hub" && i.id === "po-entry" && hub === "purchasing") ? "is-active" : ""}" data-go="${i.id}"><span class="ico">${i.ico}</span><span>${i.label}</span></button>`
    ).join("");

    const tree = document.getElementById("moduleTree");
    const q = (document.getElementById("treeSearch").value || "").trim().toLowerCase();
    tree.innerHTML = TREE.map((group) => {
      const items = group.items.filter((it) => !q || it.label.toLowerCase().includes(q));
      if (!items.length) return "";
      return `<details ${group.open || q ? "open" : ""}>
        <summary>${group.title}</summary>
        ${items
          .map((it) => {
            const selected =
              (it.hub && view === "hub" && hub === it.hub) ||
              (it.view && view === it.view);
            const attrs = it.hub ? `data-hub="${it.hub}"` : `data-view="${it.view}"`;
            return `<button type="button" class="tree-leaf ${selected ? "is-selected" : ""}" ${attrs}>${it.label}</button>`;
          })
          .join("")}
      </details>`;
    }).join("");

    document.getElementById("roleBlurb").textContent = ROLES[role]?.blurb || "";
    const select = document.getElementById("roleSelect");
    select.innerHTML = Object.keys(ROLES)
      .map((r) => `<option value="${r}" ${r === role ? "selected" : ""}>${r}</option>`)
      .join("");
  }

  function showView(name) {
    view = name;
    document.querySelectorAll(".view").forEach((el) => {
      const on = el.dataset.view === name;
      el.hidden = !on;
      el.classList.toggle("is-active", on);
    });
  }

  function setHub(name) {
    hub = name;
    localStorage.setItem(HUB_KEY, name);
    showView("hub");
    render();
  }

  function go(target) {
    if (target === "po-entry") {
      hub = "purchasing";
      localStorage.setItem(HUB_KEY, hub);
    }
    showView(target);
    render();
  }

  /* —— hub —— */
  function hubPack() {
    if (hub === "sales") {
      return {
        title: "Sales Order Management",
        explorer: "Sales Order Explorer",
        entry: [
          { label: "Quote Entry", view: "quotes", ico: "✎" },
          { label: "Sales Order Entry", view: "orders", ico: "☰" },
          { label: "Customer Maintenance", view: "customers", ico: "☺" },
        ],
        reports: [
          { label: "Open Sales Orders", view: "orders", ico: "🖨" },
          { label: "Quote Totals", view: "quotes", ico: "🖨" },
          { label: "Order Acknowledgment", toast: "Report scaffold", ico: "🖨" },
        ],
        maintenance: [
          { label: "Field Network", view: "fields", ico: "⚙" },
          { label: "Relations Graph", view: "relations", ico: "⚙" },
        ],
        analysis: [
          { label: `Open quote value · ${money(quoteTotal())}`, view: "quotes", ico: "📊" },
          { label: "Orders requiring attention", view: "orders", ico: "🔎" },
          { label: "Customer list", view: "customers", ico: "📅" },
        ],
      };
    }
    if (hub === "home") {
      return {
        title: "My Start Page",
        explorer: "Business Explorer",
        entry: [
          { label: "PO Entry", view: "po-entry", ico: "📋" },
          { label: "Sales Order Entry", view: "orders", ico: "☰" },
          { label: "Quote Entry", view: "quotes", ico: "✎" },
        ],
        reports: [
          { label: "Open PO Report", view: "purchasing", ico: "🖨" },
          { label: "Reorder Watch", view: "products", ico: "🖨" },
        ],
        maintenance: [
          { label: "Suppliers / Relations", view: "relations", ico: "⚙" },
          { label: "Field Network", view: "fields", ico: "⚙" },
        ],
        analysis: [
          { label: "Purchasing Management", hub: "purchasing", ico: "🔎" },
          { label: "Sales Order Management", hub: "sales", ico: "🔎" },
        ],
      };
    }
    return {
      title: "Purchasing Management",
      explorer: "Purchase Order Explorer",
      entry: [
        { label: "Purchase Order Entry", view: "po-entry", ico: "📋" },
        { label: "Open Purchase Orders", view: "purchasing", ico: "📋" },
        { label: "Inventory / Products", view: "products", ico: "▦" },
        { label: "Vendor (Supplier) Links", view: "relations", ico: "⇄" },
      ],
      reports: [
        { label: "Purchase Order Print", view: "po-entry", ico: "🖨" },
        { label: "Open PO Report", view: "purchasing", ico: "🖨" },
        { label: "Vendor Performance", toast: "Report scaffold", ico: "🖨" },
        { label: "Expected Receipts", toast: "Report scaffold", ico: "🖨" },
      ],
      maintenance: [
        { label: "Vendor Maintenance", view: "relations", ico: "⚙" },
        { label: "Buyer / Terms Lists", view: "fields", ico: "⚙" },
        { label: "Payment Terms", toast: "List: PaymentTerms", ico: "⚙" },
        { label: "Ship Method Maintenance", toast: "List: ShipMethod", ico: "⚙" },
      ],
      analysis: [
        { label: "POs requiring approval", view: "purchasing", ico: "🔎" },
        { label: `Open PO value · ${money(poTotal())}`, view: "purchasing", ico: "📊" },
        { label: "Price vs ProductSupplier", view: "relations", ico: "📊" },
        { label: "PO 70286 · CITY0002", view: "po-entry", ico: "📅" },
        { label: "Spend by supplier", toast: "Analysis scaffold", ico: "📈" },
      ],
    };
  }

  function linkHtml(item) {
    const attrs = item.view
      ? `data-view="${item.view}"`
      : item.hub
        ? `data-hub="${item.hub}"`
        : `data-toast="${item.toast || "Scaffold"}"`;
    return `<li><button type="button" class="hub-link" ${attrs}><span class="hub-ico">${item.ico}</span><span>${item.label}</span></button></li>`;
  }

  function renderHub() {
    const pack = hubPack();
    document.getElementById("hubTitle").textContent = pack.title;
    document.getElementById("hubSubtitle").textContent = editMode
      ? `Editing as ${role} · working copy`
      : "Entry · Reports · Maintenance · Business Analysis";

    const openPos = working.purchaseOrders.filter((p) => p.status !== "Closed").length;
    document.getElementById("statusStrip").innerHTML = `
      <span class="chip ${editMode ? "is-live" : ""}">${editMode ? "EDIT" : "VIEW"}</span>
      <span class="chip">${role}</span>
      <span class="chip is-ok">${openPos} open POs</span>
      <span class="chip">${working.suppliers.length} suppliers</span>
      <span class="chip ${isDirty() ? "is-warn" : ""}">${countChanges()} pending</span>`;

    document.getElementById("hubGrid").innerHTML = `
      <section class="hub-panel">
        <div class="hub-panel-head">Entry Screens</div>
        <ul class="hub-list">${pack.entry.map(linkHtml).join("")}</ul>
      </section>
      <section class="hub-panel analysis">
        <div class="hub-panel-head">Business Analysis</div>
        <div class="hub-explorer"><input type="search" placeholder="${pack.explorer}" disabled /></div>
        <ul class="hub-list">${pack.analysis.map(linkHtml).join("")}</ul>
      </section>
      <section class="hub-panel">
        <div class="hub-panel-head">Reports</div>
        <ul class="hub-list">${pack.reports.map(linkHtml).join("")}</ul>
      </section>
      <section class="hub-panel">
        <div class="hub-panel-head">Maintenance</div>
        <ul class="hub-list">${pack.maintenance.map(linkHtml).join("")}</ul>
      </section>
      <section class="hub-panel wide">
        <div class="hub-panel-head">Live pulse</div>
        <div class="hub-pulse">
          <div><span class="label">Open quote value</span><strong>${money(quoteTotal())}</strong></div>
          <div><span class="label">Open PO value</span><strong>${money(poTotal())}</strong></div>
          <div><span class="label">SKUs ≤ ROP</span><strong>${working.products.filter((p) => p.onHand <= p.reorderPoint).length}</strong></div>
          <div><span class="label">Sales orders</span><strong>${working.orders.length}</strong></div>
        </div>
      </section>`;
  }

  /* —— PO —— */
  function currentPo() {
    return working.purchaseOrders.find((p) => p.poNo === poNo) || working.purchaseOrders[0];
  }

  function renderPoList() {
    document.getElementById("poList").innerHTML = working.purchaseOrders
      .map((po) => `
        <article class="card">
          <div class="card-head">
            <h2 class="mono">${po.poNo}</h2>
            <span class="meta">${supplierName(po.supplierId)} · ${po.status} · ${money(sumLines(po.lines, "unitCost"))}</span>
          </div>
          <p class="note">${po.orderDate} · ${po.buyer} · ${po.paymentTerms} · ${po.shipMethod}</p>
          <button type="button" class="btn btn-primary" data-open-po="${po.poNo}">Open PO Entry</button>
        </article>`)
      .join("");
  }

  function addrBlock(a, title) {
    return `<div class="addr-col">
      <h3>${title}</h3>
      <p><strong>${a.name || "—"}</strong></p>
      <p>${a.line1 || ""}</p>
      <p>${a.line2 || ""}</p>
      <p>${a.city || ""} ${a.postcode || ""}</p>
      <p>Phone: ${a.phone || "—"}</p>
      <p>Fax: ${a.fax || "—"}</p>
    </div>`;
  }

  function renderPoEntry() {
    const po = currentPo();
    if (!po) {
      document.getElementById("poForm").innerHTML = `<p class="note">No purchase orders.</p>`;
      return;
    }
    poNo = po.poNo;
    const idx = working.purchaseOrders.findIndex((p) => p.poNo === po.poNo);
    const locked = !editMode;

    document.getElementById("poRibbon").innerHTML = `
      <button type="button" class="btn" data-action="new-po">New</button>
      <button type="button" class="btn" data-action="save-po">Save</button>
      <button type="button" class="btn" data-action="prev-po">Prev</button>
      <button type="button" class="btn" data-action="next-po">Next</button>
      <button type="button" class="btn" data-action="print-po">Print</button>
      <button type="button" class="btn" data-action="request-approval">Request Approval</button>
      <label class="po-picker">Order ID
        <select id="poSelect">${working.purchaseOrders
          .map((p) => `<option value="${p.poNo}" ${p.poNo === po.poNo ? "selected" : ""}>${p.poNo} — ${p.supplierId}</option>`)
          .join("")}</select>
      </label>`;

    document.getElementById("poTree").innerHTML = `
      <div class="po-tree-root">Purchase Orders</div>
      <div class="po-tree-active">${po.poNo} — ${po.supplierId}</div>
      ${["lines", "followups", "calls", "memos", "attachments"]
        .map((t) => {
          const labels = {
            lines: "Purchase Order Lines",
            followups: "Follow-ups",
            calls: "Calls",
            memos: "Purchase Order Memos",
            attachments: "Attachments",
          };
          return `<button type="button" class="po-tree-node ${poTab === t ? "is-active" : ""}" data-po-tab="${t}">${labels[t]}</button>`;
        })
        .join("")}
      <div class="po-msg">
        <div class="po-msg-tabs"><span>0 Requirements</span><span>0 Warnings</span><span>1 Messages</span></div>
        <p>Order ID '${po.poNo}' · supplier ${po.supplierId} · ${po.orderDate}</p>
      </div>`;

    const field = (label, control, span = false) =>
      `<div class="field ${span ? "field-span" : ""} ${locked ? "is-locked" : ""}"><label>${label}</label>${control}</div>`;

    const linesRows = po.lines
      .map(
        (l, li) => `<tr>
          <td class="mono">${l.line}</td>
          <td><input data-path="purchaseOrders.${idx}.lines.${li}.sku" value="${l.sku}" ${!editMode || !canEdit("purchaseOrders.lines.sku") ? "disabled" : ""} /></td>
          <td><input type="number" data-path="purchaseOrders.${idx}.lines.${li}.qty" value="${l.qty}" ${!editMode || !canEdit("purchaseOrders.lines.qty") ? "disabled" : ""} /></td>
          <td><input type="number" step="0.01" data-path="purchaseOrders.${idx}.lines.${li}.unitCost" value="${l.unitCost}" ${!editMode || !canEdit("purchaseOrders.lines.unitCost") ? "disabled" : ""} /></td>
          <td class="mono">${money(l.qty * l.unitCost)}</td>
        </tr>`
      )
      .join("");

    let child = "";
    if (poTab === "lines") {
      child = `<div class="po-section"><div class="po-section-head">Purchase Order Lines</div>
        <div class="table-wrap" style="padding:0.45rem">
          <table class="data"><thead><tr><th>Line</th><th>SKU</th><th>Qty</th><th>Unit cost</th><th>Total</th></tr></thead>
          <tbody>${linesRows}</tbody></table>
        </div>
        <p class="note" style="padding:0 0.55rem 0.55rem">PO total ${money(sumLines(po.lines, "unitCost"))}</p>
      </div>`;
    } else if (poTab === "memos") {
      child = `<div class="po-section"><div class="po-section-head">Memos</div>
        <ul style="margin:0.5rem 1.1rem">${po.memos.map((m) => `<li>${m.text}</li>`).join("") || "<li>No memos</li>"}</ul></div>`;
    } else if (poTab === "attachments") {
      child = `<div class="po-section"><div class="po-section-head">Attachments</div>
        <ul style="margin:0.5rem 1.1rem">${po.attachments.map((a) => `<li class="mono">${a.fileName}</li>`).join("") || "<li>No attachments</li>"}</ul></div>`;
    } else {
      child = `<div class="po-section"><div class="po-section-head">${poTab}</div><p class="note" style="padding:0.55rem">Scaffold for later increment.</p></div>`;
    }

    const form = document.getElementById("poForm");
    form.innerHTML = `
      <div class="po-section"><div class="po-section-head">ID Info</div>
        <div class="field-grid">${field("Order ID *", `<input class="mono" value="${po.poNo}" disabled />`)}</div>
      </div>
      <div class="po-section"><div class="po-section-head">Supplier Info</div>
        <div class="field-grid">
          ${field("Supplier ID *", `<select data-path="purchaseOrders.${idx}.supplierId" ${!editMode || !canEdit("purchaseOrders.supplierId") ? "disabled" : ""}>${working.suppliers.map((s) => `<option value="${s.id}" ${s.id === po.supplierId ? "selected" : ""}>${s.id} — ${s.name}</option>`).join("")}</select>`)}
          ${field("Inv. Location", `<input data-path="purchaseOrders.${idx}.invLocation" value="${po.invLocation || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Pur. Location", `<input data-path="purchaseOrders.${idx}.purLocation" value="${po.purLocation || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Org Account ID", `<input data-path="purchaseOrders.${idx}.orgAccountId" value="${po.orgAccountId || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Drop Ship Org ID", `<input data-path="purchaseOrders.${idx}.dropShipOrgId" value="${po.dropShipOrgId || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Drop Ship Location", `<input data-path="purchaseOrders.${idx}.dropShipLocation" value="${po.dropShipLocation || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Accounting Contact (AP)", `<input data-path="purchaseOrders.${idx}.apContact" value="${po.apContact || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Purchasing Contact", `<input data-path="purchaseOrders.${idx}.purchasingContact" value="${po.purchasingContact || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Drop Ship Contact", `<input data-path="purchaseOrders.${idx}.dropShipContact" value="${po.dropShipContact || ""}" ${locked ? "disabled" : ""} />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Supplier Address Info</div>
        <div class="addr-grid">${addrBlock(po.invAddress, "Invoice")}${addrBlock(po.purAddress, "Purchase")}${addrBlock(po.dropShipAddress, "Drop ship")}</div>
      </div>
      <div class="po-section"><div class="po-section-head">Shipping Info</div>
        <div class="field-grid">
          ${field("Payment Terms", `<select data-path="purchaseOrders.${idx}.paymentTerms" ${!editMode || !canEdit("purchaseOrders.paymentTerms") ? "disabled" : ""}>${PAYMENT_TERMS.map((t) => `<option ${t === po.paymentTerms ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
          ${field("Due Date", `<input data-path="purchaseOrders.${idx}.dueDate" value="${po.dueDate}" ${!editMode || !canEdit("purchaseOrders.dueDate") ? "disabled" : ""} />`)}
          ${field("Ship Method", `<select data-path="purchaseOrders.${idx}.shipMethod" ${!editMode || !canEdit("purchaseOrders.shipMethod") ? "disabled" : ""}>${SHIP_METHODS.map((t) => `<option ${t === po.shipMethod ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
          ${field("FOB Description", `<input data-path="purchaseOrders.${idx}.fob" value="${po.fob || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Supplier Rating", `<input data-path="purchaseOrders.${idx}.supplierRating" value="${po.supplierRating || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Landed Cost?", `<input type="checkbox" data-path="purchaseOrders.${idx}.landedCost" ${po.landedCost ? "checked" : ""} ${locked ? "disabled" : ""} />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Other Info</div>
        <div class="field-grid">
          ${field("Order Date *", `<input data-path="purchaseOrders.${idx}.orderDate" value="${po.orderDate}" ${locked ? "disabled" : ""} />`)}
          ${field("Buyer", `<select data-path="purchaseOrders.${idx}.buyer" ${!editMode || !canEdit("purchaseOrders.buyer") ? "disabled" : ""}>${BUYERS.map((t) => `<option ${t === po.buyer ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
          ${field("Standard Message", `<input data-path="purchaseOrders.${idx}.standardMessage" value="${po.standardMessage || ""}" ${locked ? "disabled" : ""} />`)}
          ${field("Ready to Print?", `<input type="checkbox" data-path="purchaseOrders.${idx}.readyToPrint" ${po.readyToPrint ? "checked" : ""} ${!editMode || !canEdit("purchaseOrders.readyToPrint") ? "disabled" : ""} />`)}
          ${field("Order Comments", `<textarea data-path="purchaseOrders.${idx}.comments" ${!editMode || !canEdit("purchaseOrders.comments") ? "disabled" : ""}>${po.comments || ""}</textarea>`, true)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Currency Info</div>
        <div class="field-grid">
          ${field("Currency *", `<input data-path="purchaseOrders.${idx}.currency" value="${po.currency}" ${!editMode || !canEdit("purchaseOrders.currency") ? "disabled" : ""} />`)}
          ${field("Exchange Rate", `<input type="number" step="0.000001" data-path="purchaseOrders.${idx}.exchangeRate" value="${po.exchangeRate}" ${locked ? "disabled" : ""} />`)}
          ${field("Custom Rate?", `<input type="checkbox" data-path="purchaseOrders.${idx}.customRate" ${po.customRate ? "checked" : ""} ${locked ? "disabled" : ""} />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Related Documents</div>
        <div class="toolbar" style="padding:0.45rem"><button type="button" class="btn" disabled>Add</button><button type="button" class="btn" disabled>Delete</button><button type="button" class="btn" disabled>Open</button><button type="button" class="btn" disabled>Print</button></div>
        <p class="note" style="padding:0 0.55rem 0.55rem">Document library scaffold — file metadata lives under Attachments.</p>
      </div>
      <div class="po-section"><div class="po-section-head">Status Info</div>
        <div class="field-grid">
          ${field("Status *", `<select data-path="purchaseOrders.${idx}.status" ${!editMode || !canEdit("purchaseOrders.status") ? "disabled" : ""}>${PO_STATUSES.map((t) => `<option ${t === po.status ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
        </div>
      </div>
      ${child}`;

    bindPaths(form);
    document.getElementById("poSelect").onchange = (e) => {
      poNo = e.target.value;
      render();
    };
  }

  function addPo() {
    if (!canAdd("purchaseOrders")) return toast("Role cannot add purchase orders.");
    const nums = working.purchaseOrders.map((p) => Number(p.poNo) || 70000);
    const next = String(Math.max(70000, ...nums) + 1);
    const supplier = working.suppliers[0];
    if (!mutate(`Add PO ${next}`, () => {
      working.purchaseOrders.push({
        poNo: next,
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
        dropShipAddress: emptyAddr(),
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
      });
    })) return;
    poNo = next;
    go("po-entry");
    toast(`PO ${next} added.`);
  }

  /* —— other views —— */
  function renderQuotes() {
    document.getElementById("quotesRoot").innerHTML = working.quotes
      .map((q) => `
        <article class="card">
          <div class="card-head"><h2 class="mono">${q.quoteNo}</h2><span class="meta">${customerName(q.customerId)} · ${q.status} · ${money(sumLines(q.lines, "price"))}</span></div>
          <table class="data"><thead><tr><th>Line</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${q.lines.map((l) => `<tr><td>${l.line}</td><td class="mono">${l.sku}</td><td>${l.qty}</td><td>${money(l.price)}</td><td>${money(l.qty * l.price)}</td></tr>`).join("")}</tbody></table>
        </article>`)
      .join("");
  }

  function renderOrders() {
    document.getElementById("ordersRoot").innerHTML = working.orders
      .map((o) => `
        <article class="card">
          <div class="card-head"><h2 class="mono">${o.orderNo}</h2><span class="meta">${customerName(o.customerId)} · quote ${o.quoteNo || "—"} · ${o.status} · ${money(sumLines(o.lines, "price"))}</span></div>
          <table class="data"><thead><tr><th>Line</th><th>SKU</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${o.lines.map((l) => `<tr><td>${l.line}</td><td class="mono">${l.sku}</td><td>${l.qty}</td><td>${money(l.price)}</td></tr>`).join("")}</tbody></table>
        </article>`)
      .join("");
  }

  function renderProducts() {
    document.getElementById("productsRoot").innerHTML = `
      <article class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>SKU</th><th>Description</th><th>OH</th><th>ROP</th><th>Cost</th><th>Sell</th><th>Flag</th></tr></thead>
        <tbody>${working.products
          .map((p) => `<tr><td class="mono">${p.sku}</td><td>${p.description}</td><td>${p.onHand}</td><td>${p.reorderPoint}</td><td>${money(p.cost)}</td><td>${money(p.sell)}</td><td>${p.onHand <= p.reorderPoint ? "REORDER" : "ok"}</td></tr>`)
          .join("")}</tbody>
      </table></div></article>`;
  }

  function renderCustomers() {
    document.getElementById("customersRoot").innerHTML = working.customers
      .map((c) => `<article class="card"><div class="card-head"><h2>${c.name}</h2><span class="meta mono">${c.id} · ${c.postcode} · ${c.status}</span></div><p class="note">${c.email}</p></article>`)
      .join("");
  }

  function renderRelations() {
    document.getElementById("relationsRoot").innerHTML = `
      <article class="card"><div class="card-head"><h2>Cardinalities</h2></div>
        <p class="note"><strong>1:1</strong> Customer↔Account · Order↔Invoice</p>
        <p class="note"><strong>1:N</strong> Supplier→PO→Lines · Customer→Quotes/Orders</p>
        <p class="note"><strong>M:N</strong> Product↔Supplier · Product↔Tag · PO↔Product via lines</p>
      </article>
      <article class="card"><div class="card-head"><h2>Suppliers</h2></div>
        <table class="data"><thead><tr><th>ID</th><th>Name</th><th>City</th><th>Postcode</th><th>Phone</th></tr></thead>
        <tbody>${working.suppliers.map((s) => `<tr><td class="mono">${s.id}</td><td>${s.name}</td><td>${s.city || ""}</td><td>${s.postcode}</td><td>${s.phone || ""}</td></tr>`).join("")}</tbody></table>
      </article>
      <article class="card"><div class="card-head"><h2>ProductSupplier (M:N)</h2></div>
        <table class="data"><thead><tr><th>SKU</th><th>Supplier</th><th>Lead</th><th>Cost</th></tr></thead>
        <tbody>${working.productSuppliers.map((ps) => `<tr><td class="mono">${ps.sku}</td><td>${supplierName(ps.supplierId)}</td><td>${ps.leadDays}d</td><td>${money(ps.unitCost)}</td></tr>`).join("")}</tbody></table>
      </article>`;
  }

  function renderFields() {
    const rows = Object.keys(ROLES)
      .map((name) => {
        const edit = [];
        const add = [];
        const walk = (n) => {
          const node = ROLES[n];
          if (!node) return;
          node.inherits.forEach(walk);
          edit.push(...node.canEdit);
          add.push(...node.canAdd);
        };
        walk(name);
        return `<tr><td>${name}</td><td class="mono">${[...new Set(add)].join(", ") || "—"}</td><td class="mono">${[...new Set(edit)].join(", ") || "—"}</td></tr>`;
      })
      .join("");
    document.getElementById("fieldsRoot").innerHTML = `
      <article class="card"><div class="card-head"><h2>Active · ${role}</h2></div>
        <p class="note">${ROLES[role].blurb}</p>
        <p class="note">Add: <span class="mono">${[...roleBag("canAdd")].join(", ") || "none"}</span></p>
        <p class="note">Edit: <span class="mono">${[...roleBag("canEdit")].join(", ") || "none"}</span></p>
      </article>
      <article class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Role</th><th>Can add</th><th>Can edit</th></tr></thead><tbody>${rows}</tbody>
      </table></div></article>`;
  }

  function render() {
    renderChrome();
    updatePill();
    syncButtons();
    if (view === "hub") renderHub();
    if (view === "po-entry") renderPoEntry();
    if (view === "purchasing") renderPoList();
    if (view === "quotes") renderQuotes();
    if (view === "orders") renderOrders();
    if (view === "products") renderProducts();
    if (view === "customers") renderCustomers();
    if (view === "relations") renderRelations();
    if (view === "fields") renderFields();
  }

  function boot() {
    document.getElementById("btnEdit").onclick = () => {
      editMode = !editMode;
      sessionStorage.setItem(EDIT_KEY, editMode ? "1" : "0");
      log(editMode ? "Edit mode ON" : "Edit mode OFF", "mode");
      toast(editMode ? "Edit mode on — working copy only." : "Edit mode off.");
      render();
    };
    document.getElementById("btnPost").onclick = () => {
      posted = { at: Date.now(), data: clone(working) };
      localStorage.setItem(POSTED_KEY, JSON.stringify(posted));
      log("Posted journal", "post");
      toast("Posted journal (master remains sealed).");
      render();
    };
    document.getElementById("btnUndo").onclick = () => {
      if (!undoStack.length) return;
      const prev = undoStack.pop();
      redoStack.push({ label: prev.label, data: clone(working) });
      working = normalize(prev.data);
      persist();
      log(`Undo ${prev.label}`, "undo");
      toast("Undone.");
      render();
    };
    document.getElementById("btnRedo").onclick = () => {
      if (!redoStack.length) return;
      const next = redoStack.pop();
      undoStack.push({ label: next.label, data: clone(working) });
      working = normalize(next.data);
      persist();
      log(`Redo ${next.label}`, "redo");
      toast("Redone.");
      render();
    };
    document.getElementById("btnDiscard").onclick = () => {
      working = normalize(clone(MASTER));
      undoStack = [];
      redoStack = [];
      persist();
      log("Discarded working copy", "discard");
      toast("Discarded — reloaded master.");
      render();
    };

    document.getElementById("roleSelect").onchange = (e) => {
      role = e.target.value;
      localStorage.setItem(ROLE_KEY, role);
      log(`Role → ${role}`, "mode");
      toast(`Role → ${role}`);
      render();
    };

    document.getElementById("treeSearch").oninput = () => renderChrome();

    document.getElementById("app").addEventListener("click", (e) => {
      const goBtn = e.target.closest("[data-go]");
      if (goBtn) return go(goBtn.dataset.go);

      const hubBtn = e.target.closest("[data-hub]");
      if (hubBtn) return setHub(hubBtn.dataset.hub);

      const viewBtn = e.target.closest("[data-view]");
      if (viewBtn) return go(viewBtn.dataset.view);

      const toastBtn = e.target.closest("[data-toast]");
      if (toastBtn) return toast(toastBtn.dataset.toast);

      const openPo = e.target.closest("[data-open-po]");
      if (openPo) {
        poNo = openPo.dataset.openPo;
        return go("po-entry");
      }

      const tab = e.target.closest("[data-po-tab]");
      if (tab) {
        poTab = tab.dataset.poTab;
        return render();
      }

      const action = e.target.closest("[data-action]")?.dataset.action;
      if (!action) return;
      if (action === "new-po") return addPo();
      if (action === "save-po") return toast(editMode ? "Fields save to working copy on change." : "Turn on Edit to change the PO.");
      if (action === "print-po") return toast("Print preview scaffold.");
      if (action === "request-approval") {
        const po = currentPo();
        if (!po) return;
        if (!canEdit("purchaseOrders.status")) return toast("Role cannot change PO status.");
        if (!mutate(`Request approval ${po.poNo}`, () => { po.status = "Pending Approval"; })) return;
        toast(`PO ${po.poNo} → Pending Approval`);
        return render();
      }
      if (action === "prev-po" || action === "next-po") {
        const list = working.purchaseOrders;
        const i = list.findIndex((p) => p.poNo === poNo);
        const n = action === "next-po" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        poNo = list[n].poNo;
        return render();
      }
    });

    showView("hub");
    render();
  }

  boot();
})();
