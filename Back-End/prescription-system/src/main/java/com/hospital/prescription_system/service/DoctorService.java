package com.hospital.prescription_system.service;

import com.hospital.prescription_system.entity.Doctor;
import com.hospital.prescription_system.repository.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final EmailService emailService;

    public DoctorService(DoctorRepository doctorRepository, EmailService emailService) {
        this.doctorRepository = doctorRepository;
        this.emailService = emailService;
    }

    private String generateDoctorId() {

        Doctor lastDoctor = doctorRepository
                .findFirstByOrderByDoctorIdDesc()
                .orElse(null);

        if (lastDoctor == null) {
            return "DOC1001";
        }

        String lastId = lastDoctor.getDoctorId(); // DOC1001
        int number = Integer.parseInt(lastId.substring(3)); // 1001
        number++;

        return "DOC" + number;
    }

    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$!";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            int idx = ThreadLocalRandom.current().nextInt(chars.length());
            password.append(chars.charAt(idx));
        }
        return password.toString();
    }

    // create doctor
    public Doctor createDoctor(Doctor doctor) {

        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor details are required");
        }

        if (doctor.getEmail() == null || doctor.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor email is required");
        }

        String doctorId = doctor.getDoctorId();
        if (doctorId == null || doctorId.trim().isEmpty()) {
            doctorId = generateDoctorId();
        }
        doctorId = doctorId.trim().toUpperCase(Locale.ROOT);

        if (doctorRepository.existsByDoctorIdIgnoreCase(doctorId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Doctor username already exists");
        }

        String password = doctor.getPassword();
        if (password == null || password.trim().isEmpty()) {
            password = generateTemporaryPassword();
        }

        // Persist normalized credentials used for doctor login.
        doctor.setDoctorId(doctorId);
        doctor.setPassword(password);

        Doctor savedDoctor = doctorRepository.save(doctor);

        emailService.sendDoctorCredentials(
                savedDoctor.getEmail(),
                savedDoctor.getDoctorId(),
                savedDoctor.getPassword()
        );
        return savedDoctor;
    }

    // get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // get doctor by id
    public Doctor getDoctorById(UUID id) {
        return doctorRepository.findById(id).orElse(null);
    }

    // delete doctor
    public void deleteDoctor(UUID id) {
        doctorRepository.deleteById(id);
    }
}
