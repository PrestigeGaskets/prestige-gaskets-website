/**
 * Rushmore Business OS — full M1-style GUI (built as one app, not a patch).
 * Master sealed; edits go to working copy (localStorage). GBP / UK postcode.
 */

(() => {
  "use strict";

  const STORAGE = "rushmore-bos-v9";
  const ROLE_KEY = "rushmore-role-v2";
  const HUB_KEY = "rushmore-hub-v2";
  const OPERATOR_KEY = "rushmore-operator-v1";
  const POSTED_KEY = "rushmore-posted-v2";
  const ACTIVITY_KEY = "rushmore-activity-v2";
  const PENDING_KEY = "rushmore-pending-v1";
  const ACTION_REPO_KEY = "rushmore-action-repo-v1";
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
        status: "Won",
        quotedDate: "20/08/2026",
        validDays: 14,
        shipMethod: "CARRIER",
        via: "WL-CITY",
        lines: [
          { line: 1, sku: "P1001", qty: 10, price: 4.75 },
          { line: 2, sku: "P1002", qty: 5, price: 5.9 },
        ],
      },
      {
        quoteNo: "Q-101",
        customerId: "C001",
        status: "Confirmed",
        quotedDate: "01/09/2026",
        validDays: 14,
        shipMethod: "COLLECT",
        via: "",
        lines: [
          { line: 1, sku: "P1003", qty: 40, price: 2.4 },
          { line: 2, sku: "P1005", qty: 100, price: 0.95 },
        ],
      },
      {
        quoteNo: "Q-102",
        customerId: "C002",
        status: "Sent",
        quotedDate: "05/09/2026",
        validDays: 14,
        shipMethod: "COURIER",
        via: "WL-MID",
        lines: [
          { line: 1, sku: "P1006", qty: 12, price: 3.25 },
        ],
      },
    ],
    orders: [
      {
        orderNo: "O-500",
        quoteNo: "Q-100",
        customerId: "C004",
        status: "Shipped",
        readyToPrint: false,
        shipMethod: "CARRIER",
        via: "WL-CITY",
        shipPaymentType: "PREPAID",
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
        readyToPrint: true,
        shipMethod: "COLLECT",
        via: "",
        shipPaymentType: "COLLECT",
        lines: [
          { line: 1, sku: "P1005", qty: 80, price: 0.95 },
          { line: 2, sku: "P1006", qty: 10, price: 3.25 },
        ],
      },
    ],
    procurementProviders: [
      { id: "WL-CITY", name: "City Today White-Label", supplierId: "CITY0002" },
      { id: "WL-MID", name: "Midlands Rubber Procurement Agent", supplierId: "S-01" },
      { id: "WL-CLYDE", name: "Clyde Components White-Label", supplierId: "S-02" },
    ],
    invoices: [
      { invoiceNo: "INV-500", orderNo: "O-500", status: "Paid", amount: 77 },
      { invoiceNo: "INV-501", orderNo: "O-501", status: "Draft", amount: 108.5 },
    ],
    goodsReceipts: [],
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
    shipments: [
      {
        shipmentId: "275525",
        shipDate: "10/09/2026",
        reversalEntry: false,
        customerId: "",
        invLocation: "",
        shipOrganisation: "",
        shipLocation: "",
        arContact: "",
        shippingContact: "",
        creditHold: false,
        customerAddress: { name: "", line1: "", line2: "", city: "", postcode: "", phone: "", fax: "" },
        shipMethodId: "CARRIER",
        shipPaymentType: "PREPAID",
        trackingNumber: "",
        currency: "GBP",
        exchangeRate: 1,
        customRate: false,
        freightSubtotal: 0,
        taxTotal: 0,
        freightTotal: 0,
        weightTotal: 0,
        shippingComments: "",
        printPackingSlip: false,
        printLabels: false,
        standardMessage: "",
        deliveryNoteIssued: false,
        deliveryNoteNo: "",
        status: "Draft",
        lines: [],
        memos: [],
        attachments: [],
        followups: [],
        calls: [],
      },
      {
        shipmentId: "275526",
        shipDate: "10/09/2026",
        reversalEntry: false,
        customerId: "C004",
        invLocation: "MAIN",
        shipOrganisation: "C004",
        shipLocation: "MAIN",
        arContact: "pilot@prestige.example",
        shippingContact: "pilot@prestige.example",
        creditHold: false,
        customerAddress: {
          name: "Prestige Pilot",
          line1: "1 Parliament Sq",
          line2: "",
          city: "London",
          postcode: "SW1A 1AA",
          phone: "020 7946 0001",
          fax: "",
        },
        shipMethodId: "CARRIER",
        shipPaymentType: "PREPAID",
        trackingNumber: "",
        currency: "GBP",
        exchangeRate: 1,
        customRate: false,
        freightSubtotal: 12.5,
        taxTotal: 0,
        freightTotal: 12.5,
        weightTotal: 4.2,
        shippingComments: "Deliver to goods-in.",
        printPackingSlip: true,
        printLabels: false,
        standardMessage: "Standard shipping terms.",
        deliveryNoteIssued: true,
        deliveryNoteNo: "DN-275526",
        status: "Open",
        lines: [
          { line: 1, sku: "P1001", revision: "", warehouseBin: "A-01", deliveryQty: 10, openQty: 10, jobQtyShipped: 0, qtyShipped: 10, shipComplete: true, invoiceComplete: false, deliveryDate: "10/09/2026", jobId: "", orderNo: "O-500", marked: true },
          { line: 2, sku: "P1002", revision: "", warehouseBin: "A-02", deliveryQty: 5, openQty: 5, jobQtyShipped: 0, qtyShipped: 5, shipComplete: true, invoiceComplete: false, deliveryDate: "10/09/2026", jobId: "", orderNo: "O-500", marked: true },
        ],
        memos: [{ id: 1, text: "Confirm carrier booking." }],
        attachments: [],
        followups: [{ id: 1, text: "Confirm Prestige Pilot delivery window", subject: "Delivery window" }],
        calls: [{ id: 1, text: "Called pilot@prestige.example — OK to ship", subject: "Pre-ship call" }],
      },
    ],
  });

  const ROLES = {
    Viewer: { inherits: [], blurb: "Read-only.", canEdit: [], canAdd: [] },
    Sales: {
      inherits: ["Viewer"],
      blurb: "Contacts, quotes & sales orders; confirm quotes (14-day) → SO ready-to-print; collect/via white-label. No Inventory / Raise PO / Despatch.",
      canEdit: [
        // Customer master (sales-owned contact fields)
        "customers.name", "customers.email", "customers.postcode", "customers.status",
        // Quotes + lines (live 14 days — price may change until Won)
        "quotes.status", "quotes.customerId", "quotes.quotedDate", "quotes.validDays",
        "quotes.shipMethod", "quotes.via",
        "quotes.lines.qty", "quotes.lines.price", "quotes.lines.sku",
        // Sales orders + lines + fulfilment
        "orders.status", "orders.customerId", "orders.quoteNo", "orders.readyToPrint",
        "orders.shipMethod", "orders.via", "orders.shipPaymentType",
        "orders.lines.qty", "orders.lines.price", "orders.lines.sku",
      ],
      canAdd: [
        "customers", "quotes", "quoteLines", "orders", "orderLines",
      ],
    },
    Inventory: {
      inherits: ["Viewer"],
      blurb: "Stock edits; post GRNs that bump on-hand.",
      canEdit: ["products.description", "products.onHand", "products.reorderPoint", "products.leadDays"],
      canAdd: ["products", "goodsReceipts"],
    },
    Finance: {
      inherits: ["Viewer"],
      blurb: "Money fields, orders, products.",
      canEdit: ["products.cost", "products.sell", "orders.status", "orders.customerId", "orders.quoteNo"],
      canAdd: ["products", "orders"],
    },
    Purchasing: {
      inherits: ["Viewer"],
      blurb: "POs + GRN goods receipt against supplier orders.",
      canEdit: [
        "purchaseOrders.status", "purchaseOrders.buyer", "purchaseOrders.paymentTerms",
        "purchaseOrders.dueDate", "purchaseOrders.shipMethod", "purchaseOrders.comments",
        "purchaseOrders.currency", "purchaseOrders.readyToPrint", "purchaseOrders.supplierId",
        "purchaseOrders.lines.qty", "purchaseOrders.lines.unitCost", "purchaseOrders.lines.sku",
        "purchaseOrders.invLocation", "purchaseOrders.purLocation", "purchaseOrders.apContact",
        "purchaseOrders.purchasingContact", "purchaseOrders.dropShipContact",
        "purchaseOrders.fob", "purchaseOrders.orderDate", "purchaseOrders.standardMessage",
      ],
      canAdd: ["purchaseOrders", "poLines", "goodsReceipts"],
    },
    Shipping: {
      inherits: ["Viewer"],
      blurb: "Shipment Entry, lines, Add From Order.",
      canEdit: [
        "shipments.status", "shipments.customerId", "shipments.shipDate",
        "shipments.invLocation", "shipments.shipOrganisation", "shipments.shipLocation",
        "shipments.arContact", "shipments.shippingContact", "shipments.creditHold",
        "shipments.shipMethodId", "shipments.shipPaymentType", "shipments.trackingNumber",
        "shipments.currency", "shipments.exchangeRate", "shipments.customRate",
        "shipments.freightSubtotal", "shipments.taxTotal", "shipments.freightTotal", "shipments.weightTotal",
        "shipments.shippingComments", "shipments.printPackingSlip", "shipments.printLabels",
        "shipments.standardMessage", "shipments.reversalEntry",
        "shipments.customerAddress.name", "shipments.customerAddress.line1", "shipments.customerAddress.line2",
        "shipments.customerAddress.city", "shipments.customerAddress.postcode",
        "shipments.customerAddress.phone", "shipments.customerAddress.fax",
        "shipments.lines.sku", "shipments.lines.qtyShipped", "shipments.lines.deliveryQty",
        "shipments.lines.warehouseBin", "shipments.lines.orderNo", "shipments.lines.marked",
      ],
      canAdd: ["shipments", "shipmentLines"],
    },
    Manager: {
      inherits: ["Sales", "Inventory", "Finance", "Purchasing", "Shipping"],
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

  /* Session / workload come from RushmoreServer responses — not a hardcoded chrome list. */
  let serverEmployees = [];
  let session = null; // last GET /session payload
  let workload = null; // last GET /workload payload
  let projectsPayload = null;

  function operatorById(id) {
    return serverEmployees.find((op) => op.id === id) || (session && session.employee) || null;
  }

  function operatorForRole(roleName) {
    return serverEmployees.find((op) => op.role === roleName) || serverEmployees[0] || null;
  }

  function currentEmployee() {
    return (session && session.employee) || operatorById(operatorId) || null;
  }

  function accountInitials(op) {
    const parts = String((op && (op.name || op.username)) || "?")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return String(parts[0] || "?").slice(0, 2).toUpperCase();
  }

  async function refreshSessionFromServer() {
    if (!window.RushmoreServer) return null;
    const res = await RushmoreServer.getSession();
    if (!res.ok) return null;
    session = res.data;
    if (session.employee) {
      operatorId = session.employee.id;
      localStorage.setItem(OPERATOR_KEY, operatorId);
      role = session.employee.role;
      localStorage.setItem(ROLE_KEY, role);
    }
    return session;
  }

  async function refreshEmployeesFromServer() {
    if (!window.RushmoreServer) return;
    const res = await RushmoreServer.listEmployees();
    if (res.ok) serverEmployees = res.data.employees || [];
  }

  async function refreshWorkloadFromServer() {
    if (!window.RushmoreServer) return null;
    const res = await RushmoreServer.getWorkload();
    if (!res.ok) {
      workload = null;
      return null;
    }
    workload = res.data;
    if (workload.session) session = workload.session;
    return workload;
  }

  async function refreshProjectsFromServer() {
    if (!window.RushmoreServer) return null;
    const res = await RushmoreServer.getProjects();
    if (!res.ok) {
      projectsPayload = null;
      return null;
    }
    projectsPayload = res.data;
    if (projectsPayload.session) session = projectsPayload.session;
    return projectsPayload;
  }

  async function loginViaServer(employeeId) {
    const res = await RushmoreServer.login(employeeId);
    if (!res.ok) throw new Error((res.data && res.data.error) || "Login failed");
    session = res.data;
    operatorId = session.employee.id;
    localStorage.setItem(OPERATOR_KEY, operatorId);
    role = session.employee.role;
    localStorage.setItem(ROLE_KEY, role);
    await refreshWorkloadFromServer();
    return session;
  }
  const QUOTE_STATUSES = ["Open", "Sent", "Confirmed", "Won", "Lost"];
  const ORDER_STATUSES = ["Open", "Picked", "Shipped", "Closed"];
  const CUSTOMER_STATUSES = ["Active", "Inactive"];
  const SHIPMENT_STATUSES = ["Draft", "Open", "Shipped", "Posted", "Closed"];
  const SHIP_PAYMENT_TYPES = ["PREPAID", "COLLECT", "THIRD PARTY"];
  const PLANTS = ["J A HARRISON (MANCHESTER)", "J A HARRISON (SHEFFIELD)"];
  const QUOTE_VALID_DAYS_DEFAULT = 14;

  /* My Shortcuts — same set as M1 rail */
  const ICONS = [
    { id: "workload", label: "My Workload", ico: "📋" },
    { id: "projects", label: "Projects / Scrum", ico: "🏁" },
    { id: "quotes", label: "Quote Entry", ico: "📝" },
    { id: "orders", label: "Sales Order Entry", ico: "📦" },
    { id: "customers", label: "Contact Management", ico: "👤" },
    { id: "po-entry", label: "PO Entry", ico: "🛒" },
    { id: "shipment", label: "Shipment Entry", ico: "🚚" },
    { id: "receipt", label: "Receipt Entry", ico: "📥" },
    { id: "invoices", label: "AR Invoices", ico: "💵" },
    { id: "so-explorer", label: "Sales Order Explorer", ico: "🔍", hub: "sales" },
  ];

  const TREE_FILTERS = ["All", "Sales", "Production", "Financial"];

  const TREE = [
    {
      id: "start",
      title: "My Start Page",
      ico: "🏠",
      filter: "All",
      open: true,
      items: [{ label: "My Start Page", hub: "home" }],
    },
    {
      id: "sales",
      title: "Sales",
      ico: "💰",
      filter: "Sales",
      open: true,
      items: [
        { label: "Contact Management", view: "customers" },
        { label: "Follow-up Management", view: "shipment", shipTab: "followups" },
        { label: "Call Management", view: "shipment", shipTab: "calls" },
        { label: "Estimating/Quoting Management", hub: "quoting" },
        { label: "Sales Order Management", hub: "sales" },
      ],
    },
    {
      id: "production",
      title: "Production",
      ico: "🏭",
      filter: "Production",
      open: true,
      items: [
        { label: "My Workload", view: "workload" },
        { label: "Inventory Management", hub: "inventory" },
        { label: "Purchasing Management", hub: "purchasing" },
        { label: "Receipt Management", view: "receipt" },
        { label: "End-to-end Intake Map", view: "intake" },
        { label: "Shipping Management", hub: "shipping" },
      ],
    },
    {
      id: "financial",
      title: "Financial",
      ico: "🪙",
      filter: "Financial",
      open: false,
      items: [
        { label: "Accounts Receivable", view: "invoices" },
      ],
    },
    {
      id: "tools",
      title: "Tools",
      ico: "🛠",
      filter: "All",
      open: false,
      items: [
        { label: "Projects & Daily Scrum", view: "projects" },
        { label: "My Workload", view: "workload" },
        { label: "End-to-end Intake Map", view: "intake" },
        { label: "Planned v Actual", view: "intake" },
        { label: "Relations", view: "relations" },
        { label: "Field Network", view: "fields" },
      ],
    },
  ];

  let working = loadWorking();
  let role = localStorage.getItem(ROLE_KEY) || "Purchasing";
  let operatorId = localStorage.getItem(OPERATOR_KEY) || "154981";
  let hub = localStorage.getItem(HUB_KEY) || "sales";
  let treeFilter = localStorage.getItem("rushmore-tree-filter-v1") || "All";
  if (!TREE_FILTERS.includes(treeFilter)) {
    treeFilter = "All";
    localStorage.setItem("rushmore-tree-filter-v1", treeFilter);
  }
  let dashTab = localStorage.getItem("rushmore-dash-tab-v1") || "tables";
  if (!["tables", "role", "classic"].includes(dashTab)) dashTab = "tables";
  let dashQuery = "";
  let view = "hub";
  // Forms are always live — role gates still apply. No Edit toggle.
  let poNo = "70286";
  let poTab = "lines";
  let shipId = "275525";
  let shipTab = "lines";
  let shipPlant = "J A HARRISON (MANCHESTER)";
  let addFromOrderOpen = false;
  let addFromOrderAck = "";
  let addFromOrderLineMarks = {}; // lineNo -> bool
  let recordDialog = null; // { title, note, fields, onSave }
  let undoStack = [];
  let redoStack = [];
  let posted = loadJson(POSTED_KEY, null);
  let activity = loadJson(ACTIVITY_KEY, []);
  let pending = loadJson(PENDING_KEY, []);
  let actionRepo = loadJson(ACTION_REPO_KEY, []);

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
    if (!Array.isArray(next.goodsReceipts)) next.goodsReceipts = [];
    if (!Array.isArray(next.invoices)) next.invoices = clone(MASTER.invoices);
    if (!Array.isArray(next.procurementProviders)) {
      next.procurementProviders = clone(MASTER.procurementProviders || []);
    }
    for (const po of next.purchaseOrders) {
      if (!po.invAddress) po.invAddress = emptyAddr();
      if (!po.purAddress) po.purAddress = emptyAddr();
      if (!po.dropShipAddress) po.dropShipAddress = emptyAddr();
      if (!Array.isArray(po.lines)) po.lines = [];
      if (!Array.isArray(po.memos)) po.memos = [];
      if (!Array.isArray(po.attachments)) po.attachments = [];
      if (!Array.isArray(po.followups)) po.followups = [];
      if (!Array.isArray(po.calls)) po.calls = [];
    }
    for (const q of next.quotes) {
      if (!Array.isArray(q.lines)) q.lines = [];
      if (q.validDays == null) q.validDays = QUOTE_VALID_DAYS_DEFAULT;
      if (!q.quotedDate) q.quotedDate = "01/09/2026";
      if (!q.shipMethod) q.shipMethod = "CARRIER";
      if (q.via == null) q.via = "";
    }
    for (const o of next.orders) {
      if (!Array.isArray(o.lines)) o.lines = [];
      if (o.readyToPrint == null) o.readyToPrint = false;
      if (!o.shipMethod) o.shipMethod = "CARRIER";
      if (o.via == null) o.via = "";
      if (!o.shipPaymentType) o.shipPaymentType = o.shipMethod === "COLLECT" ? "COLLECT" : "PREPAID";
    }
    for (const g of next.goodsReceipts) if (!Array.isArray(g.lines)) g.lines = [];
    if (!Array.isArray(next.shipments)) next.shipments = clone(MASTER.shipments);
    for (const s of next.shipments) {
      if (!s.customerAddress) s.customerAddress = emptyAddr();
      if (!Array.isArray(s.lines)) s.lines = [];
      if (!Array.isArray(s.memos)) s.memos = [];
      if (!Array.isArray(s.attachments)) s.attachments = [];
      if (!Array.isArray(s.followups)) s.followups = [];
      if (!Array.isArray(s.calls)) s.calls = [];
      if (s.deliveryNoteIssued == null) s.deliveryNoteIssued = false;
      if (s.deliveryNoteNo == null) s.deliveryNoteNo = "";
    }
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

  function canTouchPrefix(prefix) {
    if (!prefix) return false;
    const set = roleBag("canEdit");
    if (set.has("*")) return true;
    for (const f of set) {
      if (f === prefix || f.startsWith(`${prefix}.`)) return true;
    }
    return false;
  }


  /** Create-form field: show when role can edit it, or it is a create key with canAdd. */
  function canFillCreate(entity, fieldPath, opts = {}) {
    if (opts.system) return true;
    if (canEdit(fieldPath)) return true;
    if (opts.isKey && canAdd(entity)) return true;
    return false;
  }

  function escAttr(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function openRecordDialog(spec) {
    // live form — role checks follow
    recordDialog = {
      title: spec.title || "Record",
      note: spec.note || "",
      fields: (spec.fields || []).slice(),
      onSave: spec.onSave,
    };
    render();
  }

  function closeRecordDialog() {
    if (!recordDialog) return;
    recordDialog = null;
    render();
  }

  function readRecordDialogValues() {
    const root = document.getElementById("recordDialogPanel");
    const vals = {};
    if (!recordDialog || !root) return vals;
    for (const f of recordDialog.fields) {
      const el = root.querySelector(`[data-rec-key="${CSS.escape(f.key)}"]`);
      if (!el) {
        vals[f.key] = f.value;
        continue;
      }
      if (f.type === "checkbox") vals[f.key] = el.checked;
      else if (f.type === "number") vals[f.key] = el.value === "" ? "" : Number(el.value);
      else vals[f.key] = el.value;
    }
    return vals;
  }

  function saveRecordDialog() {
    if (!recordDialog) return;
    const vals = readRecordDialogValues();
    for (const f of recordDialog.fields) {
      if (!f.required || f.readonly) continue;
      const v = vals[f.key];
      if (v == null || String(v).trim() === "") {
        return toast(`${f.label} is required.`);
      }
    }
    if (typeof recordDialog.onSave !== "function") {
      recordDialog = null;
      return render();
    }
    const ok = recordDialog.onSave(vals);
    if (ok === false) return;
    recordDialog = null;
    render();
  }

  function renderRecordDialog() {
    const root = document.getElementById("recordDialogPanel");
    if (!root) return;
    if (!recordDialog) {
      root.hidden = true;
      root.innerHTML = "";
      return;
    }
    const d = recordDialog;
    const fieldsHtml = d.fields.map((f) => {
      const locked = !!(f.readonly || f.disabled);
      let control = "";
      if (f.type === "select") {
        control = `<select data-rec-key="${escAttr(f.key)}" "" ${f.required ? "required" : ""}>
          ${(f.options || []).map((o) => {
            const val = typeof o === "object" ? o.value : o;
            const lab = typeof o === "object" ? o.label : o;
            return `<option value="${escAttr(val)}" ${String(val) === String(f.value ?? "") ? "selected" : ""}>${escAttr(lab)}</option>`;
          }).join("")}
        </select>`;
      } else if (f.type === "textarea") {
        control = `<textarea data-rec-key="${escAttr(f.key)}" rows="3" "" ${f.required ? "required" : ""}>${escAttr(f.value ?? "")}</textarea>`;
      } else if (f.type === "checkbox") {
        control = `<input type="checkbox" data-rec-key="${escAttr(f.key)}" ${f.value ? "checked" : ""} "" />`;
      } else {
        const t = f.type || "text";
        control = `<input type="${escAttr(t)}" data-rec-key="${escAttr(f.key)}" value="${escAttr(f.value ?? "")}" ${locked ? "readonly" : ""} ${f.required ? "required" : ""} ${f.step != null ? `step="${escAttr(f.step)}"` : ""} ${f.min != null ? `min="${escAttr(f.min)}"` : ""} placeholder="${escAttr(f.placeholder || "")}" autocomplete="off" />`;
      }
      return `<div class="field ${locked ? "is-locked" : ""}"><label>${escAttr(f.label)}${f.required ? " *" : ""}${f.hint ? ` <span class="meta">${escAttr(f.hint)}</span>` : ""}</label>${control}</div>`;
    }).join("");

    root.hidden = false;
    root.innerHTML = `
      <div class="afo-dialog rec-dialog" role="dialog" aria-modal="true" aria-labelledby="recTitle">
        <div class="afo-head rec-titlebar">
          <div>
            <h2 id="recTitle">${escAttr(d.title)}</h2>
            ${d.note ? `<p class="rec-sub">${escAttr(d.note)}</p>` : ""}
          </div>
          <button type="button" class="btn" data-action="rec-close" aria-label="Close">✕</button>
        </div>
        <div class="afo-body">
          <div class="field-grid rec-fields">${fieldsHtml || `<p class="note">No editable fields for this role.</p>`}</div>
        </div>
        <div class="afo-actions">
          <button type="button" class="btn" data-action="rec-close">Cancel</button>
          <button type="button" class="btn btn-primary" data-action="rec-save">Save</button>
        </div>
      </div>`;

    const first = root.querySelector("input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([disabled])");
    if (first) setTimeout(() => first.focus(), 30);
  }

  function pushCreateField(fields, entity, def) {
    if (!canFillCreate(entity, def.fieldPath, def)) return;
    fields.push(def);
  }

  function dashIco(name) {
    const common = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const icons = {
      customers: `<svg ${common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      quotes: `<svg ${common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>`,
      orders: `<svg ${common}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></svg>`,
      invoices: `<svg ${common}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>`,
      products: `<svg ${common}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="m7.5 4.2 9 5.2"/></svg>`,
      po: `<svg ${common}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>`,
      receipt: `<svg ${common}><path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 3-2 3 2 2-2 3 2V4a2 2 0 0 0-2-2z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>`,
      ship: `<svg ${common}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      vendors: `<svg ${common}><path d="M3 9 12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>`,
      intake: `<svg ${common}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h8"/><path d="M6 8v8"/><path d="M18 8v8"/><path d="M8 18h8"/></svg>`,
      fields: `<svg ${common}><circle cx="12" cy="12" r="3"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.2 4.2 1.4 1.4"/><path d="m18.4 18.4 1.4 1.4"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.2 19.8 1.4-1.4"/><path d="m18.4 5.6 1.4-1.4"/></svg>`,
      bolt: `<svg ${common}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"/></svg>`,
      check: `<svg ${common}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
      plus: `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
      hub: `<svg ${common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    };
    return icons[name] || icons.hub;
  }

  function tileAccess(tile) {
    const add = tile.entity ? canAdd(tile.entity) : false;
    const edit = tile.fieldPrefix ? canTouchPrefix(tile.fieldPrefix) : false;
    if (add && edit) return { mode: "write", badge: "Add · Edit" };
    if (add) return { mode: "write", badge: "Can add" };
    if (edit) return { mode: "write", badge: "Can edit" };
    return { mode: "view", badge: "View" };
  }

  function isDirty() {
    return JSON.stringify(working) !== JSON.stringify(normalize(clone(MASTER)));
  }

  function mutate(label, fn, opts = {}) {
    undoStack.push({ label, data: clone(working) });
    if (undoStack.length > 40) undoStack.shift();
    redoStack = [];
    fn();
    persist();
    log(label);
    return true;
  }

  function businessDay(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function isoNow() {
    return new Date().toISOString();
  }

  function persistPending() {
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    syncButtons();
  }

  function persistActionRepo() {
    localStorage.setItem(ACTION_REPO_KEY, JSON.stringify(actionRepo));
  }

  function stageAction(entry) {
    pending = pending.filter((e) => {
      if (e.type !== entry.type) return true;
      if (entry.quoteNo) return e.quoteNo !== entry.quoteNo;
      if (entry.poNo) return e.poNo !== entry.poNo;
      if (entry.shipmentId) return e.shipmentId !== entry.shipmentId;
      return true;
    });
    pending.push({
      id: `ACT-${Date.now()}-${pending.length + 1}`,
      day: businessDay(),
      actor: role,
      status: "staged",
      stagedAt: isoNow(),
      postedAt: "",
      quoteNo: "",
      orderNo: "",
      poNo: "",
      grnNo: "",
      shipmentId: "",
      customerId: "",
      detail: "",
      ...entry,
    });
    persistPending();
  }

  function isStaged(type, key, value) {
    return pending.some((e) => e.type === type && e[key] === value);
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
    // Pill text owned by syncButtons (WORKING · N Δ) for live-copy chrome.
    syncButtons();
  }

  function countChanges() {
    let n = 0;
    const m = normalize(clone(MASTER));
    if (JSON.stringify(working.purchaseOrders) !== JSON.stringify(m.purchaseOrders)) n += 1;
    if (JSON.stringify(working.quotes) !== JSON.stringify(m.quotes)) n += 1;
    if (JSON.stringify(working.orders) !== JSON.stringify(m.orders)) n += 1;
    if (JSON.stringify(working.products) !== JSON.stringify(m.products)) n += 1;
    if (JSON.stringify(working.customers) !== JSON.stringify(m.customers)) n += 1;
    if (JSON.stringify(working.goodsReceipts) !== JSON.stringify(m.goodsReceipts)) n += 1;
    if (JSON.stringify(working.invoices) !== JSON.stringify(m.invoices)) n += 1;
    if (JSON.stringify(working.shipments) !== JSON.stringify(m.shipments)) n += 1;
    return n;
  }

  function syncButtons() {
    const dirty = isDirty();
    const staged = pending.length;
    const deltas = countChanges();
    document.getElementById("btnUndo").disabled = !undoStack.length;
    document.getElementById("btnRedo").disabled = !redoStack.length;
    const postBtn = document.getElementById("btnPost");
    postBtn.disabled = !dirty && staged === 0;
    postBtn.textContent = staged ? `Post (${staged})` : "Post";
    const reverseBtn = document.getElementById("btnReverse");
    if (reverseBtn) reverseBtn.disabled = !dirty && !undoStack.length && staged === 0 && !posted;
    const updateBtn = document.getElementById("btnUpdate");
    if (updateBtn) updateBtn.disabled = false;
    const pill = document.getElementById("copyPill");
    if (pill) {
      pill.classList.toggle("is-dirty", dirty || staged > 0);
      pill.textContent = staged || deltas
        ? `WORKING · ${staged || deltas} Δ`
        : "WORKING · clean";
      pill.title = "Live working copy — Post commits; Reverse restores last posted/server state";
    }
  }

  function applyMasterLists(snap, toastMsg) {
    const keepShipId = shipId;
    const keepPoNo = poNo;
    const lists = [
      "customers",
      "products",
      "suppliers",
      "quotes",
      "orders",
      "purchaseOrders",
      "goodsReceipts",
      "shipments",
      "invoices",
    ];
    mutate("update() refresh lists", () => {
      for (const key of lists) {
        if (Array.isArray(snap[key])) working[key] = clone(snap[key]);
      }
    }, { force: true });
    if (keepShipId && working.shipments.some((s) => s.shipmentId === keepShipId)) shipId = keepShipId;
    if (keepPoNo && working.purchaseOrders.some((p) => p.poNo === keepPoNo)) poNo = keepPoNo;
    Promise.all([
      typeof refreshEmployeesFromServer === "function" ? refreshEmployeesFromServer() : null,
      typeof refreshSessionFromServer === "function" ? refreshSessionFromServer() : null,
      typeof refreshWorkloadFromServer === "function" ? refreshWorkloadFromServer() : null,
      typeof refreshProjectsFromServer === "function" ? refreshProjectsFromServer() : null,
    ].filter(Boolean))
      .then(() => {
        toast(toastMsg || "update() — lists refreshed from server");
        render();
      })
      .catch(() => {
        toast("update() — lists refreshed (workforce unreachable)");
        render();
      });
  }

  /** Pull authoritative lists from Spring /api/master (or local posted/MASTER fallback). */
  function updateFromServer() {
    const fallback = () => {
      const snap = posted && posted.data ? normalize(clone(posted.data)) : normalize(clone(MASTER));
      applyMasterLists(snap, "update() — lists refreshed locally");
    };
    if (!window.RushmoreServer || typeof RushmoreServer.getMaster !== "function") {
      fallback();
      return;
    }
    RushmoreServer.getMaster()
      .then((res) => {
        if (res && res.ok && res.data) {
          applyMasterLists(normalize(clone(res.data)), "update() — lists refreshed from Spring");
        } else {
          fallback();
        }
      })
      .catch(fallback);
  }

  function reverseToPostedLocal() {
    const snap = posted && posted.data ? normalize(clone(posted.data)) : normalize(clone(MASTER));
    working = snap;
    undoStack = [];
    redoStack = [];
    pending = [];
    persistPending();
    persist();
    log("Reverse → last posted/server state", "reverse");
    toast(posted ? "Reversed to last Post snapshot." : "Reversed to master (no Post snapshot yet).");
    render();
  }

  function reverseToPosted() {
    if (!window.RushmoreServer || typeof RushmoreServer.reverse !== "function" || window.RushmoreMode !== "live") {
      reverseToPostedLocal();
      return;
    }
    RushmoreServer.reverse({ actor: role })
      .then((res) => {
        if (!res || !res.ok || !res.data || !res.data.master) {
          reverseToPostedLocal();
          return;
        }
        working = normalize(clone(res.data.master));
        undoStack = [];
        redoStack = [];
        pending = [];
        persistPending();
        persist();
        posted = {
          at: Date.now(),
          data: clone(working),
          actions: res.data.actions || [],
        };
        localStorage.setItem(POSTED_KEY, JSON.stringify(posted));
        log("Reverse → Spring posted snapshot", "reverse");
        toast("Reversed to last Spring Post snapshot.");
        render();
      })
      .catch(() => reverseToPostedLocal());
  }

  function applyCustomerToShipment(ship, customerId) {
    const cust = working.customers.find((c) => c.id === customerId);
    if (!ship || !cust) return;
    if (!ship.arContact) ship.arContact = cust.email || "";
    if (!ship.shippingContact) ship.shippingContact = cust.email || "";
    const addr = ship.customerAddress || emptyAddr();
    if (!addr.name) addr.name = cust.name;
    if (!addr.postcode) addr.postcode = cust.postcode || "";
    ship.customerAddress = addr;
    if (!ship.shipOrganisation) ship.shipOrganisation = cust.id;
  }

  function setPath(path, value) {
    const parts = path.split(".");
    let cur = working;
    for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
    const key = parts[parts.length - 1];
    mutate(`Edit ${path}`, () => {
      cur[key] = value;
      if (parts[0] === "shipments" && key === "customerId") {
        applyCustomerToShipment(working.shipments[Number(parts[1])], value);
      }
      if (key === "shipMethod" && (parts[0] === "quotes" || parts[0] === "orders")) {
        if (value === "COLLECT") {
          cur.via = "";
          if (parts[0] === "orders") cur.shipPaymentType = "COLLECT";
        } else if (parts[0] === "orders" && cur.shipPaymentType === "COLLECT") {
          cur.shipPaymentType = "PREPAID";
        }
      }
    });
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

  function closeMobileNav() {
    const app = document.getElementById("app");
    app.classList.remove("is-modules-open", "is-shortcuts-open");
    document.body.classList.remove("nav-open");
    const backdrop = document.getElementById("navBackdrop");
    if (backdrop) backdrop.hidden = true;
    const btnModules = document.getElementById("btnModules");
    const btnShortcuts = document.getElementById("btnShortcuts");
    const btnAccountMobile = document.getElementById("btnAccountMobile");
    if (btnModules) btnModules.setAttribute("aria-expanded", "false");
    if (btnShortcuts) btnShortcuts.setAttribute("aria-expanded", "false");
    if (btnAccountMobile) btnAccountMobile.setAttribute("aria-expanded", "false");
  }

  function openMobileNav(which) {
    const app = document.getElementById("app");
    closeMobileNav();
    if (which === "modules") {
      app.classList.add("is-modules-open");
      document.getElementById("btnModules")?.setAttribute("aria-expanded", "true");
    } else if (which === "shortcuts") {
      app.classList.add("is-shortcuts-open");
      document.getElementById("btnShortcuts")?.setAttribute("aria-expanded", "true");
      document.getElementById("btnAccountMobile")?.setAttribute("aria-expanded", "true");
    }
    document.body.classList.add("nav-open");
    const backdrop = document.getElementById("navBackdrop");
    if (backdrop) backdrop.hidden = false;
  }

  function contextLabel() {
    if (view === "hub") {
      if (hub === "sales") return "Sales Order Management";
      if (hub === "purchasing") return "Purchasing Management";
      if (hub === "quoting") return "Estimating/Quoting Management";
      if (hub === "shipping") return "Shipping Management";
      if (hub === "inventory") return "Inventory Management";
      if (hub === "home") return "My Start Page";
      return "Management hub";
    }
    const labels = {
      "po-entry": `PO Entry · ${poNo}`,
      purchasing: "Open Purchase Orders",
      quotes: "Quotes",
      orders: "Sales Orders",
      products: "Inventory",
      customers: "Contact Management",
      invoices: "Accounts Receivable",
      shipment: `Shipment Entry · ${shipId}`,
      receipt: "Receipt Entry · GRN",
      intake: "End-to-end Intake",
      relations: "Relations",
      fields: "Field network",
      workload: "My Workload",
      projects: "Projects & Daily Scrum",
    };
    return labels[view] || view;
  }

  function syncMobileChrome() {
    const ctx = document.getElementById("mobileContext");
    if (ctx) ctx.textContent = contextLabel();
    const canPo = canAdd("purchaseOrders") || canTouchPrefix("purchaseOrders");
    const canShip = canAdd("shipments") || canTouchPrefix("shipments");
    document.querySelectorAll(".dock-btn[data-dock]").forEach((btn) => {
      const key = btn.dataset.dock;
      if (key === "po-entry") {
        btn.hidden = !canPo;
        btn.disabled = !canPo;
        btn.setAttribute("aria-hidden", canPo ? "false" : "true");
      } else if (key === "shipment") {
        btn.hidden = !canShip;
        btn.disabled = !canShip;
        btn.setAttribute("aria-hidden", canShip ? "false" : "true");
      }
      const on =
        (key === "hub" && view === "hub") ||
        (key === "orders" && view === "orders") ||
        (key === "po-entry" && view === "po-entry") ||
        (key === "shipment" && view === "shipment") ||
        (key === "quotes" && view === "quotes");
      btn.classList.toggle("is-active", on && !btn.hidden);
    });
    const shortcutsOpen = document.getElementById("app")?.classList.contains("is-shortcuts-open");
    const btnAccountMobile = document.getElementById("btnAccountMobile");
    if (btnAccountMobile) {
      btnAccountMobile.setAttribute("aria-expanded", shortcutsOpen ? "true" : "false");
    }
  }

  function syncAccountChrome() {
    const op = currentEmployee() || { id: "—", name: "…", username: "…", role };
    const idEls = document.querySelectorAll("[data-account-id]");
    idEls.forEach((el) => {
      el.textContent = op.id;
    });
    const nameEls = document.querySelectorAll("[data-account-name]");
    nameEls.forEach((el) => {
      el.textContent = op.name;
    });
    const userEls = document.querySelectorAll("[data-account-user]");
    userEls.forEach((el) => {
      el.textContent = op.username;
    });
    const avatarEls = document.querySelectorAll("[data-account-avatar]");
    avatarEls.forEach((el) => {
      el.textContent = accountInitials(op);
    });
    const meta = document.getElementById("sessionUserMeta");
    if (meta) {
      meta.setAttribute("title", `${op.name} · ${op.username} · ${op.id}`);
    }
    const select = document.getElementById("operatorSelect");
    if (select) {
      const list = serverEmployees.length ? serverEmployees : op.id !== "—" ? [op] : [];
      select.innerHTML = list
        .map((o) => `<option value="${o.id}" ${o.id === op.id ? "selected" : ""}>${o.name} (${o.id})</option>`)
        .join("");
    }
    const presence = document.getElementById("accountPresence");
    if (presence) {
      const clocked = session && session.clockedIn ? "Clocked in" : "Clocked out";
      const onCount = session && session.loggedOnCount != null ? session.loggedOnCount : "—";
      presence.textContent = `${clocked} · ${onCount} logged on (server)`;
    }
    const taskBox = document.getElementById("accountTaskLinks");
    if (taskBox) {
      const links = (workload && workload.taskLinks) || [];
      if (!links.length) {
        taskBox.hidden = true;
        taskBox.innerHTML = "";
      } else {
        taskBox.hidden = false;
        taskBox.innerHTML = links
          .slice(0, 4)
          .map((lnk) => {
            const attrs = [`data-view="${lnk.view}"`];
            if (lnk.shipmentId) attrs.push(`data-open-ship-id="${lnk.shipmentId}"`);
            if (lnk.poNo) attrs.push(`data-open-po-no="${lnk.poNo}"`);
            return `<button type="button" class="account-task-link" ${attrs.join(" ")}>${lnk.label}</button>`;
          })
          .join("");
      }
    }
  }

  /* —— chrome —— */
  function renderChrome() {
    const rail = document.getElementById("iconRail");
    rail.innerHTML = ICONS.map((i) => {
      const active =
        view === i.id ||
        (i.id === "so-explorer" && view === "hub" && hub === "sales") ||
        (i.id === "orders" && view === "orders") ||
        (i.id === "quotes" && view === "quotes") ||
        (i.id === "po-entry" && view === "po-entry") ||
        (i.id === "receipt" && view === "receipt") ||
        (i.id === "shipment" && view === "shipment") ||
        (i.id === "customers" && view === "customers") ||
        (i.id === "invoices" && view === "invoices");
      let attrs = `data-go="${i.id}"`;
      if (i.hub) attrs = `data-hub="${i.hub}"`;
      return `<button type="button" class="icon-btn ${active ? "is-active" : ""}" ${attrs} title="${i.label}"><span class="ico">${i.ico}</span><span>${i.label}</span></button>`;
    }).join("");

    document.getElementById("treeFilters").innerHTML = TREE_FILTERS.map(
      (f) => `<button type="button" class="tree-filter ${treeFilter === f ? "is-active" : ""}" data-tree-filter="${f}">${f}</button>`
    ).join("");

    const tree = document.getElementById("moduleTree");
    const q = (document.getElementById("treeSearch").value || "").trim().toLowerCase();
    tree.innerHTML = TREE.map((group) => {
      const inFilter =
        treeFilter === "All" ||
        group.filter === treeFilter ||
        (treeFilter !== "All" && group.id === "start");
      if (!inFilter) return "";

      const items = group.items.filter((it) => !q || it.label.toLowerCase().includes(q));
      if (q && !items.length && !group.title.toLowerCase().includes(q)) return "";

      const open =
        group.open ||
        !!q ||
        items.some((it) => it.hub && view === "hub" && hub === it.hub);

      return `<details ${open ? "open" : ""}>
        <summary><span class="tree-group-ico">${group.ico || ""}</span>${group.title}</summary>
        ${items
          .map((it) => {
            const selected =
              (it.hub && view === "hub" && hub === it.hub) ||
              (it.view && view === it.view && (!it.shipTab || shipTab === it.shipTab));
            let attrs = "";
            if (it.hub) attrs = `data-hub="${it.hub}"`;
            else if (it.view) {
              attrs = `data-view="${it.view}"`;
              if (it.shipTab) attrs += ` data-open-ship-tab="${it.shipTab}"`;
              if (it.poTab) attrs += ` data-open-po-tab="${it.poTab}"`;
            }
            return `<button type="button" class="tree-leaf ${selected ? "is-selected" : ""}" ${attrs}>${it.label}</button>`;
          })
          .join("")}
      </details>`;
    }).join("");

    const select = document.getElementById("roleSelect");
    select.innerHTML = Object.keys(ROLES)
      .map((r) => `<option value="${r}" ${r === role ? "selected" : ""}>${r}</option>`)
      .join("");

    syncAccountChrome();
    syncMobileChrome();
  }

  function closeToolbarMore() {
    document.querySelectorAll("details.toolbar-more[open]").forEach((d) => {
      d.open = false;
    });
  }

  function showView(name) {
    view = name;
    closeToolbarMore();
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
    closeMobileNav();
    render();
  }

  function go(target) {
    const icon = ICONS.find((i) => i.id === target);
    if (icon?.hub) return setHub(icon.hub);
    if (target === "po-entry") {
      hub = "purchasing";
      localStorage.setItem(HUB_KEY, hub);
    }
    if (target === "shipment") {
      hub = "shipping";
      localStorage.setItem(HUB_KEY, hub);
      // Prefer a shipment that already has lines when opening Despatch on phone.
      const cur = working.shipments.find((s) => s.shipmentId === shipId);
      if (!cur?.lines?.length) {
        const withLines = working.shipments.find((s) => (s.lines || []).length);
        if (withLines) shipId = withLines.shipmentId;
      }
      shipTab = "lines";
    }
    if (target === "customers") {
      hub = "quoting";
      localStorage.setItem(HUB_KEY, hub);
    }
    if (target === "invoices") {
      hub = "sales";
      localStorage.setItem(HUB_KEY, hub);
    }
    const known = ["quotes", "orders", "po-entry", "purchasing", "products", "customers", "invoices", "shipment", "receipt", "intake", "relations", "fields", "hub", "workload", "projects"];
    if (!known.includes(target)) {
      closeMobileNav();
      return toast(`Unknown view: ${target}`);
    }
    showView(target);
    closeMobileNav();
    render();
  }

  /* —— hub packs (live links only) —— */
  function hubPack() {
    if (hub === "sales") {
      return {
        title: "Sales Order Management",
        explorer: "Sales Order Explorer",
        entry: [
          { label: "Sales Order Entry", view: "orders", ico: "⚡", live: true },
          { label: "Accept Quote → Sales Order", view: "quotes", ico: "⚡", live: true },
          { label: "Contact Management", view: "customers", ico: "⚡", live: true },
          { label: "End-to-end Intake Map", view: "intake", ico: "⚡", live: true },
        ],
        reports: [
          { label: "Sales Order Analysis Report", view: "orders", ico: "🖨", live: true },
          { label: "Accounts Receivable", view: "invoices", ico: "🖨", live: true },
        ],
        maintenance: [
          { label: "Customer / Contact Maintenance", view: "customers", ico: "⚙", live: true },
          { label: "Field Network", view: "fields", ico: "⚙", live: true },
        ],
        analysis: [
          { label: "Sales Orders Requiring Approval", view: "orders", ico: "🔎", live: true },
          { label: `Open Sales Orders · ${working.orders.length}`, view: "orders", ico: "🔎", live: true },
          { label: "Unprocessed Sales Orders", view: "orders", ico: "🔎", live: true },
          { label: "Sales Order Backlog", view: "orders", ico: "🔎", live: true },
          { label: `Open quote value · ${money(quoteTotal())}`, view: "quotes", ico: "📊", live: true },
          { label: `AR invoices · ${working.invoices.length}`, view: "invoices", ico: "📊", live: true },
        ],
        customReports: [{ label: "Planned v Actual (Intake)", view: "intake", ico: "📊", live: true }],
        close: [],
      };
    }
    if (hub === "quoting") {
      return {
        title: "Estimating/Quoting Management",
        explorer: "Quote Explorer",
        entry: [
          { label: "Quote Entry", view: "quotes", ico: "⚡", live: true },
          { label: "Accept Quote → Sales Order", view: "quotes", ico: "⚡", live: true },
          { label: "Contact Management", view: "customers", ico: "⚡", live: true },
        ],
        reports: [
          { label: "Open Quotes Report", view: "quotes", ico: "🖨", live: true },
        ],
        maintenance: [
          { label: "Customer / Contact Maintenance", view: "customers", ico: "⚙", live: true },
          { label: "Field Network", view: "fields", ico: "⚙", live: true },
        ],
        analysis: [
          { label: `Open quote value · ${money(quoteTotal())}`, view: "quotes", ico: "🔎", live: true },
          { label: "Quotes by customer", view: "customers", ico: "🔎", live: true },
        ],
        customReports: [{ label: "Planned v Actual (Intake)", view: "intake", ico: "📊", live: true }],
        close: [],
      };
    }
    if (hub === "inventory") {
      return {
        title: "Inventory Management",
        explorer: "Inventory Explorer",
        entry: [
          { label: "Inventory / Products", view: "products", ico: "⚡", live: true },
          { label: "Receipt Entry (GRN)", view: "receipt", ico: "⚡", live: true },
          { label: "Product–Supplier Links", view: "relations", ico: "⚡", live: true },
        ],
        reports: [
          { label: "Reorder Point Report", view: "products", ico: "🖨", live: true },
          { label: "Stock Status", view: "products", ico: "🖨", live: true },
        ],
        maintenance: [
          { label: "Field Network", view: "fields", ico: "⚙", live: true },
        ],
        analysis: [
          { label: `SKUs ≤ ROP · ${working.products.filter((p) => p.onHand <= p.reorderPoint).length}`, view: "products", ico: "🔎", live: true },
          { label: `Confirmed quotes · ${working.quotes.filter((q) => q.status === "Confirmed").length}`, view: "quotes", ico: "🔎", live: true },
          { label: "Product tags", view: "relations", ico: "🔎", live: true },
        ],
        customReports: [],
        close: [],
      };
    }
    if (hub === "home") {
      return {
        title: "My Start Page",
        explorer: "Business Explorer",
        entry: [
          { label: "My Workload", view: "workload", ico: "⚡", live: true },
          { label: "Projects & Daily Scrum", view: "projects", ico: "⚡", live: true },
          { label: "Sales Order Entry", view: "orders", ico: "⚡", live: true },
          { label: "Quote Entry", view: "quotes", ico: "⚡", live: true },
          { label: "Contact Management", view: "customers", ico: "⚡", live: true },
          { label: "PO Entry", view: "po-entry", ico: "⚡", live: true },
          { label: "Shipment Entry", view: "shipment", ico: "⚡", live: true },
          { label: "Receipt Entry (GRN)", view: "receipt", ico: "⚡", live: true },
          { label: "End-to-end Intake Map", view: "intake", ico: "⚡", live: true },
        ],
        reports: [
          { label: "Open Sales Orders", view: "orders", ico: "🖨", live: true },
          { label: "Open Purchase Orders", view: "purchasing", ico: "🖨", live: true },
          { label: "Accounts Receivable", view: "invoices", ico: "🖨", live: true },
        ],
        maintenance: [
          { label: "Relations", view: "relations", ico: "⚙", live: true },
          { label: "Field Network", view: "fields", ico: "⚙", live: true },
        ],
        analysis: [
          { label: "Sales Order Management", hub: "sales", ico: "🔎", live: true },
          { label: "Purchasing Management", hub: "purchasing", ico: "🔎", live: true },
          { label: "Inventory Management", hub: "inventory", ico: "🔎", live: true },
          { label: "Shipping Management", hub: "shipping", ico: "🔎", live: true },
        ],
        customReports: [{ label: "Planned v Actual (Intake)", view: "intake", ico: "📊", live: true }],
        close: [],
      };
    }
    if (hub === "shipping") {
      return {
        title: "Shipping Management",
        explorer: "Shipment Explorer",
        entry: [
          { label: "Shipment Entry", view: "shipment", ico: "⚡", live: true },
          { label: "Sales Order Entry", view: "orders", ico: "⚡", live: true },
          { label: "Follow-ups", view: "shipment", shipTab: "followups", ico: "⚡", live: true },
          { label: "Calls", view: "shipment", shipTab: "calls", ico: "⚡", live: true },
          { label: "Add From Order (on Shipment)", view: "shipment", ico: "⚡", live: true },
        ],
        reports: [
          { label: "Delivery Note / Packing Slip", view: "shipment", ico: "🖨", live: true },
          { label: "Open Shipments", view: "shipment", ico: "🖨", live: true },
        ],
        maintenance: [
          { label: "Contact Management", view: "customers", ico: "⚙", live: true },
          { label: "Field Network", view: "fields", ico: "⚙", live: true },
        ],
        analysis: [
          { label: `Open shipments · ${working.shipments.filter((s) => s.status !== "Posted" && s.status !== "Closed").length}`, view: "shipment", ico: "🔎", live: true },
          { label: "Shipments linked to Sales Orders", view: "intake", ico: "📊", live: true },
        ],
        customReports: [],
        close: [],
      };
    }
    /* purchasing (default Production hub) */
    return {
      title: "Purchasing Management",
      explorer: "Purchase Order Explorer",
      entry: [
        { label: "Purchase Order Entry", view: "po-entry", ico: "⚡", live: true },
        { label: "Receipt Entry (GRN)", view: "receipt", ico: "⚡", live: true },
        { label: "End-to-end Intake Map", view: "intake", ico: "⚡", live: true },
        { label: "Open Purchase Orders", view: "purchasing", ico: "⚡", live: true },
        { label: "Inventory / Products", view: "products", ico: "⚡", live: true },
        { label: "Vendor (Supplier) Links", view: "relations", ico: "⚡", live: true },
      ],
      reports: [
        { label: "Purchase Order Print", view: "po-entry", ico: "🖨", live: true },
        { label: "Open PO Report", view: "purchasing", ico: "🖨", live: true },
      ],
      maintenance: [
        { label: "Vendor Maintenance", view: "relations", ico: "⚙", live: true },
        { label: "Buyer / Terms Lists", view: "fields", ico: "⚙", live: true },
      ],
      analysis: [
        { label: "POs requiring approval", view: "purchasing", ico: "🔎", live: true },
        { label: `Open PO value · ${money(poTotal())}`, view: "purchasing", ico: "📊", live: true },
        { label: "Price vs ProductSupplier", view: "relations", ico: "📊", live: true },
        { label: "PO 70286 · CITY0002", view: "po-entry", ico: "📅", live: true },
      ],
      customReports: [{ label: "Planned v Actual (Intake)", view: "intake", ico: "📊", live: true }],
      close: [],
    };
  }

  function linkHtml(item) {
    let attrs = "";
    if (item.view) {
      attrs = `data-view="${item.view}"`;
      if (item.shipTab) attrs += ` data-open-ship-tab="${item.shipTab}"`;
    } else if (item.hub) {
      attrs = `data-hub="${item.hub}"`;
    } else {
      return "";
    }
    return `<li><button type="button" class="hub-link ${item.live ? "is-live" : ""}" ${attrs}><span class="hub-ico">${item.ico}</span><span>${item.label}</span></button></li>`;
  }

  function panel(title, bodyHtml) {
    return `<section class="hub-panel"><div class="hub-panel-head">${title}</div>${bodyHtml}</section>`;
  }

  function masterTiles() {
    return [
      { id: "customers", label: "Customers", hint: "Contact master", ico: "customers", view: "customers", entity: "customers", fieldPrefix: "customers", count: () => working.customers.length },
      { id: "quotes", label: "Quotes", hint: "Estimating", ico: "quotes", view: "quotes", entity: "quotes", fieldPrefix: "quotes", count: () => working.quotes.length },
      { id: "orders", label: "Sales Orders", hint: "Order master", ico: "orders", view: "orders", entity: "orders", fieldPrefix: "orders", count: () => working.orders.length },
      { id: "invoices", label: "AR Invoices", hint: "Receivables", ico: "invoices", view: "invoices", entity: null, fieldPrefix: "invoices", count: () => working.invoices.length },
      { id: "products", label: "Inventory", hint: "Product master", ico: "products", view: "products", entity: "products", fieldPrefix: "products", count: () => working.products.length },
      { id: "po-entry", label: "PO Entry", hint: "Purchase orders", ico: "po", view: "po-entry", entity: "purchaseOrders", fieldPrefix: "purchaseOrders", count: () => working.purchaseOrders.length },
      { id: "purchasing", label: "Open POs", hint: "PO list", ico: "po", view: "purchasing", entity: "purchaseOrders", fieldPrefix: "purchaseOrders", count: () => working.purchaseOrders.filter((p) => p.status !== "Closed").length },
      { id: "receipt", label: "Goods Receipt", hint: "GRN / stock in", ico: "receipt", view: "receipt", entity: "goodsReceipts", fieldPrefix: null, count: () => working.goodsReceipts.length },
      { id: "shipment", label: "Despatch", hint: "Shipment master", ico: "ship", view: "shipment", entity: "shipments", fieldPrefix: "shipments", count: () => working.shipments.length },
      { id: "relations", label: "Vendors & Links", hint: "Suppliers / tags", ico: "vendors", view: "relations", entity: null, fieldPrefix: null, count: () => working.suppliers.length },
      { id: "intake", label: "Intake Map", hint: "Quote → cash", ico: "intake", view: "intake", entity: null, fieldPrefix: null, count: null },
      { id: "workload", label: "My Workload", hint: "Assigned + dept pool", ico: "fields", view: "workload", entity: null, fieldPrefix: null, count: null },
      { id: "projects", label: "Projects / Scrum", hint: "Milestones & approach", ico: "fields", view: "projects", entity: null, fieldPrefix: null, count: null },
      { id: "fields", label: "Role Matrix", hint: "What you can do", ico: "fields", view: "fields", entity: null, fieldPrefix: null, count: null },
    ];
  }

  function roleActionTiles() {
    const tiles = [];
    const push = (t) => tiles.push(t);
    if (canAdd("customers") || canTouchPrefix("customers")) {
      push({ id: "act-customers", label: "Maintain Contacts", hint: canAdd("customers") ? "Add & edit customers" : "Edit customer fields", ico: "customers", view: "customers", badge: tileAccess({ entity: "customers", fieldPrefix: "customers" }).badge });
    }
    if (canAdd("quotes") || canTouchPrefix("quotes")) {
      push({ id: "act-quotes", label: "Quote Entry", hint: "Create / confirm quotes", ico: "quotes", view: "quotes", badge: tileAccess({ entity: "quotes", fieldPrefix: "quotes" }).badge });
    }
    if (canAdd("orders") || canTouchPrefix("orders")) {
      push({ id: "act-orders", label: "Sales Orders", hint: "Order entry & status", ico: "orders", view: "orders", badge: tileAccess({ entity: "orders", fieldPrefix: "orders" }).badge });
    }
    if (canAdd("purchaseOrders") || canTouchPrefix("purchaseOrders")) {
      push({ id: "act-po", label: "Raise PO", hint: "Purchasing entry", ico: "po", view: "po-entry", badge: tileAccess({ entity: "purchaseOrders", fieldPrefix: "purchaseOrders" }).badge });
    }
    if (canAdd("goodsReceipts")) {
      push({ id: "act-grn", label: "Receive GRN", hint: "Post goods receipt", ico: "receipt", view: "receipt", badge: "Can add" });
    }
    if (canAdd("products") || canTouchPrefix("products")) {
      push({ id: "act-stock", label: "Inventory", hint: "Stock & costs", ico: "products", view: "products", badge: tileAccess({ entity: "products", fieldPrefix: "products" }).badge });
    }
    if (canAdd("shipments") || canTouchPrefix("shipments")) {
      push({ id: "act-ship", label: "Despatch Entry", hint: "Ship / DN / post", ico: "ship", view: "shipment", badge: tileAccess({ entity: "shipments", fieldPrefix: "shipments" }).badge });
    }
    if (canAdd("shipmentLines")) {
      push({ id: "act-afo", label: "Add From Order", hint: "Pull SO lines to DN", ico: "bolt", view: "shipment", badge: "Can add lines" });
    }
    if (canTouchPrefix("invoices") || role === "Finance" || role === "Manager" || role === "Admin" || role === "Sales") {
      push({ id: "act-ar", label: "AR Invoices", hint: "Receivables browse", ico: "invoices", view: "invoices", badge: "View" });
    }
    push({ id: "act-fields", label: "Role Matrix", hint: ROLES[role]?.blurb || "Permissions", ico: "fields", view: "fields", badge: role });
    push({ id: "act-intake", label: "Intake Map", hint: "End-to-end trail", ico: "intake", view: "intake", badge: "Map" });
    // Module hubs — only when role intersects that module's write surface
    const hubs = [{ id: "hub-sales", label: "Sales Hub", hub: "sales", ico: "hub" }];
    if (canAdd("quotes") || canTouchPrefix("quotes")) {
      hubs.push({ id: "hub-quoting", label: "Quoting Hub", hub: "quoting", ico: "quotes" });
    }
    if (canAdd("purchaseOrders") || canTouchPrefix("purchaseOrders")) {
      hubs.push({ id: "hub-purchasing", label: "Purchasing Hub", hub: "purchasing", ico: "po" });
    }
    if (canAdd("shipments") || canTouchPrefix("shipments")) {
      hubs.push({ id: "hub-shipping", label: "Shipping Hub", hub: "shipping", ico: "ship" });
    }
    if (canAdd("products") || canTouchPrefix("products")) {
      hubs.push({ id: "hub-inventory", label: "Inventory Hub", hub: "inventory", ico: "products" });
    }
    hubs.forEach((h) => push({ ...h, hint: "Module start page", badge: "Hub" }));
    return tiles;
  }

  function dashTileHtml(tile) {
    const access = tile.badge ? { mode: tile.badge === "View" || tile.badge === "Map" || tile.badge === "Hub" || tile.badge === role ? "view" : "write", badge: tile.badge } : tileAccess(tile);
    // Lock only write-gated ops modules (Inventory / PO / GRN / Despatch) when role has no add/edit.
    // Browse tiles (e.g. AR Invoices) stay clickable as View.
    const writeGated = new Set(["products", "purchaseOrders", "shipments", "goodsReceipts"]);
    const hasWrite = (tile.entity && canAdd(tile.entity)) || (tile.fieldPrefix && canTouchPrefix(tile.fieldPrefix));
    const locked = !!(tile.entity && writeGated.has(tile.entity) && !hasWrite);
    const count = typeof tile.count === "function" ? tile.count() : tile.count;
    const countHtml = count == null ? "" : `<span class="dash-tile-count">${count}</span>`;
    let attrs = "";
    if (!locked) {
      if (tile.view) attrs = `data-view="${tile.view}"`;
      else if (tile.hub) attrs = `data-hub="${tile.hub}"`;
    }
    const q = `${tile.label} ${tile.hint || ""} ${access.badge}`.toLowerCase();
    const lockAttrs = locked
      ? `disabled aria-disabled="true" title="No ${role} access"`
      : "";
    return `<button type="button" class="dash-tile is-${access.mode}${locked ? " is-locked" : ""}" ${attrs} ${lockAttrs} data-dash-q="${q.replace(/"/g, "")}">
      <span class="dash-tile-ico">${dashIco(tile.ico)}</span>
      <span class="dash-tile-label">${tile.label}</span>
      <span class="dash-tile-badge">${locked ? "No access" : access.badge}</span>
      ${countHtml}
    </button>`;
  }

  function classicHubHtml() {
    const pack = hubPack();
    const custom = (pack.customReports || []).filter(Boolean);
    const close = (pack.close || []).filter(Boolean);
    return `
      <div class="hub-col">
        ${panel("Entry Screens", `<ul class="hub-list">${pack.entry.map(linkHtml).join("")}</ul>`)}
        ${panel("Reports", `<ul class="hub-list">${pack.reports.map(linkHtml).join("")}</ul>`)}
        ${panel("Maintenance", `<ul class="hub-list">${pack.maintenance.map(linkHtml).join("")}</ul>`)}
      </div>
      <div class="hub-col">
        ${panel(
          "M1 Business Analysis",
          `<div class="hub-explorer"><label>${pack.explorer}</label><input type="search" placeholder="Start Search" data-explorer /></div>
           <ul class="hub-list">${pack.analysis.map(linkHtml).join("")}</ul>`
        )}
        ${custom.length ? panel("Custom Reports", `<ul class="hub-list">${custom.map(linkHtml).join("")}</ul>`) : ""}
        ${close.length ? panel("Close", `<ul class="hub-list">${close.map(linkHtml).join("")}</ul>`) : ""}
      </div>`;
  }

  function renderHub() {
    const q = dashQuery.trim().toLowerCase();
    const blurb = ROLES[role]?.blurb || "";
    const tabs = [
      ["tables", "Master tables"],
      ["role", "Your role"],
      ["classic", "Classic hub"],
    ].map(([id, label]) => `<button type="button" class="dash-tab ${dashTab === id ? "is-active" : ""}" data-dash-tab="${id}">${label}</button>`).join("");

    let body = "";
    if (dashTab === "classic") {
      body = `<div class="hub-grid classic-hub">${classicHubHtml()}</div>`;
    } else {
      const source = dashTab === "role" ? roleActionTiles() : masterTiles();
      const tiles = source.filter((t) => {
        if (!q) return true;
        const hay = `${t.label} ${t.hint || ""} ${t.badge || ""} ${t.view || ""} ${t.hub || ""}`.toLowerCase();
        return hay.includes(q);
      });
      const grid = tiles.length
        ? tiles.map(dashTileHtml).join("")
        : `<p class="dash-empty">No tiles match “${dashQuery}” for ${role}.</p>`;
      body = `<div class="dash-grid">${grid}</div>`;
    }

    document.getElementById("hubGrid").innerHTML = `
      <div class="dash" data-dash-root>
        <header class="dash-top">
          <div class="dash-search">
            <span class="dash-search-ico" aria-hidden="true">${dashIco("hub")}</span>
            <input type="search" id="dashSearch" placeholder="Search tables, hubs or actions…" value="${dashQuery.replace(/"/g, "&quot;")}" autocomplete="off" />
          </div>
          <div class="dash-role" title="${blurb.replace(/"/g, "&quot;")}">
            <span class="dash-role-name">${role}</span>
            <span class="dash-role-blurb">${blurb}</span>
            <span class="dash-role-account">${(currentEmployee() || { name: "…", id: "—" }).name} · ${(currentEmployee() || { id: "—" }).id}</span>
          </div>
        </header>
        <nav class="dash-tabs" aria-label="Dashboard sections">${tabs}</nav>
        <p class="dash-lead">${
          dashTab === "tables"
            ? "Master tables — badges show what your role can do (view / edit / add)."
            : dashTab === "role"
              ? `Actions available to <strong>${role}</strong> from the role matrix.`
              : "Classic M1 entry / reports / maintenance panels for this hub."
        }</p>
        ${body}
        <button type="button" class="dash-fab" data-view="fields" title="Open role matrix">${dashIco("fields")}</button>
      </div>`;

    const search = document.getElementById("dashSearch");
    if (search) {
      search.addEventListener("input", (e) => {
        dashQuery = e.target.value;
        const root = document.querySelector("[data-dash-root]");
        if (!root || dashTab === "classic") return;
        const needle = dashQuery.trim().toLowerCase();
        root.querySelectorAll(".dash-tile").forEach((el) => {
          const ok = !needle || (el.dataset.dashQ || "").includes(needle);
          el.hidden = !ok;
        });
        let empty = root.querySelector(".dash-empty");
        const visible = [...root.querySelectorAll(".dash-tile")].some((el) => !el.hidden);
        if (!visible) {
          if (!empty) {
            empty = document.createElement("p");
            empty.className = "dash-empty";
            root.querySelector(".dash-grid")?.appendChild(empty);
          }
          empty.textContent = `No tiles match “${dashQuery}” for ${role}.`;
        } else if (empty) empty.remove();
      });
    }
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
    const locked = false;

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
          const extra = (t === "followups" || t === "calls")
            ? `<button type="button" class="po-tree-node" data-action="po-new-${t}">&lt;New&gt;</button>`
            : "";
          return `<button type="button" class="po-tree-node ${poTab === t ? "is-active" : ""}" data-po-tab="${t}">${labels[t]}</button>${extra}`;
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
          <td><input data-path="purchaseOrders.${idx}.lines.${li}.sku" value="${l.sku}" ${!canEdit("purchaseOrders.lines.sku") ? "disabled" : ""} /></td>
          <td><input type="number" data-path="purchaseOrders.${idx}.lines.${li}.qty" value="${l.qty}" ${!canEdit("purchaseOrders.lines.qty") ? "disabled" : ""} /></td>
          <td><input type="number" step="0.01" data-path="purchaseOrders.${idx}.lines.${li}.unitCost" value="${l.unitCost}" ${!canEdit("purchaseOrders.lines.unitCost") ? "disabled" : ""} /></td>
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
    } else if (poTab === "followups" || poTab === "calls") {
      const rows = (po[poTab] || []).map((x) => `<li>${x.text || x.subject || JSON.stringify(x)}</li>`).join("") || "<li>None yet — use &lt;New&gt;</li>";
      child = `<div class="po-section"><div class="po-section-head">${poTab === "calls" ? "Calls" : "Follow-ups"}</div>
        <p class="note" style="padding:0.55rem">Purchasing contact trail for PO ${po.poNo} · supplier ${supplierName(po.supplierId)}.</p>
        <ul style="margin:0.5rem 1.1rem">${rows}</ul></div>`;
    } else {
      child = `<div class="po-section"><div class="po-section-head">${poTab}</div><p class="note" style="padding:0.55rem">No detail for this tab.</p></div>`;
    }

    const form = document.getElementById("poForm");
    form.innerHTML = `
      <div class="po-section"><div class="po-section-head">ID Info</div>
        <div class="field-grid">${field("Order ID *", `<input class="mono" value="${po.poNo}" disabled />`)}</div>
      </div>
      <div class="po-section"><div class="po-section-head">Supplier Info</div>
        <div class="field-grid">
          ${field("Supplier ID *", `<select data-path="purchaseOrders.${idx}.supplierId" ${!canEdit("purchaseOrders.supplierId") ? "disabled" : ""}>${working.suppliers.map((s) => `<option value="${s.id}" ${s.id === po.supplierId ? "selected" : ""}>${s.id} — ${s.name}</option>`).join("")}</select>`)}
          ${field("Inv. Location", `<input data-path="purchaseOrders.${idx}.invLocation" value="${po.invLocation || ""}" ${!canEdit("purchaseOrders.invLocation") ? "disabled" : ""} />`)}
          ${field("Pur. Location", `<input data-path="purchaseOrders.${idx}.purLocation" value="${po.purLocation || ""}" ${!canEdit("purchaseOrders.purLocation") ? "disabled" : ""} />`)}
          ${field("Org Account ID", `<input data-path="purchaseOrders.${idx}.orgAccountId" value="${po.orgAccountId || ""}" "" />`)}
          ${field("Drop Ship Org ID", `<input data-path="purchaseOrders.${idx}.dropShipOrgId" value="${po.dropShipOrgId || ""}" "" />`)}
          ${field("Drop Ship Location", `<input data-path="purchaseOrders.${idx}.dropShipLocation" value="${po.dropShipLocation || ""}" "" />`)}
          ${field("Accounting Contact (AP)", `<input data-path="purchaseOrders.${idx}.apContact" value="${po.apContact || ""}" ${!canEdit("purchaseOrders.apContact") ? "disabled" : ""} />`)}
          ${field("Purchasing Contact", `<input data-path="purchaseOrders.${idx}.purchasingContact" value="${po.purchasingContact || ""}" ${!canEdit("purchaseOrders.purchasingContact") ? "disabled" : ""} />`)}
          ${field("Drop Ship Contact", `<input data-path="purchaseOrders.${idx}.dropShipContact" value="${po.dropShipContact || ""}" ${!canEdit("purchaseOrders.dropShipContact") ? "disabled" : ""} />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Supplier Address Info</div>
        <div class="addr-grid">${addrBlock(po.invAddress, "Invoice")}${addrBlock(po.purAddress, "Purchase")}${addrBlock(po.dropShipAddress, "Drop ship")}</div>
      </div>
      <div class="po-section"><div class="po-section-head">Shipping Info</div>
        <div class="field-grid">
          ${field("Payment Terms", `<select data-path="purchaseOrders.${idx}.paymentTerms" ${!canEdit("purchaseOrders.paymentTerms") ? "disabled" : ""}>${PAYMENT_TERMS.map((t) => `<option ${t === po.paymentTerms ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
          ${field("Due Date", `<input data-path="purchaseOrders.${idx}.dueDate" value="${po.dueDate}" ${!canEdit("purchaseOrders.dueDate") ? "disabled" : ""} />`)}
          ${field("Ship Method", `<select data-path="purchaseOrders.${idx}.shipMethod" ${!canEdit("purchaseOrders.shipMethod") ? "disabled" : ""}>${SHIP_METHODS.map((t) => `<option ${t === po.shipMethod ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
          ${field("FOB Description", `<input data-path="purchaseOrders.${idx}.fob" value="${po.fob || ""}" ${!canEdit("purchaseOrders.fob") ? "disabled" : ""} />`)}
          ${field("Supplier Rating", `<input data-path="purchaseOrders.${idx}.supplierRating" value="${po.supplierRating || ""}" "" />`)}
          ${field("Landed Cost?", `<input type="checkbox" data-path="purchaseOrders.${idx}.landedCost" ${po.landedCost ? "checked" : ""} "" />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Other Info</div>
        <div class="field-grid">
          ${field("Order Date *", `<input data-path="purchaseOrders.${idx}.orderDate" value="${po.orderDate}" ${!canEdit("purchaseOrders.orderDate") ? "disabled" : ""} />`)}
          ${field("Buyer", `<select data-path="purchaseOrders.${idx}.buyer" ${!canEdit("purchaseOrders.buyer") ? "disabled" : ""}>${BUYERS.map((t) => `<option ${t === po.buyer ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
          ${field("Standard Message", `<input data-path="purchaseOrders.${idx}.standardMessage" value="${po.standardMessage || ""}" ${!canEdit("purchaseOrders.standardMessage") ? "disabled" : ""} />`)}
          ${field("Ready to Print?", `<input type="checkbox" data-path="purchaseOrders.${idx}.readyToPrint" ${po.readyToPrint ? "checked" : ""} ${!canEdit("purchaseOrders.readyToPrint") ? "disabled" : ""} />`)}
          ${field("Order Comments", `<textarea data-path="purchaseOrders.${idx}.comments" ${!canEdit("purchaseOrders.comments") ? "disabled" : ""}>${po.comments || ""}</textarea>`, true)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Currency Info</div>
        <div class="field-grid">
          ${field("Currency *", `<input data-path="purchaseOrders.${idx}.currency" value="${po.currency}" ${!canEdit("purchaseOrders.currency") ? "disabled" : ""} />`)}
          ${field("Exchange Rate", `<input type="number" step="0.000001" data-path="purchaseOrders.${idx}.exchangeRate" value="${po.exchangeRate}" "" />`)}
          ${field("Custom Rate?", `<input type="checkbox" data-path="purchaseOrders.${idx}.customRate" ${po.customRate ? "checked" : ""} "" />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Related Documents</div>
        <div class="toolbar" style="padding:0.45rem"><button type="button" class="btn" disabled>Add</button><button type="button" class="btn" disabled>Delete</button><button type="button" class="btn" disabled>Open</button><button type="button" class="btn" disabled>Print</button></div>
        <p class="note" style="padding:0 0.55rem 0.55rem">Document library — file metadata lives under Attachments.</p>
      </div>
      <div class="po-section"><div class="po-section-head">Status Info</div>
        <div class="field-grid">
          ${field("Status *", `<select data-path="purchaseOrders.${idx}.status" ${!canEdit("purchaseOrders.status") ? "disabled" : ""}>${PO_STATUSES.map((t) => `<option ${t === po.status ? "selected" : ""}>${t}</option>`).join("")}</select>`)}
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
    // live form — role checks follow
    const nums = working.purchaseOrders.map((p) => Number(p.poNo) || 70000);
    const next = String(Math.max(70000, ...nums) + 1);
    const fields = [];
    fields.push({
      key: "poNo",
      label: "PO No",
      type: "text",
      value: next,
      readonly: true,
      hint: "System key",
      system: true,
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "supplierId",
      label: "Supplier",
      type: "select",
      required: true,
      fieldPath: "purchaseOrders.supplierId",
      value: "",
      options: [
        { value: "", label: "— Select supplier —" },
        ...working.suppliers.map((s) => ({ value: s.id, label: `${s.id} — ${s.name}` })),
      ],
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "buyer",
      label: "Buyer",
      type: "select",
      fieldPath: "purchaseOrders.buyer",
      value: "",
      options: [{ value: "", label: "— Select buyer —" }, ...BUYERS.map((b) => ({ value: b, label: b }))],
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      fieldPath: "purchaseOrders.paymentTerms",
      value: "",
      options: [{ value: "", label: "—" }, ...PAYMENT_TERMS.map((t) => ({ value: t, label: t }))],
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "shipMethod",
      label: "Ship Method",
      type: "select",
      fieldPath: "purchaseOrders.shipMethod",
      value: "",
      options: [{ value: "", label: "—" }, ...SHIP_METHODS.map((t) => ({ value: t, label: t }))],
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "orderDate",
      label: "Order Date",
      type: "text",
      fieldPath: "purchaseOrders.orderDate",
      value: "",
      placeholder: "DD/MM/YYYY",
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "currency",
      label: "Currency",
      type: "text",
      fieldPath: "purchaseOrders.currency",
      value: "GBP",
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "status",
      label: "Status",
      type: "select",
      fieldPath: "purchaseOrders.status",
      value: "Draft",
      options: PO_STATUSES.map((t) => ({ value: t, label: t })),
    });
    pushCreateField(fields, "purchaseOrders", {
      key: "comments",
      label: "Comments",
      type: "textarea",
      fieldPath: "purchaseOrders.comments",
      value: "",
    });

    openRecordDialog({
      title: "New Purchase Order",
      note: "Fill fields your role can edit, then Save. Supplier address copies from the supplier master.",
      fields,
      onSave(vals) {
        if (!vals.supplierId) {
          toast("Supplier is required.");
          return false;
        }
        const supplier = working.suppliers.find((s) => s.id === vals.supplierId);
        if (!mutate(`Add PO ${next}`, () => {
          const addr = supplier
            ? {
                name: supplier.name || "",
                line1: supplier.line1 || "",
                line2: supplier.line2 || "",
                city: supplier.city || "",
                postcode: supplier.postcode || "",
                phone: supplier.phone || "",
                fax: supplier.fax || "",
              }
            : emptyAddr();
          working.purchaseOrders.push({
            poNo: next,
            supplierId: vals.supplierId || "",
            invLocation: "",
            purLocation: "",
            orgAccountId: "",
            dropShipOrgId: "",
            dropShipLocation: "",
            apContact: "",
            purchasingContact: "",
            dropShipContact: "",
            invAddress: clone(addr),
            purAddress: clone(addr),
            dropShipAddress: emptyAddr(),
            paymentTerms: vals.paymentTerms || "",
            dueDate: "",
            shipMethod: vals.shipMethod || "",
            fob: "",
            supplierRating: "",
            landedCost: false,
            orderDate: vals.orderDate || "",
            buyer: vals.buyer || "",
            standardMessage: "",
            comments: vals.comments || "",
            readyToPrint: false,
            currency: vals.currency || "GBP",
            exchangeRate: 1,
            customRate: false,
            status: vals.status || "Draft",
            lines: [],
            memos: [],
            attachments: [],
            followups: [],
            calls: [],
          });
        })) return false;
        poNo = next;
        toast(`PO ${next} saved to working copy.`);
        go("po-entry");
        return true;
      },
    });
  }



  /* —— Shipment Entry (M1) —— */
  function currentShipment() {
    return working.shipments.find((s) => s.shipmentId === shipId) || working.shipments[0];
  }

  function shipmentRequirements(ship) {
    const reqs = [];
    if (!ship.customerId) reqs.push({ field: "customerId", text: "Customer ID is required" });
    if (!ship.shipOrganisation) reqs.push({ field: "shipOrganisation", text: "Ship Organisation is required" });
    return reqs;
  }

  function nextShipmentId() {
    let max = 275524;
    for (const s of working.shipments) max = Math.max(max, Number(s.shipmentId) || 0);
    return String(max + 1);
  }

  function addShipment() {
    if (!canAdd("shipments")) return toast("Role cannot add shipments.");
    // live form — role checks follow
    const id = nextShipmentId();
    const fields = [];
    fields.push({
      key: "shipmentId",
      label: "Shipment ID",
      type: "text",
      value: id,
      readonly: true,
      hint: "System key",
      system: true,
    });
    pushCreateField(fields, "shipments", {
      key: "customerId",
      label: "Customer",
      type: "select",
      required: true,
      fieldPath: "shipments.customerId",
      value: "",
      options: [
        { value: "", label: "— Select customer —" },
        ...working.customers.map((c) => ({ value: c.id, label: `${c.id} — ${c.name}` })),
      ],
    });
    pushCreateField(fields, "shipments", {
      key: "shipOrganisation",
      label: "Ship Organisation",
      type: "text",
      required: true,
      fieldPath: "shipments.shipOrganisation",
      value: "",
      placeholder: "Plant / organisation",
    });
    pushCreateField(fields, "shipments", {
      key: "shipDate",
      label: "Ship Date",
      type: "text",
      fieldPath: "shipments.shipDate",
      value: "",
      placeholder: "DD/MM/YYYY",
    });
    pushCreateField(fields, "shipments", {
      key: "shipLocation",
      label: "Ship Location",
      type: "text",
      fieldPath: "shipments.shipLocation",
      value: "",
    });
    pushCreateField(fields, "shipments", {
      key: "shipMethodId",
      label: "Ship Method",
      type: "select",
      fieldPath: "shipments.shipMethodId",
      value: "",
      options: [{ value: "", label: "—" }, ...SHIP_METHODS.map((t) => ({ value: t, label: t }))],
    });
    pushCreateField(fields, "shipments", {
      key: "shipPaymentType",
      label: "Ship Payment",
      type: "select",
      fieldPath: "shipments.shipPaymentType",
      value: "",
      options: [{ value: "", label: "—" }, ...SHIP_PAYMENT_TYPES.map((t) => ({ value: t, label: t }))],
    });
    pushCreateField(fields, "shipments", {
      key: "shippingContact",
      label: "Shipping Contact",
      type: "text",
      fieldPath: "shipments.shippingContact",
      value: "",
    });
    pushCreateField(fields, "shipments", {
      key: "arContact",
      label: "AR Contact",
      type: "text",
      fieldPath: "shipments.arContact",
      value: "",
    });
    pushCreateField(fields, "shipments", {
      key: "status",
      label: "Status",
      type: "select",
      fieldPath: "shipments.status",
      value: "Draft",
      options: SHIPMENT_STATUSES.map((t) => ({ value: t, label: t })),
    });
    pushCreateField(fields, "shipments", {
      key: "shippingComments",
      label: "Shipping Comments",
      type: "textarea",
      fieldPath: "shipments.shippingComments",
      value: "",
    });

    openRecordDialog({
      title: "New Shipment",
      note: "Enter despatch header fields your role can edit. Customer address stays blank until set on the form.",
      fields,
      onSave(vals) {
        if (!vals.customerId) {
          toast("Customer is required.");
          return false;
        }
        if (!String(vals.shipOrganisation || "").trim()) {
          toast("Ship Organisation is required.");
          return false;
        }
        if (!mutate(`Add shipment ${id}`, () => {
          working.shipments.push({
            shipmentId: id,
            shipDate: vals.shipDate || "",
            reversalEntry: false,
            customerId: vals.customerId || "",
            invLocation: "",
            shipOrganisation: String(vals.shipOrganisation || "").trim(),
            shipLocation: vals.shipLocation || "",
            arContact: vals.arContact || "",
            shippingContact: vals.shippingContact || "",
            creditHold: false,
            customerAddress: emptyAddr(),
            shipMethodId: vals.shipMethodId || "",
            shipPaymentType: vals.shipPaymentType || "",
            trackingNumber: "",
            currency: "GBP",
            exchangeRate: 1,
            customRate: false,
            freightSubtotal: 0,
            taxTotal: 0,
            freightTotal: 0,
            weightTotal: 0,
            shippingComments: vals.shippingComments || "",
            printPackingSlip: false,
            printLabels: false,
            standardMessage: "",
            deliveryNoteIssued: false,
            deliveryNoteNo: "",
            status: vals.status || "Draft",
            lines: [],
            memos: [],
            attachments: [],
            followups: [],
            calls: [],
          });
        })) return false;
        shipId = id;
        shipTab = "lines";
        toast(`Shipment ${id} saved to working copy.`);
        go("shipment");
        return true;
      },
    });
  }


  function findOrderByAck(ack) {
    const key = String(ack || "").trim().toUpperCase();
    if (!key) return null;
    return working.orders.find((o) => String(o.orderNo).toUpperCase() === key)
      || working.orders.find((o) => String(o.orderNo).toUpperCase().endsWith(key.replace(/^O-?/, "")))
      || null;
  }

  function qtyAlreadyShipped(orderNo, sku) {
    let n = 0;
    for (const s of working.shipments) {
      if (s.status === "Draft") continue;
      for (const l of s.lines || []) {
        if (l.orderNo === orderNo && l.sku === sku) n += Number(l.qtyShipped || 0);
      }
    }
    return n;
  }

  function openAddFromOrder() {
    if (!canAdd("shipmentLines") === false && false) {
      return toast("Role cannot add shipment lines.");
    }
    if (!canAdd("shipmentLines") && !canEdit("shipments.lines.sku")) {
      return toast("Role cannot add shipment lines.");
    }
    // live form — role checks follow
    addFromOrderOpen = true;
    if (!addFromOrderAck) {
      const open = working.orders.find((o) => o.status === "Open" || o.status === "Picked");
      addFromOrderAck = open?.orderNo || working.orders[0]?.orderNo || "";
    }
    const ord = findOrderByAck(addFromOrderAck);
    addFromOrderLineMarks = {};
    if (ord) {
      for (const l of ord.lines || []) addFromOrderLineMarks[l.line] = true;
    }
    shipTab = "lines";
    render();
  }

  function closeAddFromOrder() {
    addFromOrderOpen = false;
    render();
  }

  function lookupAddFromOrder() {
    const input = document.getElementById("afoAckInput");
    if (input) addFromOrderAck = input.value.trim();
    const ord = findOrderByAck(addFromOrderAck);
    if (!ord) {
      addFromOrderLineMarks = {};
      toast(`No sales acknowledgement matching "${addFromOrderAck || "—"}".`);
      return render();
    }
    addFromOrderAck = ord.orderNo;
    addFromOrderLineMarks = {};
    for (const l of ord.lines || []) addFromOrderLineMarks[l.line] = true;
    toast(`Loaded acknowledgement ${ord.orderNo}.`);
    render();
  }

  function renderAddFromOrderPanel() {
    const root = document.getElementById("addFromOrderPanel");
    if (!root) return;
    if (!addFromOrderOpen) {
      root.hidden = true;
      root.innerHTML = "";
      return;
    }
    root.hidden = false;
    const ord = findOrderByAck(addFromOrderAck);
    const oi = ord ? working.orders.findIndex((o) => o.orderNo === ord.orderNo) : -1;
    const inv = ord ? working.invoices.find((i) => i.orderNo === ord.orderNo) : null;
    const value = ord ? sumLines(ord.lines, "price") : 0;
    const openLines = ord ? (ord.lines || []).length : 0;
    const remainQty = ord
      ? (ord.lines || []).reduce((s, l) => s + Math.max(0, Number(l.qty) - qtyAlreadyShipped(ord.orderNo, l.sku)), 0)
      : 0;

    const statusDis = oi < 0 || !canEdit("orders.status");
    const custDis = oi < 0 || !canEdit("orders.customerId");
    const printDis = oi < 0 || !canEdit("orders.readyToPrint");
    const methodDis = oi < 0 || !canEdit("orders.shipMethod");
    const viaDis = oi < 0 || !canEdit("orders.via") || (ord && ord.shipMethod === "COLLECT");
    const payDis = oi < 0 || !canEdit("orders.shipPaymentType");
    const canCommit = ord && (canAdd("shipmentLines") || canEdit("shipments.lines.sku"));

    const suggestions = working.orders
      .filter((o) => o.status === "Open" || o.status === "Picked" || o.status === "Shipped" || o.readyToPrint)
      .map((o) => `<option value="${o.orderNo}"></option>`)
      .join("");

    const stats = ord ? `
      <div class="afo-stats" aria-label="Order stats">
        <div class="afo-stat"><span class="k">Acknowledgement</span><span class="v mono">${ord.orderNo}</span></div>
        <div class="afo-stat"><span class="k">Customer</span><span class="v">${customerName(ord.customerId)}</span></div>
        <div class="afo-stat"><span class="k">Status</span><span class="v">${ord.status}${ord.readyToPrint ? " · ready to print" : ""}</span></div>
        <div class="afo-stat"><span class="k">Order value</span><span class="v">${money(value)}</span></div>
        <div class="afo-stat"><span class="k">Lines</span><span class="v">${openLines}</span></div>
        <div class="afo-stat"><span class="k">Qty still open</span><span class="v">${remainQty}</span></div>
        <div class="afo-stat"><span class="k">Fulfilment</span><span class="v">${ord.shipMethod || "—"}${ord.via ? ` via ${providerName(ord.via)}` : ""}</span></div>
        <div class="afo-stat"><span class="k">Invoice</span><span class="v mono">${inv ? `${inv.invoiceNo} · ${inv.status}` : "—"}</span></div>
      </div>` : `<p class="note">Enter a sales acknowledgement number (e.g. O-501) and Lookup to load order stats for despatch.</p>`;

    const anyOrderEditable = ord && oi >= 0 && !(statusDis && custDis && printDis && methodDis && viaDis && payDis);
    const editFields = ord && oi >= 0 ? `
      <details class="afo-order-fields"${anyOrderEditable ? " open" : ""}>
        <summary>Order fields (role-gated)${anyOrderEditable ? "" : " · view only"}</summary>
        <div class="field-grid" style="padding:0.55rem">
          <div class="field ${statusDis ? "is-locked" : ""}"><label>Status</label>
            <select data-path="orders.${oi}.status" ${statusDis ? "disabled" : ""}>
              ${ORDER_STATUSES.map((s) => `<option value="${s}" ${ord.status === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
          <div class="field ${custDis ? "is-locked" : ""}"><label>Customer</label>
            <select data-path="orders.${oi}.customerId" ${custDis ? "disabled" : ""}>
              ${working.customers.map((c) => `<option value="${c.id}" ${c.id === ord.customerId ? "selected" : ""}>${c.name}</option>`).join("")}
            </select>
          </div>
          <div class="field ${printDis ? "is-locked" : ""}"><label>Ready to Print?</label>
            <input type="checkbox" data-path="orders.${oi}.readyToPrint" ${ord.readyToPrint ? "checked" : ""} ${printDis ? "disabled" : ""} />
          </div>
          <div class="field ${methodDis ? "is-locked" : ""}"><label>Collect / ship</label>
            <select data-path="orders.${oi}.shipMethod" ${methodDis ? "disabled" : ""}>
              ${SHIP_METHODS.map((s) => `<option value="${s}" ${ord.shipMethod === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
          <div class="field ${viaDis ? "is-locked" : ""}"><label>Via (white-label)</label>
            <select data-path="orders.${oi}.via" ${viaDis ? "disabled" : ""}>${providerOptions(ord.via || "")}</select>
          </div>
          <div class="field ${payDis ? "is-locked" : ""}"><label>Ship payment</label>
            <select data-path="orders.${oi}.shipPaymentType" ${payDis ? "disabled" : ""}>
              ${SHIP_PAYMENT_TYPES.map((s) => `<option value="${s}" ${ord.shipPaymentType === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
        </div>
        <p class="note" style="padding:0 0.55rem 0.55rem">Editable when your role allows · Sales / Shipping / Manager / Admin. Viewer sees stats only.</p>
      </details>` : "";

    const lineRows = ord ? (ord.lines || []).map((l, li) => {
      const shipped = qtyAlreadyShipped(ord.orderNo, l.sku);
      const remain = Math.max(0, Number(l.qty) - shipped);
      const prod = working.products.find((p) => p.sku === l.sku);
      const qtyDis = !canEdit("orders.lines.qty");
      const skuDis = !canEdit("orders.lines.sku");
      const priceDis = !canEdit("orders.lines.price");
      const marked = addFromOrderLineMarks[l.line] !== false && remain > 0;
      return `<tr>
        <td><input type="checkbox" data-afo-line="${l.line}" ${marked ? "checked" : ""} ${remain <= 0 ? "disabled" : ""} /></td>
        <td>${l.line}</td>
        <td><input class="mono" data-path="orders.${oi}.lines.${li}.sku" value="${l.sku}" ${skuDis ? "disabled" : ""} /></td>
        <td>${prod?.description || ""}</td>
        <td><input type="number" min="0" data-path="orders.${oi}.lines.${li}.qty" value="${l.qty}" ${qtyDis ? "disabled" : ""} /></td>
        <td>${shipped}</td>
        <td>${remain}</td>
        <td>${prod ? prod.onHand : "—"}</td>
        <td><input type="number" min="0" step="0.01" data-path="orders.${oi}.lines.${li}.price" value="${l.price}" ${priceDis ? "disabled" : ""} /></td>
        <td>${money(l.qty * l.price)}</td>
      </tr>`;
    }).join("") : "";

    const phoneLineCards = ord ? (ord.lines || []).map((l, li) => {
      const shipped = qtyAlreadyShipped(ord.orderNo, l.sku);
      const remain = Math.max(0, Number(l.qty) - shipped);
      const prod = working.products.find((p) => p.sku === l.sku);
      const qtyDis = !canEdit("orders.lines.qty");
      const skuDis = !canEdit("orders.lines.sku");
      const priceDis = !canEdit("orders.lines.price");
      const marked = addFromOrderLineMarks[l.line] !== false && remain > 0;
      return `<article class="afo-phone-line">
        <div class="apl-top">
          <label><input type="checkbox" data-afo-line="${l.line}" ${marked ? "checked" : ""} ${remain <= 0 ? "disabled" : ""} /> Line ${l.line}</label>
          <span class="mono">${l.sku}</span>
        </div>
        <p class="note" style="margin:0">${prod?.description || "—"}</p>
        <div class="apl-meta">
          <div><label>Ordered</label><input type="number" min="0" data-path="orders.${oi}.lines.${li}.qty" value="${l.qty}" ${qtyDis ? "disabled" : ""} /></div>
          <div><label>Remain / OH</label><span>${remain} / ${prod ? prod.onHand : "—"}</span></div>
          <div><label>SKU</label><input class="mono" data-path="orders.${oi}.lines.${li}.sku" value="${l.sku}" ${skuDis ? "disabled" : ""} /></div>
          <div><label>Price</label><input type="number" min="0" step="0.01" data-path="orders.${oi}.lines.${li}.price" value="${l.price}" ${priceDis ? "disabled" : ""} /></div>
        </div>
      </article>`;
    }).join("") : "";

    const linesBlock = ord ? `
      <div class="po-section"><div class="po-section-head">Lines to despatch</div>
        <div class="table-wrap desktop-only" style="padding:0.45rem">
          <table class="data ship-lines"><thead><tr>
            <th></th><th>Line</th><th>SKU</th><th>Description</th><th>Ordered</th><th>Shipped</th><th>Remain</th><th>OH</th><th>Price</th><th>Ext</th>
          </tr></thead><tbody>${lineRows || `<tr><td colspan="10">No lines on acknowledgement</td></tr>`}</tbody></table>
        </div>
        <div class="afo-phone-lines phone-only">${phoneLineCards || `<p class="note">No lines on acknowledgement</p>`}</div>
      </div>` : "";

    root.innerHTML = `
      <div class="afo-dialog" role="dialog" aria-modal="true" aria-labelledby="afoTitle">
        <div class="afo-head">
          <h2 id="afoTitle">Add From Order · Despatch</h2>
          <button type="button" class="btn" data-action="afo-close">Close</button>
        </div>
        <div class="afo-body">
          <div class="afo-lookup-row">
            <div>
              <label for="afoAckInput">Sales acknowledgement No</label>
              <div class="lookup-wrap">
                <input id="afoAckInput" list="afoAckList" class="mono" value="${addFromOrderAck}" placeholder="e.g. O-501" autocomplete="off" />
                <button type="button" class="lookup-btn" data-action="afo-lookup" title="Lookup">⌕</button>
              </div>
              <datalist id="afoAckList">${suggestions}</datalist>
            </div>
            <button type="button" class="btn btn-primary" data-action="afo-lookup">Lookup</button>
          </div>
          ${stats}
          ${editFields}
          ${linesBlock}
        </div>
        <div class="afo-actions">
          <button type="button" class="btn" data-action="afo-close">Cancel</button>
          <button type="button" class="btn btn-primary" data-action="afo-commit" ${canCommit ? "" : "disabled"}>Add to shipment</button>
        </div>
      </div>`;

    const body = root.querySelector(".afo-body");
    if (body) bindPaths(body);
    root.querySelectorAll("[data-afo-line]").forEach((el) => {
      el.addEventListener("change", () => {
        addFromOrderLineMarks[Number(el.dataset.afoLine)] = el.checked;
      });
    });
    const ackInput = document.getElementById("afoAckInput");
    if (ackInput) {
      ackInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          lookupAddFromOrder();
        }
      });
      ackInput.addEventListener("change", () => { addFromOrderAck = ackInput.value.trim(); });
    }
    root.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === "afo-close") return closeAddFromOrder();
        if (action === "afo-lookup") return lookupAddFromOrder();
        if (action === "afo-commit") return commitAddFromOrder();
      });
    });
  }

  function addShipmentLinesFromOrder() {
    openAddFromOrder();
  }

  function commitAddFromOrder() {
    if (!canAdd("shipmentLines") && !canEdit("shipments.lines.sku")) {
      return toast("Role cannot add shipment lines.");
    }
    const ship = currentShipment();
    if (!ship) return;
    const pick = findOrderByAck(addFromOrderAck);
    if (!pick || !pick.lines?.length) return toast("Lookup a sales acknowledgement first.");
    const selected = (pick.lines || []).filter((l) => addFromOrderLineMarks[l.line] !== false);
    const toAdd = selected.filter((l) => Math.max(0, Number(l.qty) - qtyAlreadyShipped(pick.orderNo, l.sku)) > 0);
    if (!toAdd.length) return toast("No remaining qty on selected lines.");
    if (!mutate(`Add from order ${pick.orderNo} → ${ship.shipmentId}`, () => {
      if (!ship.customerId) ship.customerId = pick.customerId;
      if (!ship.shipOrganisation) ship.shipOrganisation = pick.customerId;
      applyCustomerToShipment(ship, pick.customerId);
      if (pick.shipMethod) ship.shipMethodId = pick.shipMethod;
      if (pick.shipPaymentType) ship.shipPaymentType = pick.shipPaymentType;
      if (pick.via) {
        const provider = (working.procurementProviders || []).find((p) => p.id === pick.via);
        const note = provider
          ? `Via white-label ${provider.name} (${provider.id})`
          : `Via ${pick.via}`;
        if (!ship.shippingComments) ship.shippingComments = note;
        else if (!ship.shippingComments.includes(pick.via)) {
          ship.shippingComments = `${ship.shippingComments}\n${note}`;
        }
      }
      let lineNo = ship.lines.reduce((m, l) => Math.max(m, l.line), 0);
      for (const ol of toAdd) {
        const remain = Math.max(0, Number(ol.qty) - qtyAlreadyShipped(pick.orderNo, ol.sku));
        if (remain <= 0) continue;
        lineNo += 1;
        ship.lines.push({
          line: lineNo,
          sku: ol.sku,
          revision: "",
          warehouseBin: "",
          deliveryQty: remain,
          openQty: remain,
          jobQtyShipped: 0,
          qtyShipped: remain,
          shipComplete: false,
          invoiceComplete: false,
          deliveryDate: ship.shipDate,
          jobId: "",
          orderNo: pick.orderNo,
          marked: true,
        });
      }
      if (ship.status === "Draft") ship.status = "Open";
    })) return;
    addFromOrderOpen = false;
    toast(`Despatch lines from acknowledgement ${pick.orderNo}${pick.shipMethod ? ` · ${pick.shipMethod}` : ""}${pick.via ? ` via ${pick.via}` : ""}.`);
    render();
  }


  function postShipment() {
    const ship = currentShipment();
    if (!ship) return;
    if (!canEdit("shipments.status") && !canAdd("shipments")) return toast("Role cannot post shipments.");
    // live form — role checks follow
    if (ship.status === "Posted" && ship.reversalEntry) {
      return unpostShipment();
    }
    const reqs = shipmentRequirements(ship);
    if (reqs.length) return toast(reqs[0].text);
    if (!ship.lines.length) return toast("Add lines before posting (Add From Order).");
    if (ship.status === "Posted") return toast("Shipment already posted — tick Reversal Entry then Post to unpost, or use Unpost DN.");
    if (isStaged("post-shipment", "shipmentId", ship.shipmentId)) {
      return toast(`Shipment ${ship.shipmentId} already staged — toolbar Post to commit.`);
    }
    if (isStaged("unpost-shipment", "shipmentId", ship.shipmentId)) {
      return toast(`Shipment ${ship.shipmentId} staged for unpost — clear or Post that first.`);
    }
    if (ship.status === "Draft") {
      if (!mutate(`Stage shipment ${ship.shipmentId}`, () => { ship.status = "Open"; })) return;
    }
    stageAction({
      type: "post-shipment",
      shipmentId: ship.shipmentId,
      customerId: ship.customerId || "",
      orderNo: (ship.lines.find((l) => l.orderNo) || {}).orderNo || "",
      detail: `Stage ship ${ship.shipmentId} · delivery note + OH on Post`,
    });
    toast(`Shipment ${ship.shipmentId} staged — toolbar Post issues delivery note stock.`);
    render();
  }

  function unpostShipment() {
    const ship = currentShipment();
    if (!ship) return;
    if (!canEdit("shipments.status") && !canAdd("shipments")) return toast("Role cannot unpost shipments.");
    // live form — role checks follow
    if (ship.status !== "Posted") return toast("Only Posted shipments can be unposted.");
    if (isStaged("unpost-shipment", "shipmentId", ship.shipmentId)) {
      return toast(`Shipment ${ship.shipmentId} already staged for unpost.`);
    }
    if (isStaged("post-shipment", "shipmentId", ship.shipmentId)) {
      return toast(`Shipment ${ship.shipmentId} staged for post — clear pending first.`);
    }
    if (!mutate(`Mark reversal ${ship.shipmentId}`, () => { ship.reversalEntry = true; })) return;
    stageAction({
      type: "unpost-shipment",
      shipmentId: ship.shipmentId,
      customerId: ship.customerId || "",
      orderNo: (ship.lines.find((l) => l.orderNo) || {}).orderNo || "",
      detail: `Stage unpost DN ${ship.shipmentId} · restore OH on Post`,
    });
    toast(`Unpost ${ship.shipmentId} staged — toolbar Post restores stock / clears DN.`);
    render();
  }

  function issueDeliveryNote() {
    const ship = currentShipment();
    if (!ship) return;
    if (!canEdit("shipments.printPackingSlip") && !canEdit("shipments.status")) {
      return toast("Role cannot issue delivery notes.");
    }
    // live form — role checks follow
    const reqs = shipmentRequirements(ship);
    if (reqs.length) return toast(reqs[0].text);
    if (!ship.lines.length) return toast("Add lines before issuing a delivery note.");
    if (ship.status === "Posted") return toast(`DN ${ship.deliveryNoteNo || ship.shipmentId} already posted.`);
    const dnNo = ship.deliveryNoteNo || `DN-${ship.shipmentId}`;
    if (!mutate(`Issue delivery note ${dnNo}`, () => {
      ship.printPackingSlip = true;
      ship.deliveryNoteIssued = true;
      ship.deliveryNoteNo = dnNo;
      if (ship.status === "Draft") ship.status = "Open";
    })) return;
    toast(`Delivery note ${dnNo} issued (working copy) — Post shipment to commit OH.`);
    render();
  }

  function finalizeShipment(shipmentId) {
    const ship = working.shipments.find((s) => s.shipmentId === shipmentId);
    if (!ship) throw new Error(`Shipment ${shipmentId} not found`);
    if (ship.status === "Posted") return { shipmentId, orderNos: [], customerId: ship.customerId || "" };
    const reqs = shipmentRequirements(ship);
    if (reqs.length) throw new Error(reqs[0].text);
    if (!ship.lines.length) throw new Error("Shipment has no lines");
    const orderNos = [];
    ship.status = "Posted";
    ship.deliveryNoteIssued = true;
    if (!ship.deliveryNoteNo) ship.deliveryNoteNo = `DN-${ship.shipmentId}`;
    ship.printPackingSlip = true;
    ship.reversalEntry = false;
    for (const l of ship.lines) {
      if (l.marked === false) continue;
      const p = working.products.find((x) => x.sku === l.sku);
      if (p) p.onHand = Math.max(0, Number(p.onHand) - Number(l.qtyShipped || 0));
      const ord = working.orders.find((o) => o.orderNo === l.orderNo);
      if (ord && (ord.status === "Open" || ord.status === "Picked")) ord.status = "Shipped";
      if (l.orderNo) orderNos.push(l.orderNo);
      l.shipComplete = true;
    }
    return {
      shipmentId,
      orderNos: [...new Set(orderNos)],
      customerId: ship.customerId || "",
      deliveryNoteNo: ship.deliveryNoteNo,
    };
  }

  function finalizeUnpostShipment(shipmentId) {
    const ship = working.shipments.find((s) => s.shipmentId === shipmentId);
    if (!ship) throw new Error(`Shipment ${shipmentId} not found`);
    if (ship.status !== "Posted") throw new Error(`Shipment ${shipmentId} is not Posted`);
    const orderNos = [];
    for (const l of ship.lines) {
      if (l.marked === false) continue;
      const p = working.products.find((x) => x.sku === l.sku);
      if (p) p.onHand = Number(p.onHand) + Number(l.qtyShipped || 0);
      if (l.orderNo) orderNos.push(l.orderNo);
      l.shipComplete = false;
    }
    for (const orderNo of [...new Set(orderNos)]) {
      const stillPosted = working.shipments.some(
        (s) => s.shipmentId !== shipmentId && s.status === "Posted" &&
          s.lines.some((l) => l.orderNo === orderNo && l.marked !== false)
      );
      const ord = working.orders.find((o) => o.orderNo === orderNo);
      if (ord && !stillPosted && ord.status === "Shipped") ord.status = "Open";
    }
    ship.status = "Open";
    ship.reversalEntry = false;
    ship.deliveryNoteIssued = false;
    return {
      shipmentId,
      orderNos: [...new Set(orderNos)],
      customerId: ship.customerId || "",
      deliveryNoteNo: ship.deliveryNoteNo || "",
    };
  }

  function renderShipment() {
    const ship = currentShipment();
    const ribbon = document.getElementById("shipRibbon");
    const tree = document.getElementById("shipTree");
    const form = document.getElementById("shipForm");
    if (!ship) {
      if (ribbon) ribbon.innerHTML = "";
      if (form) form.innerHTML = `<p class="note">No shipments.</p>`;
      return;
    }
    shipId = ship.shipmentId;
    const idx = working.shipments.findIndex((s) => s.shipmentId === ship.shipmentId);
    const locked = false;
    const reqs = shipmentRequirements(ship);

    ribbon.innerHTML = `
      <button type="button" class="btn btn-primary" data-action="new-shipment" title="New">New</button>
      <label class="po-picker">Shipment
        <select id="shipSelect">${working.shipments
          .map((s) => `<option value="${s.shipmentId}" ${s.shipmentId === ship.shipmentId ? "selected" : ""}>${s.shipmentId} — ${s.shipDate}</option>`)
          .join("")}</select>
      </label>
      <label class="po-picker">Plant
        <select id="shipPlantSelect">${PLANTS.map((p) => `<option ${p === shipPlant ? "selected" : ""}>${p}</option>`).join("")}</select>
      </label>
      <button type="button" class="btn ribbon-secondary" data-action="prev-shipment" title="Move Previous">Prev</button>
      <button type="button" class="btn ribbon-secondary" data-action="next-shipment" title="Move Next">Next</button>
      <details class="ribbon-more">
        <summary>More shipment tools</summary>
        <div class="ribbon-more-body">
          <button type="button" class="btn" data-action="open-shipment" title="Open">Open</button>
          <button type="button" class="btn" data-action="next-ship-id" title="Next ID">Next ID</button>
          <button type="button" class="btn" data-action="save-shipment" title="Save">Save</button>
          <button type="button" class="btn" data-action="delete-shipment" title="Delete">Delete</button>
          <button type="button" class="btn" data-action="reload-shipment" title="Reload">Reload</button>
          <button type="button" class="btn" data-action="print-shipment" title="Print">Print</button>
          <button type="button" class="btn" data-action="email-shipment" title="Email">Email</button>
          <button type="button" class="btn" data-action="ship-memos" title="Memos">Memos</button>
          <button type="button" class="btn" data-action="ship-close-view" title="Close">Close</button>
        </div>
      </details>`;

    tree.innerHTML = `
      <div class="po-tree-root">Shipments</div>
      <div class="po-tree-active">${ship.shipmentId} — ${ship.shipDate}</div>
      ${["lines", "followups", "calls", "attachments"]
        .map((t) => {
          const labels = { lines: "Detail Info", followups: "Follow-ups", calls: "Calls", attachments: "Attachments" };
          return `<button type="button" class="po-tree-node ${shipTab === t ? "is-active" : ""}" data-ship-tab="${t}">${labels[t]}</button>
            ${t !== "lines" && t !== "attachments" ? `<button type="button" class="po-tree-node" data-action="ship-new-${t}">&lt;New&gt;</button>` : ""}`;
        })
        .join("")}
      <div class="po-msg">
        <div class="po-msg-tabs">
          <span class="${reqs.length ? "is-hot" : ""}">${reqs.length} Requirements</span>
          <span>0 Warnings</span>
          <span>0 Messages</span>
        </div>
        ${reqs.map((r) => `<p class="req-link" data-action="focus-ship-field" data-field="${r.field}">${r.text}</p>`).join("") || `<p>Shipment '${ship.shipmentId}' · ${ship.status}</p>`}
      </div>`;

    const field = (label, control, span = false) =>
      `<div class="field ${span ? "field-span" : ""} ${locked ? "is-locked" : ""}"><label>${label}</label>${control}</div>`;
    const lookup = (inner) => `<div class="lookup-wrap">${inner}<button type="button" class="lookup-btn" data-action="ship-lookup" title="Lookup">⌕</button></div>`;

    const linesRows = (ship.lines || [])
      .map((l, li) => `<tr>
        <td><input type="checkbox" data-path="shipments.${idx}.lines.${li}.marked" ${l.marked ? "checked" : ""} "" /></td>
        <td class="mono">${l.line}</td>
        <td><input data-path="shipments.${idx}.lines.${li}.sku" value="${l.sku}" ${!canEdit("shipments.lines.sku") ? "disabled" : ""} /></td>
        <td><input data-path="shipments.${idx}.lines.${li}.revision" value="${l.revision || ""}" "" /></td>
        <td><input data-path="shipments.${idx}.lines.${li}.warehouseBin" value="${l.warehouseBin || ""}" ${!canEdit("shipments.lines.warehouseBin") ? "disabled" : ""} /></td>
        <td><input type="number" data-path="shipments.${idx}.lines.${li}.deliveryQty" value="${l.deliveryQty}" ${!canEdit("shipments.lines.deliveryQty") ? "disabled" : ""} /></td>
        <td>${l.openQty}</td>
        <td>${l.jobQtyShipped || 0}</td>
        <td><input type="number" data-path="shipments.${idx}.lines.${li}.qtyShipped" value="${l.qtyShipped}" ${!canEdit("shipments.lines.qtyShipped") ? "disabled" : ""} /></td>
        <td>${l.shipComplete ? "Y" : ""}</td>
        <td>${l.invoiceComplete ? "Y" : ""}</td>
        <td>${l.deliveryDate || ""}</td>
        <td class="mono">${l.jobId || ""}</td>
        <td class="mono"><button type="button" class="linkish" data-action="open-order" data-order="${l.orderNo || ""}">${l.orderNo || "—"}</button></td>
      </tr>`)
      .join("");

    let detail = "";
    if (shipTab === "lines") {
      const phoneCards = (ship.lines || []).map((l, li) => {
        const skuDis = !canEdit("shipments.lines.sku");
        const qtyDis = !canEdit("shipments.lines.qtyShipped");
        const delDis = !canEdit("shipments.lines.deliveryQty");
        const binDis = !canEdit("shipments.lines.warehouseBin");
        return `<article class="phone-line-card">
          <div class="plc-top">
            <label><input type="checkbox" data-path="shipments.${idx}.lines.${li}.marked" ${l.marked ? "checked" : ""} "" /> Line ${l.line}</label>
            <span class="plc-sku">${l.sku || "—"}</span>
          </div>
          <div class="plc-grid">
            <div><label>Part ID</label><input data-path="shipments.${idx}.lines.${li}.sku" value="${l.sku}" ${skuDis ? "disabled" : ""} /></div>
            <div><label>Order</label><button type="button" class="linkish" data-action="open-order" data-order="${l.orderNo || ""}">${l.orderNo || "—"}</button></div>
            <div><label>Ship qty</label><input type="number" data-path="shipments.${idx}.lines.${li}.qtyShipped" value="${l.qtyShipped}" ${qtyDis ? "disabled" : ""} /></div>
            <div><label>Delivery qty</label><input type="number" data-path="shipments.${idx}.lines.${li}.deliveryQty" value="${l.deliveryQty}" ${delDis ? "disabled" : ""} /></div>
            <div><label>Bin</label><input data-path="shipments.${idx}.lines.${li}.warehouseBin" value="${l.warehouseBin || ""}" ${binDis ? "disabled" : ""} /></div>
            <div><label>Open / complete</label><span>${l.openQty} · ${l.shipComplete ? "shipped" : "open"}</span></div>
          </div>
        </article>`;
      }).join("") || `<p class="note" style="padding:0.55rem">No lines yet — tap <strong>Add From Order</strong> below.</p>`;

      const postLabel = isStaged("post-shipment", "shipmentId", ship.shipmentId)
        ? "Staged"
        : ship.status === "Posted" && ship.reversalEntry
          ? "Post Unpost"
          : "Post DN";
      detail = `<div class="po-section"><div class="po-section-head">Detail Info</div>
        <div class="ship-detail-layout">
          <div class="table-wrap desktop-only" style="padding:0.45rem; flex:1; min-width:0">
            <table class="data ship-lines"><thead><tr>
              <th></th><th>Line</th><th>Part ID*</th><th>Revision</th><th>Warehouse / Bin</th>
              <th>Delivery Qty</th><th>Open Qty</th><th>Job Qty Shipped</th><th>Qty Shipped</th>
              <th>Shp Cmpl?</th><th>Invoiced Cmpl?</th><th>Delivery Date</th><th>Job ID</th><th>Order ID</th>
            </tr></thead><tbody>${linesRows || `<tr><td colspan="14">No lines — use Add From Order</td></tr>`}</tbody></table>
          </div>
          <div class="phone-line-cards phone-only">${phoneCards}</div>
          <div class="ship-side-actions desktop-only">
            <button type="button" class="btn" data-action="ship-add-line" ${!canAdd("shipmentLines") ? "disabled" : ""}>Add</button>
            <button type="button" class="btn" data-action="ship-delete-lines" "">Delete</button>
            <button type="button" class="btn btn-primary" data-action="ship-add-from-order" "">Add From Order</button>
            <button type="button" class="btn" data-action="ship-mark-all" "">Mark All</button>
            <button type="button" class="btn" data-action="ship-unmark-all" "">Unmark All</button>
            <button type="button" class="btn" data-action="ship-issue-dn" ${ship.status === "Posted" ? "disabled" : ""}>${ship.deliveryNoteIssued ? `DN ${ship.deliveryNoteNo || ship.shipmentId}` : "Issue DN"}</button>
            <button type="button" class="btn btn-primary" data-action="ship-post" ${(ship.status === "Posted" && !ship.reversalEntry) ? "disabled" : ""}>${postLabel}</button>
            <button type="button" class="btn" data-action="ship-unpost" ${ship.status !== "Posted" ? "disabled" : ""}>${isStaged("unpost-shipment", "shipmentId", ship.shipmentId) ? "Unpost staged" : "Unpost DN"}</button>
          </div>
        </div>
        <div class="ship-phone-bar phone-only">
          <button type="button" class="btn btn-primary" data-action="ship-add-from-order" "">Add From Order</button>
          <button type="button" class="btn btn-primary" data-action="ship-post" ${(ship.status === "Posted" && !ship.reversalEntry) ? "disabled" : ""}>${postLabel}</button>
        </div>
        <details class="ribbon-more phone-only" style="margin:0.35rem 0.45rem 0.6rem">
          <summary>More despatch actions</summary>
          <div class="ribbon-more-body">
            <button type="button" class="btn" data-action="ship-add-line" ${!canAdd("shipmentLines") ? "disabled" : ""}>Add blank line</button>
            <button type="button" class="btn" data-action="ship-delete-lines" "">Delete marked</button>
            <button type="button" class="btn" data-action="ship-mark-all" "">Mark All</button>
            <button type="button" class="btn" data-action="ship-unmark-all" "">Unmark All</button>
            <button type="button" class="btn" data-action="ship-issue-dn" ${ship.status === "Posted" ? "disabled" : ""}>Issue DN</button>
            <button type="button" class="btn" data-action="ship-unpost" ${ship.status !== "Posted" ? "disabled" : ""}>Unpost DN</button>
          </div>
        </details>
      </div>`;
    } else if (shipTab === "attachments") {
      detail = `<div class="po-section"><div class="po-section-head">Attachments</div>
        <ul style="margin:0.5rem 1.1rem">${(ship.attachments||[]).map((a)=>`<li class="mono">${a.fileName}</li>`).join("") || "<li>No attachments</li>"}</ul></div>`;
    } else {
      const title = shipTab === "calls" ? "Calls" : "Follow-ups";
      const cust = customerName(ship.customerId);
      detail = `<div class="po-section"><div class="po-section-head">${title}</div>
        <p class="note" style="padding:0.55rem">${title} for shipment ${ship.shipmentId}${ship.customerId ? ` · ${cust}` : ""}. Use &lt;New&gt; to add.</p>
        <ul style="margin:0.5rem 1.1rem">${(ship[shipTab]||[]).map((x)=>`<li><strong>${x.subject || ""}</strong>${x.subject ? " — " : ""}${x.text || JSON.stringify(x)}</li>`).join("") || `<li>None yet</li>`}</ul></div>`;
    }

    const a = ship.customerAddress || emptyAddr();
    const headerForm = `
      <div class="po-section"><div class="po-section-head">ID Info</div>
        <div class="field-grid">
          ${field("Shipment ID", `<input class="mono" value="${ship.shipmentId}" disabled />`)}
          ${field("Ship Date *", `<input data-path="shipments.${idx}.shipDate" value="${ship.shipDate}" ${!canEdit("shipments.shipDate") ? "disabled" : ""} />`)}
          ${field("Reversal Entry?", `<input type="checkbox" data-path="shipments.${idx}.reversalEntry" ${ship.reversalEntry ? "checked" : ""} ${!canEdit("shipments.reversalEntry") ? "disabled" : ""} />`)}
          ${field("Status", `<select data-path="shipments.${idx}.status" ${!canEdit("shipments.status") ? "disabled" : ""}>${SHIPMENT_STATUSES.map((s)=>`<option ${s===ship.status?"selected":""}>${s}</option>`).join("")}</select>`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Customer Info</div>
        <div class="field-grid">
          ${field("Customer ID *", lookup(`<select data-path="shipments.${idx}.customerId" ${!canEdit("shipments.customerId") ? "disabled" : ""}><option value="">—</option>${working.customers.map((c)=>`<option value="${c.id}" ${c.id===ship.customerId?"selected":""}>${c.id} — ${c.name}</option>`).join("")}</select>`))}
          ${field("Inv. Location", lookup(`<input data-path="shipments.${idx}.invLocation" value="${ship.invLocation||""}" ${!canEdit("shipments.invLocation") ? "disabled" : ""} />`))}
          ${field("Ship Organisation *", lookup(`<input data-path="shipments.${idx}.shipOrganisation" value="${ship.shipOrganisation||""}" ${!canEdit("shipments.shipOrganisation") ? "disabled" : ""} />`))}
          ${field("Ship Location", lookup(`<input data-path="shipments.${idx}.shipLocation" value="${ship.shipLocation||""}" ${!canEdit("shipments.shipLocation") ? "disabled" : ""} />`))}
          ${field("Accounting Contact (AR)", `<input data-path="shipments.${idx}.arContact" value="${ship.arContact||""}" ${!canEdit("shipments.arContact") ? "disabled" : ""} />`)}
          ${field("Shipping Contact", `<input data-path="shipments.${idx}.shippingContact" value="${ship.shippingContact||""}" ${!canEdit("shipments.shippingContact") ? "disabled" : ""} />`)}
          ${field("Credit Hold?", `<input type="checkbox" data-path="shipments.${idx}.creditHold" ${ship.creditHold ? "checked" : ""} ${!canEdit("shipments.creditHold") ? "disabled" : ""} />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Customer Address Info</div>
        <div class="field-grid">
          ${field("Name", `<input data-path="shipments.${idx}.customerAddress.name" value="${a.name||""}" ${!canEdit("shipments.customerAddress.name") ? "disabled" : ""} />`, true)}
          ${field("Address", `<input data-path="shipments.${idx}.customerAddress.line1" value="${a.line1||""}" ${!canEdit("shipments.customerAddress.line1") ? "disabled" : ""} />`, true)}
          ${field("Address 2", `<input data-path="shipments.${idx}.customerAddress.line2" value="${a.line2||""}" ${!canEdit("shipments.customerAddress.line2") ? "disabled" : ""} />`, true)}
          ${field("City", `<input data-path="shipments.${idx}.customerAddress.city" value="${a.city||""}" ${!canEdit("shipments.customerAddress.city") ? "disabled" : ""} />`)}
          ${field("Postcode", `<input data-path="shipments.${idx}.customerAddress.postcode" value="${a.postcode||""}" ${!canEdit("shipments.customerAddress.postcode") ? "disabled" : ""} />`)}
          ${field("Phone", `<input data-path="shipments.${idx}.customerAddress.phone" value="${a.phone||""}" ${!canEdit("shipments.customerAddress.phone") ? "disabled" : ""} />`)}
          ${field("Fax", `<input data-path="shipments.${idx}.customerAddress.fax" value="${a.fax||""}" ${!canEdit("shipments.customerAddress.fax") ? "disabled" : ""} />`)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Shipping Info</div>
        <div class="field-grid">
          ${field("Ship Method ID", `<select data-path="shipments.${idx}.shipMethodId" ${!canEdit("shipments.shipMethodId") ? "disabled" : ""}>${SHIP_METHODS.map((t)=>`<option ${t===ship.shipMethodId?"selected":""}>${t}</option>`).join("")}</select>`)}
          ${field("Ship Payment Type", `<select data-path="shipments.${idx}.shipPaymentType" ${!canEdit("shipments.shipPaymentType") ? "disabled" : ""}>${SHIP_PAYMENT_TYPES.map((t)=>`<option ${t===ship.shipPaymentType?"selected":""}>${t}</option>`).join("")}</select>`)}
          ${field("Tracking Number", lookup(`<input data-path="shipments.${idx}.trackingNumber" value="${ship.trackingNumber||""}" ${!canEdit("shipments.trackingNumber") ? "disabled" : ""} />`))}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Carrier Freight Info</div>
        <div class="field-grid">
          ${field("Currency *", `<select data-path="shipments.${idx}.currency" ${!canEdit("shipments.currency") ? "disabled" : ""}><option>GBP</option><option>EUR</option><option>USD</option></select>`)}
          ${field("Exchange Rate", `<input type="number" step="0.0001" data-path="shipments.${idx}.exchangeRate" value="${ship.exchangeRate}" ${!canEdit("shipments.exchangeRate") ? "disabled" : ""} />`)}
          ${field("Custom Rate", `<input type="checkbox" data-path="shipments.${idx}.customRate" ${ship.customRate ? "checked" : ""} ${!canEdit("shipments.customRate") ? "disabled" : ""} />`)}
          ${field("Freight Subtotal", `<input type="number" step="0.01" data-path="shipments.${idx}.freightSubtotal" value="${ship.freightSubtotal}" ${!canEdit("shipments.freightSubtotal") ? "disabled" : ""} />`)}
          ${field("Tax Total", `<input type="number" step="0.01" data-path="shipments.${idx}.taxTotal" value="${ship.taxTotal}" ${!canEdit("shipments.taxTotal") ? "disabled" : ""} />`)}
          ${field("Freight Total", `<input type="number" step="0.01" data-path="shipments.${idx}.freightTotal" value="${ship.freightTotal}" ${!canEdit("shipments.freightTotal") ? "disabled" : ""} />`)}
          ${field("Weight Total", `<input type="number" step="0.01" data-path="shipments.${idx}.weightTotal" value="${ship.weightTotal}" ${!canEdit("shipments.weightTotal") ? "disabled" : ""} />`)}
          ${field("Shipping Comments", `<textarea data-path="shipments.${idx}.shippingComments" rows="3" ${!canEdit("shipments.shippingComments") ? "disabled" : ""}>${ship.shippingComments||""}</textarea>`, true)}
        </div>
      </div>
      <div class="po-section"><div class="po-section-head">Report Info</div>
        <div class="field-grid">
          ${field("Print Packing Slip / DN?", `<input type="checkbox" data-path="shipments.${idx}.printPackingSlip" ${ship.printPackingSlip ? "checked" : ""} ${!canEdit("shipments.printPackingSlip") ? "disabled" : ""} />`)}
          ${field("Print Labels?", `<input type="checkbox" data-path="shipments.${idx}.printLabels" ${ship.printLabels ? "checked" : ""} ${!canEdit("shipments.printLabels") ? "disabled" : ""} />`)}
          ${field("Delivery Note No", `<input class="mono" value="${ship.deliveryNoteNo || (ship.deliveryNoteIssued ? `DN-${ship.shipmentId}` : "—")}" disabled />`)}
          ${field("Standard Message", `<input data-path="shipments.${idx}.standardMessage" value="${ship.standardMessage||""}" ${!canEdit("shipments.standardMessage") ? "disabled" : ""} />`, true)}
        </div>
      </div>`;
    const linkNote = `<p class="note">Linking keys: <span class="mono">shipmentId=${ship.shipmentId}</span>${ship.deliveryNoteNo ? ` · <span class="mono">DN=${ship.deliveryNoteNo}</span>` : ""} · lines.orderNo → Sales Order · lines.sku → Product · Post / Unpost DN with toolbar Undo while staged</p>`;
    const compact = `
      <div class="po-section"><div class="po-section-head">Shipment</div>
        <p class="note" style="padding:0.55rem"><span class="mono">${ship.shipmentId}</span> · ${customerName(ship.customerId) || "no customer"} · ${ship.status}
          · <button type="button" class="linkish" data-ship-tab="lines">Open Detail Info</button>
          · <button type="button" class="linkish" data-view="customers">Contact Management</button></p>
      </div>`;
    // Follow-ups / Calls / Attachments lead with the tab body so Management shortcuts land on content.
    // Phone-first: Detail Info (lines + sticky actions) before long header blocks.
    form.innerHTML = shipTab === "lines"
      ? `${detail}${headerForm}${linkNote}`
      : `${compact}${detail}${headerForm}${linkNote}`;

    bindPaths(form);
    const sel = document.getElementById("shipSelect");
    if (sel) sel.onchange = (e) => { shipId = e.target.value; render(); };
    const plant = document.getElementById("shipPlantSelect");
    if (plant) plant.onchange = (e) => { shipPlant = e.target.value; toast(`Plant → ${shipPlant}`); };
  }


  /* —— intake helpers —— */
  function trailingNum(id) {
    const m = String(id).match(/(\d+)\s*$/);
    return m ? Number(m[1]) : 0;
  }

  function nextSalesOrderNo() {
    let max = 501;
    for (const o of working.orders) max = Math.max(max, trailingNum(o.orderNo));
    return `SO-${max + 1}`;
  }

  function nextGrnNo() {
    let max = 1000;
    for (const g of working.goodsReceipts) max = Math.max(max, trailingNum(g.grnNo));
    return `GRN-${max + 1}`;
  }

  function orderForQuote(quoteNo) {
    return working.orders.find((o) => o.quoteNo === quoteNo);
  }

  function parseGbDate(text) {
    const m = String(text || "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  }

  function formatGbDate(d) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
  }

  function quoteValidUntilDate(q) {
    const start = parseGbDate(q.quotedDate);
    if (!start) return null;
    const days = Number(q.validDays != null ? q.validDays : QUOTE_VALID_DAYS_DEFAULT);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + days);
    return end;
  }

  function quoteDaysRemaining(q) {
    const end = quoteValidUntilDate(q);
    if (!end) return null;
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((end - startToday) / 86400000);
  }

  function isQuoteLive(q) {
    if (!["Open", "Sent", "Confirmed"].includes(q.status)) return false;
    const rem = quoteDaysRemaining(q);
    if (rem == null) return false; // require a parseable quotedDate
    return rem >= 0;
  }

  function providerName(id) {
    if (!id) return "—";
    const p = (working.procurementProviders || []).find((x) => x.id === id);
    return p ? `${p.id} — ${p.name}` : id;
  }

  function providerOptions(selected) {
    const list = working.procurementProviders || [];
    return `<option value="">— Direct / none —</option>${list
      .map((p) => `<option value="${p.id}" ${p.id === selected ? "selected" : ""}>${p.id} — ${p.name}</option>`)
      .join("")}`;
  }

  function acceptQuote(quoteNo) {
    if (!canAdd("orders")) return toast("Role cannot create sales orders.");
    // live form — role checks follow
    const q = working.quotes.find((x) => x.quoteNo === quoteNo);
    if (!q) return toast("Quote not found.");
    if (!q.lines?.length) return toast("Quote has no lines.");
    if (q.status !== "Confirmed") return toast("Only Confirmed quotes convert to Sales Orders.");
    if (!isQuoteLive(q)) return toast(`Quote ${quoteNo} expired (live ${q.validDays || QUOTE_VALID_DAYS_DEFAULT} days from quoted date).`);
    if (orderForQuote(quoteNo)) return toast(`Quote already linked to ${orderForQuote(quoteNo).orderNo}`);
    if (isStaged("accept-quote", "quoteNo", quoteNo)) {
      return toast(`${quoteNo} already staged — toolbar Post to create Sales Order.`);
    }
    stageAction({
      type: "accept-quote",
      quoteNo,
      customerId: q.customerId || "",
      detail: `Stage accept ${quoteNo} → SO ready-to-print on Post`,
    });
    toast(`${quoteNo} staged — toolbar Post creates Sales Order (ready to print).`);
    render();
  }

  function confirmQuote(quoteNo) {
    if (!canEdit("quotes.status")) return toast("Role cannot confirm quotes.");
    // live form — role checks follow
    const q = working.quotes.find((x) => x.quoteNo === quoteNo);
    if (!q) return toast("Quote not found.");
    if (["Won", "Lost", "Confirmed"].includes(q.status)) {
      return toast(`Quote is already ${q.status}.`);
    }
    if (!isQuoteLive(q) && q.status !== "Open" && q.status !== "Sent") {
      return toast("Quote is not live.");
    }
    if (!isQuoteLive(q)) return toast(`Quote ${quoteNo} expired — refresh quoted date or extend valid days.`);
    if (!mutate(`Confirm quote ${quoteNo}`, () => {
      q.status = "Confirmed";
      if (!q.shipMethod) q.shipMethod = "CARRIER";
      if (q.shipMethod === "COLLECT") q.via = "";
      else if (!q.via && (working.procurementProviders || [])[0]) {
        q.via = working.procurementProviders[0].id;
      }
    })) return;
    toast(`${quoteNo} confirmed — live until ${formatGbDate(quoteValidUntilDate(q))} · price may still change.`);
    render();
  }

  function finalizeAcceptQuote(quoteNo) {
    const q = working.quotes.find((x) => x.quoteNo === quoteNo);
    if (!q) throw new Error(`Quote ${quoteNo} not found`);
    if (!q.lines?.length) throw new Error("Quote has no lines");
    if (q.status !== "Confirmed" && q.status !== "Won") {
      throw new Error("Quote must be Confirmed before Sales Order conversion");
    }
    if (q.status === "Confirmed" && !isQuoteLive(q)) {
      throw new Error(`Quote ${quoteNo} expired`);
    }
    const existing = orderForQuote(quoteNo);
    if (existing) return { soNo: existing.orderNo, customerId: q.customerId || "" };
    const soNo = nextSalesOrderNo();
    const value = sumLines(q.lines, "price");
    const shipMethod = q.shipMethod || "CARRIER";
    working.orders.push({
      orderNo: soNo,
      quoteNo,
      customerId: q.customerId,
      status: "Open",
      readyToPrint: true,
      shipMethod,
      via: shipMethod === "COLLECT" ? "" : (q.via || ""),
      shipPaymentType: shipMethod === "COLLECT" ? "COLLECT" : "PREPAID",
      lines: q.lines.map((l) => ({ line: l.line, sku: l.sku, qty: l.qty, price: l.price })),
    });
    q.status = "Won";
    working.invoices.push({
      invoiceNo: `INV-${trailingNum(soNo)}`,
      orderNo: soNo,
      status: "Draft",
      amount: value,
    });
    return { soNo, customerId: q.customerId || "" };
  }

  function qtyReceivedOnPoLine(poNo, poLine) {
    let n = 0;
    for (const g of working.goodsReceipts) {
      if (g.poNo !== poNo || g.status !== "Posted") continue;
      for (const l of g.lines) if (l.poLine === poLine) n += Number(l.qtyReceived) || 0;
    }
    return n;
  }

  function receivePo(poNo) {
    if (!canAdd("goodsReceipts")) return toast("Role cannot post GRNs.");
    // live form — role checks follow
    const po = working.purchaseOrders.find((p) => p.poNo === poNo);
    if (!po) return toast("PO not found.");
    if (!po.lines?.length) return toast("PO has no lines.");
    const remainAny = po.lines.some((pl) => Number(pl.qty) - qtyReceivedOnPoLine(poNo, pl.line) > 0);
    if (!remainAny) return toast(`PO ${poNo} already fully received.`);
    if (isStaged("receive-po", "poNo", poNo)) {
      return toast(`PO ${poNo} already staged — toolbar Post to create GRN.`);
    }
    stageAction({
      type: "receive-po",
      poNo,
      detail: `Stage receive PO ${poNo} → GRN on Post`,
    });
    toast(`PO ${poNo} staged — toolbar Post creates GRN.`);
    render();
  }

  function finalizeReceivePo(poNo) {
    const po = working.purchaseOrders.find((p) => p.poNo === poNo);
    if (!po) throw new Error(`PO ${poNo} not found`);
    if (!po.lines?.length) throw new Error("PO has no lines");
    const lines = [];
    for (const pl of po.lines) {
      const remain = Number(pl.qty) - qtyReceivedOnPoLine(poNo, pl.line);
      if (remain > 0) {
        lines.push({
          poLine: pl.line,
          sku: pl.sku,
          qtyOrdered: Number(pl.qty),
          qtyReceived: remain,
        });
      }
    }
    if (!lines.length) throw new Error(`PO ${poNo} already fully received`);
    const grnNo = nextGrnNo();
    working.goodsReceipts.push({
      grnNo,
      poNo,
      supplierId: po.supplierId,
      receivedDate: new Date().toLocaleDateString("en-GB"),
      receivedBy: role,
      status: "Posted",
      notes: `Goods received against PO ${poNo}`,
      lines: lines.map((l, i) => ({
        line: i + 1,
        poNo,
        poLine: l.poLine,
        sku: l.sku,
        qtyOrdered: l.qtyOrdered,
        qtyReceived: l.qtyReceived,
      })),
    });
    for (const l of lines) {
      const p = working.products.find((x) => x.sku === l.sku);
      if (p) p.onHand = Number(p.onHand) + Number(l.qtyReceived);
    }
    const fully = po.lines.every((pl) => qtyReceivedOnPoLine(poNo, pl.line) + 1e-9 >= Number(pl.qty));
    po.status = fully ? "Closed" : "Approved";
    return { grnNo, poNo };
  }

  function commitPostLocal() {
    const staged = clone(pending);
    const day = businessDay();
    const postedAt = isoNow();
    const summaries = [];
    const committed = [];

    const run = () => {
      for (const entry of staged) {
        const out = { ...entry, actor: role, day, postedAt, status: "posted" };
        if (entry.type === "accept-quote") {
          const r = finalizeAcceptQuote(entry.quoteNo);
          out.orderNo = r.soNo;
          out.customerId = r.customerId;
          out.detail = `Accept ${entry.quoteNo} → ${r.soNo}`;
          summaries.push(out.detail);
        } else if (entry.type === "receive-po") {
          const r = finalizeReceivePo(entry.poNo);
          out.grnNo = r.grnNo;
          out.poNo = r.poNo;
          out.detail = `Receive ${r.poNo} → ${r.grnNo}`;
          summaries.push(out.detail);
        } else if (entry.type === "post-shipment") {
          const r = finalizeShipment(entry.shipmentId);
          out.shipmentId = r.shipmentId;
          out.customerId = r.customerId || "";
          out.orderNo = (r.orderNos || [])[0] || "";
          out.detail = `Ship ${r.shipmentId} posted · DN ${r.deliveryNoteNo || r.shipmentId} · OH issued`;
          summaries.push(out.detail);
        } else if (entry.type === "unpost-shipment") {
          const r = finalizeUnpostShipment(entry.shipmentId);
          out.shipmentId = r.shipmentId;
          out.customerId = r.customerId || "";
          out.orderNo = (r.orderNos || [])[0] || "";
          out.detail = `Unpost ${r.shipmentId} · DN ${r.deliveryNoteNo || r.shipmentId} · OH restored`;
          summaries.push(out.detail);
        } else {
          summaries.push(entry.detail || entry.type);
        }
        committed.push(out);
      }
      if (!staged.length && isDirty()) {
        committed.push({
          id: `ACT-${Date.now()}-edits`,
          day,
          actor: role,
          type: "working-copy-edits",
          status: "posted",
          stagedAt: postedAt,
          postedAt,
          quoteNo: "",
          orderNo: "",
          poNo: "",
          grnNo: "",
          shipmentId: "",
          customerId: "",
          detail: `Working-copy field edits · ${countChanges()} Δ`,
        });
        summaries.push("Working-copy edits");
      }
    };

    if (!mutate(`Post ${staged.length || "edits"}`, run, { force: true })) return;

    actionRepo = committed.concat(actionRepo).slice(0, 500);
    persistActionRepo();
    pending = [];
    persistPending();
    posted = { at: Date.now(), data: clone(working), actions: committed };
    localStorage.setItem(POSTED_KEY, JSON.stringify(posted));
    log(`Posted ${committed.length} action(s)`, "post");
    toast(
      summaries.length
        ? `Posted ${committed.length}: ${summaries.slice(0, 3).join(" · ")}${summaries.length > 3 ? "…" : ""}`
        : "Posted journal (master remains sealed)."
    );
    render();
  }

  /** Prefer Spring /api/post; fall back to in-browser intake when offline/mock. */
  function commitPost() {
    if (!window.RushmoreServer || typeof RushmoreServer.post !== "function" || window.RushmoreMode !== "live") {
      commitPostLocal();
      return;
    }
    const payload = {
      actor: role,
      pending: clone(pending),
      workingCopy: clone(working),
    };
    RushmoreServer.post(payload)
      .then((res) => {
        if (!res || !res.ok || !res.data || !res.data.master) {
          toast((res && res.data && res.data.error) || "Spring Post failed — using local Post");
          commitPostLocal();
          return;
        }
        working = normalize(clone(res.data.master));
        const committed = res.data.actions || [];
        actionRepo = committed.concat(actionRepo).slice(0, 500);
        persistActionRepo();
        pending = [];
        persistPending();
        posted = { at: Date.now(), data: clone(working), actions: committed };
        localStorage.setItem(POSTED_KEY, JSON.stringify(posted));
        undoStack = [];
        redoStack = [];
        persist();
        log(`Posted ${committed.length} action(s) via Spring`, "post");
        toast(
          committed.length
            ? `Posted ${committed.length} via Spring: ${(committed[0].detail || committed[0].type || "").slice(0, 80)}`
            : "Posted to Spring."
        );
        render();
      })
      .catch((err) => {
        console.warn(err);
        toast("Spring Post unreachable — using local Post");
        commitPostLocal();
      });
  }

  /* —— other views —— */
  function renderQuotes() {
    const root = document.getElementById("quotesRoot");
    root.innerHTML = working.quotes
      .map((q, qi) => {
        const linked = orderForQuote(q.quoteNo);
        const staged = isStaged("accept-quote", "quoteNo", q.quoteNo);
        const live = isQuoteLive(q);
        const rem = quoteDaysRemaining(q);
        const until = quoteValidUntilDate(q);
        const canConfirm = !linked && ["Open", "Sent"].includes(q.status) && live && canEdit("quotes.status");
        const canAccept = !linked && !staged && q.status === "Confirmed" && live && canAdd("orders");
        const statusDisabled = !canEdit("quotes.status");
        const custDisabled = !canEdit("quotes.customerId");
        const dateDis = !canEdit("quotes.quotedDate");
        const daysDis = !canEdit("quotes.validDays");
        const methodDis = !canEdit("quotes.shipMethod");
        const viaDis = !canEdit("quotes.via");
        const lifeLabel = until
          ? (live ? `live ${rem}d · until ${formatGbDate(until)}` : `expired ${formatGbDate(until)}`)
          : "set quoted date";
        return `
        <article class="card">
          <div class="card-head">
            <h2 class="mono">${q.quoteNo}</h2>
            <span class="meta">${customerName(q.customerId)} · ${money(sumLines(q.lines, "price"))} · ${lifeLabel}${linked ? ` · SO ${linked.orderNo}` : ""}${staged ? " · staged" : ""}</span>
          </div>
          <div class="form-grid compact">
            <label>Status
              <select data-path="quotes.${qi}.status" ${statusDisabled ? "disabled" : ""}>
                ${QUOTE_STATUSES.map((s) => `<option value="${s}" ${q.status === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </label>
            <label>Customer
              <select data-path="quotes.${qi}.customerId" ${custDisabled ? "disabled" : ""}>
                ${working.customers.map((c) => `<option value="${c.id}" ${q.customerId === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
              </select>
            </label>
            <label>Quoted date
              <input data-path="quotes.${qi}.quotedDate" value="${q.quotedDate || ""}" ${dateDis ? "disabled" : ""} />
            </label>
            <label>Valid days
              <input type="number" min="1" data-path="quotes.${qi}.validDays" value="${q.validDays != null ? q.validDays : QUOTE_VALID_DAYS_DEFAULT}" ${daysDis ? "disabled" : ""} />
            </label>
            <label>Collect / ship (via)
              <select data-path="quotes.${qi}.shipMethod" ${methodDis ? "disabled" : ""}>
                ${SHIP_METHODS.map((s) => `<option value="${s}" ${q.shipMethod === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </label>
            <label>White-label via
              <select data-path="quotes.${qi}.via" ${viaDis || q.shipMethod === "COLLECT" ? "disabled" : ""}>
                ${providerOptions(q.via || "")}
              </select>
            </label>
          </div>
          <p class="note">Quotes stay live ${q.validDays || QUOTE_VALID_DAYS_DEFAULT} days — line price may change until Won. Inventory can look up Confirmed quotes before SO print.</p>
          <table class="data"><thead><tr><th>Line</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${q.lines.map((l, li) => {
            const skuDis = !canEdit("quotes.lines.sku");
            const qtyDis = !canEdit("quotes.lines.qty");
            const priceDis = !canEdit("quotes.lines.price") || q.status === "Won" || q.status === "Lost";
            return `<tr>
              <td>${l.line}</td>
              <td><input class="mono" value="${l.sku}" data-path="quotes.${qi}.lines.${li}.sku" ${skuDis ? "disabled" : ""} /></td>
              <td><input type="number" min="0" step="1" value="${l.qty}" data-path="quotes.${qi}.lines.${li}.qty" ${qtyDis ? "disabled" : ""} /></td>
              <td><input type="number" min="0" step="0.01" value="${l.price}" data-path="quotes.${qi}.lines.${li}.price" ${priceDis ? "disabled" : ""} /></td>
              <td>${money(l.qty * l.price)}</td>
            </tr>`;
          }).join("")}</tbody></table>
          <div class="card-actions">
            <button type="button" class="btn" data-action="confirm-quote" data-quote="${q.quoteNo}" ${canConfirm ? "" : "disabled"}>
              ${q.status === "Confirmed" ? "Confirmed" : "Confirm quote (14-day live)"}
            </button>
            <button type="button" class="btn btn-primary" data-action="accept-quote" data-quote="${q.quoteNo}" ${canAccept ? "" : "disabled"}>
              ${linked ? `Linked → ${linked.orderNo}` : staged ? "Staged — Post to create SO" : "Accept confirmed → SO (ready to print)"}
            </button>
          </div>
        </article>`;
      })
      .join("");
    bindPaths(root);
  }

  function renderOrders() {
    const root = document.getElementById("ordersRoot");
    root.innerHTML = working.orders
      .map((o, oi) => {
        const inv = working.invoices.find((i) => i.orderNo === o.orderNo);
        const statusDis = !canEdit("orders.status");
        const custDis = !canEdit("orders.customerId");
        const quoteDis = !canEdit("orders.quoteNo");
        const printDis = !canEdit("orders.readyToPrint");
        const methodDis = !canEdit("orders.shipMethod");
        const viaDis = !canEdit("orders.via");
        const payDis = !canEdit("orders.shipPaymentType");
        return `
        <article class="card">
          <div class="card-head">
            <h2 class="mono">${o.orderNo}</h2>
            <span class="meta">Sales Order · ${money(sumLines(o.lines, "price"))}${o.readyToPrint ? " · ready to print" : ""} · ${o.shipMethod || "—"}${o.via ? ` via ${o.via}` : ""}</span>
          </div>
          <div class="form-grid compact">
            <label>Status
              <select data-path="orders.${oi}.status" ${statusDis ? "disabled" : ""}>
                ${ORDER_STATUSES.map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </label>
            <label>Customer
              <select data-path="orders.${oi}.customerId" ${custDis ? "disabled" : ""}>
                ${working.customers.map((c) => `<option value="${c.id}" ${o.customerId === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
              </select>
            </label>
            <label>Quote No
              <input data-path="orders.${oi}.quoteNo" value="${o.quoteNo || ""}" ${quoteDis ? "disabled" : ""} />
            </label>
            <label>Ready to Print?
              <input type="checkbox" data-path="orders.${oi}.readyToPrint" ${o.readyToPrint ? "checked" : ""} ${printDis ? "disabled" : ""} />
            </label>
            <label>Collect / ship
              <select data-path="orders.${oi}.shipMethod" ${methodDis ? "disabled" : ""}>
                ${SHIP_METHODS.map((s) => `<option value="${s}" ${o.shipMethod === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </label>
            <label>Via (white-label agent)
              <select data-path="orders.${oi}.via" ${viaDis || o.shipMethod === "COLLECT" ? "disabled" : ""}>
                ${providerOptions(o.via || "")}
              </select>
            </label>
            <label>Ship payment
              <select data-path="orders.${oi}.shipPaymentType" ${payDis ? "disabled" : ""}>
                ${SHIP_PAYMENT_TYPES.map((s) => `<option value="${s}" ${o.shipPaymentType === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </label>
            <label>Invoice <span class="meta mono">${inv ? `${inv.invoiceNo} · ${inv.status}` : "—"}</span></label>
          </div>
          <p class="note">Fulfilment: ${o.shipMethod === "COLLECT" ? "Customer collect" : `Ship ${o.shipMethod || "—"}`}${o.via ? ` · procurement via ${providerName(o.via)}` : " · direct"}.</p>
          <table class="data"><thead><tr><th>Line</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${o.lines.map((l, li) => {
            const skuDis = !canEdit("orders.lines.sku");
            const qtyDis = !canEdit("orders.lines.qty");
            const priceDis = !canEdit("orders.lines.price");
            return `<tr>
              <td>${l.line}</td>
              <td><input class="mono" data-path="orders.${oi}.lines.${li}.sku" value="${l.sku}" ${skuDis ? "disabled" : ""} /></td>
              <td><input type="number" min="0" step="1" data-path="orders.${oi}.lines.${li}.qty" value="${l.qty}" ${qtyDis ? "disabled" : ""} /></td>
              <td><input type="number" min="0" step="0.01" data-path="orders.${oi}.lines.${li}.price" value="${l.price}" ${priceDis ? "disabled" : ""} /></td>
              <td>${money(l.qty * l.price)}</td>
            </tr>`;
          }).join("")}</tbody></table>
          <p class="note">Linking keys: <span class="mono">orderNo=${o.orderNo}</span>${o.quoteNo ? ` · <span class="mono">quoteNo=${o.quoteNo}</span>` : ""} · <span class="mono">customerId=${o.customerId}</span>${o.via ? ` · <span class="mono">via=${o.via}</span>` : ""}</p>
        </article>`;
      })
      .join("");
    bindPaths(root);
  }

  function renderProducts() {
    const root = document.getElementById("productsRoot");
    root.innerHTML = `
      <article class="card">
        <div class="card-actions" style="padding:0.55rem 0.55rem 0">
          <button type="button" class="btn btn-primary" data-action="add-product" ${canAdd("products") ? "" : "disabled"}>Add product</button>
        </div>
        <div class="table-wrap"><table class="data">
        <thead><tr><th>SKU</th><th>Description</th><th>OH</th><th>ROP</th><th>Lead</th><th>Cost</th><th>Sell</th><th>Flag</th></tr></thead>
        <tbody>${working.products
          .map((p, pi) => {
            const ohDis = !canEdit("products.onHand");
            const ropDis = !canEdit("products.reorderPoint");
            const leadDis = !canEdit("products.leadDays");
            const costDis = !canEdit("products.cost");
            const sellDis = !canEdit("products.sell");
            const descDis = !canEdit("products.description");
            return `<tr>
              <td class="mono">${p.sku}</td>
              <td><input type="text" value="${p.description}" data-path="products.${pi}.description" ${descDis ? "disabled" : ""} /></td>
              <td><input type="number" value="${p.onHand}" data-path="products.${pi}.onHand" ${ohDis ? "disabled" : ""} /></td>
              <td><input type="number" value="${p.reorderPoint}" data-path="products.${pi}.reorderPoint" ${ropDis ? "disabled" : ""} /></td>
              <td><input type="number" value="${p.leadDays}" data-path="products.${pi}.leadDays" ${leadDis ? "disabled" : ""} /></td>
              <td><input type="number" step="0.01" value="${p.cost}" data-path="products.${pi}.cost" ${costDis ? "disabled" : ""} /></td>
              <td><input type="number" step="0.01" value="${p.sell}" data-path="products.${pi}.sell" ${sellDis ? "disabled" : ""} /></td>
              <td>${p.onHand <= p.reorderPoint ? "REORDER" : "ok"}</td>
            </tr>`;
          })
          .join("")}</tbody>
      </table></div>
      <p class="note">OH also rises when a GRN is posted against a PO (Receipt Entry).</p>
      </article>`;
    bindPaths(root);
  }

  function nextCustomerId() {
    let max = 0;
    for (const c of working.customers) {
      const n = Number(String(c.id).replace(/^C/i, ""));
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
    return `C${String(max + 1).padStart(3, "0")}`;
  }

  function nextProductSku() {
    let max = 1000;
    for (const p of working.products) {
      const n = Number(String(p.sku).replace(/^P/i, ""));
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
    return `P${max + 1}`;
  }

  function addCustomer() {
    if (!canAdd("customers")) return toast("Role cannot add customers.");
    // live form — role checks follow
    const id = nextCustomerId();
    const fields = [];
    fields.push({
      key: "id",
      label: "Customer ID",
      type: "text",
      value: id,
      readonly: true,
      hint: "System key",
      system: true,
    });
    pushCreateField(fields, "customers", {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      fieldPath: "customers.name",
      value: "",
      placeholder: "Customer / contact name",
    });
    pushCreateField(fields, "customers", {
      key: "email",
      label: "Email",
      type: "email",
      fieldPath: "customers.email",
      value: "",
    });
    pushCreateField(fields, "customers", {
      key: "postcode",
      label: "Postcode",
      type: "text",
      fieldPath: "customers.postcode",
      value: "",
      placeholder: "UK postcode",
    });
    pushCreateField(fields, "customers", {
      key: "status",
      label: "Status",
      type: "select",
      fieldPath: "customers.status",
      value: "Active",
      options: CUSTOMER_STATUSES.map((s) => ({ value: s, label: s })),
    });

    openRecordDialog({
      title: "Add Customer",
      note: "Contact Management · editable fields follow your role. AR account key is created on Save.",
      fields,
      onSave(vals) {
        const name = String(vals.name || "").trim();
        if (!name) {
          toast("Name is required.");
          return false;
        }
        if (!mutate(`Add customer ${id}`, () => {
          working.customers.push({
            id,
            name,
            email: String(vals.email || "").trim(),
            postcode: String(vals.postcode || "").trim(),
            status: vals.status || "Active",
          });
          if (!working.accounts.some((a) => a.customerId === id)) {
            working.accounts.push({
              customerId: id,
              accountCode: `ACC-${id}`,
              creditLimit: 0,
              paymentTerms: "",
            });
          }
        })) return false;
        toast(`Customer ${id} saved to working copy.`);
        return true;
      },
    });
  }

  function addProduct() {
    if (!canAdd("products")) return toast("Role cannot add products.");
    // live form — role checks follow
    const skuDefault = nextProductSku();
    const fields = [];
    pushCreateField(fields, "products", {
      key: "sku",
      label: "SKU",
      type: "text",
      required: true,
      fieldPath: "products.sku",
      isKey: true,
      value: skuDefault,
      placeholder: "Product SKU",
    });
    pushCreateField(fields, "products", {
      key: "description",
      label: "Description",
      type: "text",
      required: true,
      fieldPath: "products.description",
      isKey: true,
      value: "",
    });
    pushCreateField(fields, "products", {
      key: "onHand",
      label: "On Hand",
      type: "number",
      fieldPath: "products.onHand",
      value: "",
      min: 0,
      step: 1,
    });
    pushCreateField(fields, "products", {
      key: "reorderPoint",
      label: "Reorder Point",
      type: "number",
      fieldPath: "products.reorderPoint",
      value: "",
      min: 0,
      step: 1,
    });
    pushCreateField(fields, "products", {
      key: "leadDays",
      label: "Lead Days",
      type: "number",
      fieldPath: "products.leadDays",
      value: "",
      min: 0,
      step: 1,
    });
    pushCreateField(fields, "products", {
      key: "cost",
      label: "Cost",
      type: "number",
      fieldPath: "products.cost",
      value: "",
      min: 0,
      step: 0.01,
    });
    pushCreateField(fields, "products", {
      key: "sell",
      label: "Sell",
      type: "number",
      fieldPath: "products.sell",
      value: "",
      min: 0,
      step: 0.01,
    });

    openRecordDialog({
      title: "Add Product",
      note: "Inventory master · only fields your role can edit are shown. Blank numbers stay 0.",
      fields,
      onSave(vals) {
        const sku = String(vals.sku || "").trim().toUpperCase();
        const description = String(vals.description || "").trim();
        if (!sku) {
          toast("SKU is required.");
          return false;
        }
        if (!description) {
          toast("Description is required.");
          return false;
        }
        if (working.products.some((p) => String(p.sku).toUpperCase() === sku)) {
          toast(`SKU ${sku} already exists.`);
          return false;
        }
        const num = (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? 0 : Number(v));
        if (!mutate(`Add product ${sku}`, () => {
          working.products.push({
            sku,
            description,
            onHand: num(vals.onHand),
            reorderPoint: num(vals.reorderPoint),
            leadDays: num(vals.leadDays),
            cost: num(vals.cost),
            sell: num(vals.sell),
          });
        })) return false;
        toast(`Product ${sku} saved to working copy.`);
        go("products");
        return true;
      },
    });
  }


  function renderCustomers() {
    const root = document.getElementById("customersRoot");
    const head = `<article class="card">
      <div class="card-head"><h2>Contact Management</h2>
        <span class="meta">Sales-owned · links quotes, orders, shipments, AR</span></div>
      <p class="note">Edit contact fields here. Follow-ups and calls live on <button type="button" class="linkish" data-view="shipment" data-open-ship-tab="followups">Shipment Entry</button>.</p>
      <div class="card-actions">
        <button type="button" class="btn btn-primary" data-action="add-customer" ${canAdd("customers") ? "" : "disabled"}>Add customer</button>
        <button type="button" class="btn" data-view="quotes">Quotes</button>
        <button type="button" class="btn" data-view="orders">Sales Orders</button>
        <button type="button" class="btn" data-view="invoices">AR Invoices</button>
      </div>
    </article>`;
    const cards = working.customers
      .map((c, ci) => {
        const nameDis = !canEdit("customers.name");
        const emailDis = !canEdit("customers.email");
        const pcDis = !canEdit("customers.postcode");
        const stDis = !canEdit("customers.status");
        const acct = working.accounts.find((a) => a.customerId === c.id);
        const quotes = working.quotes.filter((q) => q.customerId === c.id);
        const orders = working.orders.filter((o) => o.customerId === c.id);
        const ships = working.shipments.filter((s) => s.customerId === c.id);
        const invs = working.invoices.filter((inv) => orders.some((o) => o.orderNo === inv.orderNo));
        const linkRow = (label, items, openView, idKey) => {
          if (!items.length) return `<p class="note">${label}: none</p>`;
          return `<p class="note">${label}: ${items.map((it) => {
            const id = it[idKey];
            return `<button type="button" class="linkish" data-view="${openView}">${id}</button>`;
          }).join(" · ")}</p>`;
        };
        return `<article class="card">
          <div class="card-head"><h2 class="mono">${c.id}</h2><span class="meta">${c.status}${acct ? ` · ${acct.accountCode}` : ""}</span></div>
          <div class="form-grid compact">
            <label>Name <input type="text" value="${c.name}" data-path="customers.${ci}.name" ${nameDis ? "disabled" : ""} /></label>
            <label>Email <input type="email" value="${c.email}" data-path="customers.${ci}.email" ${emailDis ? "disabled" : ""} /></label>
            <label>Postcode <input type="text" value="${c.postcode}" data-path="customers.${ci}.postcode" ${pcDis ? "disabled" : ""} /></label>
            <label>Status
              <select data-path="customers.${ci}.status" ${stDis ? "disabled" : ""}>
                ${CUSTOMER_STATUSES.map((s) => `<option value="${s}" ${c.status === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </label>
          </div>
          ${acct ? `<p class="note">Account ${acct.accountCode} · credit ${money(acct.creditLimit)} · ${acct.paymentTerms}</p>` : `<p class="note">No AR account row yet.</p>`}
          ${linkRow("Quotes", quotes, "quotes", "quoteNo")}
          ${linkRow("Orders", orders, "orders", "orderNo")}
          ${linkRow("Shipments", ships, "shipment", "shipmentId")}
          ${linkRow("Invoices", invs, "invoices", "invoiceNo")}
        </article>`;
      })
      .join("");
    root.innerHTML = head + cards;
    bindPaths(root);
  }

  function renderInvoices() {
    const root = document.getElementById("invoicesRoot");
    if (!root) return;
    const rows = working.invoices.map((inv) => {
      const order = working.orders.find((o) => o.orderNo === inv.orderNo);
      const custId = order?.customerId || "";
      return `<tr>
        <td class="mono">${inv.invoiceNo}</td>
        <td class="mono"><button type="button" class="linkish" data-view="orders">${inv.orderNo}</button></td>
        <td class="mono"><button type="button" class="linkish" data-view="customers">${custId || "—"}</button></td>
        <td>${customerName(custId)}</td>
        <td>${inv.status}</td>
        <td>${money(inv.amount)}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="6">No invoices — accept a quote and Post to create a draft AR invoice.</td></tr>`;
    root.innerHTML = `
      <article class="card">
        <div class="card-head"><h2>Accounts Receivable</h2><span class="meta">${working.invoices.length} invoices</span></div>
        <p class="note">Invoices are created when a quote is accepted and posted. Contact fields live under Contact Management.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Invoice</th><th>Order</th><th>Customer</th><th>Name</th><th>Status</th><th>Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        <div class="card-actions">
          <button type="button" class="btn" data-view="customers">Contact Management</button>
          <button type="button" class="btn" data-view="orders">Sales Orders</button>
          <button type="button" class="btn" data-view="quotes">Quotes</button>
        </div>
      </article>`;
  }

  function renderReceipt() {
    const root = document.getElementById("receiptRoot");
    const openPos = working.purchaseOrders.filter((po) => po.status !== "Closed" && po.lines?.length);
    const poCards = (openPos.length ? openPos : working.purchaseOrders).map((po) => {
      const rows = po.lines.map((pl) => {
        const recv = qtyReceivedOnPoLine(po.poNo, pl.line);
        const remain = Math.max(0, Number(pl.qty) - recv);
        return `<tr><td>${pl.line}</td><td class="mono">${pl.sku}</td><td>${pl.qty}</td><td>${recv}</td><td>${remain}</td></tr>`;
      }).join("");
      const stagedRecv = isStaged("receive-po", "poNo", po.poNo);
      const canRecv = !stagedRecv && canAdd("goodsReceipts") && po.lines.some((pl) => Number(pl.qty) - qtyReceivedOnPoLine(po.poNo, pl.line) > 0);
      return `<article class="card">
        <div class="card-head"><h2 class="mono">PO ${po.poNo}</h2><span class="meta">${supplierName(po.supplierId)} · ${po.status}${stagedRecv ? " · staged" : ""}</span></div>
        <table class="data"><thead><tr><th>Line</th><th>SKU</th><th>Ordered</th><th>Received</th><th>Remain</th></tr></thead><tbody>${rows}</tbody></table>
        <div class="card-actions">
          <button type="button" class="btn btn-primary" data-action="receive-po" data-po="${po.poNo}" ${canRecv ? "" : "disabled"}>${stagedRecv ? "Staged — Post to create GRN" : "Receive remaining → GRN"}</button>
          <button type="button" class="btn" data-open-po="${po.poNo}">Open PO</button>
        </div>
      </article>`;
    }).join("");

    const grns = working.goodsReceipts.length
      ? working.goodsReceipts.map((g) => `
        <article class="card">
          <div class="card-head"><h2 class="mono">${g.grnNo}</h2><span class="meta">PO ${g.poNo} · ${g.status} · ${g.receivedDate} · ${g.receivedBy || ""}</span></div>
          <table class="data"><thead><tr><th>Line</th><th>PO line</th><th>SKU</th><th>Ordered</th><th>Received</th></tr></thead>
          <tbody>${g.lines.map((l) => `<tr><td>${l.line}</td><td>${l.poLine}</td><td class="mono">${l.sku}</td><td>${l.qtyOrdered}</td><td>${l.qtyReceived}</td></tr>`).join("")}</tbody></table>
          <p class="note">Linking keys: <span class="mono">grnNo=${g.grnNo}</span> · <span class="mono">poNo=${g.poNo}</span> · lines → Product.onHand</p>
        </article>`).join("")
      : `<article class="card"><p class="note">No GRNs yet. Receive against an open PO (Purchasing/Inventory/Manager).</p></article>`;

    root.innerHTML = `
      <article class="card"><div class="card-head"><h2>Receive goods</h2></div>
        <p class="note">Stages a GRN receive. Toolbar <strong>Post</strong> creates the GRN number, updates lines / on-hand, and writes the daily action repository.</p>
      </article>
      ${poCards}
      <article class="card"><div class="card-head"><h2>Posted GRNs</h2></div></article>
      ${grns}`;
  }

  function renderIntake() {
    const soLinks = working.orders
      .map((o) => {
        const inv = working.invoices.find((i) => i.orderNo === o.orderNo);
        return `<tr>
          <td class="mono">${o.quoteNo || "—"}</td>
          <td class="mono">${o.orderNo}</td>
          <td class="mono">${o.customerId}</td>
          <td class="mono">${inv ? inv.invoiceNo : "—"}</td>
          <td>${o.status}</td>
        </tr>`;
      })
      .join("");
    const grnLinks = working.goodsReceipts
      .map((g) => `<tr>
        <td class="mono">${g.poNo}</td>
        <td class="mono">${g.grnNo}</td>
        <td class="mono">${g.supplierId}</td>
        <td>${g.lines.map((l) => l.sku).join(", ")}</td>
        <td>${g.status}</td>
      </tr>`)
      .join("") || `<tr><td colspan="5">No GRNs posted yet</td></tr>`;

    document.getElementById("intakeRoot").innerHTML = `
      <article class="card">
        <div class="card-head"><h2>Sales intake</h2></div>
        <ol class="intake-steps">
          <li><strong>Customer quote received</strong> — edit Quote / QuoteLines (Sales role).</li>
          <li><strong>Accept quote</strong> — stages until toolbar <strong>Post</strong> (then <span class="mono">SO-…</span>).</li>
          <li><strong>On Post</strong> — Quote.status → Won · Order + OrderLines · draft Invoice · action repo row for Role/day.</li>
        </ol>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Quote</th><th>Sales Order #</th><th>Customer</th><th>Invoice</th><th>Status</th></tr></thead>
          <tbody>${soLinks}</tbody>
        </table></div>
      </article>
      <article class="card">
        <div class="card-head"><h2>Purchase intake</h2></div>
        <ol class="intake-steps">
          <li><strong>Raise / approve PO</strong> — Purchasing edits PurchaseOrder + PoLines.</li>
          <li><strong>Goods received</strong> — Receipt Entry stages receive until toolbar <strong>Post</strong>.</li>
          <li><strong>On Post</strong> — GRN + GrnLine · Product.onHand += qty · PO closes when fully received · action repo.</li>
        </ol>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>PO</th><th>GRN #</th><th>Supplier</th><th>SKUs</th><th>Status</th></tr></thead>
          <tbody>${grnLinks}</tbody>
        </table></div>
      </article>
      <article class="card">
        <div class="card-head"><h2>Linking keys (end-to-end)</h2></div>
        <p class="note"><span class="mono">Customer.id</span> ← Quote/Order.customerId</p>
        <p class="note"><span class="mono">Quote.quoteNo</span> ←→ <span class="mono">Order.quoteNo</span> (1:1 when set)</p>
        <p class="note"><span class="mono">Order.orderNo</span> = Sales Order number ← Invoice.orderNo · OrderLine.orderNo</p>
        <p class="note"><span class="mono">PurchaseOrder.poNo</span> ← GoodsReceipt.poNo · PoLine.poNo · GrnLine.poNo</p>
        <p class="note"><span class="mono">GoodsReceipt.grnNo</span> = GRN number ← GrnLine.grnNo → Product.sku (OH)</p>
        <p class="note"><span class="mono">Shipment.shipmentId</span> · ship Post stages · toolbar Post issues OH · action repo (no Activity UI)</p>
        <div class="card-actions">
          <button type="button" class="btn" data-view="quotes">Quotes</button>
          <button type="button" class="btn" data-view="orders">Sales Orders</button>
          <button type="button" class="btn" data-view="receipt">Receipt / GRN</button>
          <button type="button" class="btn" data-view="relations">Relations</button>
        </div>
      </article>`;
  }

  function renderRelations() {
    document.getElementById("relationsRoot").innerHTML = `
      <article class="card"><div class="card-head"><h2>Cardinalities</h2></div>
        <p class="note"><strong>1:1</strong> Customer↔Account · Order↔Invoice · Quote↔Order (when accepted)</p>
        <p class="note"><strong>1:N</strong> Supplier→PO→Lines · PO→GRN · Customer→Quotes/Orders</p>
        <p class="note"><strong>M:N</strong> Product↔Supplier · Product↔Tag · PO/SO/GRN↔Product via lines</p>
        <p class="note"><button type="button" class="btn" data-view="intake">Open intake map</button></p>
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

  function fulfilmentNote(job) {
    if (!job) return "";
    const c = job.criteria || {};
    const bits = [];
    if (c.poNo) bits.push(`PO ${c.poNo}`);
    if (c.orderNo) bits.push(`SO ${c.orderNo}`);
    if (c.quoteNo) bits.push(`Quote ${c.quoteNo}`);
    if (c.shipmentId) bits.push(`Ship ${c.shipmentId}`);
    if (c.sku) bits.push(`SKU ${c.sku}`);
    const roles = (job.allowedRoles || []).join(", ");
    const roleBit = roles ? `roles: ${roles}` : "any dept role";
    return bits.length
      ? `<span class="note">${bits.join(" · ")} · ${roleBit}</span>`
      : `<span class="note">${roleBit}</span>`;
  }

  function jobLinkButtons(job) {
    if (!job || !job.link) return "";
    const lnk = job.link;
    const attrs = [`data-view="${lnk.view}"`];
    if (lnk.shipmentId) attrs.push(`data-open-ship-id="${lnk.shipmentId}"`);
    if (lnk.poNo) attrs.push(`data-open-po-no="${lnk.poNo}"`);
    return `<button type="button" class="btn btn-primary" ${attrs.join(" ")}>${lnk.label}</button>`;
  }

  function renderWorkload() {
    const root = document.getElementById("workloadRoot");
    const head = document.getElementById("workloadHeadActions");
    if (!root) return;
    if (!workload) {
      root.innerHTML = `<article class="card"><p class="note">Loading workload from server…</p></article>`;
      if (head) head.innerHTML = "";
      refreshWorkloadFromServer().then(() => {
        if (view === "workload") renderWorkload();
        syncAccountChrome();
      });
      return;
    }
    const emp = workload.session && workload.session.employee;
    const clocked = workload.session && workload.session.clockedIn;
    const summary = workload.departmentPool && workload.departmentPool.summary;
    const assigned = workload.assigned || [];
    const eligible = (workload.departmentPool && workload.departmentPool.eligible) || [];
    const blocked = (workload.departmentPool && workload.departmentPool.blocked) || [];
    const rules = workload.scrumRules || {};

    if (head) {
      head.innerHTML = `
        <button type="button" class="btn" data-action="wl-refresh">Refresh</button>
        <button type="button" class="btn ${clocked ? "" : "btn-primary"}" data-action="wl-clock" data-clock="${clocked ? "out" : "in"}">${clocked ? "Clock out" : "Clock in"}</button>
        <button type="button" class="btn" data-view="projects">Projects / Scrum</button>`;
    }

    const assignedHtml = assigned.length
      ? assigned
          .map((row) => {
            const job = row.job || {};
            return `<tr>
              <td class="mono">${job.id || row.jobId}</td>
              <td>${job.title || "—"}<div>${fulfilmentNote(job)}</div></td>
              <td>${row.status}</td>
              <td class="card-actions">${jobLinkButtons(job)}
                <button type="button" class="btn" data-action="wl-book" data-job="${job.id}">Book 0.25h</button>
              </td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="4">No personal assignments — clock in and pull from the department pool.</td></tr>`;

    const eligibleHtml = eligible.length
      ? eligible
          .map((row) => {
            const job = row.job || {};
            return `<tr>
              <td class="mono">${job.id || row.jobId}</td>
              <td>${job.title || "—"}<div>${fulfilmentNote(job)}</div></td>
              <td>${row.departmentName || ""}</td>
              <td><button type="button" class="btn btn-primary" data-action="wl-pull" data-pool="${row.id}">Pull job</button> ${jobLinkButtons(job)}</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="4">No eligible pool jobs for your role right now — clock in to start your shift.</td></tr>`;

    const blockedHtml = blocked.length
      ? `<article class="card"><div class="card-head"><h2>Queued but not pullable</h2></div>
          <ul class="note-list">${blocked
            .map((b) => `<li><span class="mono">${(b.job && b.job.id) || b.jobId}</span> — ${b.reason}</li>`)
            .join("")}</ul></article>`
      : "";

    const onPeople = ((summary && summary.loggedOn) || [])
      .map((p) => `${p.name}`)
      .join(", ") || "—";

    root.innerHTML = `
      <article class="card">
        <div class="card-head"><h2>Server session</h2></div>
        <p class="note"><strong>${(emp && emp.name) || "—"}</strong> · <span class="mono">${(emp && emp.id) || "—"}</span> · ${(emp && emp.title) || ""} · ${role}</p>
        <p class="note">${clocked ? "Clocked in (shift started)" : "Clocked out"} · role <strong>${(emp && emp.role) || role}</strong> · approach <strong>${workload.approach || "pull"}</strong> · logged on in dept: ${onPeople}</p>
        <p class="note">${rules.note || ""}</p>
      </article>
      <article class="card">
        <div class="card-head"><h2>Assigned to me</h2></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Job</th><th>Fulfilment</th><th>Status</th><th>Links</th></tr></thead>
          <tbody>${assignedHtml}</tbody>
        </table></div>
      </article>
      <article class="card">
        <div class="card-head"><h2>Department work pool · ${(summary && summary.departmentName) || "—"}</h2></div>
        <p class="note">Queued ${summary ? summary.queued : 0} · eligible for your role ${summary ? summary.eligible : 0}${summary && summary.wipLimit ? ` · WIP ${summary.wip}/${summary.wipLimit}` : ""}. Clock in, then pull PO/SO fulfilment work from the pool.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Job</th><th>Fulfilment</th><th>Dept</th><th>Actions</th></tr></thead>
          <tbody>${eligibleHtml}</tbody>
        </table></div>
      </article>
      ${blockedHtml}`;
  }

  function renderProjects() {
    const root = document.getElementById("projectsRoot");
    if (!root) return;
    if (!projectsPayload) {
      root.innerHTML = `<article class="card"><p class="note">Loading projects from server…</p></article>`;
      refreshProjectsFromServer().then(() => {
        if (view === "projects") renderProjects();
      });
      return;
    }
    const rules = projectsPayload.scrumRules || {};
    const daily = projectsPayload.dailyScrum || {};
    const projects = projectsPayload.projects || [];

    root.innerHTML = `
      <article class="card">
        <div class="card-head"><h2>Daily scrum rules</h2></div>
        <p class="note">${rules.note || ""}</p>
        <p class="note">Stand-up ${rules.dailyScrumMinutes || 15} min · builds toward <strong>${rules.buildsToward || "milestones"}</strong> · pull requires clock-in=${!!rules.pullRequiresClockedIn}${rules.wipLimit ? ` · WIP limit ${rules.wipLimit}` : ""} · gated by <strong>role</strong> (no skills matrix)</p>
        <p class="note"><strong>${daily.date || ""}</strong> · project <span class="mono">${daily.projectId || ""}</span></p>
        <ul class="note-list">${(daily.agenda || []).map((a) => `<li>${a}</li>`).join("")}</ul>
        <p class="note">${daily.notes || ""}</p>
        <div class="card-actions">
          <button type="button" class="btn" data-action="wl-refresh">Refresh server</button>
          <button type="button" class="btn btn-primary" data-view="workload">Open my workload</button>
        </div>
      </article>
      ${projects
        .map((p) => {
          const ms = (p.milestones || [])
            .map(
              (m) =>
                `<tr><td class="mono">${m.id}</td><td>${m.name}</td><td>${m.dueDate}</td><td>${m.status}</td></tr>`
            )
            .join("");
          const jobs = (p.jobs || [])
            .map((j) => `<tr><td class="mono">${j.id}</td><td>${j.title}</td><td>${j.status}</td><td>${jobLinkButtons(j)}</td></tr>`)
            .join("");
          return `<article class="card">
            <div class="card-head"><h2>${p.name}</h2></div>
            <p class="note">Goal: ${p.goal}</p>
            <p class="note">PM: ${(p.projectManager && p.projectManager.name) || "—"} · Scrum master: ${(p.scrumMaster && p.scrumMaster.name) || "—"}</p>
            <p class="note">Approach: <strong>${p.approach}</strong>
              <button type="button" class="btn" data-action="prj-approach" data-project="${p.id}" data-approach="pull">Set pull</button>
              <button type="button" class="btn" data-action="prj-approach" data-project="${p.id}" data-approach="assign">Set assign</button>
            </p>
            <h3 class="subhead">Milestones</h3>
            <div class="table-wrap"><table class="data"><thead><tr><th>ID</th><th>Milestone</th><th>Due</th><th>Status</th></tr></thead><tbody>${ms}</tbody></table></div>
            <h3 class="subhead">Jobs feeding the pools</h3>
            <div class="table-wrap"><table class="data"><thead><tr><th>Job</th><th>Title</th><th>Status</th><th>Link</th></tr></thead><tbody>${jobs}</tbody></table></div>
          </article>`;
        })
        .join("")}`;
  }

  function render() {
    renderChrome();
    renderAddFromOrderPanel();
    renderRecordDialog();
    updatePill();
    syncButtons();
    if (view === "hub") renderHub();
    if (view === "po-entry") renderPoEntry();
    if (view === "shipment") renderShipment();
    if (view === "purchasing") renderPoList();
    if (view === "quotes") renderQuotes();
    if (view === "orders") renderOrders();
    if (view === "products") renderProducts();
    if (view === "customers") renderCustomers();
    if (view === "invoices") renderInvoices();
    if (view === "receipt") renderReceipt();
    if (view === "intake") renderIntake();
    if (view === "relations") renderRelations();
    if (view === "fields") renderFields();
    if (view === "workload") renderWorkload();
    if (view === "projects") renderProjects();
  }

  function boot() {
    document.getElementById("btnPost").onclick = () => commitPost();
    const btnUpdate = document.getElementById("btnUpdate");
    if (btnUpdate) btnUpdate.onclick = () => updateFromServer();
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
    const btnReverse = document.getElementById("btnReverse") || document.getElementById("btnDiscard");
    if (btnReverse) btnReverse.onclick = () => reverseToPosted();

    function jumpForRole(nextRole) {
      const roleHub = {
        Viewer: "home",
        Sales: "sales",
        Inventory: "inventory",
        Finance: "sales",
        Purchasing: "purchasing",
        Shipping: "shipping",
        Manager: "home",
        Admin: "home",
      };
      hub = roleHub[nextRole] || "home";
      localStorage.setItem(HUB_KEY, hub);
      dashTab = "role";
      localStorage.setItem("rushmore-dash-tab-v1", dashTab);
      dashQuery = "";
      showView("hub");
      closeMobileNav();
      closeToolbarMore();
    }

    document.getElementById("roleSelect").onchange = async (e) => {
      const nextRole = e.target.value;
      const matched = operatorForRole(nextRole);
      try {
        if (matched && matched.role === nextRole) {
          await loginViaServer(matched.id);
        } else {
          role = nextRole;
          localStorage.setItem(ROLE_KEY, role);
          await refreshSessionFromServer();
          await refreshWorkloadFromServer();
        }
        jumpForRole(role);
        const op = currentEmployee() || { name: role, id: "—", username: role };
        log(`Role → ${role} · server session ${op.username}`, "mode");
        toast(`Server · ${op.name} (${op.id}) · Role → ${role}`);
        render();
      } catch (err) {
        toast(err.message || "Session update failed");
        render();
      }
    };

    document.getElementById("operatorSelect").onchange = async (e) => {
      try {
        await loginViaServer(e.target.value);
        jumpForRole(role);
        const op = currentEmployee();
        log(`Server login → ${op.username} (${op.id})`, "mode");
        toast(`Server signed in · ${op.name} · ${op.id}`);
        render();
      } catch (err) {
        toast(err.message || "Login failed");
        render();
      }
    };

    document.getElementById("btnAccount").onclick = () => {
      const app = document.getElementById("app");
      const isMobile = window.matchMedia("(max-width: 960px)").matches;
      if (isMobile) {
        const open = app.classList.contains("is-shortcuts-open");
        if (open) closeMobileNav();
        else openMobileNav("shortcuts");
      } else {
        go("workload");
      }
    };

    // Dismiss ⋯ menu as soon as the user taps/clicks elsewhere.
    document.addEventListener(
      "pointerdown",
      (e) => {
        const open = document.querySelector("details.toolbar-more[open]");
        if (!open) return;
        if (open.contains(e.target)) return;
        open.open = false;
      },
      true
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (recordDialog) {
          e.preventDefault();
          return closeRecordDialog();
        }
        closeToolbarMore();
      }
    });
    document.querySelectorAll(".toolbar-more-body .btn, .toolbar-more-body button").forEach((btn) => {
      btn.addEventListener("click", () => closeToolbarMore());
    });
    // Also close after native toggle if focus moves away (iOS Safari).
    document.querySelectorAll("details.toolbar-more").forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        // Ensure only one toolbar-more is open at a time.
        document.querySelectorAll("details.toolbar-more[open]").forEach((other) => {
          if (other !== d) other.open = false;
        });
      });
    });

    document.getElementById("treeSearch").oninput = () => renderChrome();

    document.getElementById("btnModules").onclick = () => {
      const open = document.getElementById("app").classList.contains("is-modules-open");
      if (open) closeMobileNav();
      else openMobileNav("modules");
    };
    document.getElementById("btnShortcuts").onclick = () => {
      const open = document.getElementById("app").classList.contains("is-shortcuts-open");
      if (open) closeMobileNav();
      else openMobileNav("shortcuts");
    };
    document.getElementById("btnAccountMobile").onclick = () => {
      const open = document.getElementById("app").classList.contains("is-shortcuts-open");
      if (open) closeMobileNav();
      else openMobileNav("shortcuts");
    };
    document.getElementById("navBackdrop").onclick = () => closeMobileNav();
    document.querySelectorAll("[data-close-nav]").forEach((btn) => {
      btn.onclick = () => closeMobileNav();
    });
    document.getElementById("dockMore").onclick = () => openMobileNav("shortcuts");
    document.getElementById("dockHub").onclick = () => {
      showView("hub");
      closeMobileNav();
      render();
    };

    document.getElementById("app").addEventListener("click", (e) => {
      if (e.target.closest("[data-close-nav]")) return closeMobileNav();

      const filterBtn = e.target.closest("[data-tree-filter]");
      if (filterBtn) {
        treeFilter = filterBtn.dataset.treeFilter;
        localStorage.setItem("rushmore-tree-filter-v1", treeFilter);
        return render();
      }

      const sectionHead = e.target.closest("#view-shipment .po-section-head");
      if (sectionHead) {
        const section = sectionHead.closest(".po-section");
        if (section && !section.querySelector(".ship-detail-layout")) {
          section.classList.toggle("is-open");
          return;
        }
      }

      const goBtn = e.target.closest("[data-go]");
      if (goBtn) return go(goBtn.dataset.go);

      const dashTabBtn = e.target.closest("[data-dash-tab]");
      if (dashTabBtn) {
        dashTab = dashTabBtn.dataset.dashTab;
        localStorage.setItem("rushmore-dash-tab-v1", dashTab);
        return render();
      }

      const hubBtn = e.target.closest("[data-hub]");
      if (hubBtn) return setHub(hubBtn.dataset.hub);

      // Actions before data-view: sections also carry data-view and would steal clicks.
      const actionEl = e.target.closest("[data-action]");
      const action = actionEl?.dataset.action;

      if (action === "new-shipment") return addShipment();
      if (action === "save-shipment") return toast("Shipment fields save to working copy on change.");
      if (action === "open-shipment") return toast("Use the Shipment picker to open another ID.");
      if (action === "next-ship-id") return addShipment();
      if (action === "prev-shipment" || action === "next-shipment") {
        const list = working.shipments;
        const i = list.findIndex((s) => s.shipmentId === shipId);
        const n = action === "next-shipment" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        shipId = list[n].shipmentId;
        return render();
      }
      if (action === "delete-shipment") {
        if (!canAdd("shipments")) return toast("Role cannot delete shipments.");
        if (working.shipments.length <= 1) return toast("Keep at least one shipment.");
        if (!mutate(`Delete shipment ${shipId}`, () => {
          working.shipments = working.shipments.filter((s) => s.shipmentId !== shipId);
        })) return;
        shipId = working.shipments[0].shipmentId;
        toast("Shipment deleted.");
        return render();
      }
      if (action === "reload-shipment") {
        const m = normalize(clone(MASTER)).shipments.find((s) => s.shipmentId === shipId);
        if (!m) return toast("Not on master — discard or keep working copy.");
        if (!mutate(`Reload shipment ${shipId}`, () => {
          const i = working.shipments.findIndex((s) => s.shipmentId === shipId);
          if (i >= 0) working.shipments[i] = clone(m);
        })) return;
        toast("Reloaded from master snapshot.");
        return render();
      }
      if (action === "print-shipment") return issueDeliveryNote();
      if (action === "email-shipment") {
        const ship = currentShipment();
        if (!ship) return;
        const to = ship.shippingContact || ship.arContact || working.customers.find((c) => c.id === ship.customerId)?.email || "";
        const dn = ship.deliveryNoteNo || (ship.deliveryNoteIssued ? `DN-${ship.shipmentId}` : "packing slip");
        return toast(to ? `Email ${dn} ${ship.shipmentId} → ${to}` : `Set Shipping Contact on ${ship.shipmentId} first (Contact Management).`);
      }
      if (action === "ship-memos") { shipTab = "lines"; toast("Memos shown under shipment notes / tree."); return render(); }
      if (action === "ship-close-view") return setHub("shipping");
      if (action === "ship-lookup") return toast("Use the Customer ID dropdown — Contact Management owns the master list.");
      if (action === "ship-add-from-order") return openAddFromOrder();
      if (action === "afo-close") return closeAddFromOrder();
      if (action === "afo-lookup") return lookupAddFromOrder();
      if (action === "afo-commit") return commitAddFromOrder();
      if (action === "rec-close") return closeRecordDialog();
      if (action === "rec-save") return saveRecordDialog();
      if (action === "ship-add-line") {
        if (!canAdd("shipmentLines")) return toast("Role cannot add lines.");
        const ship = currentShipment();
        if (!mutate(`Add blank line ${ship.shipmentId}`, () => {
          const line = (ship.lines.reduce((m, l) => Math.max(m, l.line), 0) || 0) + 1;
          ship.lines.push({ line, sku: working.products[0]?.sku || "", revision: "", warehouseBin: "", deliveryQty: 0, openQty: 0, jobQtyShipped: 0, qtyShipped: 0, shipComplete: false, invoiceComplete: false, deliveryDate: ship.shipDate, jobId: "", orderNo: "", marked: true });
        })) return;
        return render();
      }
      if (action === "ship-delete-lines") {
        const ship = currentShipment();
        if (!mutate(`Delete marked lines ${ship.shipmentId}`, () => {
          ship.lines = ship.lines.filter((l) => !l.marked);
        })) return;
        return render();
      }
      if (action === "ship-mark-all" || action === "ship-unmark-all") {
        const ship = currentShipment();
        const on = action === "ship-mark-all";
        if (!mutate(`${on ? "Mark" : "Unmark"} all ${ship.shipmentId}`, () => {
          for (const l of ship.lines) l.marked = on;
        })) return;
        return render();
      }
      if (action === "ship-post") return postShipment();
      if (action === "ship-unpost") return unpostShipment();
      if (action === "ship-issue-dn") return issueDeliveryNote();
      if (action === "open-order") {
        const orderNo = actionEl.dataset.order;
        if (!orderNo) return toast("No Order ID on line.");
        go("orders");
        toast(`Sales Order ${orderNo}`);
        return;
      }
      if (action === "ship-new-followups" || action === "ship-new-calls") {
        const kind = action.endsWith("calls") ? "calls" : "followups";
        const ship = currentShipment();
        // live form — role checks follow
        openRecordDialog({
          title: kind === "calls" ? "New Call" : "New Follow-up",
          note: `Shipment ${ship.shipmentId} · working copy`,
          fields: [
            { key: "subject", label: "Subject", type: "text", required: true, value: "" },
            { key: "text", label: "Notes", type: "textarea", value: "" },
          ],
          onSave(vals) {
            const subject = String(vals.subject || "").trim();
            if (!subject) {
              toast("Subject is required.");
              return false;
            }
            if (!mutate(`New ${kind} on ${ship.shipmentId}`, () => {
              ship[kind].push({
                id: (ship[kind].length || 0) + 1,
                text: String(vals.text || "").trim() || subject,
                subject,
              });
            })) return false;
            shipTab = kind;
            toast(`Saved ${kind.slice(0, -1)}.`);
            return true;
          },
        });
        return;
      }
      if (action === "focus-ship-field") {
        const fieldName = actionEl.dataset.field;
        const el = document.querySelector(`[data-path$=".${fieldName}"]`);
        if (el) { el.focus(); el.classList.add("is-hot-field"); setTimeout(() => el.classList.remove("is-hot-field"), 1200); }
        return;
      }

      if (action === "new-po") return addPo();
      if (action === "confirm-quote") return confirmQuote(actionEl.dataset.quote);
      if (action === "accept-quote") return acceptQuote(actionEl.dataset.quote);
      if (action === "receive-po") return receivePo(actionEl.dataset.po);
      if (action === "wl-refresh") {
        Promise.all([refreshSessionFromServer(), refreshWorkloadFromServer(), refreshProjectsFromServer()]).then(() => {
          toast("Refreshed from server");
          render();
        });
        return;
      }
      if (action === "wl-clock") {
        const clockAction = actionEl.dataset.clock || "in";
        RushmoreServer.clock(clockAction).then(async (res) => {
          if (!res.ok) return toast((res.data && res.data.error) || "Clock failed");
          workload = res.data;
          if (workload.session) session = workload.session;
          toast(clockAction === "in" ? "Clocked in — department pool updated" : "Clocked out");
          render();
        });
        return;
      }
      if (action === "wl-pull") {
        RushmoreServer.pullJob(actionEl.dataset.pool).then(async (res) => {
          if (!res.ok) return toast((res.data && res.data.error) || "Pull failed");
          workload = res.data;
          if (workload.session) session = workload.session;
          toast("Pulled job from department pool");
          render();
        });
        return;
      }
      if (action === "wl-book") {
        RushmoreServer.clock("book", actionEl.dataset.job, 0.25, "Progress from My Workload").then(async (res) => {
          if (!res.ok) return toast((res.data && res.data.error) || "Time booking failed");
          workload = res.data;
          if (workload.session) session = workload.session;
          toast("Time card updated · job progress refreshed");
          render();
        });
        return;
      }
      if (action === "prj-approach") {
        RushmoreServer.setApproach(actionEl.dataset.project, actionEl.dataset.approach).then(async (res) => {
          if (!res.ok) return toast((res.data && res.data.error) || "Cannot set approach");
          projectsPayload = res.data;
          await refreshWorkloadFromServer();
          toast(`Approach → ${actionEl.dataset.approach}`);
          render();
        });
        return;
      }
      if (action === "save-po") return toast("Fields save to working copy on change.");
      if (action === "print-po") {
        const po = currentPo();
        if (!po) return;
        return toast(`Print PO ${po.poNo} · ${supplierName(po.supplierId)} · ${money(sumLines(po.lines, "unitCost"))}`);
      }
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

      if (action === "add-customer") return addCustomer();
      if (action === "add-product") return addProduct();
      if (action === "po-new-followups" || action === "po-new-calls") {
        const kind = action.endsWith("calls") ? "calls" : "followups";
        const po = currentPo();
        if (!po) return;
        // live form — role checks follow
        openRecordDialog({
          title: kind === "calls" ? "New Call" : "New Follow-up",
          note: `PO ${po.poNo} · working copy`,
          fields: [
            { key: "subject", label: "Subject", type: "text", required: true, value: "" },
            { key: "text", label: "Notes", type: "textarea", value: "" },
          ],
          onSave(vals) {
            const subject = String(vals.subject || "").trim();
            if (!subject) {
              toast("Subject is required.");
              return false;
            }
            if (!mutate(`New ${kind} on PO ${po.poNo}`, () => {
              if (!Array.isArray(po[kind])) po[kind] = [];
              po[kind].push({
                id: (po[kind].length || 0) + 1,
                text: String(vals.text || "").trim() || subject,
                subject,
              });
            })) return false;
            poTab = kind;
            toast(`Saved ${kind.slice(0, -1)}.`);
            return true;
          },
        });
        return;
      }

      const viewBtn = e.target.closest("button[data-view], .hub-link[data-view], .tree-leaf[data-view], .account-task-link[data-view]");
      if (viewBtn) {
        if (viewBtn.dataset.openShipTab) {
          shipTab = viewBtn.dataset.openShipTab;
          const kind = shipTab;
          const cur = working.shipments.find((s) => s.shipmentId === shipId);
          if (!cur || !(cur[kind] || []).length) {
            const withItems = working.shipments.find((s) => (s[kind] || []).length);
            if (withItems) shipId = withItems.shipmentId;
          }
        }
        if (viewBtn.dataset.openPoTab) poTab = viewBtn.dataset.openPoTab;
        if (viewBtn.dataset.openShipId) {
          shipId = viewBtn.dataset.openShipId;
          shipTab = "lines";
        }
        if (viewBtn.dataset.openPoNo) {
          poNo = viewBtn.dataset.openPoNo;
        }
        return go(viewBtn.dataset.view);
      }

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

      const shipTabBtn = e.target.closest("[data-ship-tab]");
      if (shipTabBtn) {
        shipTab = shipTabBtn.dataset.shipTab;
        return render();
      }
    });

    /* Land on Sales Order Management hub (matches M1 screenshot) */
    localStorage.setItem(HUB_KEY, hub);
    showView("hub");
    render();

    (async () => {
      try {
        if (typeof installRushmoreClient === "function") {
          const mode = await installRushmoreClient();
          console.info("Rushmore client mode:", mode);
        }
        await refreshEmployeesFromServer();
        const saved = localStorage.getItem(OPERATOR_KEY) || localStorage.getItem("rushmore-server-session-v1") || operatorId;
        await loginViaServer(saved);
        jumpForRole(role);
        await refreshProjectsFromServer();
        render();
      } catch (err) {
        console.warn("Server session bootstrap failed", err);
        toast("Could not reach workforce server — using last local chrome");
        render();
      }
    })();
  }

  boot();
})();
