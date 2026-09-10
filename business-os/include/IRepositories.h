#pragma once

#include <optional>
#include <string>
#include <vector>

#include "Customer.h"
#include "Order.h"
#include "Product.h"
#include "Quote.h"

namespace bos {

// Abstract repository contracts — concrete repos implement these.
// Application / services depend only on these interfaces (DIP).

class ICustomerRepository {
public:
    virtual ~ICustomerRepository() = default;
    virtual void reload() = 0;
    virtual const std::vector<Customer>& all() const = 0;
    virtual std::optional<Customer> findById(const std::string& id) const = 0;
};

class IProductCatalog {
public:
    virtual ~IProductCatalog() = default;
    virtual void reload() = 0;
    virtual const std::vector<Product>& all() const = 0;
    virtual std::vector<Product>& mutableAll() = 0;
    virtual std::optional<Product> findBySku(const std::string& sku) const = 0;
};

class IQuoteRepository {
public:
    virtual ~IQuoteRepository() = default;
    virtual void reload() = 0;
    virtual const std::vector<Quote>& all() const = 0;
    virtual std::optional<Quote> findByNo(const std::string& quoteNo) const = 0;
};

class IOrderRepository {
public:
    virtual ~IOrderRepository() = default;
    virtual void reload() = 0;
    virtual const std::vector<Order>& all() const = 0;
    virtual std::optional<Order> findByNo(const std::string& orderNo) const = 0;
};

}  // namespace bos
