package com.hospital.controller;

import com.hospital.entity.ERole;
import com.hospital.entity.User;
import com.hospital.dto.DoctorDto;
import com.hospital.dto.UserDto;
import com.hospital.repository.UserRepository;
import com.hospital.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('PATIENT')")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                roles,
                user.getSpecialization()
        ));
    }

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