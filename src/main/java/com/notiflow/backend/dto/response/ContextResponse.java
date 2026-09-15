package com.notiflow.backend.dto.response;

import com.notiflow.backend.entity.ContextSession;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ContextResponse {
    private Long id;
    private String activeApplication;
    private String applicationCategory;
    private String activeDomain;
    private ContextSession.ActivityLevel activityLevel;
    private boolean idle;
    private int focusDurationMinutes;
    private int applicationSwitchCount;
    private LocalDateTime timestamp;
}