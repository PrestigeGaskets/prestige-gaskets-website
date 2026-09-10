#include "CustomerRepository.h"

#include <algorithm>

namespace bos {

CustomerRepository::CustomerRepository(IDataStore& store) : store_(store) { reload(); }

void CustomerRepository::reload() { customers_ = store_.loadCustomers(); }

const std::vector<Customer>& CustomerRepository::all() const { return customers_; }

std::optional<Customer> CustomerRepository::findById(const std::string& id) const {
    const auto it = std::find_if(customers_.begin(), customers_.end(),
                                 [&](const Customer& c) { return c.id == id; });
    if (it == customers_.end()) {
        return std::nullopt;
    }
    return *it;
}

}  // namespace bos
