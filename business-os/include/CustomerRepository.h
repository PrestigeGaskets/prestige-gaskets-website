#pragma once

#include <optional>
#include <string>
#include <vector>

#include "Customer.h"
#include "IDataStore.h"

namespace bos {

class CustomerRepository {
public:
    explicit CustomerRepository(IDataStore& store);

    void reload();
    const std::vector<Customer>& all() const;
    std::optional<Customer> findById(const std::string& id) const;

private:
    IDataStore& store_;
    std::vector<Customer> customers_;
};

}  // namespace bos
