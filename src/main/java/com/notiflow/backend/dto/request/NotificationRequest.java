package com.notiflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Title is required")
    private String title;

    private String content;
}