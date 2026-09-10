#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include "IDataStore.h"

namespace bos {

// Seeded with workbook-shaped demo rows from _verify_aec5.py expectations.
class InMemoryStore : public IDataStore {
public:
    InMemoryStore();

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<std::string> loadList(const std::string& listName) override;

private:
    void seedDemoData();

    std::vector<Customer> customers_;
    std::vector<Product> products_;
    std::vector<Quote> quotes_;
    std::vector<Order> orders_;
    std::unordered_map<std::string, std::vector<std::string>> lists_;
};

}  // namespace bos
