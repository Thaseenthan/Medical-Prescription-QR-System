package com.hospital.prescription_system.controller;


import com.hospital.prescription_system.entity.Doctor;
import com.hospital.prescription_system.service.DoctorService;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
//@PreAuthorize("hasRole('ADMIN')")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // create doctor
    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.createDoctor(doctor);
    }

    // get all doctors
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
    // get doctor by id
    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable UUID id) {
        return doctorService.getDoctorById(id);
    }
    // delete doctor
    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
    }


}
