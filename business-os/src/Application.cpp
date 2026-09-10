#include "Application.h"

#include "ConsoleUi.h"
#include "CustomerRepository.h"
#include "DailyActionRepository.h"
#include "DashboardService.h"
#include "IntakeService.h"
#include "InventoryService.h"
#include "OrderRepository.h"
#include "PostCommitService.h"
#include "ProductCatalog.h"
#include "QuoteRepository.h"
#include "QuoteService.h"
#include "RoleHierarchy.h"
#include "RelationService.h"
#include "WorkspaceSession.h"

#include <iostream>
#include <sstream>
#include <utility>
#include <vector>

namespace bos {

Application::Application() { wire(); }

void Application::wire() {
    auto session = std::make_unique<WorkspaceSession>();
    mutations_ = &session->workingCopy();  // WorkingCopyStore : IWorkingCopyMutations
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
    intake_ = std::make_unique<IntakeService>(*mutations_);
    actions_ = std::make_unique<DailyActionRepository>();
    ui_ = std::make_unique<ConsoleUi>(*dashboard_, *quoteService_, *inventory_, *customers_,
                                     *orders_);

    session_ = std::move(session);
    postCommit_ = std::make_unique<PostCommitService>(*actions_, *intake_, *session_);
    inventory_->refreshReorderFlags();
}

bool Application::handleCommand(const std::string& cmd) {
    if (cmd == "quit" || cmd == "exit" || cmd == "q") {
        return false;
    }
    if (cmd == "help" || cmd == "?") {
        ui_->showToast(
            "dashboard|quotes|products|customers|orders|relations|intake|"
            "accept-quote Q-101|receive-po 70286|post-shipment 275525|"
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
                       " | pending=" + std::to_string(postCommit_->pendingCount()));
        return true;
    }
    if (cmd == "actions") {
        ui_->showToast(postCommit_->describePendingAndToday(activeRole_));
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
        try {
            const PostCommitResult result = postCommit_->commit(activeRole_);
            quotes_->reload();
            orders_->reload();
            products_->reload();
            inventory_->refreshReorderFlags();
            if (result.count == 0) {
                ui_->showToast("Posted journal (master remains sealed).");
            } else {
                ui_->showToast("Posted " + std::to_string(result.count) + ": " + result.summary +
                               " (action repo updated for " + activeRole_ + ")");
            }
        } catch (const std::exception& ex) {
            ui_->showToast(std::string("post failed: ") + ex.what());
        }
        return true;
    }
    if (cmd == "discard") {
        session_->discardToMaster();
        postCommit_->clearPending();
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
        postCommit_->stageAcceptQuote(quoteNo, activeRole_);
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
        postCommit_->stageReceivePo(poNo, activeRole_);
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
        postCommit_->stagePostShipment(shipmentId, activeRole_);
        ui_->showToast("Shipment " + shipmentId + " staged — run post to issue stock.");
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
        if (!mutations_) {
            ui_->showToast("Working copy unavailable.");
            return true;
        }
        IWorkingCopyMutations* mutations = mutations_;
        session_->runMutation("set OH " + sku, [mutations, sku, value]() {
            mutations->updateProductField(sku, "onHand", value);
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
