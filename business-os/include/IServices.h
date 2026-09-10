#pragma once

#include <map>
#include <string>
#include <utility>
#include <vector>

#include "Dashboard.h"
#include "Product.h"
#include "Relations.h"

namespace bos {

// Abstract service contracts — business logic behind polymorphic APIs.

class IQuoteService {
public:
    virtual ~IQuoteService() = default;
    virtual std::map<std::string, double> totalsByQuote() const = 0;
    virtual double grandTotal() const = 0;
    virtual void printTotals() const = 0;
};

class IInventoryService {
public:
    virtual ~IInventoryService() = default;
    virtual void refreshReorderFlags() = 0;
    virtual void printInventory() const = 0;
    virtual bool needsReorder(const Product& product) const = 0;
};

class IDashboardService {
public:
    virtual ~IDashboardService() = default;
    virtual DashboardSnapshot build() const = 0;
    virtual void print() const = 0;
};

class IRelationService {
public:
    virtual ~IRelationService() = default;
    virtual std::vector<RelationEdge> catalog() const = 0;
    virtual std::vector<std::string> validate() const = 0;
    virtual void print() const = 0;
};

/// End-to-end intake: Quote → Sales Order number; PO → GRN number + stock; Shipment → OH.
class IIntakeService {
public:
    virtual ~IIntakeService() = default;
    /// Accept a received customer quote → generate Sales Order number, copy lines,
    /// mark quote Won, draft invoice. Returns new orderNo (SO-…).
    virtual std::string acceptQuoteToSalesOrder(const std::string& quoteNo) = 0;
    /// Book goods against a PO → generate GRN number, update Product.onHand.
    /// qtys: pairs of (poLine, qtyReceived). Empty = receive full remaining.
    virtual std::string receivePurchaseOrder(
        const std::string& poNo,
        const std::vector<std::pair<int, double>>& qtys,
        const std::string& receivedBy) = 0;
    /// Post a staged shipment → issue Product.onHand, mark lines complete, issue DN.
    virtual void postShipment(const std::string& shipmentId) = 0;
    /// Unpost a posted shipment / delivery note → restore Product.onHand.
    virtual void unpostShipment(const std::string& shipmentId) = 0;
};

/// Result of committing staged actions (+ optional working-copy edits).
struct PostCommitResult {
    int count = 0;
    std::string summary;
};

/// Stage operational actions; commit on Post via IIntakeService + action ledger.
class IPostCommitService {
public:
    virtual ~IPostCommitService() = default;

    virtual void stageAcceptQuote(const std::string& quoteNo, const std::string& actor) = 0;
    virtual void stageReceivePo(const std::string& poNo, const std::string& actor) = 0;
    virtual void stagePostShipment(const std::string& shipmentId,
                                   const std::string& actor) = 0;
    virtual void stageUnpostShipment(const std::string& shipmentId,
                                     const std::string& actor) = 0;

    /// Finalize pending intake, write action repo for actor/day, clear pending.
    virtual PostCommitResult commit(const std::string& actor) = 0;

    virtual void clearPending() = 0;
    virtual std::size_t pendingCount() const = 0;
    virtual std::string describePendingAndToday(const std::string& actor) const = 0;
};

}  // namespace bos
