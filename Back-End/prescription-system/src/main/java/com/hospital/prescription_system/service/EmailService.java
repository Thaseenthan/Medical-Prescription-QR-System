package com.hospital.prescription_system.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }



    public void sendPrescriptionEmail(String toEmail, byte[] qrCode) {
        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your Medical Prescription");

            helper.setText(
                    "Hello ,\n\n" +
                            "Your prescription has been created successfully.\n\n" +
                            "Please find the QR code attached to view your prescription.\n\n" +
                            "Regards,\nHospital System"
            );

            helper.addAttachment(
                    "prescription-qr.png",
                    new ByteArrayResource(qrCode)
            );

            mailSender.send(message);
            System.out.println("Email sent to: " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendDoctorCredentials(String toEmail, String doctorId, String password){

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Doctor Account Created");

        message.setText(
                "Dear Doctor,\n\n" +
                        "Your account has been created.\n\n" +
                        "Username: " + doctorId + "\n" +
                        "Password: " + password + "\n\n" +
                        "Please login to the system."
        );

        mailSender.send(message);
        System.out.println("Email sent to: " + toEmail);
    }
}
