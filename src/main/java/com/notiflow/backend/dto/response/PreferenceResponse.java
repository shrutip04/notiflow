package com.notiflow.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class PreferenceResponse {
    private Long id;
    private boolean focusModeEnabled;
    private LocalTime workHoursStart;
    private LocalTime workHoursEnd;
    private boolean allowHighPriority;
    private boolean allowWorkNotifications;
    private boolean allowPersonalNotifications;
}