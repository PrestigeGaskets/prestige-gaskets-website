package com.prestigegaskets.rushmore.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.prestigegaskets.rushmore.persistence.ActionEntryEntity;
import com.prestigegaskets.rushmore.persistence.ActionEntryRepository;
import com.prestigegaskets.rushmore.persistence.PostedSnapshotEntity;
import com.prestigegaskets.rushmore.persistence.PostedSnapshotRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostCommitService {

  private final MasterSyncService masterSync;
  private final IntakeService intake;
  private final ActionEntryRepository actionRepo;
  private final PostedSnapshotRepository snapshotRepo;
  private final ObjectMapper mapper;

  public PostCommitService(
      MasterSyncService masterSync,
      IntakeService intake,
      ActionEntryRepository actionRepo,
      PostedSnapshotRepository snapshotRepo,
      ObjectMapper mapper) {
    this.masterSync = masterSync;
    this.intake = intake;
    this.actionRepo = actionRepo;
    this.snapshotRepo = snapshotRepo;
    this.mapper = mapper;
  }

  @Transactional
  public ObjectNode post(String actor, ArrayNode pending, JsonNode workingCopyPatch) {
    ObjectNode master =
        workingCopyPatch != null && workingCopyPatch.isObject()
            ? (ObjectNode) workingCopyPatch.deepCopy()
            : masterSync.getMaster();

    ArrayNode pendingCopy =
        pending == null ? mapper.createArrayNode() : (ArrayNode) pending.deepCopy();
    String day = IntakeService.businessDay();
    String postedAt = Instant.now().toString();

    intake.applyAll(master, pendingCopy, actor == null ? "Unknown" : actor);

    List<ObjectNode> committed = new ArrayList<>();
    for (JsonNode entry : pendingCopy) {
      ObjectNode out = (ObjectNode) entry.deepCopy();
      out.put("actor", actor == null ? text(entry, "actor") : actor);
      out.put("day", day);
      out.put("postedAt", postedAt);
      out.put("status", "posted");
      if (!out.hasNonNull("stagedAt")) {
        out.put("stagedAt", postedAt);
      }
      committed.add(out);
      actionRepo.save(toEntity(out));
    }
    if (pendingCopy.isEmpty()) {
      ObjectNode edits = mapper.createObjectNode();
      edits.put("id", "ACT-" + System.currentTimeMillis() + "-edits");
      edits.put("day", day);
      edits.put("actor", actor == null ? "Unknown" : actor);
      edits.put("type", "working-copy-edits");
      edits.put("status", "posted");
      edits.put("stagedAt", postedAt);
      edits.put("postedAt", postedAt);
      edits.put("detail", "Working-copy field edits");
      committed.add(edits);
      actionRepo.save(toEntity(edits));
    }

    masterSync.saveMaster(master);

    ArrayNode actionsJson = mapper.createArrayNode();
    committed.forEach(actionsJson::add);

    PostedSnapshotEntity snap = new PostedSnapshotEntity();
    snap.setActor(actor == null ? "Unknown" : actor);
    snap.setBusinessDay(day);
    snap.setPostedAtEpochMs(System.currentTimeMillis());
    try {
      snap.setMasterJson(mapper.writeValueAsString(master));
      snap.setActionsJson(mapper.writeValueAsString(actionsJson));
    } catch (Exception e) {
      throw new IllegalStateException("Failed to serialize snapshot", e);
    }
    snapshotRepo.save(snap);

    ObjectNode result = mapper.createObjectNode();
    result.set("master", master);
    result.set("actions", actionsJson);
    result.put("postedAt", postedAt);
    result.put("day", day);
    result.put("actor", actor == null ? "Unknown" : actor);
    result.put("snapshotId", snap.getId());
    return result;
  }

  @Transactional
  public ObjectNode reverse(String actor) {
    PostedSnapshotEntity snap =
        (actor == null || actor.isBlank()
                ? snapshotRepo.findFirstByOrderByPostedAtEpochMsDesc()
                : snapshotRepo.findFirstByActorOrderByPostedAtEpochMsDesc(actor))
            .or(() -> snapshotRepo.findFirstByOrderByPostedAtEpochMsDesc())
            .orElseThrow(() -> new IllegalStateException("No posted snapshot to reverse to"));
    try {
      ObjectNode master = (ObjectNode) mapper.readTree(snap.getMasterJson());
      masterSync.saveMaster(master);
      ObjectNode result = mapper.createObjectNode();
      result.set("master", master);
      result.set("actions", mapper.readTree(snap.getActionsJson()));
      result.put("snapshotId", snap.getId());
      result.put("actor", snap.getActor());
      result.put("day", snap.getBusinessDay());
      result.put("postedAtEpochMs", snap.getPostedAtEpochMs());
      return result;
    } catch (Exception e) {
      throw new IllegalStateException("Failed to restore snapshot", e);
    }
  }

  @Transactional(readOnly = true)
  public List<ObjectNode> searchActions(
      String actor,
      String day,
      String orderNo,
      String quoteNo,
      String poNo,
      String grnNo,
      String shipmentId) {
    return actionRepo.search(emptyToNull(actor), emptyToNull(day), emptyToNull(orderNo), emptyToNull(quoteNo), emptyToNull(poNo), emptyToNull(grnNo), emptyToNull(shipmentId))
        .stream()
        .map(this::toJson)
        .toList();
  }

  private ActionEntryEntity toEntity(ObjectNode out) {
    ActionEntryEntity e = new ActionEntryEntity();
    e.setId(text(out, "id").isBlank() ? "ACT-" + System.currentTimeMillis() : text(out, "id"));
    e.setBusinessDay(text(out, "day"));
    e.setActor(text(out, "actor"));
    e.setType(text(out, "type"));
    e.setStatus(text(out, "status"));
    e.setStagedAt(text(out, "stagedAt"));
    e.setPostedAt(text(out, "postedAt"));
    e.setQuoteNo(text(out, "quoteNo"));
    e.setOrderNo(text(out, "orderNo"));
    e.setPoNo(text(out, "poNo"));
    e.setGrnNo(first(out, "grnNo", "grnNo"));
    e.setShipmentId(text(out, "shipmentId"));
    e.setCustomerId(text(out, "customerId"));
    e.setDetail(text(out, "detail"));
    return e;
  }

  private ObjectNode toJson(ActionEntryEntity e) {
    ObjectNode n = mapper.createObjectNode();
    n.put("id", e.getId());
    n.put("day", e.getBusinessDay());
    n.put("actor", e.getActor());
    n.put("type", e.getType());
    n.put("status", e.getStatus());
    n.put("stagedAt", nullToEmpty(e.getStagedAt()));
    n.put("postedAt", nullToEmpty(e.getPostedAt()));
    n.put("quoteNo", nullToEmpty(e.getQuoteNo()));
    n.put("orderNo", nullToEmpty(e.getOrderNo()));
    n.put("poNo", nullToEmpty(e.getPoNo()));
    n.put("grnNo", nullToEmpty(e.getGrnNo()));
    n.put("shipmentId", nullToEmpty(e.getShipmentId()));
    n.put("customerId", nullToEmpty(e.getCustomerId()));
    n.put("detail", nullToEmpty(e.getDetail()));
    return n;
  }

  private static String text(JsonNode n, String field) {
    JsonNode v = n.get(field);
    return v == null || v.isNull() ? "" : v.asText("");
  }

  private static String first(JsonNode n, String a, String b) {
    String v = text(n, a);
    return v.isBlank() ? text(n, b) : v;
  }

  private static String nullToEmpty(String s) {
    return s == null ? "" : s;
  }

  private static String emptyToNull(String s) {
    return s == null || s.isBlank() ? null : s;
  }
}
