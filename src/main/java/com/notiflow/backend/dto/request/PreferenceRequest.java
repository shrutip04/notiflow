package com.notiflow.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalTime;

@Getter
@Setter
public class PreferenceRequest {

    @NotNull
    private boolean focusModeEnabled;

    @NotNull
    private LocalTime workHoursStart;

    @NotNull
    private LocalTime workHoursEnd;

    @NotNull
    private boolean allowHighPriority;

    @NotNull
    private boolean allowWorkNotifications;

    @NotNull
    private boolean allowPersonalNotifications;
}