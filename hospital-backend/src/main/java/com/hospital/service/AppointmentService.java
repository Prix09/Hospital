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
    private final EmailService emailService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        User patient = userRepository.findById(appointmentDto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + appointmentDto.getPatientId()));
        User doctor = userRepository.findById(appointmentDto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + appointmentDto.getDoctorId()));

        // Conflict check... (already there)
        List<Appointment.AppointmentStatus> excludedStatuses = Arrays.asList(Appointment.AppointmentStatus.CANCELLED, Appointment.AppointmentStatus.COMPLETED);
        boolean conflict = appointmentRepository.existsByDoctorIdAndAppointmentTimeAndStatusNotIn(
                appointmentDto.getDoctorId(),
                appointmentDto.getAppointmentTime(),
                excludedStatuses
        );

        if (conflict) {
            throw new ConflictException("This time slot is already booked for the selected doctor. Please choose another time.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentDto.getAppointmentTime());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointment.setReason(appointmentDto.getReason());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Notify patient
        emailService.sendEmail(patient.getEmail(), "Appointment Requested", 
            "Hello " + patient.getName() + ",\n\nYour appointment request with Dr. " + doctor.getName() + 
            " for " + savedAppointment.getAppointmentTime().toString() + " has been received and is pending approval.");

        return convertToDto(savedAppointment);
    }

    public AppointmentDto approveAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        appointment.setStatus(Appointment.AppointmentStatus.APPROVED);
        appointment.setVideoSessionId(UUID.randomUUID().toString());

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Notify patient
        emailService.sendEmail(appointment.getPatient().getEmail(), "Appointment Approved", 
            "Hello " + appointment.getPatient().getName() + ",\n\nYour appointment with Dr. " + appointment.getDoctor().getName() + 
            " has been approved for " + updatedAppointment.getAppointmentTime().toString() + ".");

        return convertToDto(updatedAppointment);
    }

    public AppointmentDto cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));
        
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Notify both
        String cancelMsg = "The appointment for " + updatedAppointment.getAppointmentTime().toString() + " has been cancelled.";
        emailService.sendEmail(appointment.getPatient().getEmail(), "Appointment Cancelled", cancelMsg);
        emailService.sendEmail(appointment.getDoctor().getEmail(), "Appointment Cancelled", cancelMsg);

        return convertToDto(updatedAppointment);
    }

    public AppointmentDto rescheduleAppointment(Long appointmentId, AppointmentDto rescheduleDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        // Conflict check...
        List<Appointment.AppointmentStatus> excludedStatuses = Arrays.asList(Appointment.AppointmentStatus.CANCELLED, Appointment.AppointmentStatus.COMPLETED);
        boolean conflict = appointmentRepository.existsByDoctorIdAndAppointmentTimeAndStatusNotIn(
                appointment.getDoctor().getId(),
                rescheduleDto.getAppointmentTime(),
                excludedStatuses
        );

        if (conflict) {
            throw new ConflictException("The new time slot is already booked. Please choose another time.");
        }

        appointment.setAppointmentTime(rescheduleDto.getAppointmentTime());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED); 
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Notify patient
        emailService.sendEmail(appointment.getPatient().getEmail(), "Appointment Rescheduled", 
            "Hello " + appointment.getPatient().getName() + ",\n\nYour appointment has been rescheduled to " + 
            updatedAppointment.getAppointmentTime().toString() + ".");

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
        dto.setReason(appointment.getReason());
        return dto;
    }
}

