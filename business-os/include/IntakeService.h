#pragma once

#include <string>
#include <utility>
#include <vector>

#include "IServices.h"
#include "WorkingCopyStore.h"

namespace bos {

/// Orchestrates quote→Sales Order and PO→GRN intake on the working copy.
class IntakeService : public IIntakeService {
public:
    explicit IntakeService(WorkingCopyStore& working) : working_(working) {}

    std::string acceptQuoteToSalesOrder(const std::string& quoteNo) override {
        return working_.convertQuoteToSalesOrder(quoteNo);
    }

    std::string receivePurchaseOrder(const std::string& poNo,
                                     const std::vector<std::pair<int, double>>& qtys,
                                     const std::string& receivedBy) override {
        return working_.receiveGoodsAgainstPo(poNo, qtys, receivedBy);
    }

    void postShipment(const std::string& shipmentId) override {
        working_.postShipment(shipmentId);
    }

    void unpostShipment(const std::string& shipmentId) override {
        working_.unpostShipment(shipmentId);
    }

private:
    WorkingCopyStore& working_;
};

}  // namespace bos
