package com.notiflow.backend.decision;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InterruptibilityResult {
    private double score;          // 0.0 (not interruptible at all) - 1.0 (fully available)
    private Level level;
    private String reason;

    public enum Level {
        HIGH, MEDIUM, LOW
    }
}