#include "InMemoryStore.h"

#include "DemoSeed.h"

namespace bos {

InMemoryStore::InMemoryStore() { seedDemoData(); }

void InMemoryStore::seedDemoData() {
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

std::vector<CustomerAccount> InMemoryStore::loadCustomerAccounts() { return accounts_; }
std::vector<Invoice> InMemoryStore::loadInvoices() { return invoices_; }
std::vector<Tag> InMemoryStore::loadTags() { return tags_; }
std::vector<ProductTag> InMemoryStore::loadProductTags() { return productTags_; }
std::vector<Supplier> InMemoryStore::loadSuppliers() { return suppliers_; }
std::vector<ProductSupplier> InMemoryStore::loadProductSuppliers() { return productSuppliers_; }

}  // namespace bos
