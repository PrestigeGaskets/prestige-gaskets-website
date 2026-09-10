#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include "IDataStore.h"

namespace bos {

class InMemoryStore : public IDataStore {
public:
    InMemoryStore();

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<PurchaseOrder> loadPurchaseOrders() override;
    std::vector<std::string> loadList(const std::string& listName) override;

    std::vector<CustomerAccount> loadCustomerAccounts() override;
    std::vector<Invoice> loadInvoices() override;
    std::vector<Tag> loadTags() override;
    std::vector<ProductTag> loadProductTags() override;
    std::vector<Supplier> loadSuppliers() override;
    std::vector<ProductSupplier> loadProductSuppliers() override;

private:
    void seedDemoData();

    std::vector<Customer> customers_;
    std::vector<Product> products_;
    std::vector<Quote> quotes_;
    std::vector<Order> orders_;
    std::vector<PurchaseOrder> purchaseOrders_;
    std::vector<CustomerAccount> accounts_;
    std::vector<Invoice> invoices_;
    std::vector<Tag> tags_;
    std::vector<ProductTag> productTags_;
    std::vector<Supplier> suppliers_;
    std::vector<ProductSupplier> productSuppliers_;
    std::unordered_map<std::string, std::vector<std::string>> lists_;
};

}  // namespace bos
