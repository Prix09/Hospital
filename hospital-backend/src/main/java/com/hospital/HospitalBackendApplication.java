package com.hospital;

import com.hospital.entity.ERole;
import com.hospital.entity.Role;
import com.hospital.entity.User;
import com.hospital.repository.RoleRepository;
import com.hospital.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;

@SpringBootApplication
@EnableScheduling
public class HospitalBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, org.springframework.core.env.Environment env) {
        return args -> {
            if (java.util.Arrays.asList(env.getActiveProfiles()).contains("test")) {
                return;
            }

            // Seed roles
            if (roleRepository.findByName(ERole.ROLE_DOCTOR).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_DOCTOR));
            }
            if (roleRepository.findByName(ERole.ROLE_PATIENT).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_PATIENT));
            }
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
            }

            Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR).orElseThrow();

            // Seed multiple doctors with different specializations
            // Name stored WITHOUT "Dr." prefix — frontend or display layer adds "Dr."
            seedDoctor(userRepository, passwordEncoder, doctorRole, "DrSmith", "John Smith", "dr.smith@hospital.com", "Cardiology");
            seedDoctor(userRepository, passwordEncoder, doctorRole, "DrPatel", "Ananya Patel", "dr.patel@hospital.com", "Neurology");
            seedDoctor(userRepository, passwordEncoder, doctorRole, "DrLee", "Kevin Lee", "dr.lee@hospital.com", "Orthopedics");
            seedDoctor(userRepository, passwordEncoder, doctorRole, "DrSharma", "Priya Sharma", "dr.sharma@hospital.com", "Dermatology");
            seedDoctor(userRepository, passwordEncoder, doctorRole, "DrChen", "Wei Chen", "dr.chen@hospital.com", "Pediatrics");
            seedDoctor(userRepository, passwordEncoder, doctorRole, "DrGupta", "Rahul Gupta", "dr.gupta@hospital.com", "General Medicine");
        };
    }

    private void seedDoctor(UserRepository repo, PasswordEncoder encoder, Role doctorRole,
                             String username, String name, String email, String specialization) {
        if (repo.findByUsername(username).isEmpty()) {
            User doctor = new User(username, name, email, encoder.encode("doctor123"));
            doctor.setSpecialization(specialization);
            doctor.setRoles(Set.of(doctorRole));
            repo.save(doctor);
            System.out.println("✅ Created doctor: Dr. " + name + " (" + specialization + ")");
        }
    }
}