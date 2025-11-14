package com.hospital;

import com.hospital.entity.ERole;
import com.hospital.entity.Role;
import com.hospital.entity.User;
import com.hospital.repository.RoleRepository;
import com.hospital.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;

@SpringBootApplication
public class HospitalBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.findByName(ERole.ROLE_DOCTOR).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_DOCTOR));
            }
            if (roleRepository.findByName(ERole.ROLE_PATIENT).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_PATIENT));
            }
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
            }
            if (userRepository.findByUsername("DrSmith").isEmpty()) {
                Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR).orElseThrow();
                User doctor = new User("DrSmith", "Dr. John Smith", "dr.smith@hospital.com", passwordEncoder.encode("doctor123"));
                doctor.setSpecialization("Cardiology");
                doctor.setRoles(Set.of(doctorRole));
                userRepository.save(doctor);
                System.out.println("✅ Created sample doctor: Dr. John Smith");
            }
        };
    }
}