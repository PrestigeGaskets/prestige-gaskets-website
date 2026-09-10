#include "CommandInvoker.h"

namespace bos {

void CommandInvoker::execute(std::unique_ptr<ICommand> command) {
    if (!command || !command->canExecute()) {
        return;
    }
    command->execute();
    undoStack_.push_back(std::move(command));
    redoStack_.clear();
}

bool CommandInvoker::canUndo() const { return !undoStack_.empty(); }
bool CommandInvoker::canRedo() const { return !redoStack_.empty(); }

bool CommandInvoker::undo() {
    if (!canUndo()) {
        return false;
    }
    auto cmd = std::move(undoStack_.back());
    undoStack_.pop_back();
    cmd->undo();
    redoStack_.push_back(std::move(cmd));
    return true;
}

bool CommandInvoker::redo() {
    if (!canRedo()) {
        return false;
    }
    auto cmd = std::move(redoStack_.back());
    redoStack_.pop_back();
    cmd->execute();
    undoStack_.push_back(std::move(cmd));
    return true;
}

void CommandInvoker::clear() {
    undoStack_.clear();
    redoStack_.clear();
}

}  // namespace bos
