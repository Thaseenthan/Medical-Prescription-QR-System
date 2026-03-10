package com.hospital.prescription_system.repository;

import com.hospital.prescription_system.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID>{
}
