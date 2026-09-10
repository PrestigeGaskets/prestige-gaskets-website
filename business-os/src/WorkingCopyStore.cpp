#include "WorkingCopyStore.h"

#include "DemoSeed.h"

#include <algorithm>
#include <cctype>
#include <stdexcept>
#include <unordered_map>

namespace bos {

namespace {

int extractTrailingNumber(const std::string& id) {
    int end = static_cast<int>(id.size()) - 1;
    while (end >= 0 && std::isdigit(static_cast<unsigned char>(id[end]))) {
        --end;
    }
    if (end + 1 >= static_cast<int>(id.size())) {
        return 0;
    }
    try {
        return std::stoi(id.substr(static_cast<size_t>(end + 1)));
    } catch (...) {
        return 0;
    }
}

}  // namespace

MasterStore::MasterStore() { seedDemoData(); }

void MasterStore::seedDemoData() {
    const DemoSeed s = makeDemoSeed();
    customers_ = s.customers;
    products_ = s.products;
    quotes_ = s.quotes;
    orders_ = s.orders;
    purchaseOrders_ = s.purchaseOrders;
    goodsReceipts_ = s.goodsReceipts;
    shipments_ = s.shipments;
    accounts_ = s.accounts;
    invoices_ = s.invoices;
    tags_ = s.tags;
    productTags_ = s.productTags;
    suppliers_ = s.suppliers;
    productSuppliers_ = s.productSuppliers;
    lists_ = s.lists;
}

std::vector<Customer> MasterStore::loadCustomers() { return customers_; }
std::vector<Product> MasterStore::loadProducts() { return products_; }
std::vector<Quote> MasterStore::loadQuotes() { return quotes_; }
std::vector<Order> MasterStore::loadOrders() { return orders_; }
std::vector<PurchaseOrder> MasterStore::loadPurchaseOrders() { return purchaseOrders_; }
std::vector<GoodsReceipt> MasterStore::loadGoodsReceipts() { return goodsReceipts_; }
std::vector<Shipment> MasterStore::loadShipments() { return shipments_; }

std::vector<std::string> MasterStore::loadList(const std::string& listName) {
    const auto it = lists_.find(listName);
    if (it == lists_.end()) {
        return {};
    }
    return it->second;
}

std::vector<CustomerAccount> MasterStore::loadCustomerAccounts() { return accounts_; }
std::vector<Invoice> MasterStore::loadInvoices() { return invoices_; }
std::vector<Tag> MasterStore::loadTags() { return tags_; }
std::vector<ProductTag> MasterStore::loadProductTags() { return productTags_; }
std::vector<Supplier> MasterStore::loadSuppliers() { return suppliers_; }
std::vector<ProductSupplier> MasterStore::loadProductSuppliers() { return productSuppliers_; }

WorkingCopyStore::WorkingCopyStore(IDataStore& master) : master_(master) { cloneFromMaster(); }

void WorkingCopyStore::cloneFromMaster() {
    customers_ = master_.loadCustomers();
    products_ = master_.loadProducts();
    quotes_ = master_.loadQuotes();
    orders_ = master_.loadOrders();
    purchaseOrders_ = master_.loadPurchaseOrders();
    goodsReceipts_ = master_.loadGoodsReceipts();
    shipments_ = master_.loadShipments();
    invoices_ = master_.loadInvoices();
    dirty_ = false;
}

void WorkingCopyStore::resetToMaster() { cloneFromMaster(); }

std::vector<Customer> WorkingCopyStore::loadCustomers() { return customers_; }
std::vector<Product> WorkingCopyStore::loadProducts() { return products_; }
std::vector<Quote> WorkingCopyStore::loadQuotes() { return quotes_; }
std::vector<Order> WorkingCopyStore::loadOrders() { return orders_; }
std::vector<PurchaseOrder> WorkingCopyStore::loadPurchaseOrders() { return purchaseOrders_; }
std::vector<GoodsReceipt> WorkingCopyStore::loadGoodsReceipts() { return goodsReceipts_; }
std::vector<Shipment> WorkingCopyStore::loadShipments() { return shipments_; }

std::vector<std::string> WorkingCopyStore::loadList(const std::string& listName) {
    return master_.loadList(listName);
}

std::vector<CustomerAccount> WorkingCopyStore::loadCustomerAccounts() {
    return master_.loadCustomerAccounts();
}
std::vector<Invoice> WorkingCopyStore::loadInvoices() { return invoices_; }
std::vector<Tag> WorkingCopyStore::loadTags() { return master_.loadTags(); }
std::vector<ProductTag> WorkingCopyStore::loadProductTags() { return master_.loadProductTags(); }
std::vector<Supplier> WorkingCopyStore::loadSuppliers() { return master_.loadSuppliers(); }
std::vector<ProductSupplier> WorkingCopyStore::loadProductSuppliers() {
    return master_.loadProductSuppliers();
}

WorkingCopyStore::Snapshot WorkingCopyStore::capture() const {
    return Snapshot{customers_, products_, quotes_, orders_, purchaseOrders_, goodsReceipts_,
                    shipments_, invoices_, dirty_};
}

void WorkingCopyStore::restore(const Snapshot& snap) {
    customers_ = snap.customers;
    products_ = snap.products;
    quotes_ = snap.quotes;
    orders_ = snap.orders;
    purchaseOrders_ = snap.purchaseOrders;
    goodsReceipts_ = snap.goodsReceipts;
    shipments_ = snap.shipments;
    invoices_ = snap.invoices;
    dirty_ = snap.dirty;
}

void WorkingCopyStore::updateProductField(const std::string& sku,
                                          const std::string& field,
                                          double value) {
    auto it = std::find_if(products_.begin(), products_.end(),
                           [&](const Product& p) { return p.sku == sku; });
    if (it == products_.end()) {
        throw std::runtime_error("Unknown product: " + sku);
    }
    if (field == "onHand") {
        it->onHand = value;
    } else if (field == "reorderPoint") {
        it->reorderPoint = value;
    } else if (field == "leadDays") {
        it->leadDays = static_cast<int>(value);
    } else if (field == "cost") {
        it->cost = value;
    } else if (field == "sell") {
        it->sell = value;
    } else {
        throw std::runtime_error("Unsupported product field: " + field);
    }
    dirty_ = true;
}

void WorkingCopyStore::updateCustomerField(const std::string& id,
                                           const std::string& field,
                                           const std::string& value) {
    auto it = std::find_if(customers_.begin(), customers_.end(),
                           [&](const Customer& c) { return c.id == id; });
    if (it == customers_.end()) {
        throw std::runtime_error("Unknown customer: " + id);
    }
    if (field == "name") {
        it->name = value;
    } else if (field == "email") {
        it->email = value;
    } else if (field == "postcode") {
        it->postcode = value;
    } else if (field == "status") {
        it->status = value;
    } else if (field == "notes") {
        it->notes = value;
    } else {
        throw std::runtime_error("Unsupported customer field: " + field);
    }
    dirty_ = true;
}

void WorkingCopyStore::updateQuoteLine(const std::string& quoteNo,
                                       int line,
                                       const std::string& field,
                                       double value) {
    auto qit = std::find_if(quotes_.begin(), quotes_.end(),
                            [&](const Quote& q) { return q.quoteNo == quoteNo; });
    if (qit == quotes_.end()) {
        throw std::runtime_error("Unknown quote: " + quoteNo);
    }
    auto lit = std::find_if(qit->lines.begin(), qit->lines.end(),
                            [&](const QuoteLine& l) { return l.line == line; });
    if (lit == qit->lines.end()) {
        throw std::runtime_error("Unknown quote line");
    }
    if (field == "qty") {
        lit->qty = value;
    } else if (field == "price") {
        lit->price = value;
    } else {
        throw std::runtime_error("Unsupported quote line field: " + field);
    }
    qit->value = 0.0;
    for (const auto& l : qit->lines) {
        qit->value += l.lineTotal();
    }
    dirty_ = true;
}

void WorkingCopyStore::updateOrderField(const std::string& orderNo,
                                        const std::string& field,
                                        const std::string& value) {
    auto it = std::find_if(orders_.begin(), orders_.end(),
                           [&](const Order& o) { return o.orderNo == orderNo; });
    if (it == orders_.end()) {
        throw std::runtime_error("Unknown order: " + orderNo);
    }
    if (field == "status") {
        it->status = value;
    } else if (field == "quoteNo") {
        it->quoteNo = value;
    } else if (field == "customerId") {
        it->customerId = value;
    } else if (field == "value") {
        it->value = std::stod(value);
    } else {
        throw std::runtime_error("Unsupported order field: " + field);
    }
    dirty_ = true;
}

void WorkingCopyStore::updatePoField(const std::string& poNo,
                                     const std::string& field,
                                     const std::string& value) {
    auto it = std::find_if(purchaseOrders_.begin(), purchaseOrders_.end(),
                           [&](const PurchaseOrder& po) { return po.poNo == poNo; });
    if (it == purchaseOrders_.end()) {
        throw std::runtime_error("Unknown purchase order: " + poNo);
    }
    if (field == "status") {
        it->status = value;
    } else if (field == "buyer") {
        it->buyer = value;
    } else if (field == "paymentTerms") {
        it->paymentTerms = value;
    } else if (field == "dueDate") {
        it->dueDate = value;
    } else if (field == "shipMethod") {
        it->shipMethod = value;
    } else if (field == "comments") {
        it->comments = value;
    } else if (field == "currency") {
        it->currency = value;
    } else if (field == "readyToPrint") {
        it->readyToPrint = (value == "true");
    } else if (field == "landedCost") {
        it->landedCost = (value == "true");
    } else if (field == "customRate") {
        it->customRate = (value == "true");
    } else {
        throw std::runtime_error("Unsupported purchase order field: " + field);
    }
    dirty_ = true;
}

std::string WorkingCopyStore::nextSalesOrderNo() const {
    int maxNo = 501;
    for (const auto& o : orders_) {
        maxNo = std::max(maxNo, extractTrailingNumber(o.orderNo));
    }
    return "SO-" + std::to_string(maxNo + 1);
}

std::string WorkingCopyStore::nextGrnNo() const {
    int maxNo = 1000;
    for (const auto& g : goodsReceipts_) {
        maxNo = std::max(maxNo, extractTrailingNumber(g.grnNo));
    }
    return "GRN-" + std::to_string(maxNo + 1);
}

std::string WorkingCopyStore::nextInvoiceNo(const std::string& orderNo) const {
    return "INV-" + std::to_string(extractTrailingNumber(orderNo));
}

std::string WorkingCopyStore::convertQuoteToSalesOrder(const std::string& quoteNo) {
    auto qit = std::find_if(quotes_.begin(), quotes_.end(),
                            [&](const Quote& q) { return q.quoteNo == quoteNo; });
    if (qit == quotes_.end()) {
        throw std::runtime_error("Unknown quote: " + quoteNo);
    }
    if (qit->lines.empty()) {
        throw std::runtime_error("Quote has no lines: " + quoteNo);
    }
    for (const auto& o : orders_) {
        if (o.quoteNo == quoteNo) {
            throw std::runtime_error("Quote already converted to sales order " + o.orderNo);
        }
    }

    const std::string soNo = nextSalesOrderNo();
    Order order;
    order.orderNo = soNo;
    order.quoteNo = quoteNo;
    order.customerId = qit->customerId;
    order.status = "Open";
    order.value = 0.0;
    for (const auto& ql : qit->lines) {
        OrderLine ol;
        ol.orderNo = soNo;
        ol.line = ql.line;
        ol.sku = ql.sku;
        ol.qty = ql.qty;
        ol.price = ql.price;
        order.value += ol.lineTotal();
        order.lines.push_back(ol);
    }
    orders_.push_back(order);

    qit->status = "Won";
    qit->value = order.value;

    Invoice inv;
    inv.invoiceNo = nextInvoiceNo(soNo);
    inv.orderNo = soNo;
    inv.status = "Draft";
    inv.amount = order.value;
    invoices_.push_back(inv);

    dirty_ = true;
    return soNo;
}

std::string WorkingCopyStore::receiveGoodsAgainstPo(
    const std::string& poNo,
    const std::vector<std::pair<int, double>>& qtys,
    const std::string& receivedBy) {
    auto poIt = std::find_if(purchaseOrders_.begin(), purchaseOrders_.end(),
                             [&](const PurchaseOrder& po) { return po.poNo == poNo; });
    if (poIt == purchaseOrders_.end()) {
        throw std::runtime_error("Unknown purchase order: " + poNo);
    }
    if (poIt->lines.empty()) {
        throw std::runtime_error("Purchase order has no lines: " + poNo);
    }

    std::unordered_map<int, double> alreadyReceived;
    for (const auto& grn : goodsReceipts_) {
        if (grn.poNo != poNo || grn.status != "Posted") {
            continue;
        }
        for (const auto& line : grn.lines) {
            alreadyReceived[line.poLine] += line.qtyReceived;
        }
    }

    std::unordered_map<int, double> requested;
    if (qtys.empty()) {
        for (const auto& pl : poIt->lines) {
            const double remain = pl.qty - alreadyReceived[pl.line];
            if (remain > 0) {
                requested[pl.line] = remain;
            }
        }
    } else {
        for (const auto& pair : qtys) {
            requested[pair.first] = pair.second;
        }
    }
    if (requested.empty()) {
        throw std::runtime_error("Nothing left to receive on PO " + poNo);
    }

    const std::string grnNo = nextGrnNo();
    GoodsReceipt grn;
    grn.grnNo = grnNo;
    grn.poNo = poNo;
    grn.supplierId = poIt->supplierId;
    grn.receivedDate = poIt->orderDate.empty() ? "10/09/2026" : poIt->orderDate;
    grn.receivedBy = receivedBy.empty() ? "RECEIVER" : receivedBy;
    grn.status = "Posted";
    grn.notes = "Goods received against PO " + poNo;

    int lineNo = 0;
    for (const auto& pl : poIt->lines) {
        const auto rit = requested.find(pl.line);
        if (rit == requested.end()) {
            continue;
        }
        const double qty = rit->second;
        if (qty <= 0) {
            continue;
        }
        const double remain = pl.qty - alreadyReceived[pl.line];
        if (qty > remain + 1e-9) {
            throw std::runtime_error("Receive qty exceeds remaining on PO line " +
                                     std::to_string(pl.line));
        }

        GrnLine gl;
        gl.grnNo = grnNo;
        gl.line = ++lineNo;
        gl.poNo = poNo;
        gl.poLine = pl.line;
        gl.sku = pl.sku;
        gl.qtyOrdered = pl.qty;
        gl.qtyReceived = qty;
        grn.lines.push_back(gl);

        auto pit = std::find_if(products_.begin(), products_.end(),
                                [&](const Product& p) { return p.sku == pl.sku; });
        if (pit == products_.end()) {
            throw std::runtime_error("Unknown product on PO line: " + pl.sku);
        }
        pit->onHand += qty;
    }

    if (grn.lines.empty()) {
        throw std::runtime_error("No GRN lines created for PO " + poNo);
    }

    goodsReceipts_.push_back(grn);

    bool fullyReceived = true;
    for (const auto& pl : poIt->lines) {
        const double totalRecv = alreadyReceived[pl.line] + requested[pl.line];
        if (totalRecv + 1e-9 < pl.qty) {
            fullyReceived = false;
            break;
        }
    }
    poIt->status = fullyReceived ? "Closed" : "Approved";

    dirty_ = true;
    return grnNo;
}

}  // namespace bos
