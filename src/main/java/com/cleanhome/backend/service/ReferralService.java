package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ReferralResponseDTO;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.entity.NotificationType;
import com.cleanhome.backend.model.LoyaltyPoints;
import com.cleanhome.backend.model.Referral;
import com.cleanhome.backend.model.ReferralStatus;
import com.cleanhome.backend.repository.ReferralRepository;
import com.cleanhome.backend.repository.UserRepository;
import com.cleanhome.backend.repository.LoyaltyPointsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReferralService {

    private static final Logger log = LoggerFactory.getLogger(ReferralService.class);

    private final ReferralRepository referralRepository;
    private final UserRepository userRepository;
    private final LoyaltyPointsRepository loyaltyPointsRepository;
    private final NotificationService notificationService;

    public ReferralService(ReferralRepository referralRepository,
                           UserRepository userRepository,
                           LoyaltyPointsRepository loyaltyPointsRepository,
                           NotificationService notificationService) {
        this.referralRepository = referralRepository;
        this.userRepository = userRepository;
        this.loyaltyPointsRepository = loyaltyPointsRepository;
        this.notificationService = notificationService;
    }

    private static final Integer REFERRAL_POINTS = 100; // Puntos por referido exitoso
    private static final Integer REFERRED_POINTS = 50; // Puntos para el referido

    @Transactional
    public String generateReferralCode(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        // Generar código único
        String code = "REF-" + user.getId() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return code;
    }

    @Transactional
    public void registerReferral(String referralCode, Long referredId) {
        User referred = userRepository.findById(referredId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Buscar el código de referido
        Referral existingReferral = referralRepository.findByReferralCode(referralCode)
                .orElse(null);

        User referrer;
        if (existingReferral != null) {
            referrer = existingReferral.getReferrer();
        } else {
            // Extraer ID del código
            String[] parts = referralCode.split("-");
            if (parts.length < 2) {
                throw new IllegalArgumentException("Código de referido inválido");
            }
            Long referrerId = Long.parseLong(parts[1]);
            referrer = userRepository.findById(referrerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Referidor no encontrado"));
        }

        // Verificar que no se refiera a sí mismo
        if (referrer.getId().equals(referredId)) {
            throw new IllegalStateException("No puedes usar tu propio código de referido");
        }

        // Crear referral
        Referral referral = new Referral();
        referral.setReferrer(referrer);
        referral.setReferred(referred);
        referral.setReferralCode(referralCode);
        referral.setStatus(ReferralStatus.PENDING);
        referralRepository.save(referral);

        log.info("Referido registrado: {} refirió a {}", referrer.getEmail(), referred.getEmail());
    }

    @Transactional
    public void completeReferral(Long referredId) {
        User referred = userRepository.findById(referredId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Referral referral = referralRepository.findByReferred(referred)
                .orElse(null);

        if (referral == null || referral.getStatus() != ReferralStatus.PENDING) {
            return; // No hay referral pendiente
        }

        // Marcar como completado
        referral.setStatus(ReferralStatus.COMPLETED);
        referral.setCompletedAt(LocalDateTime.now());
        referralRepository.save(referral);

        // Otorgar puntos al referidor
        LoyaltyPoints referrerPoints = getOrCreateLoyaltyPoints(referral.getReferrer());
        referrerPoints.addPoints(REFERRAL_POINTS);
        loyaltyPointsRepository.save(referrerPoints);

        // Otorgar puntos al referido
        LoyaltyPoints referredPoints = getOrCreateLoyaltyPoints(referred);
        referredPoints.addPoints(REFERRED_POINTS);
        loyaltyPointsRepository.save(referredPoints);

        // Notificar al referidor
        notificationService.createNotification(
                referral.getReferrer().getId(),
                "¡Referido exitoso!",
                "Has ganado " + REFERRAL_POINTS + " puntos por referir a un nuevo usuario",
                NotificationType.SUCCESS,
                null
        );

        log.info("Referral completado: {} - {} puntos otorgados", referral.getId(), REFERRAL_POINTS);
    }

    @Transactional(readOnly = true)
    public List<ReferralResponseDTO> getUserReferrals(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<Referral> referrals = referralRepository.findByReferrerOrderByCreatedAtDesc(user);
        return referrals.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Long countCompletedReferrals(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return referralRepository.countByReferrerAndStatus(user, ReferralStatus.COMPLETED);
    }

    private LoyaltyPoints getOrCreateLoyaltyPoints(User user) {
        return loyaltyPointsRepository.findByUser(user)
                .orElseGet(() -> {
                    LoyaltyPoints points = new LoyaltyPoints();
                    points.setUser(user);
                    points.setCurrentPoints(0);
                    points.setTotalEarned(0);
                    points.setTotalSpent(0);
                    return points;
                });
    }

    private ReferralResponseDTO mapToResponseDTO(Referral referral) {
        ReferralResponseDTO dto = new ReferralResponseDTO();
        dto.setId(referral.getId());
        dto.setReferralCode(referral.getReferralCode());
        dto.setStatus(referral.getStatus());
        dto.setReferredUserName(referral.getReferred().getFirstName() + " " + referral.getReferred().getLastName());
        dto.setCreatedAt(referral.getCreatedAt());
        dto.setCompletedAt(referral.getCompletedAt());
        return dto;
    }
}
