package com.cleanhome.backend.service;

import com.cleanhome.backend.entity.Payment;
import com.cleanhome.backend.enums.PaymentStatus;
import com.cleanhome.backend.repository.PaymentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@SuppressWarnings("unchecked")
public class ReconciliationService {

    private final PaymentRepository paymentRepository;
    private final WompiService wompiService;
    private final PaymentService paymentService;

    public ReconciliationService(PaymentRepository paymentRepository, WompiService wompiService, PaymentService paymentService) {
        this.paymentRepository = paymentRepository;
        this.wompiService = wompiService;
        this.paymentService = paymentService;
    }

    // Cada 10 minutos
    @Scheduled(fixedDelay = 600_000)
    public void reconcilePendingPayments() {
        List<Payment> pendings = paymentRepository.findByStatus(PaymentStatus.PENDING);
        for (Payment p : pendings) {
            String extId = p.getExternalPaymentId();
            if (extId == null || extId.isEmpty()) continue;
            try {
                Map<String, Object> tx = wompiService.getTransaction(extId);
                Map<String, Object> data = (Map<String, Object>) tx.get("data");
                if (data != null) {
                    String status = String.valueOf(data.get("status"));
                    if (status != null) {
                        paymentService.updateStatusByExternalId(extId, status);
                    }
                }
            } catch (Exception ignored) {}
        }
    }
}
