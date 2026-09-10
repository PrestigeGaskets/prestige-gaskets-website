#include "SnapshotCommand.h"

namespace bos {

SnapshotCommand::SnapshotCommand(WorkingCopyStore& store,
                                 std::string name,
                                 std::function<void()> mutate)
    : store_(store), name_(std::move(name)), mutate_(std::move(mutate)) {}

std::string SnapshotCommand::name() const { return name_; }

bool SnapshotCommand::canExecute() const { return static_cast<bool>(mutate_); }

void SnapshotCommand::execute() {
    before_ = store_.capture();
    mutate_();
    executed_ = true;
}

void SnapshotCommand::undo() {
    if (executed_) {
        store_.restore(before_);
        executed_ = false;
    }
}

}  // namespace bos
