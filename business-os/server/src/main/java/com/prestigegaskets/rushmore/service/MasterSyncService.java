package com.prestigegaskets.rushmore.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.prestigegaskets.rushmore.persistence.PlantMasterEntity;
import com.prestigegaskets.rushmore.persistence.PlantMasterRepository;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MasterSyncService {

  private final PlantMasterRepository repo;
  private final ObjectMapper mapper;
  private final Resource seedMaster;

  public MasterSyncService(
      PlantMasterRepository repo,
      ObjectMapper mapper,
      @Value("${rushmore.seed-master}") Resource seedMaster) {
    this.repo = repo;
    this.mapper = mapper;
    this.seedMaster = seedMaster;
  }

  @Transactional
  public void ensureSeeded() {
    if (repo.existsById("plant")) {
      return;
    }
    try (InputStream in = seedMaster.getInputStream()) {
      JsonNode node = mapper.readTree(in);
      saveMaster(node);
    } catch (IOException e) {
      throw new IllegalStateException("Failed to seed plant master", e);
    }
  }

  @Transactional(readOnly = true)
  public ObjectNode getMaster() {
    PlantMasterEntity entity =
        repo.findById("plant").orElseThrow(() -> new IllegalStateException("Master not seeded"));
    try {
      return (ObjectNode) mapper.readTree(entity.getPayloadJson());
    } catch (IOException e) {
      throw new IllegalStateException("Corrupt master payload", e);
    }
  }

  @Transactional
  public ObjectNode saveMaster(JsonNode master) {
    try {
      PlantMasterEntity entity = repo.findById("plant").orElseGet(PlantMasterEntity::new);
      entity.setId("plant");
      entity.setPayloadJson(mapper.writeValueAsString(master));
      entity.setUpdatedAtEpochMs(System.currentTimeMillis());
      repo.save(entity);
      return (ObjectNode) master.deepCopy();
    } catch (IOException e) {
      throw new IllegalStateException("Failed to persist master", e);
    }
  }
}
