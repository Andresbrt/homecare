package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.FileUploadResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${file.max.size:5242880}") // 5MB por defecto
    private long maxFileSize;
    
    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "gif", "webp");
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    
    /**
     * Guarda un archivo y retorna la información del archivo guardado
     */
    public FileUploadResponseDTO saveFile(MultipartFile file, String category) throws IOException {
        // Validar que el archivo no esté vacío
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
        
        // Validar tamaño
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("El archivo excede el tamaño máximo permitido de " + 
                                             (maxFileSize / 1024 / 1024) + "MB");
        }
        
        // Validar tipo de archivo
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)");
        }
        
        // Obtener extensión del archivo
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new IllegalArgumentException("Extensión de archivo no permitida");
            }
        }
        
        // Generar nombre único para el archivo
        String uniqueFileName = UUID.randomUUID().toString() + "." + extension;
        
        // Crear directorio si no existe (por categoría)
        String categoryPath = category != null ? category : "general";
        Path uploadPath = Paths.get(uploadDir, categoryPath);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Guardar archivo
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Construir URL del archivo (relativa)
        String fileUrl = "/" + categoryPath + "/" + uniqueFileName;
        
        // Crear respuesta
        return new FileUploadResponseDTO(
            uniqueFileName,
            fileUrl,
            contentType,
            file.getSize(),
            LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }
    
    /**
     * Guarda múltiples archivos
     */
    public List<FileUploadResponseDTO> saveFiles(List<MultipartFile> files, String category) throws IOException {
        List<FileUploadResponseDTO> responses = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                FileUploadResponseDTO response = saveFile(file, category);
                responses.add(response);
            }
        }
        
        return responses;
    }
    
    /**
     * Elimina un archivo
     */
    public boolean deleteFile(String fileUrl) {
        try {
            // Extraer ruta relativa del URL
            String relativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
            Path filePath = Paths.get(uploadDir, relativePath);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            return false;
        }
    }
    
    /**
     * Valida si un archivo es una imagen válida
     */
    public boolean isValidImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        
        String contentType = file.getContentType();
        return contentType != null && ALLOWED_MIME_TYPES.contains(contentType);
    }
}
