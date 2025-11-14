package com.hospital.repository;

import com.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    /**
     * Checks if an appointment exists for a specific doctor at a given time,
     * excluding certain statuses like CANCELLED. This is used for conflict detection.
     * @param doctorId The ID of the doctor.
     * @param appointmentTime The exact start time of the appointment to check.
     * @param excludedStatuses A list of statuses to ignore in the check.
     * @return true if a conflicting appointment exists, false otherwise.
     */
    boolean existsByDoctorIdAndAppointmentTimeAndStatusNotIn(Long doctorId, LocalDateTime appointmentTime, List<Appointment.AppointmentStatus> excludedStatuses);
}

