package com.prestigegaskets.rushmore.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.prestigegaskets.rushmore.security.OperatorSessionFilter;
import com.prestigegaskets.rushmore.service.MasterSyncService;
import com.prestigegaskets.rushmore.service.PostCommitService;
import com.prestigegaskets.rushmore.service.WorkforceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class RushmoreApiController {

  private final MasterSyncService masterSync;
  private final WorkforceService workforce;
  private final PostCommitService postCommit;

  public RushmoreApiController(
      MasterSyncService masterSync, WorkforceService workforce, PostCommitService postCommit) {
    this.masterSync = masterSync;
    this.workforce = workforce;
    this.postCommit = postCommit;
  }

  @GetMapping("/master")
  public ObjectNode master() {
    return masterSync.getMaster();
  }

  @PostMapping("/session/login")
  public ObjectNode login(
      @RequestBody Map<String, String> body, HttpServletResponse response) {
    String employeeId = body.get("employeeId");
    if (employeeId == null || employeeId.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "employeeId required");
    }
    ObjectNode session = workforce.login(employeeId);
    OperatorSessionFilter.writeLoginCookie(response, employeeId);
    return session;
  }

  @GetMapping("/session")
  public ObjectNode session(HttpServletRequest request) {
    return workforce.getSession(employeeId(request));
  }

  @GetMapping("/employees")
  public ObjectNode employees() {
    return workforce.listEmployees();
  }

  @GetMapping("/workload")
  public ObjectNode workload(HttpServletRequest request) {
    return workforce.getWorkload(employeeId(request));
  }

  @PostMapping("/workload/clock")
  public ObjectNode clock(@RequestBody Map<String, Object> body, HttpServletRequest request) {
    String action = str(body.get("action"));
    String jobId = str(body.get("jobId"));
    Double hours = body.get("hours") == null ? null : Double.valueOf(String.valueOf(body.get("hours")));
    String note = str(body.get("note"));
    return workforce.clock(employeeId(request), action, jobId, hours, note);
  }

  @PostMapping("/workload/pull")
  public ObjectNode pull(@RequestBody Map<String, String> body, HttpServletRequest request) {
    String workPoolId = body.get("workPoolId");
    if (workPoolId == null || workPoolId.isBlank()) {
      workPoolId = body.get("id");
    }
    if (workPoolId == null || workPoolId.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "workPoolId required");
    }
    return workforce.pullJob(employeeId(request), workPoolId);
  }

  @GetMapping("/projects")
  public ObjectNode projects(HttpServletRequest request) {
    return workforce.getProjects(employeeId(request));
  }

  @PostMapping("/projects/{id}/approach")
  public ObjectNode approach(
      @PathVariable("id") String projectId,
      @RequestBody Map<String, String> body,
      HttpServletRequest request) {
    return workforce.setApproach(employeeId(request), projectId, body.get("approach"));
  }

  @PostMapping("/post")
  public ObjectNode post(@RequestBody ObjectNode body) {
    String actor = body.path("actor").asText("");
    ArrayNode pending =
        body.path("pending").isArray() ? (ArrayNode) body.get("pending") : null;
    JsonNode workingCopy = body.get("workingCopy");
    if (workingCopy == null) {
      workingCopy = body.get("workingCopyPatch");
    }
    return postCommit.post(actor, pending, workingCopy);
  }

  @PostMapping("/reverse")
  public ObjectNode reverse(@RequestBody(required = false) Map<String, String> body) {
    String actor = body == null ? null : body.get("actor");
    return postCommit.reverse(actor);
  }

  @GetMapping("/actions")
  public List<ObjectNode> actions(
      @RequestParam(required = false) String actor,
      @RequestParam(required = false) String day,
      @RequestParam(required = false) String orderNo,
      @RequestParam(required = false) String quoteNo,
      @RequestParam(required = false) String poNo,
      @RequestParam(required = false) String grnNo,
      @RequestParam(required = false) String shipmentId) {
    return postCommit.searchActions(actor, day, orderNo, quoteNo, poNo, grnNo, shipmentId);
  }

  @GetMapping("/health")
  public ResponseEntity<Map<String, String>> health() {
    return ResponseEntity.ok(Map.of("status", "ok", "service", "rushmore-server"));
  }

  private static String employeeId(HttpServletRequest request) {
    Object v = request.getAttribute(OperatorSessionFilter.ATTR);
    return v == null ? null : String.valueOf(v);
  }

  private static String str(Object o) {
    return o == null ? null : String.valueOf(o);
  }
}
