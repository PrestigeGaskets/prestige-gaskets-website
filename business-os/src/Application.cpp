#include "Application.h"

#include <iostream>
#include <string>

namespace bos {

Application::Application()
    : store_(),
      customers_(store_),
      products_(store_),
      quotes_(store_),
      orders_(store_),
      lists_(store_),
      quoteService_(quotes_),
      inventory_(products_),
      dashboard_(customers_, products_, quoteService_, orders_) {
    wire();
}

void Application::wire() {
    inventory_.refreshReorderFlags();
    (void)lists_;  // reserved for DV / status pickers in later UI
}

void Application::printBanner() const {
    std::cout << "========================================\n"
              << "  SMB Business OS  (scaffold)\n"
              << "  BusinessOS.exe composition root\n"
              << "========================================\n"
              << "Commands: dashboard | quotes | products | customers | orders | help | quit\n\n";
}

bool Application::handleCommand(const std::string& cmd) {
    if (cmd == "quit" || cmd == "exit" || cmd == "q") {
        return false;
    }
    if (cmd == "help" || cmd == "?") {
        std::cout << "  dashboard  - KPI roll-up (Dashboard sheet)\n"
                  << "  quotes     - QuoteLines qty*price totals\n"
                  << "  products   - OH / ROP / lead / reorder flag\n"
                  << "  customers  - Customer master\n"
                  << "  orders     - tblOrders\n"
                  << "  quit       - exit\n\n";
        return true;
    }
    if (cmd == "dashboard") {
        dashboard_.print();
        return true;
    }
    if (cmd == "quotes") {
        quoteService_.printTotals();
        return true;
    }
    if (cmd == "products") {
        inventory_.refreshReorderFlags();
        inventory_.printInventory();
        return true;
    }
    if (cmd == "customers") {
        std::cout << "--- CUSTOMERS ---\n";
        for (const auto& c : customers_.all()) {
            std::cout << "  " << c.id << " " << c.name << " " << c.status << '\n';
        }
        std::cout << '\n';
        return true;
    }
    if (cmd == "orders") {
        std::cout << "--- ORDERS ---\n";
        for (const auto& o : orders_.all()) {
            std::cout << "  " << o.orderNo << " cust=" << o.customerId
                      << " status=" << o.status << " value=" << o.value << '\n';
        }
        std::cout << '\n';
        return true;
    }

    std::cout << "Unknown command. Type help.\n\n";
    return true;
}

int Application::run() {
    printBanner();
    dashboard_.print();
    quoteService_.printTotals();
    inventory_.printInventory();

    std::string cmd;
    while (true) {
        std::cout << "bos> " << std::flush;
        if (!std::getline(std::cin, cmd)) {
            break;
        }
        if (cmd.empty()) {
            continue;
        }
        if (!handleCommand(cmd)) {
            break;
        }
    }
    return 0;
}

}  // namespace bos
