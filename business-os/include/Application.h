#pragma once

#include <memory>
#include <string>

#include "IRolePolicy.h"
#include "IServices.h"
#include "IUserInterface.h"
#include "IWorkspaceSession.h"
#include "IRepositories.h"

namespace bos {

class WorkingCopyStore;  // composition-root mutation target (not an abstract port)

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
    std::unique_ptr<IUserInterface> ui_;

    // Non-owning: lifetime owned by session_ concrete. Used only at composition root.
    WorkingCopyStore* workingCopy_ = nullptr;

    std::string activeRole_ = "Manager";
};

}  // namespace bos
