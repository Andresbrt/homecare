package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.PaymentCreateDto;
import com.cleanhome.backend.dto.PaymentResponseDto;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.Payment;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.BookingStatus;
import com.cleanhome.backend.enums.PaymentStatus;
import com.cleanhome.backend.repository.BookingRepository;
import com.cleanhome.backend.repository.PaymentRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    /**
     * Procesar un nuevo pago
     */
    public PaymentResponseDto processPayment(PaymentCreateDto paymentDto, String userEmail) {
        // Validar booking
        Booking booking = bookingRepository.findById(paymentDto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        // Validar usuario
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar que el usuario sea el dueño de la reserva
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("No tienes permiso para pagar esta reserva");
        }
        
        // Crear payment
        Payment payment = new Payment();
        payment.setAmount(paymentDto.getAmount());
        payment.setPaymentMethod(paymentDto.getPaymentMethod().name());
        payment.setBooking(booking);
        payment.setCustomer(customer);
        payment.setNotes(paymentDto.getNotes());
        payment.setCurrency("COP"); // Colombian Pesos
        
        // Generar transaction ID único
        String transactionId = generateTransactionId();
        payment.setTransactionId(transactionId);
        
        // Procesar según método de pago
        boolean paymentSuccessful = processPaymentByMethod(paymentDto, payment);
        
        if (paymentSuccessful) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaymentDate(LocalDateTime.now());
            
            // Actualizar estado de la reserva
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Error al procesar el pago con " + paymentDto.getPaymentMethod());
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        
        return mapToResponseDto(savedPayment);
    }
    
    /**
     * Procesar pago según el método
     */
    private boolean processPaymentByMethod(PaymentCreateDto paymentDto, Payment payment) {
        switch (paymentDto.getPaymentMethod()) {
            case CREDIT_CARD:
            case DEBIT_CARD:
                return processCreditCardPayment(paymentDto, payment);
            
            case CASH:
                return processCashPayment(payment);
            
            case PAYPAL:
                return processPayPalPayment(paymentDto, payment);
            
            case PSE:
                return processPSEPayment(paymentDto, payment);
            
            case NEQUI:
            case DAVIPLATA:
                return processWalletPayment(paymentDto, payment);
            
            case MERCADO_PAGO:
                return processMercadoPagoPayment(paymentDto, payment);
            
            case BANK_TRANSFER:
                return processBankTransferPayment(paymentDto, payment);
            
            default:
                return false;
        }
    }
    
    /**
     * Procesar pago con tarjeta de crédito/débito
     */
    private boolean processCreditCardPayment(PaymentCreateDto paymentDto, Payment payment) {
        try {
            // En producción, aquí integrarías con un gateway de pagos real
            // Por ahora, simulamos el proceso
            
            // Validar que tengamos los datos de la tarjeta
            if (paymentDto.getCardNumber() == null || paymentDto.getCardNumber().isEmpty()) {
                payment.setFailureReason("Número de tarjeta requerido");
                return false;
            }
            
            // Simular procesamiento (en producción sería una llamada API)
            String externalPaymentId = "CARD_" + UUID.randomUUID().toString();
            payment.setExternalPaymentId(externalPaymentId);
            
            // Guardar últimos 4 dígitos de la tarjeta de forma segura
            String maskedCard = maskCardNumber(paymentDto.getCardNumber());
            payment.setNotes("Tarjeta: " + maskedCard + "\n" + (payment.getNotes() != null ? payment.getNotes() : ""));
            
            return true; // Pago exitoso
        } catch (Exception e) {
            payment.setFailureReason("Error al procesar tarjeta: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Procesar pago en efectivo
     */
    private boolean processCashPayment(Payment payment) {
        // El pago en efectivo se marca como pendiente hasta que se confirme la entrega
        payment.setStatus(PaymentStatus.PENDING);
        payment.setNotes("Pago en efectivo - Se cobrará al finalizar el servicio");
        return true;
    }
    
    /**
     * Procesar pago con PayPal
     */
    private boolean processPayPalPayment(PaymentCreateDto paymentDto, Payment payment) {
        try {
            // En producción, integrarías con PayPal SDK
            String externalPaymentId = "PP_" + UUID.randomUUID().toString();
            payment.setExternalPaymentId(externalPaymentId);
            
            if (paymentDto.getTransactionReference() != null) {
                payment.setNotes("PayPal Ref: " + paymentDto.getTransactionReference());
            }
            
            return true;
        } catch (Exception e) {
            payment.setFailureReason("Error con PayPal: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Procesar pago PSE
     */
    private boolean processPSEPayment(PaymentCreateDto paymentDto, Payment payment) {
        try {
            // Integración con PSE (sistema de pagos bancarios colombiano)
            String externalPaymentId = "PSE_" + UUID.randomUUID().toString();
            payment.setExternalPaymentId(externalPaymentId);
            payment.setNotes("Pago vía PSE");
            return true;
        } catch (Exception e) {
            payment.setFailureReason("Error con PSE: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Procesar pago con billeteras digitales (Nequi, Daviplata)
     */
    private boolean processWalletPayment(PaymentCreateDto paymentDto, Payment payment) {
        try {
            String walletType = paymentDto.getPaymentMethod().name();
            String externalPaymentId = walletType + "_" + UUID.randomUUID().toString();
            payment.setExternalPaymentId(externalPaymentId);
            payment.setNotes("Pago vía " + paymentDto.getPaymentMethod().getDisplayName());
            return true;
        } catch (Exception e) {
            payment.setFailureReason("Error con billetera: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Procesar pago con Mercado Pago
     */
    private boolean processMercadoPagoPayment(PaymentCreateDto paymentDto, Payment payment) {
        try {
            String externalPaymentId = "MP_" + UUID.randomUUID().toString();
            payment.setExternalPaymentId(externalPaymentId);
            
            if (paymentDto.getTransactionReference() != null) {
                payment.setNotes("Mercado Pago Ref: " + paymentDto.getTransactionReference());
            }
            
            return true;
        } catch (Exception e) {
            payment.setFailureReason("Error con Mercado Pago: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Procesar transferencia bancaria
     */
    private boolean processBankTransferPayment(PaymentCreateDto paymentDto, Payment payment) {
        payment.setStatus(PaymentStatus.PENDING);
        payment.setNotes("Transferencia bancaria pendiente de confirmación\n" + 
                        (payment.getNotes() != null ? payment.getNotes() : ""));
        return true;
    }
    
    /**
     * Obtener pagos por booking
     */
    public List<PaymentResponseDto> getPaymentsByBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        List<Payment> payments = paymentRepository.findByBooking(booking);
        
        return payments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener pagos del usuario
     */
    public List<PaymentResponseDto> getPaymentsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Payment> payments = paymentRepository.findByCustomerOrderByPaymentDateDesc(user);
        
        return payments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener pago por ID
     */
    public PaymentResponseDto getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        return mapToResponseDto(payment);
    }
    
    /**
     * Reembolsar pago
     */
    public PaymentResponseDto refundPayment(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Solo se pueden reembolsar pagos completados");
        }
        
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundAmount(payment.getAmount());
        payment.setRefundDate(LocalDateTime.now());
        payment.setNotes(payment.getNotes() + "\nReembolso: " + reason);
        
        Payment refundedPayment = paymentRepository.save(payment);
        
        // Actualizar estado de la reserva
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        return mapToResponseDto(refundedPayment);
    }
    
    // Utility methods
    private String generateTransactionId() {
        return "TXN_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
    
    private PaymentResponseDto mapToResponseDto(Payment payment) {
        PaymentResponseDto dto = modelMapper.map(payment, PaymentResponseDto.class);
        dto.setBookingId(payment.getBooking().getId());
        dto.setCustomerId(payment.getCustomer().getId());
        dto.setCustomerName(payment.getCustomer().getFullName());
        return dto;
    }

    /**
     * Actualiza el estado del pago por ID externo del gateway (e.g., Wompi transaction id).
     */
    public void updateStatusByExternalId(String externalId, String gatewayStatus) {
        paymentRepository.findByExternalPaymentId(externalId).ifPresent(payment -> {
            // Idempotencia: si ya está COMPLETED y el nuevo estado también lo es, no hacer nada
            if (payment.getStatus() == PaymentStatus.COMPLETED &&
                ("APPROVED".equalsIgnoreCase(gatewayStatus) || "SUCCESSFUL".equalsIgnoreCase(gatewayStatus))) {
                return;
            }
            switch (gatewayStatus.toUpperCase()) {
                case "APPROVED":
                case "SUCCESSFUL":
                case "COMPLETED":
                    payment.setStatus(PaymentStatus.COMPLETED);
                    payment.setPaymentDate(LocalDateTime.now());
                    Booking booking = payment.getBooking();
                    booking.setStatus(BookingStatus.CONFIRMED);
                    bookingRepository.save(booking);
                    break;
                case "PENDING":
                    payment.setStatus(PaymentStatus.PENDING);
                    break;
                case "DECLINED":
                case "REJECTED":
                case "FAILED":
                    payment.setStatus(PaymentStatus.FAILED);
                    payment.setFailureReason("Gateway: " + gatewayStatus);
                    break;
            }
            paymentRepository.save(payment);
        });
    }

    /**
     * Crea un Payment en estado PENDING para iniciar flujo con gateway externo.
     */
    public Payment createPendingPayment(Long bookingId, String userEmail,
                                       String method, String currency, String reference) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setCustomer(customer);
        // Montos SIEMPRE del lado servidor: usar total de la reserva con mínimos aplicados
        java.math.BigDecimal chargeAmount = booking.getTotalAmount();
        if (chargeAmount == null) {
            // Fallback conservador si no hay total seteado
            if (booking.getService() != null && booking.getService().getBasePrice() != null) {
                chargeAmount = booking.getService().getBasePrice();
            } else {
                throw new RuntimeException("No se pudo determinar el monto a cobrar para la reserva");
            }
        }
        // Enforzar tarifa mínima de 80.000 COP
        java.math.BigDecimal MIN = new java.math.BigDecimal("80000");
        if (chargeAmount.compareTo(MIN) < 0) {
            chargeAmount = MIN;
        }
        payment.setAmount(chargeAmount);
        payment.setCurrency(currency != null ? currency : "COP");
        payment.setPaymentMethod(method);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId(generateTransactionId());
        String notes = (reference != null ? ("Ref: " + reference + "\n") : "") + (payment.getNotes() != null ? payment.getNotes() : "");
        payment.setNotes(notes);

        return paymentRepository.save(payment);
    }

    public Payment attachExternalInfo(Long paymentId, String externalId, String redirectUrl) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        if (externalId != null && (payment.getExternalPaymentId() == null || !externalId.equals(payment.getExternalPaymentId()))) {
            payment.setExternalPaymentId(externalId);
        }
        if (redirectUrl != null) {
            String notes = (payment.getNotes() != null ? payment.getNotes() + "\n" : "") + "Redirect: " + redirectUrl;
            payment.setNotes(notes);
        }
        return paymentRepository.save(payment);
    }
}
