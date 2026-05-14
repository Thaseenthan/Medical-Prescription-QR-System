package com.hospital.prescription_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class LoginResponseDTO {

    // Constructor with parameters
    public LoginResponseDTO(String message, String role) {
        this.message = message;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    private String message;
    private String role;

}
