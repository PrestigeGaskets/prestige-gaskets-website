#pragma once

#include <string>
#include <utility>
#include <vector>

namespace bos {

/// Abstract mutation port for working-copy intake / field updates.
/// Encapsulates WorkingCopyStore behind a polymorphic contract (DIP).
class IWorkingCopyMutations {
public:
    virtual ~IWorkingCopyMutations() = default;

    virtual std::string convertQuoteToSalesOrder(const std::string& quoteNo) = 0;
    virtual std::string receiveGoodsAgainstPo(
        const std::string& poNo,
        const std::vector<std::pair<int, double>>& qtys,
        const std::string& receivedBy) = 0;
    virtual void postShipment(const std::string& shipmentId) = 0;
    virtual void unpostShipment(const std::string& shipmentId) = 0;
    virtual void updateProductField(const std::string& sku,
                                    const std::string& field,
                                    double value) = 0;
};

}  // namespace bos
