package com.hospital.exception;

import com.hospital.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@ControllerAdvice // This annotation makes it a global exception handler for the entire application.
public class GlobalExceptionHandler {

    /**
     * Handles specific resource not found exceptions.
     * @param ex The exception that was thrown.
     * @param request The web request during which the exception occurred.
     * @return A formatted ResponseEntity with a 404 NOT_FOUND status.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<MessageResponse> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                "Error: " + ex.getMessage());
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles all other exceptions that are not specifically caught.
     * This acts as a final catch-all.
     * @param ex The exception that was thrown.
     * @param request The web request during which the exception occurred.
     * @return A formatted ResponseEntity with a 500 INTERNAL_SERVER_ERROR status.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> globalExceptionHandler(Exception ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                "An unexpected error occurred: " + ex.getMessage());
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
