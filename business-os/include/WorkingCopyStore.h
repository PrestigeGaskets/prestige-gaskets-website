#pragma once

#include <functional>
#include <string>

#include "IDataStore.h"

namespace bos {

// Immutable system-of-record. Seeded once; never mutated by user edits.
class MasterStore : public IDataStore {
public:
    MasterStore();

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<std::string> loadList(const std::string& listName) override;

private:
    std::vector<Customer> customers_;
    std::vector<Product> products_;
    std::vector<Quote> quotes_;
    std::vector<Order> orders_;
};

// Per-user / per-session overlay. Reads merge master + overlay;
// writes update overlay only. resetToMaster() drops overlays.
class WorkingCopyStore : public IDataStore {
public:
    explicit WorkingCopyStore(MasterStore& master);

    void resetToMaster();
    bool isDirty() const;

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<std::string> loadList(const std::string& listName) override;

    // Mutations — never forward to MasterStore.
    void updateProductField(const std::string& sku, const std::string& field, double value);
    void updateCustomerField(const std::string& id, const std::string& field, const std::string& value);
    void updateQuoteLine(const std::string& quoteNo, int line, const std::string& field, double value);
    void updateOrderField(const std::string& orderNo, const std::string& field, const std::string& value);

private:
    MasterStore& master_;
    std::vector<Customer> customers_;
    std::vector<Product> products_;
    std::vector<Quote> quotes_;
    std::vector<Order> orders_;
    bool dirty_ = false;

    void cloneFromMaster();
};

}  // namespace bos
