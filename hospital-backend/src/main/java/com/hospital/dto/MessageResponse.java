package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // A Lombok annotation to create a constructor with all fields
public class MessageResponse {
    private String message;
}
