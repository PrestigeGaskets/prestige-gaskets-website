#pragma once

#include <string>
#include <vector>

#include "Customer.h"
#include "Order.h"
#include "Product.h"
#include "Quote.h"

namespace bos {

// Persistence boundary. InMemoryStore now; ExcelStore later (workbook parity).
class IDataStore {
public:
    virtual ~IDataStore() = default;

    virtual std::vector<Customer> loadCustomers() = 0;
    virtual std::vector<Product> loadProducts() = 0;
    virtual std::vector<Quote> loadQuotes() = 0;
    virtual std::vector<Order> loadOrders() = 0;
    virtual std::vector<std::string> loadList(const std::string& listName) = 0;
};

}  // namespace bos
