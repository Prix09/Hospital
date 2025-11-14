package com.hospital.service;

import com.hospital.dto.PrescriptionDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.Prescription;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository, AppointmentRepository appointmentRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public void createPrescription(PrescriptionDto prescriptionDto) {
        Appointment appointment = appointmentRepository.findById(prescriptionDto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + prescriptionDto.getAppointmentId()));

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDiagnosis(prescriptionDto.getDiagnosis());
        prescription.setMedication(prescriptionDto.getMedication());

        prescriptionRepository.save(prescription);
    }
}
