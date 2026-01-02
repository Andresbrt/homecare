package com.cleanhome.backend.dto;

public class FileUploadResponseDTO {
    
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private String uploadedAt;
    
    public FileUploadResponseDTO() {}
    
    public FileUploadResponseDTO(String fileName, String fileUrl, String fileType, Long fileSize, String uploadedAt) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }
    
    // Getters and Setters
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFileUrl() {
        return fileUrl;
    }
    
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
