package com.notiflow.backend.decision;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationSignal {
    private double relevance;   // 0.0 - 1.0
    private double urgency;     // 0.0 - 1.0
    private String category;   // e.g. "WORK", "PERSONAL", "CAREER", "SOCIAL"
    private String summary;
    private String explanation;
}