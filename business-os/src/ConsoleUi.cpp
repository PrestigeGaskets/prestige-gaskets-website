#include "ConsoleUi.h"

#include <iostream>

namespace bos {

ConsoleUi::ConsoleUi(IDashboardService& dashboard,
                     IQuoteService& quotes,
                     IInventoryService& inventory,
                     ICustomerRepository& customers,
                     IOrderRepository& orders)
    : dashboard_(dashboard),
      quotes_(quotes),
      inventory_(inventory),
      customers_(customers),
      orders_(orders) {}

void ConsoleUi::showBanner() {
    std::cout << "========================================\n"
              << "  SMB Business OS  (polymorphic scaffold)\n"
              << "  BusinessOS.exe composition root\n"
              << "========================================\n"
              << "Commands: dashboard | quotes | products | customers | orders |\n"
              << "          relations | edit | post | undo | redo | discard | role | status | help | quit\n\n";
}

void ConsoleUi::showToast(const std::string& message) {
    std::cout << "[ui] " << message << "\n\n";
}

void ConsoleUi::showDashboard() { dashboard_.print(); }

void ConsoleUi::showQuotes() { quotes_.printTotals(); }

void ConsoleUi::showProducts() {
    inventory_.refreshReorderFlags();
    inventory_.printInventory();
}

void ConsoleUi::showCustomers() {
    std::cout << "--- CUSTOMERS ---\n";
    for (const auto& c : customers_.all()) {
        std::cout << "  " << c.id << " " << c.name << " " << c.postcode << " " << c.status << '\n';
    }
    std::cout << '\n';
}

void ConsoleUi::showOrders() {
    std::cout << "--- ORDERS ---\n";
    for (const auto& o : orders_.all()) {
        std::cout << "  " << o.orderNo << " cust=" << o.customerId
                  << " quote=" << (o.quoteNo.empty() ? "-" : o.quoteNo)
                  << " status=" << o.status << " value=" << o.value << '\n';
        for (const auto& line : o.lines) {
            std::cout << "      L" << line.line << " " << line.sku << " qty=" << line.qty
                      << " price=" << line.price << " total=" << line.lineTotal() << '\n';
        }
    }
    std::cout << '\n';
}

bool ConsoleUi::promptCommand(std::string& outCommand) {
    std::cout << "bos> " << std::flush;
    if (!std::getline(std::cin, outCommand)) {
        return false;
    }
    return true;
}

}  // namespace bos
