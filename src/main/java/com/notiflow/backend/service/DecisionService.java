package com.notiflow.backend.service;

import com.notiflow.backend.decision.DecisionEngine;
import com.notiflow.backend.decision.DecisionResult;
import com.notiflow.backend.decision.FallbackSignalService;
import com.notiflow.backend.decision.NotificationSignal;
import com.notiflow.backend.dto.response.DecisionResponse;
import com.notiflow.backend.entity.*;
import com.notiflow.backend.exception.ResourceNotFoundException;
import com.notiflow.backend.repository.ContextSessionRepository;
import com.notiflow.backend.repository.DecisionRepository;
import com.notiflow.backend.repository.PreferenceRepository;
import com.notiflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DecisionService {

    private final DecisionEngine decisionEngine;
    private final FallbackSignalService fallbackSignalService;
    private final ContextSessionRepository contextSessionRepository;
    private final PreferenceRepository preferenceRepository;
    private final DecisionRepository decisionRepository;
    private final UserRepository userRepository;

    public Decision processNotification(Notification notification) {
        User user = notification.getUser();

        ContextSession latestContext = contextSessionRepository
                .findByUserIdOrderByTimestampDesc(user.getId())
                .stream()
                .findFirst()
                .orElseGet(this::neutralContext);

        Preference preference = preferenceRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Preference not found for user"));

        // AI service will replace this call on Day 5 — same NotificationSignal shape either way.
        NotificationSignal signal = fallbackSignalService.generateSignal(notification);

        DecisionResult result = decisionEngine.evaluate(signal, latestContext, preference);

        Decision decision = new Decision();
        decision.setNotification(notification);
        decision.setDecisionType(result.getDecisionType());
        decision.setRelevanceScore(result.getRelevanceScore());
        decision.setUrgencyScore(result.getUrgencyScore());
        decision.setInterruptionCost(result.getInterruptionCost());
        decision.setReason(result.getReason());
        decision.setAiExplanation(signal.getExplanation());

        decisionRepository.save(decision);

        notification.setCategory(signal.getCategory());
        notification.setUrgency(String.valueOf(signal.getUrgency()));
        notification.setStatus(Notification.Status.PROCESSED);
        notification.setProcessedAt(LocalDateTime.now());

        return decision;
    }

    public List<DecisionResponse> getAllDecisions() {
        String email = com.notiflow.backend.security.SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return decisionRepository.findByNotification_UserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DecisionResponse getDecisionById(Long id) {
        Decision decision = decisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Decision not found"));
        return toResponse(decision);
    }

    private ContextSession neutralContext() {
        // No context submitted yet — assume a neutral, moderate state rather than crashing.
        ContextSession context = new ContextSession();
        context.setActivityLevel(ContextSession.ActivityLevel.MEDIUM);
        context.setIdle(false);
        context.setFocusDurationMinutes(0);
        return context;
    }

    private DecisionResponse toResponse(Decision d) {
        return new DecisionResponse(
                d.getId(),
                d.getNotification().getId(),
                d.getDecisionType(),
                d.getRelevanceScore(),
                d.getUrgencyScore(),
                d.getInterruptionCost(),
                d.getReason(),
                d.getAiExplanation(),
                d.getCreatedAt()
        );
    }
}