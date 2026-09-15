package com.notiflow.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalNotifications;
    private long allowedCount;
    private long delayedCount;
    private long blockedCount;
    private boolean focusModeEnabled;
    private List<DecisionResponse> recentDecisions;
}