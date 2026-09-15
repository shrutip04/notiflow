package com.notiflow.backend.decision;

import com.notiflow.backend.entity.ContextSession;
import com.notiflow.backend.entity.Decision;
import com.notiflow.backend.entity.Preference;
import org.springframework.stereotype.Component;

@Component
public class DecisionEngine {

    private static final double RELEVANCE_WEIGHT = 0.5;
    private static final double URGENCY_WEIGHT = 0.5;
    private static final double MARGIN = 0.15;

    private static final double FOCUS_MODE_BOOST = 0.2;
    private static final double MAX_FOCUS_DURATION_BOOST = 0.2;
    private static final double PREFERENCE_PENALTY = 0.3;
    private static final double HIGH_PRIORITY_BONUS = 0.1;
    private static final double HIGH_URGENCY_THRESHOLD = 0.8;

    public DecisionResult evaluate(NotificationSignal signal, ContextSession context, Preference preference) {
        double priorityScore = calculatePriorityScore(signal);
        double interruptionCost = calculateInterruptionCost(context, preference);

        priorityScore = applyPreferenceAdjustments(priorityScore, signal, preference);

        Decision.DecisionType decisionType;
        String reason;

        if (priorityScore >= interruptionCost + MARGIN) {
            decisionType = Decision.DecisionType.ALLOW;
            reason = "High priority relative to current interruption cost";
        } else if (priorityScore <= interruptionCost - MARGIN) {
            decisionType = Decision.DecisionType.BLOCK;
            reason = "Low priority while interruption cost is high";
        } else {
            decisionType = Decision.DecisionType.DELAY;
            reason = "Priority and interruption cost are close; deferring for a better moment";
        }

        return new DecisionResult(decisionType, signal.getRelevance(), signal.getUrgency(), interruptionCost, reason);
    }

    private double calculatePriorityScore(NotificationSignal signal) {
        return (signal.getRelevance() * RELEVANCE_WEIGHT) + (signal.getUrgency() * URGENCY_WEIGHT);
    }

    private double calculateInterruptionCost(ContextSession context, Preference preference) {
        if (context.isIdle()) {
            return 0.1;
        }

        double baseCost = switch (context.getActivityLevel()) {
            case LOW -> 0.2;
            case MEDIUM -> 0.5;
            case HIGH -> 0.8;
        };

        double focusModeBoost = preference.isFocusModeEnabled() ? FOCUS_MODE_BOOST : 0.0;
        double durationBoost = Math.min(context.getFocusDurationMinutes() / 120.0, MAX_FOCUS_DURATION_BOOST);

        return Math.min(baseCost + focusModeBoost + durationBoost, 1.0);
    }

    private double applyPreferenceAdjustments(double priorityScore, NotificationSignal signal, Preference preference) {
        double adjusted = priorityScore;

        if ("PERSONAL".equalsIgnoreCase(signal.getCategory()) && !preference.isAllowPersonalNotifications()) {
            adjusted -= PREFERENCE_PENALTY;
        }
        if ("WORK".equalsIgnoreCase(signal.getCategory()) && !preference.isAllowWorkNotifications()) {
            adjusted -= PREFERENCE_PENALTY;
        }
        if (preference.isAllowHighPriority() && signal.getUrgency() >= HIGH_URGENCY_THRESHOLD) {
            adjusted += HIGH_PRIORITY_BONUS;
        }

        return Math.max(0.0, Math.min(adjusted, 1.0));
    }
}