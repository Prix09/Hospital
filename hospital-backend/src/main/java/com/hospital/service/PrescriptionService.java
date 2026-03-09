package com.hospital.service;

import com.hospital.dto.PrescriptionDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.Prescription;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final PdfGenerator pdfGenerator;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               AppointmentRepository appointmentRepository,
                               PdfGenerator pdfGenerator) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.pdfGenerator = pdfGenerator;
    }

    public void createPrescription(PrescriptionDto prescriptionDto) {
        Appointment appointment = appointmentRepository.findById(prescriptionDto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + prescriptionDto.getAppointmentId()));

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDiagnosis(prescriptionDto.getDiagnosis());
        prescription.setMedication(prescriptionDto.getMedication());
        prescription.setInstructions(prescriptionDto.getInstructions());

        prescriptionRepository.save(prescription);
    }

    /**
     * Auto-generate a prescription based on appointment reason.
     * If a prescription already exists, return it. Otherwise, create one using
     * a symptom-to-treatment mapping based on the appointment reason.
     */
    public PrescriptionDto autoGeneratePrescription(Long appointmentId) {
        // Return existing prescription if already written
        return prescriptionRepository.findByAppointmentId(appointmentId)
                .map(this::mapToDto)
                .orElseGet(() -> {
                    Appointment appointment = appointmentRepository.findById(appointmentId)
                            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

                    String reason = appointment.getReason() != null ? appointment.getReason().toLowerCase() : "";
                    String[] generated = autoGenerateFromReason(reason);

                    Prescription prescription = new Prescription();
                    prescription.setAppointment(appointment);
                    prescription.setDiagnosis(generated[0]);
                    prescription.setMedication(generated[1]);
                    prescription.setInstructions(generated[2]);

                    Prescription saved = prescriptionRepository.save(prescription);
                    return mapToDto(saved);
                });
    }

    private String[] autoGenerateFromReason(String reason) {
        // Symptom keyword → [diagnosis, medication, instructions]
        Map<String, String[]> symptomMap = new LinkedHashMap<>();
        symptomMap.put("fever", new String[]{
            "Viral Fever",
            "Paracetamol 500mg, Ibuprofen 400mg",
            "Take Paracetamol every 6 hours. Drink plenty of fluids. Rest. If fever exceeds 103°F, seek emergency care."
        });
        symptomMap.put("cold", new String[]{
            "Common Cold (Acute Rhinitis)",
            "Cetirizine 10mg, Dextromethorphan syrup",
            "Take Cetirizine once daily at bedtime. Stay warm, drink warm liquids. Avoid cold beverages."
        });
        symptomMap.put("cough", new String[]{
            "Acute Bronchitis / Upper Respiratory Infection",
            "Amoxicillin 500mg, Dextromethorphan syrup, Salbutamol inhaler (if needed)",
            "Take Amoxicillin 3 times a day for 5 days. Use syrup 3 times daily. Avoid smoking and dusty environments."
        });
        symptomMap.put("headache", new String[]{
            "Tension Headache / Migraine",
            "Paracetamol 650mg, Sumatriptan 50mg (for migraine), Domperidone 10mg",
            "Take Paracetamol at onset. Rest in a quiet, dark room. Avoid screen exposure. Follow up if frequency increases."
        });
        symptomMap.put("chest pain", new String[]{
            "Musculoskeletal Chest Pain (Non-cardiac - assessment required)",
            "Ibuprofen 400mg, Antacid (Pantoprazole 40mg)",
            "Take Ibuprofen after meals. Avoid heavy lifting. Report immediately if pain radiates to arm, jaw, or worsens."
        });
        symptomMap.put("stomach", new String[]{
            "Gastroenteritis / Stomach Infection",
            "ORS (Oral Rehydration Solution), Metronidazole 400mg, Domperidone 10mg",
            "Drink ORS regularly. Take Metronidazole 3 times daily for 5 days. Avoid spicy/oily food. Eat light meals."
        });
        symptomMap.put("back pain", new String[]{
            "Lumbar Musculoskeletal Pain",
            "Diclofenac 50mg, Muscle relaxant (Cyclobenzaprine 5mg), Topical ointment",
            "Take Diclofenac twice daily after meals. Apply topical ointment. Avoid heavy lifting. Physiotherapy recommended."
        });
        symptomMap.put("diabetes", new String[]{
            "Type 2 Diabetes Mellitus",
            "Metformin 500mg, Glipizide 5mg (if required)",
            "Take Metformin twice daily with meals. Monitor blood sugar daily. Follow a low-carb diet. Regular exercise."
        });
        symptomMap.put("blood pressure", new String[]{
            "Hypertension (High Blood Pressure)",
            "Amlodipine 5mg, Losartan 50mg",
            "Take daily in the morning. Reduce salt intake. Avoid caffeine and stress. Monitor BP regularly."
        });
        symptomMap.put("skin", new String[]{
            "Dermatitis / Skin Rash",
            "Hydrocortisone cream 1%, Cetirizine 10mg, Moisturizer",
            "Apply cream twice daily on affected area. Take Cetirizine at bedtime. Avoid irritants and allergens."
        });
        symptomMap.put("eye", new String[]{
            "Conjunctivitis / Eye Irritation",
            "Ciprofloxacin eye drops, Artificial tears",
            "Apply eye drops 4 times daily. Avoid rubbing eyes. Wash hands frequently. Use sunglasses outdoors."
        });
        symptomMap.put("anxiety", new String[]{
            "Generalized Anxiety Disorder",
            "Sertraline 50mg, Alprazolam 0.25mg (as needed)",
            "Take Sertraline daily in the morning. Alprazolam only when needed. Practice deep breathing and mindfulness."
        });

        // Find matching keyword
        for (Map.Entry<String, String[]> entry : symptomMap.entrySet()) {
            if (reason.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Default generic prescription
        return new String[]{
            "General Consultation — Further evaluation required",
            "Multivitamins, Paracetamol 500mg (if needed)",
            "Rest adequately. Stay hydrated. Eat balanced meals. Follow up in 7 days if symptoms persist."
        };
    }

    public PrescriptionDto getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found for appointment: " + appointmentId));
        return mapToDto(prescription);
    }

    public byte[] generatePrescriptionPdf(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found: " + prescriptionId));
        return pdfGenerator.createPrescriptionPdf(prescription);
    }

    private PrescriptionDto mapToDto(Prescription p) {
        return new PrescriptionDto(
            p.getId(),
            p.getAppointment().getId(),
            p.getDiagnosis(),
            p.getMedication(),
            p.getInstructions(),
            p.getPrescribedAt()
        );
    }
}
