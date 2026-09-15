package com.notiflow.backend.decision;

import com.notiflow.backend.entity.Decision;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DecisionResult {
    private Decision.DecisionType decisionType;
    private double relevanceScore;
    private double urgencyScore;
    private double interruptionCost;
    private String reason;
}