#include "Application.h"

#include "ConsoleUi.h"
#include "CustomerRepository.h"
#include "DashboardService.h"
#include "IntakeService.h"
#include "InventoryService.h"
#include "OrderRepository.h"
#include "ProductCatalog.h"
#include "QuoteRepository.h"
#include "QuoteService.h"
#include "RoleHierarchy.h"
#include "RelationService.h"
#include "WorkingCopyStore.h"
#include "WorkspaceSession.h"

#include <chrono>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <utility>
#include <vector>

namespace bos {

Application::Application() { wire(); }

void Application::wire() {
    auto session = std::make_unique<WorkspaceSession>();
    workingCopy_ = &session->workingCopy();
    IDataStore& store = session->workingStore();

    roles_ = std::make_unique<RoleHierarchy>();
    customers_ = std::make_unique<CustomerRepository>(store);
    products_ = std::make_unique<ProductCatalog>(store);
    quotes_ = std::make_unique<QuoteRepository>(store);
    orders_ = std::make_unique<OrderRepository>(store);
    quoteService_ = std::make_unique<QuoteService>(*quotes_);
    inventory_ = std::make_unique<InventoryService>(*products_);
    dashboard_ =
        std::make_unique<DashboardService>(*customers_, *products_, *quoteService_, *orders_);
    relations_ = std::make_unique<RelationService>(store);
    intake_ = std::make_unique<IntakeService>(*workingCopy_);
    ui_ = std::make_unique<ConsoleUi>(*dashboard_, *quoteService_, *inventory_, *customers_,
                                     *orders_);

    session_ = std::move(session);
    inventory_->refreshReorderFlags();
}

std::string Application::nowIso() const {
    const auto now = std::chrono::system_clock::now();
    const std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm tm{};
#if defined(_WIN32)
    gmtime_s(&tm, &t);
#else
    gmtime_r(&t, &tm);
#endif
    std::ostringstream os;
    os << std::put_time(&tm, "%Y-%m-%dT%H:%M:%SZ");
    return os.str();
}

std::string Application::todayLocal() const {
    const auto now = std::chrono::system_clock::now();
    const std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm tm{};
#if defined(_WIN32)
    localtime_s(&tm, &t);
#else
    localtime_r(&t, &tm);
#endif
    std::ostringstream os;
    os << std::put_time(&tm, "%Y-%m-%d");
    return os.str();
}

std::string Application::nextActionId() {
    ++actionSeq_;
    return "ACT-" + std::to_string(actionSeq_);
}

bool Application::handleCommand(const std::string& cmd) {
    if (cmd == "quit" || cmd == "exit" || cmd == "q") {
        return false;
    }
    if (cmd == "help" || cmd == "?") {
        ui_->showToast(
            "dashboard|quotes|products|customers|orders|relations|intake|"
            "accept-quote Q-101|receive-po 70286|post-shipment 275525|unpost-shipment 275525|"
            "edit|post|undo|redo|discard|role|status|actions");
        return true;
    }
    if (cmd == "dashboard") {
        ui_->showDashboard();
        return true;
    }
    if (cmd == "relations" || cmd == "intake") {
        relations_->print();
        return true;
    }
    if (cmd == "quotes") {
        ui_->showQuotes();
        return true;
    }
    if (cmd == "products") {
        ui_->showProducts();
        return true;
    }
    if (cmd == "customers") {
        ui_->showCustomers();
        return true;
    }
    if (cmd == "orders") {
        ui_->showOrders();
        return true;
    }
    if (cmd == "status") {
        ui_->showToast(session_->statusSummary() + " | role=" + activeRole_ +
                       " | pending=" + std::to_string(actions_.pending().size()));
        return true;
    }
    if (cmd == "actions") {
        std::ostringstream os;
        os << "pending=" << actions_.pending().size()
           << " posted=" << actions_.allPosted().size();
        for (const auto& e : actions_.pending()) {
            os << "\n  [staged] " << e.type << " " << e.detail;
        }
        for (const auto& e : actions_.forActorDay(activeRole_, todayLocal())) {
            os << "\n  [posted " << e.day << "] " << e.type << " " << e.detail;
        }
        ui_->showToast(os.str());
        return true;
    }
    if (cmd.rfind("role", 0) == 0) {
        std::istringstream iss(cmd);
        std::string verb;
        std::string name;
        iss >> verb >> name;
        if (name.empty()) {
            std::ostringstream os;
            os << "roles:";
            for (const auto& r : roles_->roleNames()) {
                os << ' ' << r;
            }
            os << " (active=" << activeRole_ << ")";
            ui_->showToast(os.str());
        } else {
            bool known = false;
            for (const auto& r : roles_->roleNames()) {
                if (r == name) {
                    known = true;
                    break;
                }
            }
            if (!known) {
                ui_->showToast("Unknown role: " + name);
            } else {
                activeRole_ = name;
                ui_->showToast("Active role → " + activeRole_ + " — " + roles_->blurb(activeRole_));
            }
        }
        return true;
    }
    if (cmd == "edit") {
        if (!roles_->canEdit(activeRole_, "products.onHand") &&
            !roles_->canEdit(activeRole_, "customers.name") &&
            !roles_->canEdit(activeRole_, "*")) {
            bool anyAdd = false;
            for (const auto& entity : {"customers", "products", "quotes", "orders",
                                       "purchaseOrders", "goodsReceipts", "shipments",
                                       "customFields", "*"}) {
                if (roles_->canAdd(activeRole_, entity)) {
                    anyAdd = true;
                    break;
                }
            }
            if (!anyAdd && activeRole_ == "Viewer") {
                ui_->showToast("Viewer cannot enter edit mode.");
                return true;
            }
        }
        session_->setEditMode(true);
        ui_->showToast("Edit mode ON — mutations go to working copy only.");
        return true;
    }
    if (cmd == "post") {
        const auto pending = actions_.pending();
        const std::string day = todayLocal();
        const std::string postedAt = nowIso();
        std::ostringstream summary;
        int n = 0;

        try {
            for (const auto& staged : pending) {
                ActionEntry live = staged;
                live.actor = activeRole_;
                live.day = day;
                live.postedAt = postedAt;
                live.status = "posted";

                if (staged.type == "accept-quote") {
                    std::string soNo;
                    session_->runMutation("post accept-quote " + staged.quoteNo, [&]() {
                        soNo = intake_->acceptQuoteToSalesOrder(staged.quoteNo);
                    });
                    live.orderNo = soNo;
                    live.detail = "Accept " + staged.quoteNo + " → " + soNo;
                } else if (staged.type == "receive-po") {
                    std::string grnNo;
                    session_->runMutation("post receive-po " + staged.poNo, [&]() {
                        grnNo = intake_->receivePurchaseOrder(staged.poNo, {}, activeRole_);
                    });
                    live.grnNo = grnNo;
                    live.detail = "Receive " + staged.poNo + " → " + grnNo;
                } else if (staged.type == "post-shipment") {
                    session_->runMutation("post shipment " + staged.shipmentId, [&]() {
                        intake_->postShipment(staged.shipmentId);
                    });
                    live.detail = "Ship " + staged.shipmentId + " posted · DN + OH issued";
                } else if (staged.type == "unpost-shipment") {
                    session_->runMutation("unpost shipment " + staged.shipmentId, [&]() {
                        intake_->unpostShipment(staged.shipmentId);
                    });
                    live.detail = "Unpost " + staged.shipmentId + " · DN cleared · OH restored";
                }

                actions_.appendPosted(live);
                if (n++) summary << " · ";
                summary << live.detail;
            }
            actions_.clearPending();

            if (pending.empty() && session_->isDirty()) {
                ActionEntry edits;
                edits.id = nextActionId();
                edits.day = day;
                edits.actor = activeRole_;
                edits.type = "working-copy-edits";
                edits.status = "posted";
                edits.stagedAt = postedAt;
                edits.postedAt = postedAt;
                edits.detail = "Working-copy field edits";
                actions_.appendPosted(edits);
                if (n++) summary << " · ";
                summary << edits.detail;
            }

            quotes_->reload();
            orders_->reload();
            products_->reload();
            inventory_->refreshReorderFlags();
            session_->postJournal();

            if (n == 0) {
                ui_->showToast("Posted journal (master remains sealed).");
            } else {
                ui_->showToast("Posted " + std::to_string(n) + ": " + summary.str() +
                               " (action repo updated for " + activeRole_ + "/" + day + ")");
            }
        } catch (const std::exception& ex) {
            ui_->showToast(std::string("post failed: ") + ex.what());
        }
        return true;
    }
    if (cmd == "discard") {
        session_->discardToMaster();
        actions_.clearPending();
        customers_->reload();
        products_->reload();
        quotes_->reload();
        orders_->reload();
        inventory_->refreshReorderFlags();
        ui_->showToast("Discarded working copy → master (cleared staged actions).");
        return true;
    }
    if (cmd == "undo") {
        if (!session_->undo()) {
            ui_->showToast("Nothing to undo.");
        } else {
            customers_->reload();
            products_->reload();
            quotes_->reload();
            orders_->reload();
            ui_->showToast("Undone.");
        }
        return true;
    }
    if (cmd == "redo") {
        if (!session_->redo()) {
            ui_->showToast("Nothing to redo.");
        } else {
            customers_->reload();
            products_->reload();
            quotes_->reload();
            orders_->reload();
            ui_->showToast("Redone.");
        }
        return true;
    }

    if (cmd.rfind("accept-quote ", 0) == 0) {
        if (!session_->isEditMode()) {
            ui_->showToast("Enter edit mode first (edit).");
            return true;
        }
        if (!roles_->canAdd(activeRole_, "orders") && !roles_->canAdd(activeRole_, "*")) {
            ui_->showToast("Role " + activeRole_ + " cannot create sales orders.");
            return true;
        }
        const std::string quoteNo = cmd.substr(13);
        ActionEntry entry;
        entry.id = nextActionId();
        entry.day = todayLocal();
        entry.actor = activeRole_;
        entry.type = "accept-quote";
        entry.stagedAt = nowIso();
        entry.quoteNo = quoteNo;
        entry.detail = "Stage accept " + quoteNo + " → Sales Order on Post";
        actions_.stage(entry);
        ui_->showToast("Quote " + quoteNo + " staged — run post to create Sales Order.");
        return true;
    }

    if (cmd.rfind("receive-po ", 0) == 0) {
        if (!session_->isEditMode()) {
            ui_->showToast("Enter edit mode first (edit).");
            return true;
        }
        if (!roles_->canAdd(activeRole_, "goodsReceipts") && !roles_->canAdd(activeRole_, "*")) {
            ui_->showToast("Role " + activeRole_ + " cannot post GRNs.");
            return true;
        }
        const std::string poNo = cmd.substr(11);
        ActionEntry entry;
        entry.id = nextActionId();
        entry.day = todayLocal();
        entry.actor = activeRole_;
        entry.type = "receive-po";
        entry.stagedAt = nowIso();
        entry.poNo = poNo;
        entry.detail = "Stage receive PO " + poNo + " → GRN on Post";
        actions_.stage(entry);
        ui_->showToast("PO " + poNo + " staged — run post to create GRN.");
        return true;
    }

    if (cmd.rfind("post-shipment ", 0) == 0) {
        if (!session_->isEditMode()) {
            ui_->showToast("Enter edit mode first (edit).");
            return true;
        }
        if (!roles_->canAdd(activeRole_, "shipments") &&
            !roles_->canEdit(activeRole_, "shipments.status") &&
            !roles_->canAdd(activeRole_, "*")) {
            ui_->showToast("Role " + activeRole_ + " cannot post shipments.");
            return true;
        }
        const std::string shipmentId = cmd.substr(14);
        ActionEntry entry;
        entry.id = nextActionId();
        entry.day = todayLocal();
        entry.actor = activeRole_;
        entry.type = "post-shipment";
        entry.stagedAt = nowIso();
        entry.shipmentId = shipmentId;
        entry.detail = "Stage ship " + shipmentId + " → DN + OH on Post";
        actions_.stage(entry);
        ui_->showToast("Shipment " + shipmentId + " staged — run post to issue stock.");
        return true;
    }

    if (cmd.rfind("unpost-shipment ", 0) == 0) {
        if (!session_->isEditMode()) {
            ui_->showToast("Enter edit mode first (edit).");
            return true;
        }
        if (!roles_->canAdd(activeRole_, "shipments") &&
            !roles_->canEdit(activeRole_, "shipments.status") &&
            !roles_->canAdd(activeRole_, "*")) {
            ui_->showToast("Role " + activeRole_ + " cannot unpost shipments.");
            return true;
        }
        const std::string shipmentId = cmd.substr(16);
        ActionEntry entry;
        entry.id = nextActionId();
        entry.day = todayLocal();
        entry.actor = activeRole_;
        entry.type = "unpost-shipment";
        entry.stagedAt = nowIso();
        entry.shipmentId = shipmentId;
        entry.detail = "Stage unpost DN " + shipmentId + " → restore OH on Post";
        actions_.stage(entry);
        ui_->showToast("Unpost " + shipmentId + " staged — run post to restore stock.");
        return true;
    }

    if (cmd.rfind("set OH ", 0) == 0) {
        if (!session_->isEditMode()) {
            ui_->showToast("Enter edit mode first (edit).");
            return true;
        }
        if (!roles_->canEdit(activeRole_, "products.onHand") &&
            !roles_->canEdit(activeRole_, "*")) {
            ui_->showToast("Role " + activeRole_ + " cannot edit products.onHand");
            return true;
        }
        std::istringstream iss(cmd);
        std::string setTok, ohTok, sku;
        double value = 0.0;
        iss >> setTok >> ohTok >> sku >> value;
        if (!workingCopy_) {
            ui_->showToast("Working copy unavailable.");
            return true;
        }
        WorkingCopyStore* copy = workingCopy_;
        session_->runMutation("set OH " + sku, [copy, sku, value]() {
            copy->updateProductField(sku, "onHand", value);
        });
        products_->reload();
        inventory_->refreshReorderFlags();
        ui_->showToast("Working copy updated: " + sku + " OH=" +
                       std::to_string(static_cast<int>(value)));
        return true;
    }

    ui_->showToast("Unknown command. Type help.");
    return true;
}

int Application::run() {
    ui_->showBanner();
    ui_->showDashboard();
    ui_->showQuotes();
    ui_->showProducts();
    ui_->showToast(session_->statusSummary() + " | role=" + activeRole_ + " — " +
                   roles_->blurb(activeRole_));

    std::string cmd;
    while (ui_->promptCommand(cmd)) {
        if (cmd.empty()) {
            continue;
        }
        if (!handleCommand(cmd)) {
            break;
        }
    }
    return 0;
}

}  // namespace bos
