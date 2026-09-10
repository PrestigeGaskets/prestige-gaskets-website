#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include "IDataStore.h"

namespace bos {

// Mirrors hidden Lists sheet + data validations.
class ListCatalog {
public:
    explicit ListCatalog(IDataStore& store);

    void reload();
    const std::vector<std::string>& values(const std::string& listName) const;

private:
    IDataStore& store_;
    std::unordered_map<std::string, std::vector<std::string>> lists_;
    static const std::vector<std::string> kEmpty_;
};

}  // namespace bos
