package com.notiflow.backend.dto.request;

import com.notiflow.backend.entity.ContextSession;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContextRequest {

    @NotBlank(message = "Active application is required")
    private String activeApplication;

    private String applicationCategory;
    private String activeDomain;

    @NotNull(message = "Activity level is required")
    private ContextSession.ActivityLevel activityLevel;

    private boolean idle;
    private int focusDurationMinutes;
    private int applicationSwitchCount;
}