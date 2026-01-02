package com.cleanhome.backend.service;

import com.cleanhome.backend.entity.Payment;
import com.cleanhome.backend.repository.PaymentRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PaymentReceiptService {

    private final JavaMailSender mailSender;
    private final PaymentRepository paymentRepository;

    public PaymentReceiptService(JavaMailSender mailSender, PaymentRepository paymentRepository) {
        this.mailSender = mailSender;
        this.paymentRepository = paymentRepository;
    }

    public byte[] generateReceiptPdf(Long paymentId) {
        Payment p = paymentRepository.findById(paymentId).orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document doc = new Document();
            PdfWriter.getInstance(doc, baos);
            doc.open();
            doc.add(new Paragraph("Recibo de pago - CleanHome"));
            doc.add(new Paragraph("Pago #: " + p.getId()));
            doc.add(new Paragraph("Fecha: " + (p.getPaymentDate() != null ? p.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "-")));
            doc.add(new Paragraph("Cliente: " + (p.getCustomer() != null ? p.getCustomer().getFullName() : "-")));
            doc.add(new Paragraph("Servicio: " + (p.getBooking() != null ? "Reserva #" + p.getBooking().getId() : "-")));
            doc.add(new Paragraph("Monto: " + p.getAmount() + " " + p.getCurrency()));
            doc.add(new Paragraph("Método: " + p.getPaymentMethod()));
            doc.add(new Paragraph("Transacción: " + (p.getExternalPaymentId() != null ? p.getExternalPaymentId() : p.getTransactionId())));
            doc.add(new Paragraph("Estado: " + p.getStatus()));
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    public void emailReceipt(Long paymentId) {
        Payment p = paymentRepository.findById(paymentId).orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        String to = p.getCustomer() != null ? p.getCustomer().getEmail() : null;
        if (to == null || to.isEmpty()) return;
        byte[] pdf = generateReceiptPdf(paymentId);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Recibo de pago CleanHome #" + p.getId());
            helper.setText("Hola, adjuntamos tu recibo de pago. ¡Gracias por usar CleanHome!", false);
            helper.addAttachment("recibo-" + p.getId() + ".pdf", new ByteArrayResource(pdf));
            mailSender.send(message);
        } catch (Exception e) {
            // log and continue
        }
    }
}
