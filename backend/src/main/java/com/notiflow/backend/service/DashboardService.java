package com.notiflow.backend.service;

import com.notiflow.backend.dto.response.DashboardSummaryResponse;
import com.notiflow.backend.dto.response.DecisionResponse;
import com.notiflow.backend.entity.Decision;
import com.notiflow.backend.entity.Preference;
import com.notiflow.backend.entity.User;
import com.notiflow.backend.exception.ResourceNotFoundException;
import com.notiflow.backend.repository.DecisionRepository;
import com.notiflow.backend.repository.PreferenceRepository;
import com.notiflow.backend.repository.UserRepository;
import com.notiflow.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DecisionRepository decisionRepository;
    private final PreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    public DashboardSummaryResponse getSummary() {
        User user = getCurrentUser();

        List<Decision> decisions = decisionRepository
                .findByNotification_UserIdOrderByCreatedAtDesc(user.getId());

        long allowed = decisions.stream().filter(d -> d.getDecisionType() == Decision.DecisionType.ALLOW).count();
        long delayed = decisions.stream().filter(d -> d.getDecisionType() == Decision.DecisionType.DELAY).count();
        long blocked = decisions.stream().filter(d -> d.getDecisionType() == Decision.DecisionType.BLOCK).count();

        Preference preference = preferenceRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Preference not found"));

        List<DecisionResponse> recent = decisions.stream()
                .limit(5)
                .map(this::toResponse)
                .toList();

        return new DashboardSummaryResponse(
                decisions.size(), allowed, delayed, blocked,
                preference.isFocusModeEnabled(), recent
        );
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private DecisionResponse toResponse(Decision d) {
        return new DecisionResponse(
                d.getId(), d.getNotification().getId(), d.getDecisionType(),
                d.getRelevanceScore(), d.getUrgencyScore(), d.getInterruptionCost(),
                d.getReason(), d.getAiExplanation(), d.getCreatedAt()
        );
    }
}