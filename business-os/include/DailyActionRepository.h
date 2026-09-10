#pragma once

#include <string>
#include <vector>

namespace bos {

/// One posted (or staged) operational action — shaped for backend report lookup.
struct ActionEntry {
    std::string id;
    std::string day;       // YYYY-MM-DD (local business day)
    std::string actor;     // role name (Sales, Purchasing, …)
    std::string type;      // accept-quote | receive-po | post-shipment | working-copy-edits
    std::string status;    // staged | posted | failed
    std::string stagedAt;  // ISO-8601
    std::string postedAt;  // ISO-8601 when posted

    // Lookup fields for reports / joins
    std::string quoteNo;
    std::string orderNo;
    std::string poNo;
    std::string grnNo;
    std::string shipmentId;
    std::string customerId;
    std::string detail;  // human / JSON summary
};

/// In-memory daily action repository (backend twin). No UI — report/API lookup only.
class DailyActionRepository {
public:
    void clearPending();
    void stage(ActionEntry entry);
    std::vector<ActionEntry> pending() const { return pending_; }

    /// Move pending → posted ledger for actor/day; returns posted copies.
    std::vector<ActionEntry> commitPending(const std::string& actor,
                                           const std::string& day,
                                           const std::string& postedAt);

    void appendPosted(ActionEntry entry);
    std::vector<ActionEntry> forDay(const std::string& day) const;
    std::vector<ActionEntry> forActorDay(const std::string& actor,
                                         const std::string& day) const;
    std::vector<ActionEntry> allPosted() const { return posted_; }

    /// Flat lookup helpers for report fields.
    std::vector<ActionEntry> lookupByOrderNo(const std::string& orderNo) const;
    std::vector<ActionEntry> lookupByQuoteNo(const std::string& quoteNo) const;
    std::vector<ActionEntry> lookupByPoNo(const std::string& poNo) const;
    std::vector<ActionEntry> lookupByGrnNo(const std::string& grnNo) const;

private:
    std::vector<ActionEntry> pending_;
    std::vector<ActionEntry> posted_;
};

}  // namespace bos
