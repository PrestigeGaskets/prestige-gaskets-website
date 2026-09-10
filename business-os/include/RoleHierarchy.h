#pragma once

#include <string>
#include <unordered_set>
#include <vector>

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

class RoleHierarchy {
public:
    RoleHierarchy();

    const std::vector<RoleDefinition>& all() const { return roles_; }
    bool canEdit(const std::string& roleName, const std::string& fieldKey) const;
    bool canAdd(const std::string& roleName, const std::string& entity) const;

private:
    std::vector<RoleDefinition> roles_;
    void collectEdit(const std::string& roleName, std::unordered_set<std::string>& out) const;
    void collectAdd(const std::string& roleName, std::unordered_set<std::string>& out) const;
};

}  // namespace bos
