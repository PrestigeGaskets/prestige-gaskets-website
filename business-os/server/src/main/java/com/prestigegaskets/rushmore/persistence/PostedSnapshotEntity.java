package com.prestigegaskets.rushmore.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "posted_snapshots")
public class PostedSnapshotEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 64)
  private String actor;

  @Column(name = "business_day", nullable = false, length = 16)
  private String businessDay;

  private long postedAtEpochMs;

  @Lob
  @Column(nullable = false, columnDefinition = "TEXT")
  private String masterJson;

  @Lob
  @Column(nullable = false, columnDefinition = "TEXT")
  private String actionsJson;

  public Long getId() {
    return id;
  }

  public String getActor() {
    return actor;
  }

  public void setActor(String actor) {
    this.actor = actor;
  }

  public String getBusinessDay() {
    return businessDay;
  }

  public void setBusinessDay(String businessDay) {
    this.businessDay = businessDay;
  }

  public long getPostedAtEpochMs() {
    return postedAtEpochMs;
  }

  public void setPostedAtEpochMs(long postedAtEpochMs) {
    this.postedAtEpochMs = postedAtEpochMs;
  }

  public String getMasterJson() {
    return masterJson;
  }

  public void setMasterJson(String masterJson) {
    this.masterJson = masterJson;
  }

  public String getActionsJson() {
    return actionsJson;
  }

  public void setActionsJson(String actionsJson) {
    this.actionsJson = actionsJson;
  }
}
