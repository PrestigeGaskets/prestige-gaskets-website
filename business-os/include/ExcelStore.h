#pragma once

#include <stdexcept>
#include <string>
#include <vector>

#include "IDataStore.h"

namespace bos {

// Scaffold only — future loader for SMB-Operating-System.xlsx
// (parity with _verify_aec5.py sheet/table reads).
class ExcelStore : public IDataStore {
public:
    explicit ExcelStore(std::string workbookPath)
        : workbookPath_(std::move(workbookPath)) {}

    std::vector<Customer> loadCustomers() override {
        fail();
        return {};
    }
    std::vector<Product> loadProducts() override {
        fail();
        return {};
    }
    std::vector<Quote> loadQuotes() override {
        fail();
        return {};
    }
    std::vector<Order> loadOrders() override {
        fail();
        return {};
    }
    std::vector<std::string> loadList(const std::string& /*listName*/) override {
        fail();
        return {};
    }

private:
    [[noreturn]] void fail() const {
        throw std::runtime_error("ExcelStore not implemented: " + workbookPath_);
    }

    std::string workbookPath_;
};

}  // namespace bos
