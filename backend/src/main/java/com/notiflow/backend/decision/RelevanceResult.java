package com.notiflow.backend.decision;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RelevanceResult {
    private String category;
    private double score;
    private String reason;
}