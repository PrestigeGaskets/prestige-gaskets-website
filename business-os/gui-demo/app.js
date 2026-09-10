// GUI mirror of business-os InMemoryStore + services (Application CLI views).

const store = {
  customers: [
    { id: "C001", name: "Acme Fab", email: "buyer@acme.example", phone: "555-0101", status: "Active" },
    { id: "C002", name: "Northline", email: "ops@northline.example", phone: "555-0102", status: "Active" },
    { id: "C003", name: "Summit Seal", email: "purchasing@summit.example", phone: "555-0103", status: "Inactive" },
    { id: "C004", name: "Prestige Pilot", email: "pilot@prestige.example", phone: "555-0104", status: "Active" },
  ],
  products: [
    { sku: "P1001", description: "Flat gasket A", category: "Gasket", cost: 2.5, sell: 4.75, onHand: 120, reorderPoint: 40, leadDays: 7 },
    { sku: "P1002", description: "Cone seal B", category: "Seal", cost: 3.1, sell: 5.9, onHand: 18, reorderPoint: 25, leadDays: 14 },
    { sku: "P1003", description: "Ring C", category: "Ring", cost: 1.2, sell: 2.4, onHand: 80, reorderPoint: 30, leadDays: 5 },
    { sku: "P1004", description: "Sleeve D", category: "Sleeve", cost: 4.0, sell: 7.5, onHand: 55, reorderPoint: 20, leadDays: 10 },
    { sku: "P1005", description: "Washer E", category: "Washer", cost: 0.4, sell: 0.95, onHand: 200, reorderPoint: 50, leadDays: 3 },
    { sku: "P1006", description: "Spacer F", category: "Spacer", cost: 1.8, sell: 3.25, onHand: 12, reorderPoint: 15, leadDays: 8 },
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
};

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const needsReorder = (p) => p.onHand <= p.reorderPoint;

function lineTotal(line) {
  return line.qty * line.price;
}

function totalsByQuote() {
  const totals = {};
  for (const q of store.quotes) {
    totals[q.quoteNo] = q.lines.reduce((sum, line) => sum + lineTotal(line), 0);
  }
  return totals;
}

function grandTotal() {
  return Object.values(totalsByQuote()).reduce((a, b) => a + b, 0);
}

function customerName(id) {
  return store.customers.find((c) => c.id === id)?.name ?? id;
}

function renderDashboard() {
  const reorderCount = store.products.filter(needsReorder).length;
  const metrics = [
    { label: "Customers", value: String(store.customers.length) },
    { label: "Products", value: String(store.products.length) },
    { label: "Open quote value", value: money(grandTotal()) },
    { label: "Orders", value: String(store.orders.length) },
    { label: "SKUs at/below ROP", value: String(reorderCount) },
  ];

  document.getElementById("metric-strip").innerHTML = metrics
    .map(
      (m) => `<div class="metric"><span class="label">${m.label}</span><span class="value">${m.value}</span></div>`
    )
    .join("");

  document.getElementById("grand-total").textContent = money(grandTotal());

  document.getElementById("reorder-watch").innerHTML = store.products
    .filter(needsReorder)
    .map(
      (p) =>
        `<li><span class="sku">${p.sku}</span><span class="name">${p.description} · OH ${p.onHand} / ROP ${p.reorderPoint}</span><span class="flag">Reorder</span></li>`
    )
    .join("");
}

function renderQuotes() {
  const totals = totalsByQuote();
  const root = document.getElementById("quotes-root");
  root.innerHTML =
    store.quotes
      .map((q) => {
        const rows = q.lines
          .map(
            (line) => `
          <tr>
            <td class="mono">L${line.line}</td>
            <td class="mono">${line.sku}</td>
            <td>${line.qty}</td>
            <td>${money(line.price)}</td>
            <td>${money(lineTotal(line))}</td>
          </tr>`
          )
          .join("");
        return `
        <article class="quote-block">
          <div class="quote-head">
            <h2>${q.quoteNo}</h2>
            <span class="quote-meta">${customerName(q.customerId)} · ${q.status}</span>
            <span class="quote-total">${money(totals[q.quoteNo])}</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Line</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </article>`;
      })
      .join("") +
    `<div class="grand-row"><span>Grand</span><span>${money(grandTotal())}</span></div>`;
}

function renderProducts() {
  const tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = store.products
    .map((p) => {
      const flag = needsReorder(p);
      return `
      <tr>
        <td class="mono">${p.sku}</td>
        <td>${p.description}</td>
        <td>${p.onHand}</td>
        <td>${p.reorderPoint}</td>
        <td>${p.leadDays}</td>
        <td>${money(p.cost)}</td>
        <td>${money(p.sell)}</td>
        <td><span class="badge ${flag ? "badge-warn" : "badge-ok"}">${flag ? "Reorder" : "ok"}</span></td>
      </tr>`;
    })
    .join("");
}

function renderCustomers() {
  document.querySelector("#customers-table tbody").innerHTML = store.customers
    .map(
      (c) => `
    <tr>
      <td class="mono">${c.id}</td>
      <td>${c.name}</td>
      <td><span class="badge ${c.status === "Active" ? "badge-ok" : "badge-muted"}">${c.status}</span></td>
      <td>${c.email}</td>
      <td class="mono">${c.phone}</td>
    </tr>`
    )
    .join("");
}

function renderOrders() {
  document.querySelector("#orders-table tbody").innerHTML = store.orders
    .map(
      (o) => `
    <tr>
      <td class="mono">${o.orderNo}</td>
      <td class="mono">${o.quoteNo || "—"}</td>
      <td>${customerName(o.customerId)} <span class="mono">(${o.customerId})</span></td>
      <td>${o.status}</td>
      <td>${money(o.value)}</td>
    </tr>`
    )
    .join("");
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

function tickClock() {
  const el = document.getElementById("clock");
  const now = new Date();
  el.textContent = now.toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function boot() {
  renderDashboard();
  renderQuotes();
  renderProducts();
  renderCustomers();
  renderOrders();
  tickClock();
  setInterval(tickClock, 30_000);

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });
}

boot();
