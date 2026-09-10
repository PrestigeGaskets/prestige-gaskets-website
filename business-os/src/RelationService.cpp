#include "RelationService.h"

#include <iostream>
#include <sstream>
#include <unordered_map>
#include <unordered_set>

namespace bos {

RelationService::RelationService(IDataStore& store) : store_(store) {}

std::vector<RelationEdge> RelationService::catalog() const {
    return {
        {"1:1", "Customer", "CustomerAccount", "CustomerAccount.customerId",
         "Exactly one account per customer"},
        {"1:1", "Order", "Invoice", "Invoice.orderNo", "Exactly one invoice per order"},
        {"1:1", "Quote", "Order", "Order.quoteNo (unique when set)",
         "Optional quote→order conversion"},
        {"1:N", "Customer", "Quote", "Quote.customerId", "Customer has many quotes"},
        {"1:N", "Customer", "Order", "Order.customerId", "Customer has many orders"},
        {"1:N", "Quote", "QuoteLine", "Quote.lines[] / QuoteLine.quoteNo",
         "Quote header owns lines"},
        {"1:N", "Order", "OrderLine", "Order.lines[] / OrderLine.orderNo",
         "Order header owns lines"},
        {"M:N", "Product", "Tag", "ProductTag", "Junction ProductTag(sku, tagId)"},
        {"M:N", "Product", "Supplier", "ProductSupplier",
         "Junction ProductSupplier(sku, supplierId)"},
        {"M:N", "Quote", "Product", "QuoteLine", "Association entity QuoteLine"},
        {"M:N", "Order", "Product", "OrderLine", "Association entity OrderLine"},
    };
}

std::vector<std::string> RelationService::validate() const {
    std::vector<std::string> issues;

    std::unordered_set<std::string> customerIds;
    for (const auto& c : store_.loadCustomers()) {
        customerIds.insert(c.id);
    }
    std::unordered_set<std::string> skus;
    for (const auto& p : store_.loadProducts()) {
        skus.insert(p.sku);
    }
    std::unordered_set<std::string> quoteNos;
    for (const auto& q : store_.loadQuotes()) {
        quoteNos.insert(q.quoteNo);
        if (!customerIds.count(q.customerId)) {
            issues.push_back("Quote " + q.quoteNo + " orphan customerId=" + q.customerId);
        }
        for (const auto& line : q.lines) {
            if (!skus.count(line.sku)) {
                issues.push_back("QuoteLine " + q.quoteNo + "/" + std::to_string(line.line) +
                                 " orphan sku=" + line.sku);
            }
        }
    }

    std::unordered_set<std::string> orderNos;
    std::unordered_set<std::string> quoteUsedByOrder;
    for (const auto& o : store_.loadOrders()) {
        orderNos.insert(o.orderNo);
        if (!customerIds.count(o.customerId)) {
            issues.push_back("Order " + o.orderNo + " orphan customerId=" + o.customerId);
        }
        if (!o.quoteNo.empty()) {
            if (!quoteNos.count(o.quoteNo)) {
                issues.push_back("Order " + o.orderNo + " orphan quoteNo=" + o.quoteNo);
            }
            if (!quoteUsedByOrder.insert(o.quoteNo).second) {
                issues.push_back("1:1 Quote→Order broken: quote " + o.quoteNo +
                                 " linked to multiple orders");
            }
        }
        for (const auto& line : o.lines) {
            if (!skus.count(line.sku)) {
                issues.push_back("OrderLine " + o.orderNo + "/" + std::to_string(line.line) +
                                 " orphan sku=" + line.sku);
            }
        }
    }

    // 1:1 Customer ↔ Account
    std::unordered_set<std::string> accountCustomers;
    for (const auto& a : store_.loadCustomerAccounts()) {
        if (!customerIds.count(a.customerId)) {
            issues.push_back("CustomerAccount orphan customerId=" + a.customerId);
        }
        if (!accountCustomers.insert(a.customerId).second) {
            issues.push_back("1:1 Customer↔Account broken: duplicate " + a.customerId);
        }
    }
    for (const auto& id : customerIds) {
        if (!accountCustomers.count(id)) {
            issues.push_back("1:1 Customer↔Account missing account for " + id);
        }
    }

    // 1:1 Order ↔ Invoice
    std::unordered_set<std::string> invoicedOrders;
    for (const auto& inv : store_.loadInvoices()) {
        if (!orderNos.count(inv.orderNo)) {
            issues.push_back("Invoice " + inv.invoiceNo + " orphan orderNo=" + inv.orderNo);
        }
        if (!invoicedOrders.insert(inv.orderNo).second) {
            issues.push_back("1:1 Order↔Invoice broken: duplicate order " + inv.orderNo);
        }
    }

    std::unordered_set<std::string> tagIds;
    for (const auto& t : store_.loadTags()) {
        tagIds.insert(t.id);
    }
    for (const auto& pt : store_.loadProductTags()) {
        if (!skus.count(pt.sku)) {
            issues.push_back("ProductTag orphan sku=" + pt.sku);
        }
        if (!tagIds.count(pt.tagId)) {
            issues.push_back("ProductTag orphan tagId=" + pt.tagId);
        }
    }

    std::unordered_set<std::string> supplierIds;
    for (const auto& s : store_.loadSuppliers()) {
        supplierIds.insert(s.id);
    }
    for (const auto& ps : store_.loadProductSuppliers()) {
        if (!skus.count(ps.sku)) {
            issues.push_back("ProductSupplier orphan sku=" + ps.sku);
        }
        if (!supplierIds.count(ps.supplierId)) {
            issues.push_back("ProductSupplier orphan supplierId=" + ps.supplierId);
        }
    }

    return issues;
}

void RelationService::print() const {
    std::cout << "--- RELATIONSHIP CATALOG ---\n";
    for (const auto& e : catalog()) {
        std::cout << "  [" << e.cardinality << "] " << e.fromTable << " → " << e.toTable
                  << "  via " << e.via << "\n"
                  << "           " << e.note << '\n';
    }
    const auto issues = validate();
    std::cout << "--- FK VALIDATION ---\n";
    if (issues.empty()) {
        std::cout << "  OK — all 1:1 / 1:N / M:N links resolve\n\n";
    } else {
        for (const auto& issue : issues) {
            std::cout << "  ! " << issue << '\n';
        }
        std::cout << '\n';
    }
}

}  // namespace bos
