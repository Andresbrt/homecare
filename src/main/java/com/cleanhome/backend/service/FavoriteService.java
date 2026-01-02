package com.cleanhome.backend.service;

import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.model.Favorite;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.repository.FavoriteRepository;
import com.cleanhome.backend.repository.ServiceProviderRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;

        public FavoriteService(FavoriteRepository favoriteRepository,
                                                   UserRepository userRepository,
                                                   ServiceProviderRepository serviceProviderRepository) {
                this.favoriteRepository = favoriteRepository;
                this.userRepository = userRepository;
                this.serviceProviderRepository = serviceProviderRepository;
        }

    @Transactional
    public void addFavorite(Long userId, Long providerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        // Verificar si ya existe
        if (favoriteRepository.existsByUserAndServiceProvider(user, provider)) {
            throw new IllegalStateException("Este proveedor ya está en favoritos");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setServiceProvider(provider);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long providerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        Favorite favorite = favoriteRepository.findByUserAndServiceProvider(user, provider)
                .orElseThrow(() -> new ResourceNotFoundException("Favorito no encontrado"));

        favoriteRepository.delete(favorite);
    }

    @Transactional(readOnly = true)
    public List<ServiceProvider> getUserFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        List<Favorite> favorites = favoriteRepository.findByUserOrderByCreatedAtDesc(user);
        return favorites.stream()
                .map(Favorite::getServiceProvider)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long providerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        return favoriteRepository.existsByUserAndServiceProvider(user, provider);
    }
}
