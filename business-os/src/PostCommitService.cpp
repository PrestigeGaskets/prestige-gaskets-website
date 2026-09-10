#include "PostCommitService.h"

#include <chrono>
#include <ctime>
#include <iomanip>
#include <sstream>

namespace bos {

PostCommitService::PostCommitService(IDailyActionRepository& actions,
                                     IIntakeService& intake,
                                     IWorkspaceSession& session)
    : actions_(actions), intake_(intake), session_(session) {}

std::string PostCommitService::nowIso() const {
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

std::string PostCommitService::todayLocal() const {
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

std::string PostCommitService::nextActionId() {
    ++actionSeq_;
    return "ACT-" + std::to_string(actionSeq_);
}

void PostCommitService::stageAcceptQuote(const std::string& quoteNo,
                                         const std::string& actor) {
    ActionEntry entry;
    entry.id = nextActionId();
    entry.day = todayLocal();
    entry.actor = actor;
    entry.type = "accept-quote";
    entry.stagedAt = nowIso();
    entry.quoteNo = quoteNo;
    entry.detail = "Stage accept " + quoteNo + " → Sales Order on Post";
    actions_.stage(std::move(entry));
}

void PostCommitService::stageReceivePo(const std::string& poNo, const std::string& actor) {
    ActionEntry entry;
    entry.id = nextActionId();
    entry.day = todayLocal();
    entry.actor = actor;
    entry.type = "receive-po";
    entry.stagedAt = nowIso();
    entry.poNo = poNo;
    entry.detail = "Stage receive PO " + poNo + " → GRN on Post";
    actions_.stage(std::move(entry));
}

void PostCommitService::stagePostShipment(const std::string& shipmentId,
                                          const std::string& actor) {
    ActionEntry entry;
    entry.id = nextActionId();
    entry.day = todayLocal();
    entry.actor = actor;
    entry.type = "post-shipment";
    entry.stagedAt = nowIso();
    entry.shipmentId = shipmentId;
    entry.detail = "Stage ship " + shipmentId + " → OH on Post";
    actions_.stage(std::move(entry));
}

PostCommitResult PostCommitService::commit(const std::string& actor) {
    const auto pending = actions_.pending();
    const std::string day = todayLocal();
    const std::string postedAt = nowIso();
    PostCommitResult result;
    std::ostringstream summary;

    for (const auto& staged : pending) {
        ActionEntry live = staged;
        live.actor = actor;
        live.day = day;
        live.postedAt = postedAt;
        live.status = "posted";

        if (staged.type == "accept-quote") {
            std::string soNo;
            session_.runMutation("post accept-quote " + staged.quoteNo, [&]() {
                soNo = intake_.acceptQuoteToSalesOrder(staged.quoteNo);
            });
            live.orderNo = soNo;
            live.detail = "Accept " + staged.quoteNo + " → " + soNo;
        } else if (staged.type == "receive-po") {
            std::string grnNo;
            session_.runMutation("post receive-po " + staged.poNo, [&]() {
                grnNo = intake_.receivePurchaseOrder(staged.poNo, {}, actor);
            });
            live.grnNo = grnNo;
            live.detail = "Receive " + staged.poNo + " → " + grnNo;
        } else if (staged.type == "post-shipment") {
            session_.runMutation("post shipment " + staged.shipmentId, [&]() {
                intake_.postShipment(staged.shipmentId);
            });
            live.detail = "Ship " + staged.shipmentId + " posted · OH issued";
        }

        actions_.appendPosted(live);
        if (result.count++) summary << " · ";
        summary << live.detail;
    }
    actions_.clearPending();

    if (pending.empty() && session_.isDirty()) {
        ActionEntry edits;
        edits.id = nextActionId();
        edits.day = day;
        edits.actor = actor;
        edits.type = "working-copy-edits";
        edits.status = "posted";
        edits.stagedAt = postedAt;
        edits.postedAt = postedAt;
        edits.detail = "Working-copy field edits";
        actions_.appendPosted(edits);
        if (result.count++) summary << " · ";
        summary << edits.detail;
    }

    session_.postJournal();
    result.summary = summary.str();
    return result;
}

void PostCommitService::clearPending() { actions_.clearPending(); }

std::size_t PostCommitService::pendingCount() const { return actions_.pending().size(); }

std::string PostCommitService::describePendingAndToday(const std::string& actor) const {
    std::ostringstream os;
    os << "pending=" << actions_.pending().size()
       << " posted=" << actions_.allPosted().size();
    for (const auto& e : actions_.pending()) {
        os << "\n  [staged] " << e.type << " " << e.detail;
    }
    for (const auto& e : actions_.forActorDay(actor, todayLocal())) {
        os << "\n  [posted " << e.day << "] " << e.type << " " << e.detail;
    }
    return os.str();
}

}  // namespace bos
