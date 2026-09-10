#include "DailyActionRepository.h"

#include <algorithm>

namespace bos {

void DailyActionRepository::clearPending() { pending_.clear(); }

void DailyActionRepository::stage(ActionEntry entry) {
    entry.status = "staged";
    // Replace duplicate staged action of same type + primary lookup key.
    pending_.erase(std::remove_if(pending_.begin(), pending_.end(),
                                  [&](const ActionEntry& e) {
                                      if (e.type != entry.type) return false;
                                      if (!entry.quoteNo.empty()) return e.quoteNo == entry.quoteNo;
                                      if (!entry.poNo.empty()) return e.poNo == entry.poNo;
                                      if (!entry.shipmentId.empty())
                                          return e.shipmentId == entry.shipmentId;
                                      return false;
                                  }),
                   pending_.end());
    pending_.push_back(std::move(entry));
}

std::vector<ActionEntry> DailyActionRepository::pending() const { return pending_; }

void DailyActionRepository::appendPosted(ActionEntry entry) {
    entry.status = "posted";
    posted_.push_back(std::move(entry));
}

std::vector<ActionEntry> DailyActionRepository::forDay(const std::string& day) const {
    std::vector<ActionEntry> out;
    for (const auto& e : posted_) {
        if (e.day == day) out.push_back(e);
    }
    return out;
}

std::vector<ActionEntry> DailyActionRepository::forActorDay(const std::string& actor,
                                                            const std::string& day) const {
    std::vector<ActionEntry> out;
    for (const auto& e : posted_) {
        if (e.actor == actor && e.day == day) out.push_back(e);
    }
    return out;
}

std::vector<ActionEntry> DailyActionRepository::allPosted() const { return posted_; }

std::vector<ActionEntry> DailyActionRepository::lookupByOrderNo(
    const std::string& orderNo) const {
    std::vector<ActionEntry> out;
    for (const auto& e : posted_) {
        if (e.orderNo == orderNo) out.push_back(e);
    }
    return out;
}

std::vector<ActionEntry> DailyActionRepository::lookupByQuoteNo(
    const std::string& quoteNo) const {
    std::vector<ActionEntry> out;
    for (const auto& e : posted_) {
        if (e.quoteNo == quoteNo) out.push_back(e);
    }
    return out;
}

std::vector<ActionEntry> DailyActionRepository::lookupByPoNo(const std::string& poNo) const {
    std::vector<ActionEntry> out;
    for (const auto& e : posted_) {
        if (e.poNo == poNo) out.push_back(e);
    }
    return out;
}

std::vector<ActionEntry> DailyActionRepository::lookupByGrnNo(const std::string& grnNo) const {
    std::vector<ActionEntry> out;
    for (const auto& e : posted_) {
        if (e.grnNo == grnNo) out.push_back(e);
    }
    return out;
}

}  // namespace bos
