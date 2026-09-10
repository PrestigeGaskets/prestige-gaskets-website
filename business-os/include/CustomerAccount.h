#pragma once

#include <string>

namespace bos {

/// 1:1 with Customer — exactly one account row per customerId (unique FK).
struct CustomerAccount {
    std::string customerId;   // PK + FK → Customer.id (unique)
    std::string accountCode;  // e.g. ACC-C004
    double creditLimit = 0.0;
    std::string paymentTerms; // e.g. Net-30
};

/// 1:1 with Order — at most one invoice per orderNo (unique FK).
struct Invoice {
    std::string invoiceNo;  // PK
    std::string orderNo;    // FK → Order.orderNo (unique) — 1:1
    std::string status;     // Draft | Issued | Paid
    double amount = 0.0;
};

}  // namespace bos
