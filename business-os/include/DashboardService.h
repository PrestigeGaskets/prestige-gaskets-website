#pragma once

#include "Dashboard.h"
#include "IRepositories.h"
#include "IServices.h"

namespace bos {

class DashboardService : public IDashboardService {
public:
    DashboardService(ICustomerRepository& customers,
                     IProductCatalog& products,
                     IQuoteService& quotes,
                     IOrderRepository& orders);

    DashboardSnapshot build() const override;
    void print() const override;

private:
    ICustomerRepository& customers_;
    IProductCatalog& products_;
    IQuoteService& quotes_;
    IOrderRepository& orders_;
};

}  // namespace bos
