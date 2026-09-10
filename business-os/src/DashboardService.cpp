#include "DashboardService.h"

#include <iostream>
#include <sstream>

namespace bos {

DashboardService::DashboardService(ICustomerRepository& customers,
                                   IProductCatalog& products,
                                   IQuoteService& quotes,
                                   IOrderRepository& orders)
    : customers_(customers), products_(products), quotes_(quotes), orders_(orders) {}

DashboardSnapshot DashboardService::build() const {
    DashboardSnapshot snap;
    snap.metrics.push_back({"Customers", std::to_string(customers_.all().size())});
    snap.metrics.push_back({"Products", std::to_string(products_.all().size())});

    std::ostringstream quoteVal;
    quoteVal.setf(std::ios::fixed);
    quoteVal.precision(2);
    quoteVal << quotes_.grandTotal();
    snap.metrics.push_back({"Open quote value", quoteVal.str()});
    snap.metrics.push_back({"Orders", std::to_string(orders_.all().size())});

    int reorderCount = 0;
    for (const auto& p : products_.all()) {
        if (p.onHand <= p.reorderPoint) {
            ++reorderCount;
        }
    }
    snap.metrics.push_back({"SKUs at/below ROP", std::to_string(reorderCount)});
    return snap;
}

void DashboardService::print() const {
    std::cout << "--- DASHBOARD ---\n";
    int row = 1;
    for (const auto& m : build().metrics) {
        std::cout << "  " << row++ << ": " << m.label << " | " << m.value << '\n';
    }
    std::cout << '\n';
}

}  // namespace bos
