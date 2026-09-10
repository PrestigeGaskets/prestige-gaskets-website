#pragma once

#include <string>

#include "IRepositories.h"
#include "IServices.h"
#include "IWorkspaceSession.h"

namespace bos {

/// Polymorphic Post pipeline: stage → commit intake → daily action repository.
class PostCommitService : public IPostCommitService {
public:
    PostCommitService(IDailyActionRepository& actions,
                      IIntakeService& intake,
                      IWorkspaceSession& session);

    void stageAcceptQuote(const std::string& quoteNo, const std::string& actor) override;
    void stageReceivePo(const std::string& poNo, const std::string& actor) override;
    void stagePostShipment(const std::string& shipmentId, const std::string& actor) override;
    void stageUnpostShipment(const std::string& shipmentId, const std::string& actor) override;

    PostCommitResult commit(const std::string& actor) override;

    void clearPending() override;
    std::size_t pendingCount() const override;
    std::string describePendingAndToday(const std::string& actor) const override;

private:
    std::string nowIso() const;
    std::string todayLocal() const;
    std::string nextActionId();

    IDailyActionRepository& actions_;
    IIntakeService& intake_;
    IWorkspaceSession& session_;
    int actionSeq_ = 0;
};

}  // namespace bos
