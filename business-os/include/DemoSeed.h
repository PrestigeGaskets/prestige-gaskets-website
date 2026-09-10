#pragma once

#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

#include "Customer.h"
#include "CustomerAccount.h"
#include "Order.h"
#include "Product.h"
#include "Quote.h"
#include "Relations.h"

namespace bos {

/// Shared workbook-shaped demo seed used by InMemoryStore and MasterStore.
struct DemoSeed {
    std::vector<Customer> customers;
    std::vector<Product> products;
    std::vector<Quote> quotes;
    std::vector<Order> orders;
    std::vector<CustomerAccount> accounts;
    std::vector<Invoice> invoices;
    std::vector<Tag> tags;
    std::vector<ProductTag> productTags;
    std::vector<Supplier> suppliers;
    std::vector<ProductSupplier> productSuppliers;
    std::unordered_map<std::string, std::vector<std::string>> lists;
};

DemoSeed makeDemoSeed();

}  // namespace bos
