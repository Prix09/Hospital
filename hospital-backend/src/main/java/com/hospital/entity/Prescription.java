package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A one-to-one relationship: each prescription is linked to exactly one appointment.
    // The `unique = true` constraint enforces this at the database level.
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    // By explicitly defining the column as TEXT, we ensure that long descriptions
    // for diagnosis and medication can be stored without any length limitations.
    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String medication;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(nullable = false, updatable = false)
    private LocalDateTime prescribedAt;

    @PrePersist
    protected void onCreate() {
        prescribedAt = LocalDateTime.now();
    }
}

