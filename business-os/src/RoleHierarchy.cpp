#include "RoleHierarchy.h"

#include <algorithm>

namespace bos {

RoleHierarchy::RoleHierarchy() {
    roles_ = {
        {"Viewer", {}, "Read-only across the workbook twin.", {}, {}},
        {"Sales",
         {"Viewer"},
         "Own customers/quotes; accept received quotes → Sales Order number.",
         {"customers.name", "customers.email", "customers.postcode", "customers.status",
          "customers.notes", "quotes.customerId", "quotes.status", "quoteLines.qty",
          "quoteLines.price", "quoteLines.sku", "orders.status"},
         {"customers", "quotes", "quoteLines", "orders"}},
        {"Inventory",
         {"Viewer"},
         "Own product stock; post GRNs that update on-hand.",
         {"products.onHand", "products.reorderPoint", "products.leadDays", "products.cost",
          "products.sell", "products.description", "products.category"},
         {"products", "goodsReceipts"}},
        {"Finance",
         {"Viewer"},
         "Own products, orders, and custom field definitions.",
         {"products.cost", "products.sell", "orders.status", "orders.value", "orders.quoteNo",
          "orders.customerId", "custom.*"},
         {"products", "orders", "customFields"}},
        {"Purchasing",
         {"Viewer"},
         "Own POs and goods receipt (GRN) against supplier orders.",
         {"purchaseOrders.status", "purchaseOrders.buyer", "purchaseOrders.paymentTerms",
          "purchaseOrders.dueDate", "purchaseOrders.shipMethod", "purchaseOrders.comments",
          "purchaseOrders.currency", "purchaseOrders.readyToPrint", "purchaseOrders.supplierId",
          "purchaseOrders.lines.qty", "purchaseOrders.lines.unitCost", "purchaseOrders.lines.sku"},
         {"purchaseOrders", "poLines", "goodsReceipts"}},
        {"Manager",
         {"Sales", "Inventory", "Finance", "Purchasing"},
         "Inherits Sales + Inventory + Finance + Purchasing.",
         {},
         {}},
        {"Admin", {"Manager"}, "Full access including custom field admin.", {"*"}, {"*"}},
    };
}

void RoleHierarchy::collectEdit(const std::string& roleName,
                                std::unordered_set<std::string>& out) const {
    for (const auto& role : roles_) {
        if (role.name != roleName) {
            continue;
        }
        for (const auto& parent : role.inherits) {
            collectEdit(parent, out);
        }
        for (const auto& key : role.canEdit) {
            out.insert(key);
        }
        return;
    }
}

void RoleHierarchy::collectAdd(const std::string& roleName,
                               std::unordered_set<std::string>& out) const {
    for (const auto& role : roles_) {
        if (role.name != roleName) {
            continue;
        }
        for (const auto& parent : role.inherits) {
            collectAdd(parent, out);
        }
        for (const auto& key : role.canAdd) {
            out.insert(key);
        }
        return;
    }
}

bool RoleHierarchy::canEdit(const std::string& roleName, const std::string& fieldKey) const {
    std::unordered_set<std::string> allowed;
    collectEdit(roleName, allowed);
    if (allowed.count("*") || allowed.count(fieldKey)) {
        return true;
    }
    if (fieldKey.rfind("custom.", 0) == 0 && allowed.count("custom.*")) {
        return true;
    }
    return false;
}

bool RoleHierarchy::canAdd(const std::string& roleName, const std::string& entity) const {
    std::unordered_set<std::string> allowed;
    collectAdd(roleName, allowed);
    return allowed.count("*") > 0 || allowed.count(entity) > 0;
}

std::vector<std::string> RoleHierarchy::roleNames() const {
    std::vector<std::string> names;
    names.reserve(roles_.size());
    for (const auto& role : roles_) {
        names.push_back(role.name);
    }
    return names;
}

std::string RoleHierarchy::blurb(const std::string& roleName) const {
    for (const auto& role : roles_) {
        if (role.name == roleName) {
            return role.blurb;
        }
    }
    return {};
}

}  // namespace bos
