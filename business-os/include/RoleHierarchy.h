#pragma once

#include <string>
#include <unordered_set>
#include <vector>

#include "IRolePolicy.h"

namespace bos {

// Hierarchical roles: child inherits parent permissions.
// Edits / creates always target a WorkingCopy — never MasterStore.
struct RoleDefinition {
    std::string name;
    std::vector<std::string> inherits;
    std::string blurb;
    std::vector<std::string> canEdit;  // field keys e.g. "products.onHand", "custom.*"
    std::vector<std::string> canAdd;   // customers | products | quotes | quoteLines | orders | customFields
};

class RoleHierarchy : public IRolePolicy {
public:
    RoleHierarchy();

    const std::vector<RoleDefinition>& definitions() const { return roles_; }

    bool canEdit(const std::string& roleName, const std::string& fieldKey) const override;
    bool canAdd(const std::string& roleName, const std::string& entity) const override;
    std::vector<std::string> roleNames() const override;
    std::string blurb(const std::string& roleName) const override;

private:
    std::vector<RoleDefinition> roles_;
    void collectEdit(const std::string& roleName, std::unordered_set<std::string>& out) const;
    void collectAdd(const std::string& roleName, std::unordered_set<std::string>& out) const;
};

}  // namespace bos
