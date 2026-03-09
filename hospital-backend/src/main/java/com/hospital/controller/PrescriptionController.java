package com.hospital.controller;

import com.hospital.dto.MessageResponse;
import com.hospital.dto.PrescriptionDto;
import com.hospital.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> createPrescription(@Valid @RequestBody PrescriptionDto prescriptionDto) {
        try {
            prescriptionService.createPrescription(prescriptionDto);
            return ResponseEntity.ok(new MessageResponse("Prescription created successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<?> getPrescriptionByAppointment(@PathVariable Long appointmentId) {
        try {
            return ResponseEntity.ok(prescriptionService.getPrescriptionByAppointmentId(appointmentId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Auto-generate a prescription based on appointment reason.
     * Accessible by PATIENT — creates one if not already present, returns existing if it is.
     */
    @PostMapping("/auto/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<?> autoGeneratePrescription(@PathVariable Long appointmentId) {
        try {
            PrescriptionDto dto = prescriptionService.autoGeneratePrescription(appointmentId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<byte[]> downloadPrescription(@PathVariable Long id) {
        byte[] pdfContent = prescriptionService.generatePrescriptionPdf(id);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=prescription-" + id + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdfContent);
    }
}