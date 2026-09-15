package com.notiflow.backend.repository;

import com.notiflow.backend.entity.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DecisionRepository extends JpaRepository<Decision, Long> {
    Optional<Decision> findByNotificationId(Long notificationId);
}