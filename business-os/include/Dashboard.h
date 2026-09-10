#pragma once

#include <string>
#include <vector>

namespace bos {

struct DashboardMetric {
    std::string label;  // Dashboard!A
    std::string value;  // Dashboard!B
};

struct DashboardSnapshot {
    std::vector<DashboardMetric> metrics;
};

}  // namespace bos
