package com.notiflow.backend.repository;

import com.notiflow.backend.entity.ContextSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContextSessionRepository extends JpaRepository<ContextSession, Long> {
    List<ContextSession> findByUserIdOrderByTimestampDesc(Long userId);
}