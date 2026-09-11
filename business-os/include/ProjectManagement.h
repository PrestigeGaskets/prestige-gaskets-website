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

/**
 * Agile scrum rules for fulfilment work.
 * Pull eligibility: clocked-in + role + department — never skills.
 */
struct ScrumRules {
    int dailyScrumMinutes = 15;
    std::string buildsToward;  // milestones
    bool pullRequiresClockedIn = true;
    bool assignmentOverridesPool = true;
    int wipLimit = 0;  // 0 = no limit
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
