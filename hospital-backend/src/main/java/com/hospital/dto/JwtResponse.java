package com.hospital.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username; // ✅ Added username
    private String email;
    private String name;
    private List<String> roles;

    // ✅ Updated constructor to include username
    public JwtResponse(String accessToken, Long id, String username, String email, String name, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }
}