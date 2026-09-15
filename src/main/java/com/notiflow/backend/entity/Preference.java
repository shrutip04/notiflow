package com.notiflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "preferences")
@Getter
@Setter
@NoArgsConstructor
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private boolean focusModeEnabled = false;

    private LocalTime workHoursStart = LocalTime.of(9, 0);
    private LocalTime workHoursEnd = LocalTime.of(18, 0);

    private boolean allowHighPriority = true;
    private boolean allowWorkNotifications = true;
    private boolean allowPersonalNotifications = false;
}