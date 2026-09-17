package com.notiflow.backend.decision;

import com.notiflow.backend.entity.ContextSession;
import com.notiflow.backend.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class TaskRelevanceEngine {

    private static final double CONTEXT_ALIGNMENT_BOOST = 0.15;
    private static final double CONTEXT_MISMATCH_PENALTY = 0.1;

    public RelevanceResult evaluate(Notification notification, ContextSession context) {
        String text = (notification.getTitle() + " " + notification.getContent()).toLowerCase();

        String category;
        double baseScore;

        if (containsAny(text, "interview", "exam", "deadline", "offer letter", "salary")) {
            category = "CAREER";
            baseScore = 0.85;
        } else if (containsAny(text, "pull request", "review", "build failed", "deploy", "bug", "ticket", "meeting")) {
            category = "WORK";
            baseScore = 0.6;
        } else if (containsAny(text, "sale", "% off", "discount", "buy now", "offer ends")) {
            category = "PROMOTIONAL";
            baseScore = 0.1;
        } else if (containsAny(text, "liked", "commented", "followed", "friend request", "story")) {
            category = "SOCIAL";
            baseScore = 0.2;
        } else {
            category = "GENERAL";
            baseScore = 0.45;
        }

        double adjustedScore = adjustForContext(baseScore, category, context);
        String reason = "Category " + category + " with active application category "
                + context.getApplicationCategory();

        return new RelevanceResult(category, adjustedScore, reason);
    }

    private double adjustForContext(double baseScore, String category, ContextSession context) {
        String appCategory = context.getApplicationCategory();
        double score = baseScore;

        boolean userIsWorking = "DEVELOPMENT".equalsIgnoreCase(appCategory) || "WORK".equalsIgnoreCase(appCategory);

        if (userIsWorking && ("WORK".equals(category) || "CAREER".equals(category))) {
            score += CONTEXT_ALIGNMENT_BOOST;
        } else if (userIsWorking && ("PROMOTIONAL".equals(category) || "SOCIAL".equals(category))) {
            score -= CONTEXT_MISMATCH_PENALTY;
        }

        return Math.max(0.0, Math.min(score, 1.0));
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }
}