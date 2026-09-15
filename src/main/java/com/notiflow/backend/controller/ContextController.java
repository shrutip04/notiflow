package com.notiflow.backend.controller;

import com.notiflow.backend.dto.request.ContextRequest;
import com.notiflow.backend.dto.response.ContextResponse;
import com.notiflow.backend.service.ContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/context")
@RequiredArgsConstructor
public class ContextController {

    private final ContextService contextService;

    @PostMapping
    public ResponseEntity<ContextResponse> submitContext(@Valid @RequestBody ContextRequest request) {
        return ResponseEntity.ok(contextService.submitContext(request));
    }

    @GetMapping("/current")
    public ResponseEntity<ContextResponse> getCurrentContext() {
        return ResponseEntity.ok(contextService.getCurrentContext());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ContextResponse>> getContextHistory() {
        return ResponseEntity.ok(contextService.getContextHistory());
    }
}