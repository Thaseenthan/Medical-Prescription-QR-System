package com.hospital.prescription_system.service;

import com.hospital.prescription_system.entity.Patient;
import com.hospital.prescription_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    //crate patient
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }
    //get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(UUID id) {
        return patientRepository.findById(id).orElse(null);
    }

    // delete patient
    public void deletePatient(UUID id) {
        patientRepository.deleteById(id);
    }


}
