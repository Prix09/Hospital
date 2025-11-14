package com.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionDto {
    private Long id;

    @NotNull(message = "Appointment ID cannot be null")
    private Long appointmentId;

    @NotBlank(message = "Diagnosis cannot be blank")
    private String diagnosis;

    @NotBlank(message = "Medication cannot be blank")
    private String medication;
}
