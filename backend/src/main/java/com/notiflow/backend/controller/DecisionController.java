package com.notiflow.backend.controller;

import com.notiflow.backend.dto.response.DecisionResponse;
import com.notiflow.backend.service.DecisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decisions")
@RequiredArgsConstructor
public class DecisionController {

    private final DecisionService decisionService;

    @GetMapping
    public ResponseEntity<List<DecisionResponse>> getAll() {
        return ResponseEntity.ok(decisionService.getAllDecisions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DecisionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(decisionService.getDecisionById(id));
    }
}