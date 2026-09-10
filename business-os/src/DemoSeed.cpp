#include "DemoSeed.h"

namespace bos {

DemoSeed makeDemoSeed() {
    DemoSeed s;

    s.customers = {
        {"C001", "Acme Fab", "buyer@acme.example", "B1 1AA", "Active", ""},
        {"C002", "Northline", "ops@northline.example", "M1 2AB", "Active", ""},
        {"C003", "Summit Seal", "purchasing@summit.example", "EH1 3EG", "Inactive", ""},
        {"C004", "Prestige Pilot", "pilot@prestige.example", "SW1A 1AA", "Active",
         "Sample from verify script"},
    };

    s.accounts = {
        {"C001", "ACC-C001", 5000.0, "Net-30"},
        {"C002", "ACC-C002", 12000.0, "Net-45"},
        {"C003", "ACC-C003", 2500.0, "Net-15"},
        {"C004", "ACC-C004", 20000.0, "Net-30"},
    };

    s.products = {
        {"P1001", "Flat gasket A", "Gasket", 2.50, 4.75, 120, 40, 7, false},
        {"P1002", "Cone seal B", "Seal", 3.10, 5.90, 18, 25, 14, false},
        {"P1003", "Ring C", "Ring", 1.20, 2.40, 80, 30, 5, false},
        {"P1004", "Sleeve D", "Sleeve", 4.00, 7.50, 55, 20, 10, false},
        {"P1005", "Washer E", "Washer", 0.40, 0.95, 200, 50, 3, false},
        {"P1006", "Spacer F", "Spacer", 1.80, 3.25, 12, 15, 8, false},
    };

    s.tags = {
        {"T-SEAL", "Sealing"},
        {"T-FAST", "Fastener"},
        {"T-STOCK", "Stocked"},
    };
    s.productTags = {
        {"P1001", "T-SEAL"},
        {"P1001", "T-STOCK"},
        {"P1002", "T-SEAL"},
        {"P1005", "T-FAST"},
        {"P1005", "T-STOCK"},
        {"P1006", "T-FAST"},
    };

    s.suppliers = {
        {"CITY0002", "CITY TODAY COURIERS LTD", "SK1 2ND", "UNIT 1 NEWBRIDGE LANE", "",
         "STOCKPORT", "0161 477 9800", "0161 477 4409"},
        {"S-01", "Midlands Rubber", "B1 2AA", "12 Forge Way", "", "Birmingham", "0121 555 0101", ""},
        {"S-02", "Clyde Components", "G1 1AA", "4 Quay Street", "", "Glasgow", "0141 555 0202", ""},
    };
    s.productSuppliers = {
        {"P1001", "S-01", 7, 2.40},
        {"P1001", "CITY0002", 5, 2.45},
        {"P1001", "S-02", 10, 2.55},
        {"P1002", "S-01", 14, 3.00},
        {"P1002", "CITY0002", 10, 3.05},
        {"P1003", "S-02", 5, 1.10},
        {"P1006", "S-01", 8, 1.70},
        {"P1006", "S-02", 12, 1.75},
    };

    Quote q1;
    q1.quoteNo = "Q-100";
    q1.customerId = "C004";
    q1.status = "Open";
    q1.lines = {
        {"Q-100", 1, "P1001", 10, 4.75, "=D2*E2"},
        {"Q-100", 2, "P1002", 5, 5.90, "=D3*E3"},
    };
    for (const auto& line : q1.lines) {
        q1.value += line.lineTotal();
    }

    Quote q2;
    q2.quoteNo = "Q-101";
    q2.customerId = "C001";
    q2.status = "Open";
    q2.lines = {
        {"Q-101", 1, "P1003", 40, 2.40, "=D2*E2"},
        {"Q-101", 2, "P1005", 100, 0.95, "=D3*E3"},
    };
    for (const auto& line : q2.lines) {
        q2.value += line.lineTotal();
    }
    s.quotes = {q1, q2};

    Order o1;
    o1.orderNo = "O-500";
    o1.quoteNo = "Q-100";
    o1.customerId = "C004";
    o1.status = "Shipped";
    o1.lines = {
        {"O-500", 1, "P1001", 10, 4.75},
        {"O-500", 2, "P1002", 5, 5.90},
    };
    for (const auto& line : o1.lines) {
        o1.value += line.lineTotal();
    }

    Order o2;
    o2.orderNo = "O-501";
    o2.quoteNo = "";
    o2.customerId = "C002";
    o2.status = "Open";
    o2.lines = {
        {"O-501", 1, "P1005", 80, 0.95},
        {"O-501", 2, "P1006", 10, 3.25},
    };
    for (const auto& line : o2.lines) {
        o2.value += line.lineTotal();
    }
    s.orders = {o1, o2};

    s.invoices = {
        {"INV-500", "O-500", "Paid", o1.value},
        {"INV-501", "O-501", "Draft", o2.value},
    };

    // Purchase order mirroring M1 template (Order ID 70286 / CITY0002)
    AddressBlock cityAddr{"CITY TODAY COURIERS LTD", "UNIT 1 NEWBRIDGE LANE", "", "STOCKPORT",
                          "SK1 2ND", "0161 477 9800", "0161 477 4409"};
    PurchaseOrder po;
    po.poNo = "70286";
    po.supplierId = "CITY0002";
    po.invLocation = "";
    po.purLocation = "";
    po.orgAccountId = "";
    po.dropShipOrgId = "";
    po.dropShipLocation = "";
    po.apContact = "";
    po.purchasingContact = "";
    po.dropShipContact = "";
    po.invAddress = cityAddr;
    po.purAddress = cityAddr;
    po.dropShipAddress = {};
    po.paymentTerms = "30 DAYS EOM";
    po.dueDate = "09/09/2026";
    po.shipMethod = "CARRIER";
    po.fob = "";
    po.supplierRating = "";
    po.landedCost = false;
    po.orderDate = "09/09/2026";
    po.buyer = "JAMES CRAVEN";
    po.standardMessage = "Purchasing additional terms and conditions apply.";
    po.comments = "";
    po.readyToPrint = true;
    po.currency = "GBP";
    po.exchangeRate = 1.0;
    po.customRate = false;
    po.status = "Approved";
    po.lines = {
        {"70286", 1, "P1001", 100, 2.45},
        {"70286", 2, "P1002", 40, 3.05},
    };
    for (const auto& line : po.lines) {
        po.value += line.lineTotal();
    }
    po.memos = {{"70286", 1, "Confirm carrier booking before print."}};
    po.attachments = {{"70286", 1, "vendor-quote-city.pdf", "Supplier quote"}};
    s.purchaseOrders = {po};

    PurchaseOrder po2;
    po2.poNo = "70290";
    po2.supplierId = "S-01";
    po2.invAddress = {"Midlands Rubber", "12 Forge Way", "", "Birmingham", "B1 2AA", "0121 555 0101",
                      ""};
    po2.purAddress = po2.invAddress;
    po2.paymentTerms = "Net-30";
    po2.dueDate = "20/09/2026";
    po2.shipMethod = "CARRIER";
    po2.orderDate = "10/09/2026";
    po2.buyer = "JAMES CRAVEN";
    po2.standardMessage = "Standard purchasing terms.";
    po2.readyToPrint = false;
    po2.currency = "GBP";
    po2.exchangeRate = 1.0;
    po2.status = "Draft";
    po2.lines = {{"70290", 1, "P1006", 25, 1.70}};
    for (const auto& line : po2.lines) {
        po2.value += line.lineTotal();
    }
    s.purchaseOrders.push_back(po2);

    s.lists["QuoteStatus"] = {"Open", "Sent", "Won", "Lost"};
    s.lists["OrderStatus"] = {"Open", "Picked", "Shipped", "Closed"};
    s.lists["CustomerStatus"] = {"Active", "Inactive"};
    s.lists["InvoiceStatus"] = {"Draft", "Issued", "Paid"};
    s.lists["PoStatus"] = {"Draft", "Pending Approval", "Approved", "Closed"};
    s.lists["PaymentTerms"] = {"30 DAYS EOM", "Net-30", "Net-45", "Net-15"};
    s.lists["ShipMethod"] = {"CARRIER", "COLLECT", "COURIER"};
    s.lists["Buyer"] = {"JAMES CRAVEN", "A. BUYER"};

    return s;
}

}  // namespace bos
