#pragma once

#include <string>
#include <vector>

namespace bos {

struct AddressBlock {
    std::string name;
    std::string line1;
    std::string line2;
    std::string city;
    std::string postcode;
    std::string phone;
    std::string fax;
};

struct PoLine {
    std::string poNo;  // FK → PurchaseOrder.poNo
    int line = 0;
    std::string sku;  // FK → Product.sku
    double qty = 0.0;
    double unitCost = 0.0;

    double lineTotal() const { return qty * unitCost; }
};

struct PoMemo {
    std::string poNo;
    int id = 0;
    std::string text;
};

struct PoAttachment {
    std::string poNo;
    int id = 0;
    std::string fileName;
    std::string note;
};

/// Purchase order header — maps to M1 PO Entry form panels.
struct PurchaseOrder {
    std::string poNo;       // PK e.g. 70286
    std::string supplierId; // FK → Supplier.id

    // Supplier Info
    std::string invLocation;
    std::string purLocation;
    std::string orgAccountId;
    std::string dropShipOrgId;
    std::string dropShipLocation;
    std::string apContact;
    std::string purchasingContact;
    std::string dropShipContact;

    // Address snapshots (denormalised at save)
    AddressBlock invAddress;
    AddressBlock purAddress;
    AddressBlock dropShipAddress;

    // Shipping
    std::string paymentTerms;
    std::string dueDate;
    std::string shipMethod;
    std::string fob;
    std::string supplierRating;
    bool landedCost = false;

    // Other
    std::string orderDate;
    std::string buyer;
    std::string standardMessage;
    std::string comments;
    bool readyToPrint = false;

    // Currency
    std::string currency;  // e.g. GBP
    double exchangeRate = 1.0;
    bool customRate = false;

    // Status
    std::string status;  // Draft | Pending Approval | Approved | Closed
    double value = 0.0;

    std::vector<PoLine> lines;
    std::vector<PoMemo> memos;
    std::vector<PoAttachment> attachments;
};

}  // namespace bos
