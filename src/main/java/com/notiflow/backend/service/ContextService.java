package com.notiflow.backend.service;

import com.notiflow.backend.dto.request.ContextRequest;
import com.notiflow.backend.dto.response.ContextResponse;
import com.notiflow.backend.entity.ContextSession;
import com.notiflow.backend.entity.User;
import com.notiflow.backend.exception.ResourceNotFoundException;
import com.notiflow.backend.repository.ContextSessionRepository;
import com.notiflow.backend.repository.UserRepository;
import com.notiflow.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContextService {

    private final ContextSessionRepository contextSessionRepository;
    private final UserRepository userRepository;

    public ContextResponse submitContext(ContextRequest request) {
        User user = getCurrentUser();

        ContextSession session = new ContextSession();
        session.setUser(user);
        session.setActiveApplication(request.getActiveApplication());
        session.setApplicationCategory(request.getApplicationCategory());
        session.setActiveDomain(request.getActiveDomain());
        session.setActivityLevel(request.getActivityLevel());
        session.setIdle(request.isIdle());
        session.setFocusDurationMinutes(request.getFocusDurationMinutes());
        session.setApplicationSwitchCount(request.getApplicationSwitchCount());

        contextSessionRepository.save(session);
        return toResponse(session);
    }

    public ContextResponse getCurrentContext() {
        User user = getCurrentUser();
        List<ContextSession> sessions =
                contextSessionRepository.findByUserIdOrderByTimestampDesc(user.getId());

        if (sessions.isEmpty()) {
            throw new ResourceNotFoundException("No context data found for this user yet");
        }
        return toResponse(sessions.get(0));
    }

    public List<ContextResponse> getContextHistory() {
        User user = getCurrentUser();
        return contextSessionRepository.findByUserIdOrderByTimestampDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ContextResponse toResponse(ContextSession session) {
        return new ContextResponse(
                session.getId(),
                session.getActiveApplication(),
                session.getApplicationCategory(),
                session.getActiveDomain(),
                session.getActivityLevel(),
                session.isIdle(),
                session.getFocusDurationMinutes(),
                session.getApplicationSwitchCount(),
                session.getTimestamp()
        );
    }
}