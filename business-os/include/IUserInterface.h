#pragma once

#include <string>

namespace bos {

// UI boundary — ConsoleUi now; GuiShell later. Application talks only to this.
class IUserInterface {
public:
    virtual ~IUserInterface() = default;

    virtual void showBanner() = 0;
    virtual void showToast(const std::string& message) = 0;
    virtual void showDashboard() = 0;
    virtual void showQuotes() = 0;
    virtual void showProducts() = 0;
    virtual void showCustomers() = 0;
    virtual void showOrders() = 0;
    virtual bool promptCommand(std::string& outCommand) = 0;
};

}  // namespace bos
