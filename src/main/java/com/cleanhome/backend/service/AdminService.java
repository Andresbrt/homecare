package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.AdminUserDTO;
import com.cleanhome.backend.dto.UserUpdateDTO;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::mapToAdminDTO);
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getUsersByRole(UserRole role, Pageable pageable) {
        Page<User> users = userRepository.findByRole(role, pageable);
        return users.map(this::mapToAdminDTO);
    }

    @Transactional(readOnly = true)
    public AdminUserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return mapToAdminDTO(user);
    }

    @Transactional
    public AdminUserDTO updateUser(Long userId, UserUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalStateException("El email ya está en uso");
            }
            user.setEmail(dto.getEmail());
        }
        if (dto.getPhoneNumber() != null) {
            user.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getIsActive() != null) {
            user.setIsActive(dto.getIsActive());
        }

        User savedUser = userRepository.save(user);
        log.info("Usuario actualizado por admin: {}", userId);
        return mapToAdminDTO(savedUser);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Soft delete
        user.setIsActive(false);
        userRepository.save(user);
        log.info("Usuario desactivado por admin: {}", userId);
    }

    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setIsActive(true);
        userRepository.save(user);
        log.info("Usuario activado por admin: {}", userId);
    }

    @Transactional
    public void changeUserRole(Long userId, UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setRole(newRole);
        userRepository.save(user);
        log.info("Rol de usuario cambiado a {} por admin: {}", newRole, userId);
    }

    private AdminUserDTO mapToAdminDTO(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setEmailVerified(user.getIsVerified());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
