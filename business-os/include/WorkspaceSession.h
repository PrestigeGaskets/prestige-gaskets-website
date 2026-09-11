#pragma once

#include <functional>
#include <memory>
#include <string>
#include <vector>

#include "ICommand.h"
#include "IDataStore.h"
#include "IWorkspaceSession.h"
#include "WorkingCopyStore.h"

namespace bos {

// Concrete workspace: sealed MasterStore + mutable WorkingCopyStore + edit mode.
class WorkspaceSession : public IWorkspaceSession {
public:
    WorkspaceSession();

    IDataStore& workingStore() override;
    const IDataStore& masterStore() const override;

    bool isDirty() const override;
    bool isEditMode() const override;
    void setEditMode(bool on) override;

    void discardToMaster() override;
    void postJournal() override;
    bool undo() override;
    bool redo() override;
    void runMutation(const std::string& label, std::function<void()> mutate) override;

    std::string statusSummary() const override;

    WorkingCopyStore& workingCopy();

private:
    MasterStore master_;
    WorkingCopyStore working_;
    bool editMode_ = true;  // live forms — Post commits; Reverse restores
    std::unique_ptr<ICommandInvoker> invoker_;
    std::vector<std::string> journal_;
};

}  // namespace bos
