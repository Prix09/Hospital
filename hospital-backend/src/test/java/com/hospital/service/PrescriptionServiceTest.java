package com.hospital.service;

import com.hospital.dto.PrescriptionDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.Prescription;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.PdfGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PrescriptionServiceTest {

    @Mock
    private PrescriptionRepository prescriptionRepository;
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private PdfGenerator pdfGenerator;

    @InjectMocks
    private PrescriptionService prescriptionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreatePrescription() {
        // Arrange
        PrescriptionDto dto = new PrescriptionDto();
        dto.setAppointmentId(1L);
        dto.setDiagnosis("Common Cold");
        dto.setMedication("Paracetamol");

        Appointment appointment = new Appointment();
        appointment.setId(1L);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

        // Act
        prescriptionService.createPrescription(dto);

        // Assert
        verify(prescriptionRepository, times(1)).save(any(Prescription.class));
    }

    @Test
    void testGeneratePdf() {
        // Arrange
        Prescription prescription = new Prescription();
        prescription.setId(1L);
        when(prescriptionRepository.findById(1L)).thenReturn(Optional.of(prescription));
        when(pdfGenerator.createPrescriptionPdf(any())).thenReturn(new byte[]{1, 2, 3});

        // Act
        byte[] result = prescriptionService.generatePrescriptionPdf(1L);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.length);
        verify(pdfGenerator, times(1)).createPrescriptionPdf(prescription);
    }
}
