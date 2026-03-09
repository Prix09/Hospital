package com.hospital.repository;

import com.hospital.entity.DoctorAvailability;
import com.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctor(User doctor);
    List<DoctorAvailability> findByDoctorId(Long doctorId);
}
