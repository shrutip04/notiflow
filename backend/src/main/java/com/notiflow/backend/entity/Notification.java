package com.notiflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String source;     // e.g. "GitHub", "Email", "Instagram"
    private String title;

    @Column(length = 1000)
    private String content;

    private String category;   // filled in later by AI, e.g. "CAREER", "SOCIAL"
    private String urgency;    // e.g. "LOW", "MEDIUM", "HIGH"

    @Column(nullable = false, updatable = false)
    private LocalDateTime receivedAt = LocalDateTime.now();

    private LocalDateTime processedAt;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, PROCESSED, FAILED
    }
}