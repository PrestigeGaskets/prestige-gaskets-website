#pragma once

#include <map>
#include <string>

#include "Dashboard.h"
#include "Product.h"

namespace bos {

// Abstract service contracts — business logic behind polymorphic APIs.

class IQuoteService {
public:
    virtual ~IQuoteService() = default;
    virtual std::map<std::string, double> totalsByQuote() const = 0;
    virtual double grandTotal() const = 0;
    virtual void printTotals() const = 0;
};

class IInventoryService {
public:
    virtual ~IInventoryService() = default;
    virtual void refreshReorderFlags() = 0;
    virtual void printInventory() const = 0;
    virtual bool needsReorder(const Product& product) const = 0;
};

class IDashboardService {
public:
    virtual ~IDashboardService() = default;
    virtual DashboardSnapshot build() const = 0;
    virtual void print() const = 0;
};

}  // namespace bos
