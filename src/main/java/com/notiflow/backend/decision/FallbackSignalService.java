package com.notiflow.backend.decision;

import com.notiflow.backend.entity.ContextSession;
import com.notiflow.backend.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FallbackSignalService {

    private final TaskRelevanceEngine taskRelevanceEngine;
    private final MotivationPriorityEngine motivationPriorityEngine;

    public NotificationSignal generateSignal(Notification notification, ContextSession context) {
        RelevanceResult relevance = taskRelevanceEngine.evaluate(notification, context);
        PriorityResult priority = motivationPriorityEngine.evaluate(notification);

        String explanation = relevance.getReason() + ". " + priority.getReason() + ".";

        return new NotificationSignal(
                relevance.getScore(),
                priority.getUrgencyScore(),
                relevance.getCategory(),
                notification.getTitle(),
                explanation
        );
    }
}