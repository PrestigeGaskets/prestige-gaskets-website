#pragma once

#include <memory>
#include <string>

namespace bos {

// Command pattern — polymorphic Edit / Post / Undo / Redo / Discard units.
class ICommand {
public:
    virtual ~ICommand() = default;
    virtual std::string name() const = 0;
    virtual bool canExecute() const = 0;
    virtual void execute() = 0;
    virtual void undo() = 0;
};

// History port — Application / UI depend on this, not a concrete stack.
class ICommandInvoker {
public:
    virtual ~ICommandInvoker() = default;
    virtual void execute(std::unique_ptr<ICommand> command) = 0;
    virtual bool canUndo() const = 0;
    virtual bool canRedo() const = 0;
    virtual bool undo() = 0;
    virtual bool redo() = 0;
    virtual void clear() = 0;
};

}  // namespace bos
