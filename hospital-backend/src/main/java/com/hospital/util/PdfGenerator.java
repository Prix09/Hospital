package com.hospital.util;

import com.hospital.entity.Prescription;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Component
public class PdfGenerator {

    private static final Logger logger = LoggerFactory.getLogger(PdfGenerator.class);

    public byte[] createPrescriptionPdf(Prescription prescription) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Title
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 20);
                contentStream.newLineAtOffset(200, 750);
                contentStream.showText("Medical Prescription");
                contentStream.endText();

                // Patient and Doctor Info
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.setLeading(14.5f); // Line spacing
                contentStream.newLineAtOffset(50, 700);
                contentStream.showText("Date: " + prescription.getAppointment().getAppointmentTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                contentStream.newLine();
                contentStream.showText("Patient Name: " + prescription.getAppointment().getPatient().getName());
                contentStream.newLine();
                contentStream.showText("Doctor Name: " + prescription.getAppointment().getDoctor().getName());
                contentStream.endText();

                // Prescription Details
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.newLineAtOffset(50, 600);
                contentStream.showText("Diagnosis:");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(50, 580);
                contentStream.showText(prescription.getDiagnosis());
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.newLineAtOffset(50, 540);
                contentStream.showText("Medication:");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(50, 520);
                contentStream.showText(prescription.getMedication());
                contentStream.endText();

                if (prescription.getInstructions() != null && !prescription.getInstructions().isEmpty()) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                    contentStream.newLineAtOffset(50, 480);
                    contentStream.showText("Instructions:");
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    contentStream.newLineAtOffset(50, 460);
                    contentStream.showText(prescription.getInstructions());
                    contentStream.endText();
                }
            }

            document.save(baos);
            logger.info("PDF generated successfully using Apache PDFBox for appointment ID: {}", prescription.getAppointment().getId());

        } catch (IOException e) {
            logger.error("Error while generating PDF with Apache PDFBox: ", e);
        }
        return baos.toByteArray();
    }
}

