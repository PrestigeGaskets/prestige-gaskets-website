#include "OrderRepository.h"

#include <algorithm>

namespace bos {

OrderRepository::OrderRepository(IDataStore& store) : store_(store) { reload(); }

void OrderRepository::reload() { orders_ = store_.loadOrders(); }

const std::vector<Order>& OrderRepository::all() const { return orders_; }

std::optional<Order> OrderRepository::findByNo(const std::string& orderNo) const {
    const auto it = std::find_if(orders_.begin(), orders_.end(),
                                 [&](const Order& o) { return o.orderNo == orderNo; });
    if (it == orders_.end()) {
        return std::nullopt;
    }
    return *it;
}

}  // namespace bos
