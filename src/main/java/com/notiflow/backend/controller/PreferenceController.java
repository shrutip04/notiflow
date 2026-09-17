package com.notiflow.backend.controller;

import com.notiflow.backend.dto.request.PreferenceRequest;
import com.notiflow.backend.dto.response.PreferenceResponse;
import com.notiflow.backend.service.PreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class PreferenceController {

    private final PreferenceService preferenceService;

    @GetMapping
    public ResponseEntity<PreferenceResponse> getPreferences() {
        return ResponseEntity.ok(preferenceService.getPreferences());
    }

    @PutMapping
    public ResponseEntity<PreferenceResponse> updatePreferences(@Valid @RequestBody PreferenceRequest request) {
        return ResponseEntity.ok(preferenceService.updatePreferences(request));
    }
}