#pragma once

#include <optional>
#include <string>
#include <vector>

#include "IDataStore.h"
#include "IRepositories.h"
#include "Order.h"

namespace bos {

class OrderRepository : public IOrderRepository {
public:
    explicit OrderRepository(IDataStore& store);

    void reload() override;
    const std::vector<Order>& all() const override;
    std::optional<Order> findByNo(const std::string& orderNo) const override;

private:
    IDataStore& store_;
    std::vector<Order> orders_;
};

}  // namespace bos
