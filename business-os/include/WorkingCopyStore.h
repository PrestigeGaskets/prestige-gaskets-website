#pragma once

#include <string>
#include <vector>

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
    void seedDemoData();

    std::vector<Customer> customers_;
    std::vector<Product> products_;
    std::vector<Quote> quotes_;
    std::vector<Order> orders_;
    std::vector<std::pair<std::string, std::vector<std::string>>> lists_;
};

// Per-session overlay. Reads clone master; writes update overlay only.
class WorkingCopyStore : public IDataStore {
public:
    explicit WorkingCopyStore(IDataStore& master);

    void resetToMaster();
    bool isDirty() const { return dirty_; }

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<std::string> loadList(const std::string& listName) override;

    // Mutations — never forward to master.
    void updateProductField(const std::string& sku, const std::string& field, double value);
    void updateCustomerField(const std::string& id, const std::string& field, const std::string& value);
    void updateQuoteLine(const std::string& quoteNo, int line, const std::string& field, double value);
    void updateOrderField(const std::string& orderNo, const std::string& field, const std::string& value);

    // Snapshot support for polymorphic undo commands.
    struct Snapshot {
        std::vector<Customer> customers;
        std::vector<Product> products;
        std::vector<Quote> quotes;
        std::vector<Order> orders;
        bool dirty = false;
    };
    Snapshot capture() const;
    void restore(const Snapshot& snap);

private:
    IDataStore& master_;
    std::vector<Customer> customers_;
    std::vector<Product> products_;
    std::vector<Quote> quotes_;
    std::vector<Order> orders_;
    bool dirty_ = false;

    void cloneFromMaster();
};

}  // namespace bos
