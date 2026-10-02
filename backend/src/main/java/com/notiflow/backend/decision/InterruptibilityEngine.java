package com.notiflow.backend.decision;

import com.notiflow.backend.entity.ContextSession;
import org.springframework.stereotype.Component;

@Component
public class InterruptibilityEngine {

    private static final double MAX_FOCUS_DURATION_PENALTY = 0.3;

    public InterruptibilityResult evaluate(ContextSession context) {
        if (context.isIdle()) {
            return new InterruptibilityResult(0.9, InterruptibilityResult.Level.HIGH, "User is idle");
        }

        double baseScore = switch (context.getActivityLevel()) {
            case LOW -> 0.7;
            case MEDIUM -> 0.4;
            case HIGH -> 0.15;
        };

        double focusPenalty = Math.min(context.getFocusDurationMinutes() / 100.0, MAX_FOCUS_DURATION_PENALTY);
        double score = Math.max(0.0, baseScore - focusPenalty);

        InterruptibilityResult.Level level = score >= 0.6
                ? InterruptibilityResult.Level.HIGH
                : score >= 0.3
                  ? InterruptibilityResult.Level.MEDIUM
                  : InterruptibilityResult.Level.LOW;

        String reason = "Activity level " + context.getActivityLevel()
                + ", " + context.getFocusDurationMinutes() + " min focus duration";

        return new InterruptibilityResult(score, level, reason);
    }
}