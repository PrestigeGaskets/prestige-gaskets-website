package com.prestigegaskets.rushmore.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActionEntryRepository extends JpaRepository<ActionEntryEntity, Long> {

  List<ActionEntryEntity> findByActorAndBusinessDayOrderByPostedAtDesc(String actor, String day);

  @Query(
      """
      select a from ActionEntryEntity a
      where (:actor is null or a.actor = :actor)
        and (:day is null or a.businessDay = :day)
        and (:orderNo is null or a.orderNo = :orderNo)
        and (:quoteNo is null or a.quoteNo = :quoteNo)
        and (:poNo is null or a.poNo = :poNo)
        and (:grnNo is null or a.grnNo = :grnNo)
        and (:shipmentId is null or a.shipmentId = :shipmentId)
      order by a.postedAt desc
      """)
  List<ActionEntryEntity> search(
      @Param("actor") String actor,
      @Param("day") String day,
      @Param("orderNo") String orderNo,
      @Param("quoteNo") String quoteNo,
      @Param("poNo") String poNo,
      @Param("grnNo") String grnNo,
      @Param("shipmentId") String shipmentId);
}
