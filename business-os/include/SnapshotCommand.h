#pragma once

#include <functional>
#include <string>

#include "ICommand.h"
#include "WorkingCopyStore.h"

namespace bos {

/// Captures working-copy state, runs a mutation, restores on undo.
class SnapshotCommand : public ICommand {
public:
    SnapshotCommand(WorkingCopyStore& store,
                    std::string name,
                    std::function<void()> mutate);

    std::string name() const override;
    bool canExecute() const override;
    void execute() override;
    void undo() override;

private:
    WorkingCopyStore& store_;
    std::string name_;
    std::function<void()> mutate_;
    WorkingCopyStore::Snapshot before_;
    bool executed_ = false;
};

}  // namespace bos
