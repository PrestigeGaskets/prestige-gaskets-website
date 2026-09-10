#include "WorkingCopyStore.h"

#include "DemoSeed.h"

#include <algorithm>
#include <stdexcept>

namespace bos {

MasterStore::MasterStore() { seedDemoData(); }

void MasterStore::seedDemoData() {
    const DemoSeed s = makeDemoSeed();
    customers_ = s.customers;
    products_ = s.products;
    quotes_ = s.quotes;
    orders_ = s.orders;
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

std::vector<CustomerAccount> WorkingCopyStore::loadCustomerAccounts() {
    return master_.loadCustomerAccounts();
}
std::vector<Invoice> WorkingCopyStore::loadInvoices() { return master_.loadInvoices(); }
std::vector<Tag> WorkingCopyStore::loadTags() { return master_.loadTags(); }
std::vector<ProductTag> WorkingCopyStore::loadProductTags() { return master_.loadProductTags(); }
std::vector<Supplier> WorkingCopyStore::loadSuppliers() { return master_.loadSuppliers(); }
std::vector<ProductSupplier> WorkingCopyStore::loadProductSuppliers() {
    return master_.loadProductSuppliers();
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
