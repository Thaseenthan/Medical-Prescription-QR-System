package com.hospital.prescription_system.controller;

import com.hospital.prescription_system.dto.PrescriptionRequestDTO;
import com.hospital.prescription_system.entity.Prescription;
import com.hospital.prescription_system.service.PrescriptionService;
import com.hospital.prescription_system.service.QRCodeService;
import com.hospital.prescription_system.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prescriptions")
//@PreAuthorize("hasRole('DOCTOR')")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final QRCodeService qrCodeService;
    private final PdfService pdfService;

    public PrescriptionController(PrescriptionService prescriptionService, QRCodeService qrCodeService, PdfService pdfService) {
        this.prescriptionService = prescriptionService;
        this.qrCodeService = qrCodeService;
        this.pdfService = pdfService;
    }

    // create prescription
    @PostMapping
    public Prescription createPrescription( @RequestBody Prescription prescription) {
        return prescriptionService.createPrescription(prescription);
    }

    // get all prescriptions
    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    // get prescriptions by doctor username (doctorId)
    @GetMapping("/doctor/{doctorId}")
    public List<Prescription> getPrescriptionsByDoctor(@PathVariable String doctorId) {
        return prescriptionService.getPrescriptionsByDoctorId(doctorId);
    }


    // get prescription by id
    @GetMapping("/{id}")
    public Prescription getPrescriptionById(@PathVariable UUID id) {
        return prescriptionService.getPrescriptionById(id);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<PrescriptionRequestDTO> getPrescription(@PathVariable UUID id) {
//        var prescription = prescriptionService.getPrescriptionById(id);
//        if (prescription == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        // Generate QR code as Base64 string
//        byte[] qrBytes = qrCodeService.generateQRCode(prescription.getId().toString());
//        String qrBase64 = java.util.Base64.getEncoder().encodeToString(qrBytes);
//
//        // Build DTO
//        PrescriptionRequestDTO response = PrescriptionRequestDTO.builder()
//                .id(prescription.getId())
//                .patient(prescription.getPatient())
//                .doctor(prescription.getDoctor())
//                .diagnosis(prescription.getDiagnosis())
//                .createdAt(prescription.getCreatedAt())
//                .medicines(prescription.getMedicines())
//                .qrCodeBase64(qrBase64)
//                .build();
//
//        return ResponseEntity.ok(response);
//    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getPrescriptionQRCode(@PathVariable UUID id) {
        // Check if prescription exists
        var prescription = prescriptionService.getPrescriptionById(id);
        if (prescription == null) {
            return ResponseEntity.notFound().build();
        }

        // Generate QR code using prescription ID
        byte[] qrCode = qrCodeService.generateQRCode(prescription.getId().toString());

        // Return as PNG image
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE)
                .body(qrCode);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPrescriptionPDF(@PathVariable UUID id) {
        // Check if prescription exists
        var prescription = prescriptionService.getPrescriptionById(id);
        if (prescription == null) {
            return ResponseEntity.notFound().build();
        }

        // Generate PDF
        byte[] pdfBytes = pdfService.generatePrescriptionPDF(prescription);
        if (pdfBytes == null) {
            return ResponseEntity.internalServerError().build();
        }

        // Return as PDF file
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=prescription_" + id + ".pdf")
                .body(pdfBytes);
    }

    // delete prescription
    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable UUID id) {

        prescriptionService.deletePrescription(id);
    }

}
