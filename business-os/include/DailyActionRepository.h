#pragma once

#include <string>
#include <vector>

#include "ActionEntry.h"
#include "IRepositories.h"

namespace bos {

/// In-memory daily action repository (backend twin). No UI — report/API lookup only.
class DailyActionRepository : public IDailyActionRepository {
public:
    void clearPending() override;
    void stage(ActionEntry entry) override;
    std::vector<ActionEntry> pending() const override;

    void appendPosted(ActionEntry entry) override;
    std::vector<ActionEntry> forDay(const std::string& day) const override;
    std::vector<ActionEntry> forActorDay(const std::string& actor,
                                         const std::string& day) const override;
    std::vector<ActionEntry> allPosted() const override;

    std::vector<ActionEntry> lookupByOrderNo(const std::string& orderNo) const override;
    std::vector<ActionEntry> lookupByQuoteNo(const std::string& quoteNo) const override;
    std::vector<ActionEntry> lookupByPoNo(const std::string& poNo) const override;
    std::vector<ActionEntry> lookupByGrnNo(const std::string& grnNo) const override;

private:
    std::vector<ActionEntry> pending_;
    std::vector<ActionEntry> posted_;
};

}  // namespace bos
