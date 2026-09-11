#pragma once

#include <functional>
#include <memory>
#include <string>

#include "IDataStore.h"

namespace bos {

// Workspace session: working-copy overlay over an immutable master.
// Forms are live (role-gated). Post commits; Reverse restores last snapshot.
class IWorkspaceSession {
public:
    virtual ~IWorkspaceSession() = default;

    virtual IDataStore& workingStore() = 0;
    virtual const IDataStore& masterStore() const = 0;

    virtual bool isDirty() const = 0;
    virtual bool isEditMode() const = 0;
    virtual void setEditMode(bool on) = 0;

    virtual void discardToMaster() = 0;
    virtual void postJournal() = 0;  // snapshot working → journal (master sealed)
    virtual bool undo() = 0;
    virtual bool redo() = 0;

    /// Polymorphic Command entry — concrete session wraps SnapshotCommand.
    virtual void runMutation(const std::string& label, std::function<void()> mutate) = 0;

    virtual std::string statusSummary() const = 0;
};

}  // namespace bos
