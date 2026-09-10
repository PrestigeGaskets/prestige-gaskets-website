#pragma once

#include <optional>
#include <string>
#include <vector>

#include "IDataStore.h"
#include "Order.h"

namespace bos {

class OrderRepository {
public:
    explicit OrderRepository(IDataStore& store);

    void reload();
    const std::vector<Order>& all() const;
    std::optional<Order> findByNo(const std::string& orderNo) const;

private:
    IDataStore& store_;
    std::vector<Order> orders_;
};

}  // namespace bos
