package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDto {
    private Long id;
    private Long appointmentId;
    private String diagnosis;
    private String medication;
    private String instructions;
    private LocalDateTime prescribedAt;
}
