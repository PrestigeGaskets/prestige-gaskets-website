package com.prestigegaskets.rushmore.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.prestigegaskets.rushmore.persistence.WorkforceStateEntity;
import com.prestigegaskets.rushmore.persistence.WorkforceStateRepository;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WorkforceService {

  private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");
  private static final String DEFAULT_EMPLOYEE = "154981";

  private final WorkforceStateRepository repo;
  private final ObjectMapper mapper;
  private final Resource seedWorkforce;

  public WorkforceService(
      WorkforceStateRepository repo,
      ObjectMapper mapper,
      @Value("${rushmore.seed-workforce}") Resource seedWorkforce) {
    this.repo = repo;
    this.mapper = mapper;
    this.seedWorkforce = seedWorkforce;
  }

  @Transactional
  public void ensureSeeded() {
    if (repo.existsById("workforce")) {
      return;
    }
    try (InputStream in = seedWorkforce.getInputStream()) {
      persist((ObjectNode) mapper.readTree(in));
    } catch (IOException e) {
      throw new IllegalStateException("Failed to seed workforce", e);
    }
  }

  @Transactional(readOnly = true)
  public ObjectNode load() {
    WorkforceStateEntity entity =
        repo.findById("workforce").orElseThrow(() -> new IllegalStateException("Workforce not seeded"));
    try {
      return (ObjectNode) mapper.readTree(entity.getPayloadJson());
    } catch (IOException e) {
      throw new IllegalStateException("Corrupt workforce payload", e);
    }
  }

  @Transactional
  public void persist(ObjectNode state) {
    try {
      WorkforceStateEntity entity = repo.findById("workforce").orElseGet(WorkforceStateEntity::new);
      entity.setId("workforce");
      entity.setPayloadJson(mapper.writeValueAsString(state));
      entity.setUpdatedAtEpochMs(System.currentTimeMillis());
      repo.save(entity);
    } catch (IOException e) {
      throw new IllegalStateException("Failed to persist workforce", e);
    }
  }

  @Transactional
  public ObjectNode listEmployees() {
    ObjectNode state = load();
    ObjectNode out = mapper.createObjectNode();
    ArrayNode employees = mapper.createArrayNode();
    for (JsonNode e : arr(state, "employees")) {
      employees.add(publicEmployee(e));
    }
    out.set("employees", employees);
    out.set("departments", arr(state, "departments").deepCopy());
    return out;
  }

  @Transactional
  public ObjectNode getSession(String employeeId) {
    ObjectNode state = load();
    refreshLoggedOn(state);
    persist(state);
    return sessionPayload(state, resolveId(state, employeeId));
  }

  @Transactional
  public ObjectNode login(String employeeId) {
    ObjectNode state = load();
    if (findEmployee(state, employeeId) == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown employee");
    }
    ObjectNode tc = timeCard(state, employeeId);
    if (tc == null) {
      arr(state, "timeCards").add(newTimeCard(employeeId, true));
    } else if (!tc.path("clockedIn").asBoolean(false)) {
      tc.put("clockedIn", true);
      tc.put("clockInAt", nowHhmm());
      tc.putNull("clockOutAt");
    }
    refreshLoggedOn(state);
    persist(state);
    return sessionPayload(state, employeeId);
  }

  @Transactional
  public ObjectNode clock(String employeeId, String action, String jobId, Double hours, String note) {
    ObjectNode state = load();
    if (findEmployee(state, employeeId) == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not signed in");
    }
    ObjectNode tc = timeCard(state, employeeId);
    if (tc == null) {
      tc = newTimeCard(employeeId, false);
      arr(state, "timeCards").add(tc);
    }
    String now = nowHhmm();
    switch (action == null ? "" : action) {
      case "in" -> {
        tc.put("clockedIn", true);
        tc.put("clockInAt", now);
        tc.putNull("clockOutAt");
      }
      case "out" -> {
        tc.put("clockedIn", false);
        tc.put("clockOutAt", now);
      }
      case "book" -> {
        if (!tc.path("clockedIn").asBoolean(false)) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Clock in before booking time");
        }
        if (jobId == null || jobId.isBlank()) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "jobId required");
        }
        ObjectNode job = findJob(state, jobId);
        if (job == null) {
          throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown job");
        }
        ObjectNode entry = mapper.createObjectNode();
        entry.put("jobId", jobId);
        entry.put("hours", hours == null ? 0.25 : hours);
        entry.put("note", note == null ? "" : note);
        entry.put("at", now);
        arr(tc, "entries").add(entry);
        ObjectNode row = poolRowForJob(state, jobId, employeeId);
        if (row != null && "Assigned".equals(str(row, "status"))) {
          row.put("status", "In progress");
        }
        String js = str(job, "status");
        if ("Ready".equals(js) || "Assigned".equals(js)) {
          job.put("status", "In progress");
        }
      }
      default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown clock action");
    }
    refreshLoggedOn(state);
    persist(state);
    return getWorkload(employeeId);
  }

  @Transactional
  public ObjectNode getWorkload(String employeeId) {
    ObjectNode state = load();
    refreshLoggedOn(state);
    persist(state);
    String id = resolveId(state, employeeId);
    ObjectNode emp = findEmployee(state, id);
    if (emp == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not signed in");
    }
    ObjectNode session = sessionPayload(state, id);
    ObjectNode project = firstProject(state);
    ObjectNode rules =
        state.path("scrumRules").isObject()
            ? (ObjectNode) state.get("scrumRules").deepCopy()
            : mapper.createObjectNode();
    // Prefer seed keys; fill defaults if missing
    if (!rules.has("pullRequiresClockedIn")) {
      rules.put("pullRequiresClockedIn", true);
    }
    if (!rules.has("assignmentOverridesPool")) {
      rules.put("assignmentOverridesPool", true);
    }
    if (!rules.has("wipLimit")) {
      rules.put("wipLimit", 3);
    }
    String approach = project == null ? "pull" : str(project, "approach");
    int wipLimit = rules.path("wipLimit").asInt(0);
    int wip = activeWip(state, id);

    ArrayNode assigned = mapper.createArrayNode();
    for (JsonNode row : arr(state, "workPool")) {
      if (id.equals(str(row, "assigneeId"))
          && ("Assigned".equals(str(row, "status")) || "In progress".equals(str(row, "status")))) {
        assigned.add(enrich(state, (ObjectNode) row));
      }
    }

    ArrayNode eligible = mapper.createArrayNode();
    ArrayNode blocked = mapper.createArrayNode();
    int queued = 0;
    boolean clockedIn = session.path("clockedIn").asBoolean(false);
    for (JsonNode rowNode : arr(state, "workPool")) {
      ObjectNode row = (ObjectNode) rowNode;
      if (!"department".equals(str(row, "pool"))
          || !str(emp, "departmentId").equals(str(row, "departmentId"))
          || !"Queued".equals(str(row, "status"))
          || !str(row, "assigneeId").isBlank()) {
        continue;
      }
      queued++;
      ObjectNode job = findJob(state, str(row, "jobId"));
      if (job == null) {
        continue;
      }
      ObjectNode enriched = enrich(state, row);
      boolean clockOk = !rules.path("pullRequiresClockedIn").asBoolean(true) || clockedIn;
      boolean rolesMatch = roleOk(emp, job);
      boolean deptMatch =
          str(job, "departmentId").isBlank()
              || str(job, "departmentId").equals(str(emp, "departmentId"));
      boolean wipOk = wipLimit <= 0 || wip < wipLimit;
      if ("assign".equals(approach) && rules.path("assignmentOverridesPool").asBoolean(true)) {
        enriched.put("reason", "PM approach is assign-only — wait for assignment");
        blocked.add(enriched);
      } else if (!clockOk) {
        enriched.put("reason", "Clock in (start shift) to pull from department pool");
        blocked.add(enriched);
      } else if (!rolesMatch) {
        enriched.put("reason", "Role " + str(emp, "role") + " not allowed for this fulfilment job");
        blocked.add(enriched);
      } else if (!deptMatch) {
        enriched.put("reason", "Job department mismatch");
        blocked.add(enriched);
      } else if (!wipOk) {
        enriched.put("reason", "WIP limit (" + wipLimit + ") reached — finish or clock work first");
        blocked.add(enriched);
      } else {
        eligible.add(enriched);
      }
    }

    ArrayNode loggedOnDept = mapper.createArrayNode();
    for (JsonNode idNode : arr(state, "loggedOn")) {
      ObjectNode e = findEmployee(state, idNode.asText());
      if (e != null && str(emp, "departmentId").equals(str(e, "departmentId"))) {
        loggedOnDept.add(publicEmployee(e));
      }
    }

    ObjectNode summary = mapper.createObjectNode();
    summary.put("departmentId", str(emp, "departmentId"));
    ObjectNode dept = findDepartment(state, str(emp, "departmentId"));
    summary.put("departmentName", dept == null ? str(emp, "departmentId") : str(dept, "name"));
    summary.put("queued", queued);
    summary.put("eligible", eligible.size());
    summary.set("loggedOn", loggedOnDept);
    summary.put("wip", wip);
    summary.put("wipLimit", wipLimit);

    ObjectNode departmentPool = mapper.createObjectNode();
    departmentPool.set("summary", summary);
    departmentPool.set("eligible", eligible);
    departmentPool.set("blocked", blocked);

    ArrayNode taskLinks = mapper.createArrayNode();
    appendLinks(taskLinks, assigned);
    appendLinks(taskLinks, eligible);

    ObjectNode out = mapper.createObjectNode();
    out.set("session", session);
    out.put("approach", approach);
    out.set("scrumRules", rules);
    out.set("assigned", assigned);
    out.set("departmentPool", departmentPool);
    out.set("taskLinks", taskLinks);
    return out;
  }

  @Transactional
  public ObjectNode pullJob(String employeeId, String workPoolId) {
    ObjectNode state = load();
    ObjectNode emp = findEmployee(state, employeeId);
    if (emp == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not signed in");
    }
    ObjectNode project = firstProject(state);
    ObjectNode rules = (ObjectNode) state.path("scrumRules");
    ObjectNode session = sessionPayload(state, employeeId);
    if (project != null
        && "assign".equals(str(project, "approach"))
        && rules.path("assignmentOverridesPool").asBoolean(true)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Project approach is assign-only (PM/scrum master)");
    }
    if (rules.path("pullRequiresClockedIn").asBoolean(true) && !session.path("clockedIn").asBoolean(false)) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Clock in (start shift) before pulling from the department pool");
    }
    int wipLimit = rules.path("wipLimit").asInt(0);
    if (wipLimit > 0 && activeWip(state, employeeId) >= wipLimit) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "WIP limit (" + wipLimit + ") reached");
    }
    ObjectNode row = findPoolRow(state, workPoolId);
    if (row == null || !"department".equals(str(row, "pool")) || !"Queued".equals(str(row, "status"))) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not available in department pool");
    }
    if (!str(emp, "departmentId").equals(str(row, "departmentId"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Outside your department pool");
    }
    ObjectNode job = findJob(state, str(row, "jobId"));
    if (job == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job missing");
    }
    if (!roleOk(emp, job)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your role cannot pull this fulfilment job");
    }
    row.put("pool", "personal");
    row.put("assigneeId", employeeId);
    row.put("status", "Assigned");
    job.put("status", "Assigned");
    persist(state);
    return getWorkload(employeeId);
  }

  @Transactional
  public ObjectNode getProjects(String employeeId) {
    ObjectNode state = load();
    ObjectNode out = mapper.createObjectNode();
    out.set("session", getSession(employeeId));
    out.set("scrumRules", state.path("scrumRules").deepCopy());
    out.set(
        "dailyScrum",
        state.has("dailyScrum") ? state.get("dailyScrum").deepCopy() : mapper.createObjectNode());
    ArrayNode projectsOut = mapper.createArrayNode();
    for (JsonNode p : arr(state, "projects")) {
      ObjectNode copy = (ObjectNode) p.deepCopy();
      copy.set("projectManager", publicEmployee(findEmployee(state, str(p, "projectManagerId"))));
      copy.set("scrumMaster", publicEmployee(findEmployee(state, str(p, "scrumMasterId"))));
      ArrayNode milestones = mapper.createArrayNode();
      java.util.List<ObjectNode> sorted = new java.util.ArrayList<>();
      for (JsonNode m : arr(state, "milestones")) {
        if (str(p, "id").equals(str(m, "projectId"))) {
          sorted.add((ObjectNode) m.deepCopy());
        }
      }
      sorted.sort((a, b) -> Integer.compare(a.path("sort").asInt(0), b.path("sort").asInt(0)));
      sorted.forEach(milestones::add);
      copy.set("milestones", milestones);
      ArrayNode jobs = mapper.createArrayNode();
      for (JsonNode j : arr(state, "jobs")) {
        if (str(p, "id").equals(str(j, "projectId"))) {
          jobs.add(j.deepCopy());
        }
      }
      copy.set("jobs", jobs);
      projectsOut.add(copy);
    }
    out.set("projects", projectsOut);
    return out;
  }

  @Transactional
  public ObjectNode setApproach(String employeeId, String projectId, String approach) {
    ObjectNode state = load();
    ObjectNode emp = findEmployee(state, employeeId);
    if (emp == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not signed in");
    }
    ObjectNode project = null;
    for (JsonNode p : arr(state, "projects")) {
      if (projectId.equals(str(p, "id"))) {
        project = (ObjectNode) p;
        break;
      }
    }
    if (project == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown project");
    }
    boolean allowed =
        employeeId.equals(str(project, "projectManagerId"))
            || employeeId.equals(str(project, "scrumMasterId"))
            || "Admin".equals(str(emp, "role"))
            || "Manager".equals(str(emp, "role"));
    if (!allowed) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only PM / scrum master may set approach");
    }
    if (!"pull".equals(approach) && !"assign".equals(approach)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "approach must be pull or assign");
    }
    project.put("approach", approach);
    persist(state);
    return getProjects(employeeId);
  }

  private void appendLinks(ArrayNode taskLinks, ArrayNode rows) {
    for (JsonNode row : rows) {
      JsonNode link = row.path("job").path("link");
      if (!link.isMissingNode() && !link.isNull()) {
        taskLinks.add(link.deepCopy());
      }
    }
  }

  private ObjectNode sessionPayload(ObjectNode state, String id) {
    ObjectNode emp = findEmployee(state, id);
    ObjectNode tc = timeCard(state, id);
    ObjectNode dept = findDepartment(state, str(emp, "departmentId"));
    ObjectNode out = mapper.createObjectNode();
    out.set("employee", publicEmployee(emp));
    out.set("department", dept == null ? NullNode.getInstance() : dept.deepCopy());
    out.put("clockedIn", tc != null && tc.path("clockedIn").asBoolean(false));
    out.set("timeCard", tc == null ? NullNode.getInstance() : tc.deepCopy());
    out.set("loggedOnIds", arr(state, "loggedOn").deepCopy());
    out.put("loggedOnCount", arr(state, "loggedOn").size());
    out.put("serverTime", Instant.now().toString());
    return out;
  }

  private void refreshLoggedOn(ObjectNode state) {
    ArrayNode logged = mapper.createArrayNode();
    for (JsonNode tc : arr(state, "timeCards")) {
      if (tc.path("clockedIn").asBoolean(false)) {
        logged.add(str(tc, "employeeId"));
      }
    }
    state.set("loggedOn", logged);
  }

  private ObjectNode newTimeCard(String employeeId, boolean clockedIn) {
    ObjectNode tc = mapper.createObjectNode();
    tc.put("id", "TC-" + employeeId + "-LIVE");
    tc.put("employeeId", employeeId);
    tc.put("date", "11/09/2026");
    tc.put("clockedIn", clockedIn);
    if (clockedIn) {
      tc.put("clockInAt", nowHhmm());
    } else {
      tc.putNull("clockInAt");
    }
    tc.putNull("clockOutAt");
    tc.putArray("entries");
    return tc;
  }

  private ObjectNode publicEmployee(JsonNode emp) {
    if (emp == null || emp.isNull()) {
      return null;
    }
    ObjectNode out = mapper.createObjectNode();
    out.put("id", str(emp, "id"));
    out.put("username", str(emp, "username"));
    out.put("name", str(emp, "name"));
    out.put("role", str(emp, "role"));
    out.put("departmentId", str(emp, "departmentId"));
    out.put("title", str(emp, "title"));
    return out;
  }

  private ObjectNode enrich(ObjectNode state, ObjectNode row) {
    ObjectNode out = row.deepCopy();
    ObjectNode job = findJob(state, str(row, "jobId"));
    out.set("job", job == null ? NullNode.getInstance() : job.deepCopy());
    out.set("assignee", publicEmployee(findEmployee(state, str(row, "assigneeId"))));
    ObjectNode dept = findDepartment(state, str(row, "departmentId"));
    out.put("departmentName", dept == null ? str(row, "departmentId") : str(dept, "name"));
    return out;
  }

  private boolean roleOk(ObjectNode emp, ObjectNode job) {
    JsonNode allowed = job.get("allowedRoles");
    if (allowed == null || !allowed.isArray() || allowed.isEmpty()) {
      return true;
    }
    String role = str(emp, "role");
    for (JsonNode a : allowed) {
      if (role.equals(a.asText())) {
        return true;
      }
    }
    return false;
  }

  private int activeWip(ObjectNode state, String employeeId) {
    int n = 0;
    for (JsonNode w : arr(state, "workPool")) {
      if (employeeId.equals(str(w, "assigneeId"))
          && ("Assigned".equals(str(w, "status")) || "In progress".equals(str(w, "status")))) {
        n++;
      }
    }
    return n;
  }

  private String resolveId(ObjectNode state, String employeeId) {
    if (employeeId != null && findEmployee(state, employeeId) != null) {
      return employeeId;
    }
    return DEFAULT_EMPLOYEE;
  }

  private ObjectNode findEmployee(ObjectNode state, String id) {
    if (id == null || id.isBlank()) {
      return null;
    }
    for (JsonNode e : arr(state, "employees")) {
      if (id.equals(str(e, "id"))) {
        return (ObjectNode) e;
      }
    }
    return null;
  }

  private ObjectNode findDepartment(ObjectNode state, String id) {
    for (JsonNode d : arr(state, "departments")) {
      if (id.equals(str(d, "id"))) {
        return (ObjectNode) d;
      }
    }
    return null;
  }

  private ObjectNode findJob(ObjectNode state, String id) {
    for (JsonNode j : arr(state, "jobs")) {
      if (id.equals(str(j, "id"))) {
        return (ObjectNode) j;
      }
    }
    return null;
  }

  private ObjectNode timeCard(ObjectNode state, String employeeId) {
    for (JsonNode t : arr(state, "timeCards")) {
      if (employeeId.equals(str(t, "employeeId"))) {
        return (ObjectNode) t;
      }
    }
    return null;
  }

  private ObjectNode findPoolRow(ObjectNode state, String id) {
    for (JsonNode w : arr(state, "workPool")) {
      if (id.equals(str(w, "id"))) {
        return (ObjectNode) w;
      }
    }
    return null;
  }

  private ObjectNode poolRowForJob(ObjectNode state, String jobId, String employeeId) {
    for (JsonNode w : arr(state, "workPool")) {
      if (jobId.equals(str(w, "jobId"))
          && (employeeId.equals(str(w, "assigneeId")) || "personal".equals(str(w, "pool")))) {
        return (ObjectNode) w;
      }
    }
    return null;
  }

  private ObjectNode firstProject(ObjectNode state) {
    ArrayNode projects = arr(state, "projects");
    return projects.isEmpty() ? null : (ObjectNode) projects.get(0);
  }

  private static ArrayNode arr(ObjectNode parent, String field) {
    JsonNode n = parent.get(field);
    if (n instanceof ArrayNode an) {
      return an;
    }
    return parent.putArray(field);
  }

  private static String str(JsonNode n, String field) {
    if (n == null || n.isNull()) {
      return "";
    }
    JsonNode v = n.get(field);
    return v == null || v.isNull() ? "" : v.asText("");
  }

  private static String nowHhmm() {
    return LocalTime.now().format(HHMM);
  }
}
