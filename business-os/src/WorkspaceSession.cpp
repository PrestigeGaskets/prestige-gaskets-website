#include "WorkspaceSession.h"

#include "CommandInvoker.h"
#include "SnapshotCommand.h"

#include <sstream>

namespace bos {

WorkspaceSession::WorkspaceSession()
    : master_(), working_(master_), invoker_(std::make_unique<CommandInvoker>()) {}

IDataStore& WorkspaceSession::workingStore() { return working_; }

const IDataStore& WorkspaceSession::masterStore() const { return master_; }

bool WorkspaceSession::isDirty() const { return working_.isDirty(); }

bool WorkspaceSession::isEditMode() const { return editMode_; }

void WorkspaceSession::setEditMode(bool on) { editMode_ = on; }

void WorkspaceSession::discardToMaster() {
    working_.resetToMaster();
    invoker_->clear();
    editMode_ = false;
}

void WorkspaceSession::postJournal() {
    std::ostringstream entry;
    entry << "post dirty=" << (working_.isDirty() ? "yes" : "no");
    journal_.push_back(entry.str());
    invoker_->clear();
    editMode_ = false;
}

bool WorkspaceSession::undo() { return invoker_->undo(); }

bool WorkspaceSession::redo() { return invoker_->redo(); }

void WorkspaceSession::runMutation(const std::string& label, std::function<void()> mutate) {
    invoker_->execute(std::make_unique<SnapshotCommand>(working_, label, std::move(mutate)));
}

std::string WorkspaceSession::statusSummary() const {
    std::ostringstream os;
    os << (editMode_ ? "EDIT" : "VIEW") << " | " << (working_.isDirty() ? "dirty" : "clean")
       << " | journal=" << journal_.size();
    return os.str();
}

WorkingCopyStore& WorkspaceSession::workingCopy() { return working_; }

}  // namespace bos
