package com.notiflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "context_sessions")
@Getter
@Setter
@NoArgsConstructor
public class ContextSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String activeApplication;      // e.g. "idea64.exe", "chrome.exe"
    private String applicationCategory;    // e.g. "DEVELOPMENT", "SOCIAL", "COMMUNICATION"
    private String activeDomain;           // e.g. "leetcode.com" (nullable if not browser)

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;   // LOW, MEDIUM, HIGH

    private boolean idle = false;
    private int focusDurationMinutes = 0;
    private int applicationSwitchCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum ActivityLevel {
        LOW, MEDIUM, HIGH
    }
}