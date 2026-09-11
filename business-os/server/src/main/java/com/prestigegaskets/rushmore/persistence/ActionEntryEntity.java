package com.prestigegaskets.rushmore.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(
    name = "action_entries",
    indexes = {
      @Index(name = "idx_action_actor_day", columnList = "actor, business_day"),
      @Index(name = "idx_action_order", columnList = "orderNo"),
      @Index(name = "idx_action_quote", columnList = "quoteNo"),
      @Index(name = "idx_action_po", columnList = "poNo"),
      @Index(name = "idx_action_grn", columnList = "grnNo")
    })
public class ActionEntryEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long pk;

  @Column(nullable = false, unique = true, length = 64)
  private String id;

  @Column(name = "business_day", nullable = false, length = 16)
  private String businessDay;

  @Column(nullable = false, length = 64)
  private String actor;

  @Column(nullable = false, length = 64)
  private String type;

  @Column(nullable = false, length = 32)
  private String status;

  private String stagedAt;
  private String postedAt;
  private String quoteNo;
  private String orderNo;
  private String poNo;
  private String grnNo;
  private String shipmentId;
  private String customerId;

  @Column(length = 512)
  private String detail;

  public Long getPk() {
    return pk;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getBusinessDay() {
    return businessDay;
  }

  public void setBusinessDay(String businessDay) {
    this.businessDay = businessDay;
  }

  public String getActor() {
    return actor;
  }

  public void setActor(String actor) {
    this.actor = actor;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getStagedAt() {
    return stagedAt;
  }

  public void setStagedAt(String stagedAt) {
    this.stagedAt = stagedAt;
  }

  public String getPostedAt() {
    return postedAt;
  }

  public void setPostedAt(String postedAt) {
    this.postedAt = postedAt;
  }

  public String getQuoteNo() {
    return quoteNo;
  }

  public void setQuoteNo(String quoteNo) {
    this.quoteNo = quoteNo;
  }

  public String getOrderNo() {
    return orderNo;
  }

  public void setOrderNo(String orderNo) {
    this.orderNo = orderNo;
  }

  public String getPoNo() {
    return poNo;
  }

  public void setPoNo(String poNo) {
    this.poNo = poNo;
  }

  public String getGrnNo() {
    return grnNo;
  }

  public void setGrnNo(String grnNo) {
    this.grnNo = grnNo;
  }

  public String getShipmentId() {
    return shipmentId;
  }

  public void setShipmentId(String shipmentId) {
    this.shipmentId = shipmentId;
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public String getDetail() {
    return detail;
  }

  public void setDetail(String detail) {
    this.detail = detail;
  }
}
