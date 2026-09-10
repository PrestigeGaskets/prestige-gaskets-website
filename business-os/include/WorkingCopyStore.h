#pragma once

#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

#include "IDataStore.h"
#include "IWorkingCopyMutations.h"

namespace bos {

class MasterStore : public IDataStore {
public:
    MasterStore();

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<PurchaseOrder> loadPurchaseOrders() override;
    std::vector<GoodsReceipt> loadGoodsReceipts() override;
    std::vector<Shipment> loadShipments() override;
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
    std::vector<GoodsReceipt> goodsReceipts_;
    std::vector<Shipment> shipments_;
    std::vector<CustomerAccount> accounts_;
    std::vector<Invoice> invoices_;
    std::vector<Tag> tags_;
    std::vector<ProductTag> productTags_;
    std::vector<Supplier> suppliers_;
    std::vector<ProductSupplier> productSuppliers_;
    std::unordered_map<std::string, std::vector<std::string>> lists_;
};

class WorkingCopyStore : public IDataStore, public IWorkingCopyMutations {
public:
    explicit WorkingCopyStore(IDataStore& master);

    void resetToMaster();
    bool isDirty() const { return dirty_; }

    std::vector<Customer> loadCustomers() override;
    std::vector<Product> loadProducts() override;
    std::vector<Quote> loadQuotes() override;
    std::vector<Order> loadOrders() override;
    std::vector<PurchaseOrder> loadPurchaseOrders() override;
    std::vector<GoodsReceipt> loadGoodsReceipts() override;
    std::vector<Shipment> loadShipments() override;
    std::vector<std::string> loadList(const std::string& listName) override;

    std::vector<CustomerAccount> loadCustomerAccounts() override;
    std::vector<Invoice> loadInvoices() override;
    std::vector<Tag> loadTags() override;
    std::vector<ProductTag> loadProductTags() override;
    std::vector<Supplier> loadSuppliers() override;
    std::vector<ProductSupplier> loadProductSuppliers() override;

    void updateProductField(const std::string& sku, const std::string& field,
                            double value) override;
    void updateCustomerField(const std::string& id, const std::string& field, const std::string& value);
    void updateQuoteLine(const std::string& quoteNo, int line, const std::string& field, double value);
    void updateOrderField(const std::string& orderNo, const std::string& field, const std::string& value);
    void updatePoField(const std::string& poNo, const std::string& field, const std::string& value);

    /// Quote received → generate Sales Order number (SO-…), copy lines, Won + draft invoice.
    std::string convertQuoteToSalesOrder(const std::string& quoteNo) override;
    /// Goods received against PO → generate GRN, bump Product.onHand. Empty qtys = full remaining.
    std::string receiveGoodsAgainstPo(const std::string& poNo,
                                      const std::vector<std::pair<int, double>>& qtys,
                                      const std::string& receivedBy) override;
    /// Post shipment → issue on-hand for lines, mark orders Shipped, status Posted.
    void postShipment(const std::string& shipmentId) override;

    struct Snapshot {
        std::vector<Customer> customers;
        std::vector<Product> products;
        std::vector<Quote> quotes;
        std::vector<Order> orders;
        std::vector<PurchaseOrder> purchaseOrders;
        std::vector<GoodsReceipt> goodsReceipts;
        std::vector<Shipment> shipments;
        std::vector<Invoice> invoices;
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
    std::vector<PurchaseOrder> purchaseOrders_;
    std::vector<GoodsReceipt> goodsReceipts_;
    std::vector<Shipment> shipments_;
    std::vector<Invoice> invoices_;
    bool dirty_ = false;

    void cloneFromMaster();
    std::string nextSalesOrderNo() const;
    std::string nextGrnNo() const;
    std::string nextInvoiceNo(const std::string& orderNo) const;
};

}  // namespace bos
