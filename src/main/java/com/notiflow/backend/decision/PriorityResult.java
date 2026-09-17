package com.notiflow.backend.decision;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PriorityResult {
    private double urgencyScore;
    private boolean highPriority;
    private String reason;
}