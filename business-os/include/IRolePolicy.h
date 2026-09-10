#pragma once

#include <string>
#include <vector>

namespace bos {

// Authorization / role policy — hierarchical field network.
class IRolePolicy {
public:
    virtual ~IRolePolicy() = default;

    virtual bool canEdit(const std::string& roleName, const std::string& fieldKey) const = 0;
    virtual bool canAdd(const std::string& roleName, const std::string& entity) const = 0;
    virtual std::vector<std::string> roleNames() const = 0;
    virtual std::string blurb(const std::string& roleName) const = 0;
};

}  // namespace bos
