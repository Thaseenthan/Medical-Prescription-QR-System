package com.hospital.prescription_system.service;

import com.hospital.prescription_system.dto.LoginRequestDTO;
import com.hospital.prescription_system.dto.LoginResponseDTO;
import com.hospital.prescription_system.entity.Doctor;
import com.hospital.prescription_system.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final DoctorRepository doctorRepository;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    public AuthService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO request){

        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password are required");
        }

        String username = request.getUsername().trim();
        String password = request.getPassword();

        // ADMIN LOGIN
        if(username.equals(adminUsername)
                && password.equals(adminPassword)){

            return new LoginResponseDTO("Admin Login Successful", "ADMIN");
        }

        // DOCTOR LOGIN
        Doctor doctor = doctorRepository
                .findByDoctorIdIgnoreCase(username)
                .orElse(null);

        if(doctor != null && doctor.getPassword() != null && doctor.getPassword().equals(password)){
            return new LoginResponseDTO("Doctor Login Successful", "DOCTOR");
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
    }
}