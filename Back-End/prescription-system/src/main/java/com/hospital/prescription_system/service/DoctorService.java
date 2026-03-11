package com.hospital.prescription_system.service;

import com.hospital.prescription_system.entity.Doctor;
import com.hospital.prescription_system.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // create doctor
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // get doctor by id
    public Doctor getDoctorById(UUID id) {
        return doctorRepository.findById(id).orElse(null);
    }

    // delete doctor
    public void deleteDoctor(UUID id) {
        doctorRepository.deleteById(id);
    }
}
