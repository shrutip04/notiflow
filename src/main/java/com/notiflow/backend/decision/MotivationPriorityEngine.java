package com.notiflow.backend.decision;

import com.notiflow.backend.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class MotivationPriorityEngine {

    public PriorityResult evaluate(Notification notification) {
        String text = (notification.getTitle() + " " + notification.getContent()).toLowerCase();

        if (containsAny(text, "otp", "verification code", "security alert", "password reset", "suspicious login")) {
            return new PriorityResult(0.95, true, "Security or one-time-code notification");
        }
        if (containsAny(text, "interview", "deadline", "due today", "urgent", "asap", "final notice")) {
            return new PriorityResult(0.85, true, "Time-sensitive keyword detected");
        }
        if (containsAny(text, "sale", "% off", "discount", "limited time offer")) {
            return new PriorityResult(0.1, false, "Promotional content, low inherent urgency");
        }
        if (containsAny(text, "liked", "commented", "followed", "story")) {
            return new PriorityResult(0.15, false, "Social engagement notification, low inherent urgency");
        }

        return new PriorityResult(0.4, false, "No strong priority signal detected");
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }
}