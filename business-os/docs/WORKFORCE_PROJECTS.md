# Workforce, work pools & project / scrum rules

The GUI consumes **server responses** (mock API in `gui-demo/workforce-server.js`) for:

- who is logged on
- assigned tasks / job links
- department work pools
- time cards
- projects, milestones, and daily scrum rules

ERP working-copy data (`rushmore-bos-v9`) stays separate from workforce server state
(`rushmore-workforce-server-v1`).

## Session

`RushmoreServer.getSession()` / `login(employeeId)` return the signed-in employee,
department, clock state, and logged-on presence. Chrome (My account strip, avatar,
Signed in select) renders **only** from that payload — not from a hardcoded list.

Logging on clocks the employee in so department pool eligibility can refresh.

## Jobs & pools

- A **Job** belongs to a department (and usually a project milestone).
- **Work pool** rows belong to jobs:
  - `department` + `Queued` — pull queue for that dept
  - `personal` + `Assigned` / `In progress` — on an employee
- Pull checks: project **approach** (pull vs assign), clocked-in, skills vs
  `requiredSkills`, and department/job criteria.
- **Time cards** update presence (`loggedOn`) and book hours against jobs,
  moving pool / job status to In progress.

## Project management rules

PM and scrum master set **approach** (`pull` | `assign`) on the project.
Daily scrum agenda builds toward **milestones**; jobs feeding pools are the
implementation of that plan. See **Projects & Daily Scrum** and **My Workload**
in the GUI.

## C++ twins

- `include/Workforce.h` — Employee, Skill, Job, WorkPoolEntry, TimeCard
- `include/ProjectManagement.h` — Project, Milestone, ScrumRules, DailyScrum

Wire these into `DemoSeed` / `IDataStore` when the `.exe` gains a network or
local API host; the GUI mock is the behavioural reference.
