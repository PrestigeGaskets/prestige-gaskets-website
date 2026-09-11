package com.prestigegaskets.rushmore.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostedSnapshotRepository extends JpaRepository<PostedSnapshotEntity, Long> {
  Optional<PostedSnapshotEntity> findFirstByOrderByPostedAtEpochMsDesc();

  Optional<PostedSnapshotEntity> findFirstByActorOrderByPostedAtEpochMsDesc(String actor);
}
