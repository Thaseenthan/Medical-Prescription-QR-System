package com.hospital.prescription_system.service;

import com.hospital.prescription_system.entity.Doctor;
import com.hospital.prescription_system.entity.Medicine;
import com.hospital.prescription_system.entity.Patient;
import com.hospital.prescription_system.entity.Prescription;
import com.hospital.prescription_system.repository.DoctorRepository;
import com.hospital.prescription_system.repository.MedicineRepository;
import com.hospital.prescription_system.repository.PatientRepository;
import com.hospital.prescription_system.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;
    private final QRCodeService qrCodeService;
    private final EmailService emailService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, MedicineRepository medicineRepository,  QRCodeService qrCodeService, EmailService emailService) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.medicineRepository = medicineRepository;
        this.qrCodeService = qrCodeService;
        this.emailService = emailService;

        // Create prescription

    }
    public Prescription createPrescription(Prescription prescription) {

        // Set doctor and patient if not null
        if (prescription.getPatient() != null) {
            Patient patient = patientRepository.findById(prescription.getPatient().getId()).orElseThrow();
            prescription.setPatient(patient);
        }

        if (prescription.getDoctor() != null) {
            Doctor doctor = doctorRepository.findById(prescription.getDoctor().getId()).orElseThrow();
            prescription.setDoctor(doctor);
        }

        // Set creation date
        prescription.setCreatedAt(LocalDateTime.now());

        // Save prescription first to get ID
        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Save medicines
        if (prescription.getMedicines() != null) {
            for (Medicine med : prescription.getMedicines()) {
                med.setPrescription(savedPrescription);
                medicineRepository.save(med);
            }
        }

        // Generate QR code (optional)
        // QR code encodes URL to prescription viewer app with prescription ID
        // Replace with your ngrok URL or deployed frontend URL
        // ngrok example: https://abc123.ngrok.io/prescription/{id}
        // local testing: http://192.168.x.x:3000/prescription/{id}
        String qrUrl = "https://YOUR_NGROK_FRONTEND_URL.ngrok.io/prescription/" + savedPrescription.getId();
        byte[] qrCode = qrCodeService.generateQRCode(qrUrl);

        // Send email to patient (optional)
        if (savedPrescription.getPatient() != null && savedPrescription.getPatient().getEmail() != null) {
            emailService.sendPrescriptionEmail(savedPrescription.getPatient().getEmail(), qrCode);
        }

        return savedPrescription;
    }
    // get all prescriptions
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // get prescriptions by doctor username (doctorId)
    public List<Prescription> getPrescriptionsByDoctorId(String doctorId) {
        if (doctorId == null || doctorId.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return prescriptionRepository.findByDoctor_DoctorIdIgnoreCase(doctorId.trim());
    }

    // get prescription by id
    public Prescription getPrescriptionById(UUID id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    // delete prescription
    public void deletePrescription(UUID id) {
        prescriptionRepository.deleteById(id);
    }
}
