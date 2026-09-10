#pragma once

#include <memory>
#include <string>

#include "IRolePolicy.h"
#include "IServices.h"
#include "IUserInterface.h"
#include "IWorkspaceSession.h"
#include "IRepositories.h"
#include "IWorkingCopyMutations.h"

namespace bos {

// Process entry / composition root for BusinessOS.exe.
// Owns concrete objects; collaborators see only abstract interfaces (DIP).
class Application {
public:
    Application();
    int run();

private:
    void wire();
    bool handleCommand(const std::string& cmd);

    std::unique_ptr<IWorkspaceSession> session_;
    std::unique_ptr<IRolePolicy> roles_;
    std::unique_ptr<ICustomerRepository> customers_;
    std::unique_ptr<IProductCatalog> products_;
    std::unique_ptr<IQuoteRepository> quotes_;
    std::unique_ptr<IOrderRepository> orders_;
    std::unique_ptr<IQuoteService> quoteService_;
    std::unique_ptr<IInventoryService> inventory_;
    std::unique_ptr<IDashboardService> dashboard_;
    std::unique_ptr<IRelationService> relations_;
    std::unique_ptr<IIntakeService> intake_;
    std::unique_ptr<IDailyActionRepository> actions_;
    std::unique_ptr<IPostCommitService> postCommit_;
    std::unique_ptr<IUserInterface> ui_;

    // Non-owning: lifetime owned by session_ concrete. Exposed only as IWorkingCopyMutations.
    IWorkingCopyMutations* mutations_ = nullptr;

    std::string activeRole_ = "Manager";
};

}  // namespace bos
