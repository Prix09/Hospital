package com.hospital.service;

import com.hospital.dto.AppointmentDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.DoctorAvailability;
import com.hospital.entity.User;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorAvailabilityRepository;
import com.hospital.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DoctorAvailabilityRepository availabilityRepository;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAppointmentSuccess() {
        // Arrange
        Long patientId = 1L;
        Long doctorId = 2L;
        LocalDateTime time = LocalDateTime.now().plusDays(1);
        
        AppointmentDto dto = new AppointmentDto();
        dto.setPatientId(patientId);
        dto.setDoctorId(doctorId);
        dto.setAppointmentTime(time);

        User patient = new User();
        patient.setId(patientId);
        User doctor = new User();
        doctor.setId(doctorId);

        when(userRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(userRepository.findById(doctorId)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.existsByDoctorIdAndAppointmentTimeAndStatusNotIn(any(), any(), any())).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> {
            Appointment a = i.getArgument(0);
            a.setId(100L);
            return a;
        });

        // Act
        AppointmentDto result = appointmentService.createAppointment(dto);

        // Assert
        assertNotNull(result);
        assertEquals(patientId, result.getPatientId());
        verify(emailService, times(1)).sendEmail(any(), any(), any());
    }

    @Test
    void testCreateAppointmentOverlap() {
        // Arrange
        AppointmentDto dto = new AppointmentDto();
        dto.setPatientId(1L);
        dto.setDoctorId(2L);
        dto.setAppointmentTime(LocalDateTime.now());

        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        when(userRepository.findById(2L)).thenReturn(Optional.of(new User()));
        when(appointmentRepository.existsByDoctorIdAndAppointmentTimeAndStatusNotIn(any(), any(), any())).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> appointmentService.createAppointment(dto));
    }
}
