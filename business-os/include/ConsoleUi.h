#pragma once

#include <memory>
#include <string>

#include "IServices.h"
#include "IUserInterface.h"
#include "IRepositories.h"

namespace bos {

// Console adapter of IUserInterface — Win32/Qt shell will be another impl.
class ConsoleUi : public IUserInterface {
public:
    ConsoleUi(IDashboardService& dashboard,
              IQuoteService& quotes,
              IInventoryService& inventory,
              ICustomerRepository& customers,
              IOrderRepository& orders);

    void showBanner() override;
    void showToast(const std::string& message) override;
    void showDashboard() override;
    void showQuotes() override;
    void showProducts() override;
    void showCustomers() override;
    void showOrders() override;
    bool promptCommand(std::string& outCommand) override;

private:
    IDashboardService& dashboard_;
    IQuoteService& quotes_;
    IInventoryService& inventory_;
    ICustomerRepository& customers_;
    IOrderRepository& orders_;
};

}  // namespace bos
