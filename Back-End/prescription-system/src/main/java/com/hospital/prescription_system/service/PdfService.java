package com.hospital.prescription_system.service;

import com.hospital.prescription_system.entity.Prescription;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generatePrescriptionPDF(Prescription prescription) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            Paragraph title = new Paragraph("MEDICAL PRESCRIPTION")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // Prescription Info
            Paragraph prescriptionInfo = new Paragraph(
                    "Prescription ID: " + prescription.getId() + " | " +
                            "Issued: " + formatDate(prescription.getCreatedAt())
            ).setTextAlignment(TextAlignment.CENTER).setFontSize(10);
            document.add(prescriptionInfo);

            document.add(new Paragraph("\n"));

            // Doctor Section
            document.add(new Paragraph("DOCTOR INFORMATION").setBold().setFontSize(14));
            Table doctorTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
            doctorTable.setWidth(UnitValue.createPercentValue(100));

            addTableRow(doctorTable, "Name", prescription.getDoctor() != null ? prescription.getDoctor().getName() : "N/A");
            addTableRow(doctorTable, "Specialization", prescription.getDoctor() != null ? prescription.getDoctor().getSpecialization() : "N/A");
            addTableRow(doctorTable, "Hospital", prescription.getDoctor() != null ? prescription.getDoctor().getHospital() : "N/A");

            document.add(doctorTable);
            document.add(new Paragraph("\n"));

            // Patient Section
            document.add(new Paragraph("PATIENT INFORMATION").setBold().setFontSize(14));
            Table patientTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
            patientTable.setWidth(UnitValue.createPercentValue(100));

            addTableRow(patientTable, "Name", prescription.getPatient() != null ? prescription.getPatient().getName() : "N/A");
            addTableRow(patientTable, "Age", prescription.getPatient() != null ? prescription.getPatient().getAge() + " years" : "N/A");
            addTableRow(patientTable, "Gender", prescription.getPatient() != null ? prescription.getPatient().getGender() : "N/A");
            addTableRow(patientTable, "Phone", prescription.getPatient() != null ? prescription.getPatient().getPhone() : "N/A");

            document.add(patientTable);
            document.add(new Paragraph("\n"));

            // Diagnosis Section
            if (prescription.getDiagnosis() != null && !prescription.getDiagnosis().isEmpty()) {
                document.add(new Paragraph("DIAGNOSIS").setBold().setFontSize(14));
                document.add(new Paragraph(prescription.getDiagnosis()));
                document.add(new Paragraph("\n"));
            }

            // Medicines Section
            document.add(new Paragraph("PRESCRIBED MEDICINES").setBold().setFontSize(14));
            Table medicinesTable = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1}));
            medicinesTable.setWidth(UnitValue.createPercentValue(100));

            // Table Headers
            medicinesTable.addHeaderCell(new Cell().add(new Paragraph("Medicine Name").setBold()));
            medicinesTable.addHeaderCell(new Cell().add(new Paragraph("Dosage").setBold()));
            medicinesTable.addHeaderCell(new Cell().add(new Paragraph("Frequency").setBold()));
            medicinesTable.addHeaderCell(new Cell().add(new Paragraph("Duration").setBold()));

            // Table Rows
            if (prescription.getMedicines() != null && !prescription.getMedicines().isEmpty()) {
                prescription.getMedicines().forEach(medicine -> {
                    medicinesTable.addCell(new Cell().add(new Paragraph(medicine.getName())));
                    medicinesTable.addCell(new Cell().add(new Paragraph(medicine.getDosage())));
                    medicinesTable.addCell(new Cell().add(new Paragraph(medicine.getFrequency())));
                    medicinesTable.addCell(new Cell().add(new Paragraph(medicine.getDuration())));
                });
            } else {
                medicinesTable.addCell(new Cell(1, 4).add(new Paragraph("No medicines prescribed")));
            }

            document.add(medicinesTable);
            document.add(new Paragraph("\n\n"));

            // Footer
            Paragraph footer = new Paragraph("This is an official medical prescription. Please consult your doctor for any queries.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(9)
                    .setItalic();
            document.add(footer);

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void addTableRow(Table table, String label, String value) {
        Cell labelCell = new Cell().add(new Paragraph(label).setBold());
        Cell valueCell = new Cell().add(new Paragraph(value));
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String formatDate(Object dateTime) {
        if (dateTime == null) {
            return "N/A";
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
            return formatter.format((java.time.temporal.TemporalAccessor) dateTime);
        } catch (Exception e) {
            return dateTime.toString();
        }
    }
}
