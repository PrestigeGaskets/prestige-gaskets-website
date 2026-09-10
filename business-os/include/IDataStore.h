#pragma once

#include <string>
#include <vector>

#include "Customer.h"
#include "CustomerAccount.h"
#include "Order.h"
#include "Product.h"
#include "Quote.h"
#include "Relations.h"

namespace bos {

// Persistence boundary. InMemoryStore / Master+WorkingCopy now; ExcelStore later.
class IDataStore {
public:
    virtual ~IDataStore() = default;

    // Core transactional / master tables
    virtual std::vector<Customer> loadCustomers() = 0;
    virtual std::vector<Product> loadProducts() = 0;
    virtual std::vector<Quote> loadQuotes() = 0;
    virtual std::vector<Order> loadOrders() = 0;
    virtual std::vector<std::string> loadList(const std::string& listName) = 0;

    // Relational extensions (1:1 / M:N masters)
    virtual std::vector<CustomerAccount> loadCustomerAccounts() = 0;  // 1:1 Customer
    virtual std::vector<Invoice> loadInvoices() = 0;                  // 1:1 Order
    virtual std::vector<Tag> loadTags() = 0;
    virtual std::vector<ProductTag> loadProductTags() = 0;            // M:N Product↔Tag
    virtual std::vector<Supplier> loadSuppliers() = 0;
    virtual std::vector<ProductSupplier> loadProductSuppliers() = 0;  // M:N Product↔Supplier
};

}  // namespace bos
