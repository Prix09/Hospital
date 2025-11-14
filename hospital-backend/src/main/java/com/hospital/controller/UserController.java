package com.hospital.controller;

// ✅ CORRECTED imports to match your project's package structure
import com.hospital.entity.ERole;
import com.hospital.entity.User;
import com.hospital.dto.DoctorDto;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public List<DoctorDto> getAllDoctors() {
        // The logic here remains the same and is correct
        List<User> doctors = userRepository.findByRoles_Name(ERole.ROLE_DOCTOR);

        return doctors.stream()
                .map(doctor -> new DoctorDto(
                        doctor.getId(),
                        doctor.getName(),
                        doctor.getSpecialization()))
                .collect(Collectors.toList());
    }
}