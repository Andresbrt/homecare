package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ProviderSearchDTO;
import com.cleanhome.backend.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@Tag(name = "Búsqueda", description = "API de búsqueda y filtros de proveedores")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/providers")
    @Operation(summary = "Buscar proveedores", description = "Búsqueda avanzada de proveedores con filtros")
    public ResponseEntity<Page<ProviderSearchDTO>> searchProviders(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxDistance,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLng,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "rating") String sortBy) {

        Page<ProviderSearchDTO> results = searchService.searchProviders(
                query, serviceId, minRating, maxDistance, userLat, userLng, page, size, sortBy);
        
        return ResponseEntity.ok(results);
    }
}
