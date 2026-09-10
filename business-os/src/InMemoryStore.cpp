#include "InMemoryStore.h"

namespace bos {

InMemoryStore::InMemoryStore() { seedDemoData(); }

void InMemoryStore::seedDemoData() {
    customers_ = {
        {"C001", "Acme Fab", "buyer@acme.example", "555-0101", "Active", ""},
        {"C002", "Northline", "ops@northline.example", "555-0102", "Active", ""},
        {"C003", "Summit Seal", "purchasing@summit.example", "555-0103", "Inactive", ""},
        {"C004", "Prestige Pilot", "pilot@prestige.example", "555-0104", "Active", "Sample from verify script"},
    };

    products_ = {
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

    quotes_ = {q1, q2};

    orders_ = {
        {"O-500", "Q-099", "C002", "Shipped", 312.50},
        {"O-501", "", "C004", "Open", 88.00},
    };

    lists_["QuoteStatus"] = {"Open", "Sent", "Won", "Lost"};
    lists_["OrderStatus"] = {"Open", "Picked", "Shipped", "Closed"};
    lists_["CustomerStatus"] = {"Active", "Inactive"};
}

std::vector<Customer> InMemoryStore::loadCustomers() { return customers_; }
std::vector<Product> InMemoryStore::loadProducts() { return products_; }
std::vector<Quote> InMemoryStore::loadQuotes() { return quotes_; }
std::vector<Order> InMemoryStore::loadOrders() { return orders_; }

std::vector<std::string> InMemoryStore::loadList(const std::string& listName) {
    const auto it = lists_.find(listName);
    if (it == lists_.end()) {
        return {};
    }
    return it->second;
}

}  // namespace bos
