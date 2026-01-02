package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ProcessPaymentRequestDTO;
import com.cleanhome.backend.dto.TransactionResponseDTO;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.NotificationType;
import com.cleanhome.backend.entity.Payment;
import com.cleanhome.backend.enums.BookingStatus;
import com.cleanhome.backend.enums.PaymentStatus;
import com.cleanhome.backend.enums.PaymentMethod;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.model.Transaction;
import com.cleanhome.backend.model.TransactionStatus;
import com.cleanhome.backend.repository.PaymentRepository;
import com.cleanhome.backend.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    public TransactionService(TransactionRepository transactionRepository,
                              PaymentRepository paymentRepository,
                              NotificationService notificationService) {
        this.transactionRepository = transactionRepository;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public TransactionResponseDTO processPayment(ProcessPaymentRequestDTO request, Long userId) {
        // Obtener el pago
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado"));

        // Validar que el pago pertenece al usuario
        if (!payment.getBooking().getCustomer().getId().equals(userId)) {
            throw new IllegalStateException("No tienes permiso para procesar este pago");
        }

        // Validar que el pago esté pendiente
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Este pago ya fue procesado");
        }

        // Crear transacción
        Transaction transaction = new Transaction();
        transaction.setPayment(payment);
        transaction.setAmount(payment.getAmount());
        transaction.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));
        transaction.setStatus(TransactionStatus.PROCESSING);
        transaction.setTransactionId(request.getTransactionId() != null ? 
                request.getTransactionId() : 
                "TXN-" + UUID.randomUUID().toString());
        transaction.setDescription("Pago de servicio - Reserva #" + payment.getBooking().getId());
        transaction.setMetadata(request.getMetadata());

        try {
            // Simular procesamiento con pasarela de pago
            // En producción, aquí iría la integración real
            boolean paymentSuccess = processWithPaymentGateway(request);

            if (paymentSuccess) {
                transaction.setStatus(TransactionStatus.COMPLETED);
                transaction.setProcessedAt(LocalDateTime.now());
                
                // Actualizar estado del pago
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setPaymentDate(LocalDateTime.now());
                paymentRepository.save(payment);

                // Actualizar estado de la reserva
                Booking booking = payment.getBooking();
                if (booking.getStatus() == BookingStatus.PENDING) {
                    booking.setStatus(BookingStatus.CONFIRMED);
                }

                // Enviar notificación
                sendPaymentNotification(payment, true);
                
                log.info("Pago procesado exitosamente. Transaction ID: {}", transaction.getTransactionId());
            } else {
                transaction.setStatus(TransactionStatus.FAILED);
                transaction.setErrorMessage("El pago fue rechazado por la pasarela");
                
                // Enviar notificación de fallo
                sendPaymentNotification(payment, false);
                
                log.warn("Pago fallido. Transaction ID: {}", transaction.getTransactionId());
            }

        } catch (Exception e) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setErrorMessage(e.getMessage());
            log.error("Error al procesar pago", e);
        }

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponseDTO(savedTransaction);
    }

    @Transactional
    public TransactionResponseDTO refundTransaction(Long transactionId, Long userId) {
        Transaction originalTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada"));

        // Validar permisos (admin o propietario)
        Payment payment = originalTransaction.getPayment();
        if (!payment.getBooking().getCustomer().getId().equals(userId)) {
            throw new IllegalStateException("No tienes permiso para reembolsar esta transacción");
        }

        // Validar que la transacción esté completada
        if (originalTransaction.getStatus() != TransactionStatus.COMPLETED) {
            throw new IllegalStateException("Solo se pueden reembolsar transacciones completadas");
        }

        // Crear transacción de reembolso
        Transaction refund = new Transaction();
        refund.setPayment(payment);
        refund.setAmount(originalTransaction.getAmount().negate()); // Monto negativo
        refund.setPaymentMethod(originalTransaction.getPaymentMethod());
        refund.setStatus(TransactionStatus.REFUNDED);
        refund.setTransactionId("REFUND-" + originalTransaction.getTransactionId());
        refund.setDescription("Reembolso de transacción #" + originalTransaction.getId());
        refund.setProcessedAt(LocalDateTime.now());

        // Actualizar transacción original
        originalTransaction.setStatus(TransactionStatus.REFUNDED);
        transactionRepository.save(originalTransaction);

        // Actualizar estado del pago
        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        Transaction savedRefund = transactionRepository.save(refund);

        // Enviar notificación
        notificationService.createNotification(
                payment.getBooking().getCustomer().getId(),
                "Reembolso procesado",
                "Tu reembolso de $" + originalTransaction.getAmount() + " ha sido procesado",
                NotificationType.PAYMENT_COMPLETED,
                payment.getBooking().getId()
        );

        log.info("Reembolso procesado. Transaction ID: {}", savedRefund.getTransactionId());
        return mapToResponseDTO(savedRefund);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getUserTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionResponseDTO getTransactionById(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada"));

        // Validar permisos
        if (!transaction.getPayment().getBooking().getCustomer().getId().equals(userId)) {
            throw new IllegalStateException("No tienes permiso para ver esta transacción");
        }

        return mapToResponseDTO(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        List<Transaction> transactions = transactionRepository.findByDateRange(start, end);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private boolean processWithPaymentGateway(ProcessPaymentRequestDTO request) {
        // Simulación de procesamiento
        // En producción, integrar con Stripe, PayU, MercadoPago, etc.
        
        // Simular 95% de éxito
        return Math.random() > 0.05;
    }

    private void sendPaymentNotification(Payment payment, boolean success) {
        try {
            String title = success ? "Pago exitoso" : "Pago fallido";
            String body = success ? 
                    "Tu pago de $" + payment.getAmount() + " ha sido procesado correctamente" :
                    "No pudimos procesar tu pago. Por favor intenta nuevamente";
            NotificationType type = success ? 
                    NotificationType.PAYMENT_COMPLETED : 
                    NotificationType.PAYMENT_FAILED;

            notificationService.createNotification(
                    payment.getBooking().getCustomer().getId(),
                    title,
                    body,
                    type,
                    payment.getBooking().getId()
            );
        } catch (Exception e) {
            log.error("Error al enviar notificación de pago", e);
        }
    }

    private TransactionResponseDTO mapToResponseDTO(Transaction transaction) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setId(transaction.getId());
        dto.setPaymentId(transaction.getPayment().getId());
        dto.setBookingId(transaction.getPayment().getBooking().getId());
        dto.setAmount(transaction.getAmount());
        dto.setPaymentMethod(transaction.getPaymentMethod());
        dto.setStatus(transaction.getStatus());
        dto.setTransactionId(transaction.getTransactionId());
        dto.setDescription(transaction.getDescription());
        dto.setErrorMessage(transaction.getErrorMessage());
        dto.setProcessedAt(transaction.getProcessedAt());
        dto.setCreatedAt(transaction.getCreatedAt());
        return dto;
    }
}
