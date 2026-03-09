package com.hospital.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Email service that silently no-ops when mail is not configured.
 * No JavaMailSender dependency — completely safe to start without SMTP.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendEmail(String to, String subject, String body) {
        // Email sending is disabled in development mode.
        // Configure MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD env vars
        // and re-enable JavaMailSender to send real emails.
        logger.info("[EMAIL DISABLED] To: {} | Subject: {}", to, subject);
        logger.debug("[EMAIL BODY] {}", body);
    }
}
