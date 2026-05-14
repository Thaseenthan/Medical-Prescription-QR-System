package com.hospital.prescription_system.repository;

import com.hospital.prescription_system.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
	List<Prescription> findByDoctor_DoctorIdIgnoreCase(String doctorId);
}
