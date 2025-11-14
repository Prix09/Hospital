package com.hospital.dto; // ✅ Correct package for your project

// A Data Transfer Object (DTO) to safely expose doctor information
public class DoctorDto {
    private Long id;
    private String name;
    private String specialization;

    public DoctorDto(Long id, String name, String specialization) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}