#pragma once

#include <string>
#include <vector>

#include "PurchaseOrder.h"  // AddressBlock

namespace bos {

struct ShipmentLine {
    std::string shipmentId;  // FK → Shipment.shipmentId
    int line = 0;
    std::string sku;         // Part ID → Product.sku
    std::string revision;
    std::string warehouseBin;
    double deliveryQty = 0.0;
    double openQty = 0.0;
    double jobQtyShipped = 0.0;
    double qtyShipped = 0.0;
    bool shipComplete = false;
    bool invoiceComplete = false;
    std::string deliveryDate;
    std::string jobId;
    std::string orderNo;  // FK → Order.orderNo (Sales Order number)
};

struct ShipmentMemo {
    std::string shipmentId;
    int id = 0;
    std::string text;
};

struct ShipmentAttachment {
    std::string shipmentId;
    int id = 0;
    std::string fileName;
    std::string note;
};

/// Customer shipment — maps to M1 Shipment Entry form panels.
struct Shipment {
    std::string shipmentId;  // PK e.g. 275525
    std::string shipDate;    // en-GB
    bool reversalEntry = false;

    // Customer Info
    std::string customerId;  // FK → Customer.id
    std::string invLocation;
    std::string shipOrganisation;
    std::string shipLocation;
    std::string arContact;
    std::string shippingContact;
    bool creditHold = false;

    AddressBlock customerAddress;

    // Shipping Info
    std::string shipMethodId;
    std::string shipPaymentType;
    std::string trackingNumber;

    // Carrier / freight
    std::string currency;  // GBP
    double exchangeRate = 1.0;
    bool customRate = false;
    double freightSubtotal = 0.0;
    double taxTotal = 0.0;
    double freightTotal = 0.0;
    double weightTotal = 0.0;
    std::string shippingComments;

    // Report Info
    bool printPackingSlip = false;
    bool printLabels = false;
    std::string standardMessage;
    bool deliveryNoteIssued = false;
    std::string deliveryNoteNo;  // e.g. DN-275525

    // Status
    std::string status;  // Draft | Open | Shipped | Posted | Closed

    std::vector<ShipmentLine> lines;
    std::vector<ShipmentMemo> memos;
    std::vector<ShipmentAttachment> attachments;
};

}  // namespace bos
