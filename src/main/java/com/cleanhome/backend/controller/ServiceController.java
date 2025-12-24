package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ServiceResponseDto;
import com.cleanhome.backend.entity.Service;
import com.cleanhome.backend.enums.ServiceType;
import com.cleanhome.backend.repository.ServiceRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Services", description = "Endpoints para gestión de servicios de limpieza")
@RestController
@RequestMapping("/api/services")
public class ServiceController {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Operation(summary = "Listar todos los servicios activos")
    @GetMapping
    public ResponseEntity<List<ServiceResponseDto>> getAllActiveServices() {
        List<Service> services = serviceRepository.findByIsActiveTrue();
        List<ServiceResponseDto> serviceDtos = services.stream()
                .map(service -> modelMapper.map(service, ServiceResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(serviceDtos);
    }
    
    @Operation(summary = "Obtener servicio por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(service -> ResponseEntity.ok(modelMapper.map(service, ServiceResponseDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Buscar servicios por palabra clave")
    @GetMapping("/search")
    public ResponseEntity<List<ServiceResponseDto>> searchServices(@RequestParam String keyword) {
        List<Service> services = serviceRepository.searchByKeyword(keyword);
        List<ServiceResponseDto> serviceDtos = services.stream()
                .map(service -> modelMapper.map(service, ServiceResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(serviceDtos);
    }
    
    @Operation(summary = "Buscar servicios por tipo")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ServiceResponseDto>> getServicesByType(@PathVariable ServiceType type) {
        List<Service> services = serviceRepository.findByServiceType(type);
        List<ServiceResponseDto> serviceDtos = services.stream()
                .map(service -> modelMapper.map(service, ServiceResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(serviceDtos);
    }
    
    @Operation(summary = "Buscar servicios por rango de precio")
    @GetMapping("/price-range")
    public ResponseEntity<List<ServiceResponseDto>> getServicesByPriceRange(
            @RequestParam BigDecimal minPrice, 
            @RequestParam BigDecimal maxPrice) {
        List<Service> services = serviceRepository.findByPriceRange(minPrice, maxPrice);
        List<ServiceResponseDto> serviceDtos = services.stream()
                .map(service -> modelMapper.map(service, ServiceResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(serviceDtos);
    }
}
