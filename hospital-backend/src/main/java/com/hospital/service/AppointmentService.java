package com.hospital.service;

import com.hospital.dto.AppointmentDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.User;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        User patient = userRepository.findById(appointmentDto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + appointmentDto.getPatientId()));
        User doctor = userRepository.findById(appointmentDto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + appointmentDto.getDoctorId()));

        // =================================================================
        // THE FIX: Added appointment conflict detection logic.
        // =================================================================
        List<Appointment.AppointmentStatus> excludedStatuses = Arrays.asList(Appointment.AppointmentStatus.CANCELLED, Appointment.AppointmentStatus.COMPLETED);
        boolean conflict = appointmentRepository.existsByDoctorIdAndAppointmentTimeAndStatusNotIn(
                appointmentDto.getDoctorId(),
                appointmentDto.getAppointmentTime(),
                excludedStatuses
        );

        if (conflict) {
            throw new ConflictException("This time slot is already booked for the selected doctor. Please choose another time.");
        }
        // =================================================================

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentDto.getAppointmentTime());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToDto(savedAppointment);
    }

    public AppointmentDto approveAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        appointment.setStatus(Appointment.AppointmentStatus.APPROVED);
        appointment.setVideoSessionId(UUID.randomUUID().toString()); // Generate a unique session ID

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return convertToDto(updatedAppointment);
    }

    public List<AppointmentDto> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientName(appointment.getPatient().getName());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorName(appointment.getDoctor().getName());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setStatus(appointment.getStatus());
        dto.setVideoSessionId(appointment.getVideoSessionId());
        return dto;
    }
}

