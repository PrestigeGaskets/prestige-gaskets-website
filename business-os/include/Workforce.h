#pragma once

#include <string>
#include <vector>

namespace bos {

struct Department {
    std::string id;
    std::string name;
    std::string code;
};

struct Skill {
    std::string id;
    std::string name;
    int levelMin = 1;
};

struct EmployeeSkill {
    std::string skillId;
    int level = 1;
};

struct Employee {
    std::string id;          // member / badge id (server session key)
    std::string username;
    std::string name;
    std::string role;        // maps to RoleHierarchy
    std::string departmentId;
    std::string title;
    std::vector<EmployeeSkill> skills;
};

struct JobCriteria {
    std::string poNo;
    std::string quoteNo;
    std::string orderNo;
    std::string shipmentId;
    std::string sku;
    std::string customerId;
    std::string priority;
};

struct JobLink {
    std::string view;
    std::string label;
    std::string poNo;
    std::string quoteNo;
    std::string shipmentId;
    std::string sku;
};

struct Job {
    std::string id;
    std::string title;
    std::string departmentId;
    std::string projectId;
    std::string milestoneId;
    std::vector<EmployeeSkill> requiredSkills;
    JobCriteria criteria;
    JobLink link;
    std::string status;  // Ready | Assigned | In progress | Done
    double estimatedHours = 0;
};

/** Work pool row belongs to a job — personal assignment or department queue. */
struct WorkPoolEntry {
    std::string id;
    std::string jobId;
    std::string pool;  // personal | department
    std::string departmentId;
    std::string assigneeId;  // empty when queued in department pool
    std::string status;      // Queued | Assigned | In progress | Done
};

struct TimeCardEntry {
    std::string jobId;
    double hours = 0;
    std::string note;
    std::string at;
};

struct TimeCard {
    std::string id;
    std::string employeeId;
    std::string date;
    bool clockedIn = false;
    std::string clockInAt;
    std::string clockOutAt;
    std::vector<TimeCardEntry> entries;
};

}  // namespace bos
