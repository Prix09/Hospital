package com.hospital.service;

import com.hospital.entity.Document;
import com.hospital.entity.User;
import com.hospital.repository.DocumentRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    public Document uploadDocument(Long patientId, MultipartFile file) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        String fileName = fileService.saveFile(file);
        
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFilePath(fileName);
        document.setPatient(patient);

        return documentRepository.save(document);
    }

    public List<Document> getPatientDocuments(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return documentRepository.findByPatient(patient);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public void deleteDocument(Long id) {
        Document doc = getDocumentById(id);
        fileService.deleteFile(doc.getFilePath());
        documentRepository.delete(doc);
    }
}
