package com.hospital.task;

import com.hospital.entity.Appointment;
import com.hospital.repository.AppointmentRepository;
import com.hospital.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class ReminderTask {

    private static final Logger logger = LoggerFactory.getLogger(ReminderTask.class);

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    @Autowired
    public ReminderTask(AppointmentRepository appointmentRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
    }

    // Runs every 15 minutes
    @Scheduled(fixedRate = 900000)
    public void sendAppointmentReminders() {
        logger.info("Running scheduled reminder task...");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.plusMinutes(15);
        LocalDateTime windowEnd = now.plusMinutes(45);

        List<Appointment.AppointmentStatus> activeStatuses = Arrays.asList(
            Appointment.AppointmentStatus.SCHEDULED, 
            Appointment.AppointmentStatus.APPROVED
        );

        List<Appointment> upcomingAppointments = appointmentRepository.findByAppointmentTimeBetweenAndStatusIn(
            windowStart, windowEnd, activeStatuses
        );

        for (Appointment app : upcomingAppointments) {
            String subject = "Reminder: Upcoming Appointment";
            String body = "Hello, this is a reminder for your upcoming appointment at " + 
                          app.getAppointmentTime().toString() + ". Join your meeting on time!";
            
            emailService.sendEmail(app.getPatient().getEmail(), subject, body);
            emailService.sendEmail(app.getDoctor().getEmail(), subject, body);
        }
        
        logger.info("Sent reminders for {} appointments.", upcomingAppointments.size());
    }
}
