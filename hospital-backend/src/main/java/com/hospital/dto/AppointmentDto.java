package com.hospital.dto;

import com.hospital.entity.Appointment.AppointmentStatus; // <-- This is the fix
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime appointmentTime;
    private AppointmentStatus status; // This will now resolve correctly
    private String videoSessionId;
}

