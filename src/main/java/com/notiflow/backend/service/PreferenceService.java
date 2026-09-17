package com.notiflow.backend.service;

import com.notiflow.backend.dto.request.PreferenceRequest;
import com.notiflow.backend.dto.response.PreferenceResponse;
import com.notiflow.backend.entity.Preference;
import com.notiflow.backend.entity.User;
import com.notiflow.backend.exception.ResourceNotFoundException;
import com.notiflow.backend.repository.PreferenceRepository;
import com.notiflow.backend.repository.UserRepository;
import com.notiflow.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    public PreferenceResponse getPreferences() {
        Preference preference = getCurrentUserPreference();
        return toResponse(preference);
    }

    public PreferenceResponse updatePreferences(PreferenceRequest request) {
        Preference preference = getCurrentUserPreference();

        preference.setFocusModeEnabled(request.isFocusModeEnabled());
        preference.setWorkHoursStart(request.getWorkHoursStart());
        preference.setWorkHoursEnd(request.getWorkHoursEnd());
        preference.setAllowHighPriority(request.isAllowHighPriority());
        preference.setAllowWorkNotifications(request.isAllowWorkNotifications());
        preference.setAllowPersonalNotifications(request.isAllowPersonalNotifications());

        preferenceRepository.save(preference);
        return toResponse(preference);
    }

    private Preference getCurrentUserPreference() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return preferenceRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Preference not found for user"));
    }

    private PreferenceResponse toResponse(Preference p) {
        return new PreferenceResponse(
                p.getId(), p.isFocusModeEnabled(), p.getWorkHoursStart(), p.getWorkHoursEnd(),
                p.isAllowHighPriority(), p.isAllowWorkNotifications(), p.isAllowPersonalNotifications()
        );
    }
}