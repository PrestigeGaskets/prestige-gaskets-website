#pragma once

#include <string>
#include <vector>

namespace bos {

struct Project {
    std::string id;
    std::string name;
    std::string goal;
    std::string status;
    std::string projectManagerId;
    std::string scrumMasterId;
    std::string approach;  // pull | assign — defined by PM / scrum master
    std::vector<std::string> departmentIds;
};

struct Milestone {
    std::string id;
    std::string projectId;
    std::string name;
    std::string dueDate;
    std::string status;
    int sort = 0;
};

struct ScrumRules {
    int dailyScrumMinutes = 15;
    std::string buildsToward;  // milestones
    bool pullRequiresSkills = true;
    bool pullRequiresClockedIn = true;
    bool assignmentOverridesPool = true;
    std::string note;
};

struct DailyScrum {
    std::string date;
    std::string projectId;
    std::string facilitatedById;
    std::vector<std::string> agenda;
    std::string notes;
};

}  // namespace bos
