package com.notiflow.backend.decision;

import com.notiflow.backend.entity.ContextSession;
import com.notiflow.backend.entity.Decision;
import com.notiflow.backend.entity.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DecisionEngine {

    private final InterruptibilityEngine interruptibilityEngine;
    private final InterruptionCostEngine interruptionCostEngine;

    private static final double RELEVANCE_WEIGHT = 0.5;
    private static final double URGENCY_WEIGHT = 0.5;
    private static final double MARGIN = 0.15;
    private static final double PREFERENCE_PENALTY = 0.3;
    private static final double HIGH_PRIORITY_BONUS = 0.1;
    private static final double HIGH_URGENCY_THRESHOLD = 0.8;

    public DecisionResult evaluate(NotificationSignal signal, ContextSession context, Preference preference) {
        InterruptibilityResult interruptibility = interruptibilityEngine.evaluate(context);
        double interruptionCost = interruptionCostEngine.evaluate(interruptibility, preference);

        double priorityScore = calculatePriorityScore(signal);
        priorityScore = applyPreferenceAdjustments(priorityScore, signal, preference);

        Decision.DecisionType decisionType;
        String reason;

        if (priorityScore >= interruptionCost + MARGIN) {
            decisionType = Decision.DecisionType.ALLOW;
            reason = "High priority relative to interruption cost (" + interruptibility.getReason() + ")";
        } else if (priorityScore <= interruptionCost - MARGIN) {
            decisionType = Decision.DecisionType.BLOCK;
            reason = "Low priority while user is " + interruptibility.getLevel() + " interruptibility (" + interruptibility.getReason() + ")";
        } else {
            decisionType = Decision.DecisionType.DELAY;
            reason = "Priority and interruption cost are close; deferring (" + interruptibility.getReason() + ")";
        }

        return new DecisionResult(decisionType, signal.getRelevance(), signal.getUrgency(), interruptionCost, reason);
    }

    private double calculatePriorityScore(NotificationSignal signal) {
        return (signal.getRelevance() * RELEVANCE_WEIGHT) + (signal.getUrgency() * URGENCY_WEIGHT);
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