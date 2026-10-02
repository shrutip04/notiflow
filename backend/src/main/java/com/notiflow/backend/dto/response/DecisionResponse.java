package com.notiflow.backend.dto.response;

import com.notiflow.backend.entity.Decision;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class DecisionResponse {
    private Long id;
    private Long notificationId;
    private Decision.DecisionType decisionType;
    private double relevanceScore;
    private double urgencyScore;
    private double interruptionCost;
    private String reason;
    private String aiExplanation;
    private LocalDateTime createdAt;
}