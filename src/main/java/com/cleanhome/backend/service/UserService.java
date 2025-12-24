package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.*;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public UserResponseDto createUser(UserRegistrationDto registrationDto) {
        // Check if user already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        user.setRole(registrationDto.getRole() != null ? registrationDto.getRole() : UserRole.CUSTOMER);
        user.setStreetAddress(registrationDto.getStreetAddress());
        user.setCity(registrationDto.getCity());
        user.setState(registrationDto.getState());
        user.setPostalCode(registrationDto.getPostalCode());
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setVerificationToken(UUID.randomUUID().toString());
        
        User savedUser = userRepository.save(user);
        
        // Convert to response DTO
        return convertToResponseDto(savedUser);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public UserResponseDto updateUserRole(Long userId, UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Actualizar el rol
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        
        return convertToResponseDto(updatedUser);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToResponseDto(user);
    }
    
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<UserResponseDto> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public UserResponseDto updateUser(Long id, UserRegistrationDto updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Update fields
        user.setFirstName(updateDto.getFirstName());
        user.setLastName(updateDto.getLastName());
        user.setPhoneNumber(updateDto.getPhoneNumber());
        user.setStreetAddress(updateDto.getStreetAddress());
        user.setCity(updateDto.getCity());
        user.setState(updateDto.getState());
        user.setPostalCode(updateDto.getPostalCode());
        
        User updatedUser = userRepository.save(user);
        return convertToResponseDto(updatedUser);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    public UserResponseDto verifyUser(String verificationToken) {
        User user = userRepository.findByVerificationToken(verificationToken)
                .orElseThrow(() -> new RuntimeException("Token de verificación inválido"));
        
        user.setIsVerified(true);
        user.setVerificationToken(null);
        User verifiedUser = userRepository.save(user);
        
        return convertToResponseDto(verifiedUser);
    }
    
    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setResetPasswordToken(UUID.randomUUID().toString());
        userRepository.save(user);
        
        // Here you would typically send an email with the reset token
        // emailService.sendPasswordResetEmail(user.getEmail(), user.getResetPasswordToken());
    }
    
    public void resetPassword(String resetToken, String newPassword) {
        User user = userRepository.findByResetPasswordToken(resetToken)
                .orElseThrow(() -> new RuntimeException("Token de restablecimiento inválido"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        userRepository.save(user);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    private UserResponseDto convertToResponseDto(User user) {
        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
        return dto;
    }
}