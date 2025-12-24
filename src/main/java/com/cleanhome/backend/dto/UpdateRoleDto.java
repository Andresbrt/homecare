package com.cleanhome.backend.dto;

import com.cleanhome.backend.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public class UpdateRoleDto {
    
    @NotNull(message = "El rol es requerido")
    private UserRole role;
    
    // Constructors
    public UpdateRoleDto() {}
    
    public UpdateRoleDto(UserRole role) {
        this.role = role;
    }
    
    // Getters and Setters
    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }
}
