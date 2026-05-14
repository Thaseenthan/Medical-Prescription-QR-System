package com.hospital.prescription_system.dto;

import com.hospital.prescription_system.entity.Doctor;
import com.hospital.prescription_system.entity.Medicine;
import com.hospital.prescription_system.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class PrescriptionRequestDTO{

    private UUID id;
    private Patient patient;
    private Doctor doctor;
    private String diagnosis;
    private LocalDateTime createdAt;
    private List<Medicine> medicines;
    private String qrCodeBase64;
}
