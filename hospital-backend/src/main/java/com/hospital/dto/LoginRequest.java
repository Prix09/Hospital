package com.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank
    private String username; // ✅ Should be username to match security config

    @NotBlank
    private String password;
}