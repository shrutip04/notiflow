package com.notiflow.backend.service;

import com.notiflow.backend.dto.request.NotificationRequest;
import com.notiflow.backend.dto.response.NotificationResponse;
import com.notiflow.backend.entity.Notification;
import com.notiflow.backend.entity.User;
import com.notiflow.backend.exception.ResourceNotFoundException;
import com.notiflow.backend.repository.NotificationRepository;
import com.notiflow.backend.repository.UserRepository;
import com.notiflow.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationResponse submitNotification(NotificationRequest request) {
        User user = getCurrentUser();

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setSource(request.getSource());
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setStatus(Notification.Status.PENDING);

        notificationRepository.save(notification);

        // AI classification + Decision Engine will hook in here in Phase 9/10 —
        // for now we just persist it as PENDING.

        return toResponse(notification);
    }

    public List<NotificationResponse> getAllNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByUserIdOrderByReceivedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificationResponse getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        return toResponse(notification);
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getSource(), n.getTitle(), n.getContent(),
                n.getCategory(), n.getUrgency(), n.getStatus(),
                n.getReceivedAt(), n.getProcessedAt()
        );
    }
}