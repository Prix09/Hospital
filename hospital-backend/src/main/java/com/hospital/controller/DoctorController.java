package com.hospital.controller;

import com.hospital.dto.DoctorAvailabilityDto;
import com.hospital.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorAvailabilityService availabilityService;

    @Autowired
    public DoctorController(DoctorAvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<DoctorAvailabilityDto>> getDoctorAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByDoctorId(id));
    }

    @PostMapping("/availability")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorAvailabilityDto> addAvailability(@RequestBody DoctorAvailabilityDto dto) {
        return ResponseEntity.ok(availabilityService.addAvailability(dto));
    }

    @DeleteMapping("/availability/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }
}
