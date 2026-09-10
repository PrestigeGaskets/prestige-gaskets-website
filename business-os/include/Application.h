#pragma once

#include <string>

#include "CustomerRepository.h"
#include "DashboardService.h"
#include "InMemoryStore.h"
#include "InventoryService.h"
#include "ListCatalog.h"
#include "OrderRepository.h"
#include "ProductCatalog.h"
#include "QuoteRepository.h"
#include "QuoteService.h"

namespace bos {

// Process entry / composition root for BusinessOS.exe.
// CLI is temporary; GUI target look is previewed in gui-demo/index.html.
class Application {
public:
    Application();
    int run();

private:
    void wire();
    void printBanner() const;
    bool handleCommand(const std::string& cmd);

    InMemoryStore store_;
    CustomerRepository customers_;
    ProductCatalog products_;
    QuoteRepository quotes_;
    OrderRepository orders_;
    ListCatalog lists_;
    QuoteService quoteService_;
    InventoryService inventory_;
    DashboardService dashboard_;
};

}  // namespace bos
