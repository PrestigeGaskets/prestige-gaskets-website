#pragma once

#include <string>
#include <vector>

#include "IDataStore.h"
#include "IServices.h"
#include "Relations.h"

namespace bos {

/// Validates FK integrity and documents the master relationship graph.
class RelationService : public IRelationService {
public:
    explicit RelationService(IDataStore& store);

    std::vector<RelationEdge> catalog() const override;
    std::vector<std::string> validate() const override;
    void print() const override;

private:
    IDataStore& store_;
};

}  // namespace bos
