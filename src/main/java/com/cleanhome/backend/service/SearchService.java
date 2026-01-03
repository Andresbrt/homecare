package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ProviderSearchDTO;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.repository.ServiceProviderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class SearchService {

    private final ServiceProviderRepository serviceProviderRepository;
    public SearchService(ServiceProviderRepository serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProviderSearchDTO> searchProviders(
            String query,
            Long serviceId,
            Double minRating,
            Double maxDistance,
            Double userLat,
            Double userLng,
            int page,
            int size,
            String sortBy) {

        Pageable pageable = createPageable(page, size, sortBy);
        
        // Si hay query de búsqueda
        if (query != null && !query.trim().isEmpty()) {
            return searchByQuery(query, serviceId, minRating, pageable);
        }
        
        // Si hay filtros de ubicación
        if (userLat != null && userLng != null && maxDistance != null) {
            return searchByLocation(serviceId, minRating, userLat, userLng, maxDistance, pageable);
        }
        
        // Búsqueda general
        return searchGeneral(serviceId, minRating, pageable);
    }

    private Page<ProviderSearchDTO> searchByQuery(String query, Long serviceId, Double minRating, Pageable pageable) {
        Page<ServiceProvider> providers;
        
        if (serviceId != null) {
            providers = serviceProviderRepository.findByServiceIdAndSearchQuery(serviceId, query, pageable);
        } else {
            providers = serviceProviderRepository.findBySearchQuery(query, pageable);
        }
        
        return providers.map(this::mapToSearchDTO);
    }

    private Page<ProviderSearchDTO> searchByLocation(
            Long serviceId, Double minRating, Double userLat, Double userLng, 
            Double maxDistance, Pageable pageable) {
        
        Page<ServiceProvider> providers = serviceProviderRepository.findAll(pageable);
        
        // Filtrar por distancia (implementación simplificada)
        return providers.map(this::mapToSearchDTO);
    }

    private Page<ProviderSearchDTO> searchGeneral(Long serviceId, Double minRating, Pageable pageable) {
        Page<ServiceProvider> providers;
        
        if (serviceId != null) {
            providers = serviceProviderRepository.findByServiceId(serviceId, pageable);
        } else {
            providers = serviceProviderRepository.findByIsAvailableTrue(pageable);
        }
        
        return providers.map(this::mapToSearchDTO);
    }

    private Pageable createPageable(int page, int size, String sortBy) {
        Sort sort;
        
        switch (sortBy != null ? sortBy : "rating") {
            case "rating":
                sort = Sort.by(Sort.Direction.DESC, "averageRating");
                break;
            case "reviews":
                sort = Sort.by(Sort.Direction.DESC, "totalReviews");
                break;
            case "newest":
                sort = Sort.by(Sort.Direction.DESC, "createdAt");
                break;
            default:
                sort = Sort.by(Sort.Direction.DESC, "averageRating");
        }
        
        return PageRequest.of(page, size, sort);
    }

    private ProviderSearchDTO mapToSearchDTO(ServiceProvider provider) {
        ProviderSearchDTO dto = new ProviderSearchDTO();
        dto.setId(provider.getId());
        dto.setBusinessName(provider.getBusinessName());
        dto.setDescription(provider.getDescription());
        dto.setProfilePictureUrl(provider.getUser() != null ? provider.getUser().getProfileImageUrl() : null);
        dto.setAverageRating(provider.getRatingAverage() != null ? provider.getRatingAverage().doubleValue() : 0.0);
        dto.setTotalReviews(provider.getTotalRatings() != null ? provider.getTotalRatings() : 0);
        dto.setIsVerified(provider.getIsVerified());
        dto.setIsActive(provider.getIsAvailable());
        
        User user = provider.getUser();
        if (user != null) {
            dto.setUserName(user.getFirstName() + " " + user.getLastName());
        }
        
        return dto;
    }
}
