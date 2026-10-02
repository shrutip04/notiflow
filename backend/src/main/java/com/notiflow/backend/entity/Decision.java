package com.notiflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "decisions")
@Getter
@Setter
@NoArgsConstructor
public class Decision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false, unique = true)
    private Notification notification;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DecisionType decisionType;

    private double relevanceScore;
    private double urgencyScore;
    private double interruptionCost;

    @Column(length = 500)
    private String reason;

    @Column(length = 1000)
    private String aiExplanation;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DecisionType {
        ALLOW, DELAY, BLOCK
    }
}