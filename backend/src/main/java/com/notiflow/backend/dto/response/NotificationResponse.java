package com.notiflow.backend.dto.response;

import com.notiflow.backend.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String source;
    private String title;
    private String content;
    private String category;
    private String urgency;
    private Notification.Status status;
    private LocalDateTime receivedAt;
    private LocalDateTime processedAt;
}