#include "WorkingCopyStore.h"

#include <algorithm>
#include <stdexcept>

namespace bos {

namespace {

void seedLikeDemo(std::vector<Customer>& customers,
                  std::vector<Product>& products,
                  std::vector<Quote>& quotes,
                  std::vector<Order>& orders,
                  std::vector<std::pair<std::string, std::vector<std::string>>>& lists) {
    customers = {
        {"C001", "Acme Fab", "buyer@acme.example", "B1 1AA", "Active", ""},
        {"C002", "Northline", "ops@northline.example", "M1 2AB", "Active", ""},
        {"C003", "Summit Seal", "purchasing@summit.example", "EH1 3EG", "Inactive", ""},
        {"C004", "Prestige Pilot", "pilot@prestige.example", "SW1A 1AA", "Active",
         "Sample from verify script"},
    };

    products = {
        {"P1001", "Flat gasket A", "Gasket", 2.50, 4.75, 120, 40, 7, false},
        {"P1002", "Cone seal B", "Seal", 3.10, 5.90, 18, 25, 14, false},
        {"P1003", "Ring C", "Ring", 1.20, 2.40, 80, 30, 5, false},
        {"P1004", "Sleeve D", "Sleeve", 4.00, 7.50, 55, 20, 10, false},
        {"P1005", "Washer E", "Washer", 0.40, 0.95, 200, 50, 3, false},
        {"P1006", "Spacer F", "Spacer", 1.80, 3.25, 12, 15, 8, false},
    };

    Quote q1;
    q1.quoteNo = "Q-100";
    q1.customerId = "C004";
    q1.status = "Open";
    q1.lines = {
        {"Q-100", 1, "P1001", 10, 4.75, "=D2*E2"},
        {"Q-100", 2, "P1002", 5, 5.90, "=D3*E3"},
    };
    for (const auto& line : q1.lines) {
        q1.value += line.lineTotal();
    }

    Quote q2;
    q2.quoteNo = "Q-101";
    q2.customerId = "C001";
    q2.status = "Open";
    q2.lines = {
        {"Q-101", 1, "P1003", 40, 2.40, "=D2*E2"},
        {"Q-101", 2, "P1005", 100, 0.95, "=D3*E3"},
    };
    for (const auto& line : q2.lines) {
        q2.value += line.lineTotal();
    }
    quotes = {q1, q2};

    orders = {
        {"O-500", "Q-099", "C002", "Shipped", 312.50},
        {"O-501", "", "C004", "Open", 88.00},
    };

    lists = {
        {"QuoteStatus", {"Open", "Sent", "Won", "Lost"}},
        {"OrderStatus", {"Open", "Picked", "Shipped", "Closed"}},
        {"CustomerStatus", {"Active", "Inactive"}},
    };
}

}  // namespace

MasterStore::MasterStore() { seedDemoData(); }

void MasterStore::seedDemoData() {
    seedLikeDemo(customers_, products_, quotes_, orders_, lists_);
}

std::vector<Customer> MasterStore::loadCustomers() { return customers_; }
std::vector<Product> MasterStore::loadProducts() { return products_; }
std::vector<Quote> MasterStore::loadQuotes() { return quotes_; }
std::vector<Order> MasterStore::loadOrders() { return orders_; }

std::vector<std::string> MasterStore::loadList(const std::string& listName) {
    for (const auto& [name, values] : lists_) {
        if (name == listName) {
            return values;
        }
    }
    return {};
}

WorkingCopyStore::WorkingCopyStore(IDataStore& master) : master_(master) { cloneFromMaster(); }

void WorkingCopyStore::cloneFromMaster() {
    customers_ = master_.loadCustomers();
    products_ = master_.loadProducts();
    quotes_ = master_.loadQuotes();
    orders_ = master_.loadOrders();
    dirty_ = false;
}

void WorkingCopyStore::resetToMaster() { cloneFromMaster(); }

std::vector<Customer> WorkingCopyStore::loadCustomers() { return customers_; }
std::vector<Product> WorkingCopyStore::loadProducts() { return products_; }
std::vector<Quote> WorkingCopyStore::loadQuotes() { return quotes_; }
std::vector<Order> WorkingCopyStore::loadOrders() { return orders_; }

std::vector<std::string> WorkingCopyStore::loadList(const std::string& listName) {
    return master_.loadList(listName);
}

WorkingCopyStore::Snapshot WorkingCopyStore::capture() const {
    return Snapshot{customers_, products_, quotes_, orders_, dirty_};
}

void WorkingCopyStore::restore(const Snapshot& snap) {
    customers_ = snap.customers;
    products_ = snap.products;
    quotes_ = snap.quotes;
    orders_ = snap.orders;
    dirty_ = snap.dirty;
}

void WorkingCopyStore::updateProductField(const std::string& sku,
                                          const std::string& field,
                                          double value) {
    auto it = std::find_if(products_.begin(), products_.end(),
                           [&](const Product& p) { return p.sku == sku; });
    if (it == products_.end()) {
        throw std::runtime_error("Unknown SKU: " + sku);
    }
    if (field == "onHand") {
        it->onHand = static_cast<int>(value);
    } else if (field == "reorderPoint") {
        it->reorderPoint = static_cast<int>(value);
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

}  // namespace bos
