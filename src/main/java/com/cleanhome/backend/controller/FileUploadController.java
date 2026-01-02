package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.FileUploadResponseDTO;
import com.cleanhome.backend.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@Tag(name = "Files", description = "Gestión de archivos y fotos de evidencia")
public class FileUploadController {
    
    private final FileStorageService fileStorageService;
    
    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }
    
    /**
     * Sube una única foto de evidencia
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Subir archivo",
        description = "Sube una foto de evidencia (máximo 5MB, solo imágenes)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "evidence") String category) {
        try {
            if (!fileStorageService.isValidImage(file)) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)"));
            }
            
            FileUploadResponseDTO response = fileStorageService.saveFile(file, category);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error al guardar el archivo: " + e.getMessage()));
        }
    }
    
    /**
     * Sube múltiples fotos de evidencia
     */
    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Subir múltiples archivos",
        description = "Sube varias fotos de evidencia a la vez",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> uploadMultipleFiles(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "category", defaultValue = "evidence") String category) {
        try {
            // Validar que todos sean imágenes
            for (MultipartFile file : files) {
                if (!file.isEmpty() && !fileStorageService.isValidImage(file)) {
                    return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Todos los archivos deben ser imágenes válidas"));
                }
            }
            
            List<FileUploadResponseDTO> responses = fileStorageService.saveFiles(files, category);
            return ResponseEntity.status(HttpStatus.CREATED).body(responses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error al guardar los archivos: " + e.getMessage()));
        }
    }
    
    /**
     * Sube fotos específicas para un booking (evidencia del servicio)
     */
    @PostMapping(value = "/upload-evidence/{bookingId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Subir evidencia de servicio",
        description = "Permite al proveedor subir fotos de evidencia del servicio completado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> uploadServiceEvidence(
            @PathVariable Long bookingId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "room", required = false) String room) {
        try {
            // Validar imágenes
            for (MultipartFile file : files) {
                if (!file.isEmpty() && !fileStorageService.isValidImage(file)) {
                    return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Todos los archivos deben ser imágenes válidas"));
                }
            }
            
            // Guardar en categoría específica del booking
            String category = "evidence/booking-" + bookingId + (room != null ? "/" + room : "");
            List<FileUploadResponseDTO> responses = fileStorageService.saveFiles(files, category);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new EvidenceUploadResponse(
                bookingId,
                room,
                responses,
                "Evidencia subida exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error al subir evidencia: " + e.getMessage()));
        }
    }
    
    /**
     * Elimina un archivo
     */
    @DeleteMapping("/delete")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Eliminar archivo",
        description = "Elimina un archivo previamente subido",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        boolean deleted = fileStorageService.deleteFile(fileUrl);
        if (deleted) {
            return ResponseEntity.ok(new SuccessResponse("Archivo eliminado exitosamente"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Archivo no encontrado"));
        }
    }
    
    // Response DTOs
    private record ErrorResponse(String message) {}
    private record SuccessResponse(String message) {}
    private record EvidenceUploadResponse(
        Long bookingId,
        String room,
        List<FileUploadResponseDTO> files,
        String message
    ) {}
}
