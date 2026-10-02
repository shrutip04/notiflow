package com.notiflow.backend.repository;

import com.notiflow.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByReceivedAtDesc(Long userId);
}