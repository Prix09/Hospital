package com.hospital.repository;

import com.hospital.entity.Appointment;
import com.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    
    boolean existsByDoctorIdAndAppointmentTimeAndStatusNotIn(
            Long doctorId, 
            LocalDateTime appointmentTime, 
            Collection<Appointment.AppointmentStatus> statuses
    );

    List<Appointment> findByAppointmentTimeBetweenAndStatusIn(
            LocalDateTime start, LocalDateTime end, Collection<Appointment.AppointmentStatus> statuses
    );
}
