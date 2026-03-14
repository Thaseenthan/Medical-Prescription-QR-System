package com.hospital.prescription_system.repository;

import com.hospital.prescription_system.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Optional<Doctor> findByDoctorIdIgnoreCase(String doctorId);

    Optional<Doctor> findFirstByOrderByDoctorIdDesc();

    boolean existsByDoctorIdIgnoreCase(String doctorId);

}
