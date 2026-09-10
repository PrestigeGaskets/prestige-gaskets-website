#pragma once

#include <string>
#include <vector>

#include "Customer.h"
#include "CustomerAccount.h"
#include "Order.h"
#include "Product.h"
#include "PurchaseOrder.h"
#include "Quote.h"
#include "Relations.h"

namespace bos {

class IDataStore {
public:
    virtual ~IDataStore() = default;

    virtual std::vector<Customer> loadCustomers() = 0;
    virtual std::vector<Product> loadProducts() = 0;
    virtual std::vector<Quote> loadQuotes() = 0;
    virtual std::vector<Order> loadOrders() = 0;
    virtual std::vector<PurchaseOrder> loadPurchaseOrders() = 0;
    virtual std::vector<std::string> loadList(const std::string& listName) = 0;

    virtual std::vector<CustomerAccount> loadCustomerAccounts() = 0;
    virtual std::vector<Invoice> loadInvoices() = 0;
    virtual std::vector<Tag> loadTags() = 0;
    virtual std::vector<ProductTag> loadProductTags() = 0;
    virtual std::vector<Supplier> loadSuppliers() = 0;
    virtual std::vector<ProductSupplier> loadProductSuppliers() = 0;
};

}  // namespace bos
