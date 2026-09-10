#pragma once

#include <optional>
#include <string>
#include <vector>

#include "Customer.h"
#include "IDataStore.h"
#include "IRepositories.h"

namespace bos {

class CustomerRepository : public ICustomerRepository {
public:
    explicit CustomerRepository(IDataStore& store);

    void reload() override;
    const std::vector<Customer>& all() const override;
    std::optional<Customer> findById(const std::string& id) const override;

private:
    IDataStore& store_;
    std::vector<Customer> customers_;
};

}  // namespace bos
