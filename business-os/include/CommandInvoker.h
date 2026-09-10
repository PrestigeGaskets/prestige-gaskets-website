#pragma once

#include <memory>
#include <vector>

#include "ICommand.h"

namespace bos {

class CommandInvoker : public ICommandInvoker {
public:
    void execute(std::unique_ptr<ICommand> command) override;
    bool canUndo() const override;
    bool canRedo() const override;
    bool undo() override;
    bool redo() override;
    void clear() override;

private:
    std::vector<std::unique_ptr<ICommand>> undoStack_;
    std::vector<std::unique_ptr<ICommand>> redoStack_;
};

}  // namespace bos
