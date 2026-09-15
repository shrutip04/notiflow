package com.notiflow.backend.decision;

import com.notiflow.backend.entity.Notification;
import org.springframework.stereotype.Service;

@Service
public class FallbackSignalService {

    public NotificationSignal generateSignal(Notification notification) {
        String text = (notification.getTitle() + " " + notification.getContent()).toLowerCase();

        String category;
        double relevance;
        double urgency;

        if (containsAny(text, "interview", "exam", "deadline", "meeting", "salary", "offer")) {
            category = "CAREER";
            relevance = 0.9;
            urgency = 0.9;
        } else if (containsAny(text, "pull request", "review", "build failed", "deploy", "bug", "ticket")) {
            category = "WORK";
            relevance = 0.7;
            urgency = 0.6;
        } else if (containsAny(text, "sale", "% off", "discount", "offer ends", "buy now")) {
            category = "PROMOTIONAL";
            relevance = 0.1;
            urgency = 0.1;
        } else if (containsAny(text, "liked", "commented", "followed", "friend request", "story")) {
            category = "SOCIAL";
            relevance = 0.2;
            urgency = 0.1;
        } else {
            category = "GENERAL";
            relevance = 0.5;
            urgency = 0.4;
        }

        String summary = notification.getTitle();
        String explanation = "Classified using rule-based fallback (keyword match on category: " + category + ")";

        return new NotificationSignal(relevance, urgency, category, summary, explanation);
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}