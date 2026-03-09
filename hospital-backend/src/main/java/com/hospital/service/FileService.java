package com.hospital.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    private final Path root = Paths.get("uploads");
    private final List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png");

    public FileService() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public String saveFile(MultipartFile file) {
        // Virus Scanning / Security Checks
        scanFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
            
            if (!allowedExtensions.contains(extension)) {
                throw new RuntimeException("File type not allowed. Please upload PDF or Images.");
            }

            String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Files.copy(file.getInputStream(), this.root.resolve(fileName));
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public Resource loadFile(String filename) {
        try {
            Path file = root.resolve(filename);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return (Resource) resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public void deleteFile(String filename) {
        try {
            Files.deleteIfExists(root.resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException("Error deleting file: " + e.getMessage());
        }
    }

    private void scanFile(MultipartFile file) {
        // Basic safety checks
        String originalFileName = file.getOriginalFilename();
        if (file.isEmpty() || originalFileName == null) {
            throw new RuntimeException("Cannot upload empty or invalid file.");
        }
        
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
            throw new RuntimeException("File size exceeds limit (5MB).");
        }

        // Mock Virus Scan
        if (originalFileName.toLowerCase().contains("malicious")) {
            throw new RuntimeException("Virus Scan Failed: Malicious file detected.");
        }
    }

    // Workaround for import error in generated code if Resource is ambiguous
    public interface Resource extends org.springframework.core.io.Resource {}
}
