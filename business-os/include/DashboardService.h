#pragma once

#include "CustomerRepository.h"
#include "Dashboard.h"
#include "OrderRepository.h"
#include "ProductCatalog.h"
#include "QuoteService.h"

namespace bos {

class DashboardService {
public:
    DashboardService(CustomerRepository& customers,
                     ProductCatalog& products,
                     QuoteService& quotes,
                     OrderRepository& orders);

    DashboardSnapshot build() const;
    void print() const;

private:
    CustomerRepository& customers_;
    ProductCatalog& products_;
    QuoteService& quotes_;
    OrderRepository& orders_;
};

}  // namespace bos
