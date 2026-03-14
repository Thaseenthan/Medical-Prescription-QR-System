package com.hospital.prescription_system.repository;

import com.hospital.prescription_system.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MedicineRepository extends JpaRepository<Medicine, UUID> {
}
