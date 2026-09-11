package com.prestigegaskets.rushmore.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "workforce_state")
public class WorkforceStateEntity {

  @Id
  private String id = "workforce";

  @Lob
  @Column(nullable = false, columnDefinition = "TEXT")
  private String payloadJson;

  private long updatedAtEpochMs;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getPayloadJson() {
    return payloadJson;
  }

  public void setPayloadJson(String payloadJson) {
    this.payloadJson = payloadJson;
  }

  public long getUpdatedAtEpochMs() {
    return updatedAtEpochMs;
  }

  public void setUpdatedAtEpochMs(long updatedAtEpochMs) {
    this.updatedAtEpochMs = updatedAtEpochMs;
  }
}
