package com.hospital.prescription_system.controller;


import com.hospital.prescription_system.dto.LoginRequestDTO;
import com.hospital.prescription_system.dto.LoginResponseDTO;
import com.hospital.prescription_system.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request){

        return authService.login(request);

    }
}