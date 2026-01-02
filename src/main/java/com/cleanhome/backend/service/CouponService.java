package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.CouponRequestDTO;
import com.cleanhome.backend.dto.CouponResponseDTO;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.model.Coupon;
import com.cleanhome.backend.model.CouponUsage;
import com.cleanhome.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private static final Logger log = LoggerFactory.getLogger(CouponService.class);

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    public CouponService(CouponRepository couponRepository,
                         CouponUsageRepository couponUsageRepository,
                         UserRepository userRepository,
                         ServiceRepository serviceRepository,
                         BookingRepository bookingRepository) {
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public CouponResponseDTO createCoupon(CouponRequestDTO request) {
        // Validar que el código no exista
        if (couponRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalStateException("Ya existe un cupón con este código");
        }

        // Validar que tenga descuento fijo O porcentual, no ambos
        if ((request.getDiscountAmount() != null && request.getDiscountPercentage() != null) ||
            (request.getDiscountAmount() == null && request.getDiscountPercentage() == null)) {
            throw new IllegalArgumentException("Debe especificar descuento fijo O porcentual, no ambos");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountAmount(request.getDiscountAmount());
        coupon.setDiscountPercentage(request.getDiscountPercentage());
        coupon.setMinPurchaseAmount(request.getMinPurchaseAmount());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setMaxUsages(request.getMaxUsages());
        coupon.setCurrentUsages(0);
        coupon.setMaxUsagesPerUser(request.getMaxUsagesPerUser());
        coupon.setIsActive(request.getIsActive());
        coupon.setIsFirstTimeOnly(request.getIsFirstTimeOnly());

        if (request.getApplicableServiceId() != null) {
            com.cleanhome.backend.entity.Service service = serviceRepository.findById(request.getApplicableServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));
            coupon.setApplicableService(service);
        }

        Coupon savedCoupon = couponRepository.save(coupon);
        log.info("Cupón creado: {}", savedCoupon.getCode());
        return mapToResponseDTO(savedCoupon);
    }

    @Transactional(readOnly = true)
    public CouponResponseDTO validateCoupon(String code, Long userId, Long serviceId, BigDecimal amount) {
        Coupon coupon = couponRepository.findValidCoupon(code.toUpperCase(), LocalDate.now())
                .orElseThrow(() -> new ResourceNotFoundException("Cupón no válido o expirado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar si es solo para nuevos usuarios
        if (coupon.getIsFirstTimeOnly()) {
            long bookingCount = bookingRepository.countByCustomer(user);
            if (bookingCount > 0) {
                throw new IllegalStateException("Este cupón es solo para nuevos usuarios");
            }
        }

        // Validar usos por usuario
        Long usageCount = couponUsageRepository.countByCouponAndUser(coupon, user);
        if (usageCount >= coupon.getMaxUsagesPerUser()) {
            throw new IllegalStateException("Ya has usado este cupón el máximo de veces permitido");
        }

        // Validar servicio aplicable
        if (coupon.getApplicableService() != null && 
            !coupon.getApplicableService().getId().equals(serviceId)) {
            throw new IllegalStateException("Este cupón no es aplicable a este servicio");
        }

        // Validar monto mínimo
        if (coupon.getMinPurchaseAmount() != null && 
            amount.compareTo(coupon.getMinPurchaseAmount()) < 0) {
            throw new IllegalStateException("El monto mínimo para usar este cupón es $" + coupon.getMinPurchaseAmount());
        }

        return mapToResponseDTO(coupon);
    }

    @Transactional
    public BigDecimal applyCoupon(String code, Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar cupón
        validateCoupon(code, userId, booking.getService().getId(), booking.getTotalAmount());

        Coupon coupon = couponRepository.findValidCoupon(code.toUpperCase(), LocalDate.now())
                .orElseThrow(() -> new ResourceNotFoundException("Cupón no válido"));

        // Calcular descuento
        BigDecimal discount = coupon.calculateDiscount(booking.getTotalAmount());

        // Registrar uso
        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setBooking(booking);
        couponUsageRepository.save(usage);

        // Incrementar contador de usos
        coupon.setCurrentUsages(coupon.getCurrentUsages() + 1);
        couponRepository.save(coupon);

        log.info("Cupón {} aplicado a reserva {}. Descuento: ${}", code, bookingId, discount);
        return discount;
    }

    @Transactional(readOnly = true)
    public List<CouponResponseDTO> getAllActiveCoupons() {
        List<Coupon> coupons = couponRepository.findActiveCoupons(LocalDate.now());
        return coupons.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CouponResponseDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CouponResponseDTO updateCoupon(Long couponId, CouponRequestDTO request) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Cupón no encontrado"));

        coupon.setDescription(request.getDescription());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setMaxUsages(request.getMaxUsages());
        coupon.setMaxUsagesPerUser(request.getMaxUsagesPerUser());
        coupon.setIsActive(request.getIsActive());

        Coupon updatedCoupon = couponRepository.save(coupon);
        return mapToResponseDTO(updatedCoupon);
    }

    @Transactional
    public void deactivateCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Cupón no encontrado"));
        
        coupon.setIsActive(false);
        couponRepository.save(coupon);
        log.info("Cupón desactivado: {}", coupon.getCode());
    }

    private CouponResponseDTO mapToResponseDTO(Coupon coupon) {
        CouponResponseDTO dto = new CouponResponseDTO();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setDescription(coupon.getDescription());
        dto.setDiscountAmount(coupon.getDiscountAmount());
        dto.setDiscountPercentage(coupon.getDiscountPercentage());
        dto.setMinPurchaseAmount(coupon.getMinPurchaseAmount());
        dto.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        dto.setValidFrom(coupon.getValidFrom());
        dto.setValidUntil(coupon.getValidUntil());
        dto.setMaxUsages(coupon.getMaxUsages());
        dto.setCurrentUsages(coupon.getCurrentUsages());
        dto.setMaxUsagesPerUser(coupon.getMaxUsagesPerUser());
        dto.setIsActive(coupon.getIsActive());
        dto.setIsFirstTimeOnly(coupon.getIsFirstTimeOnly());
        
        if (coupon.getApplicableService() != null) {
            dto.setApplicableServiceId(coupon.getApplicableService().getId());
            dto.setApplicableServiceName(coupon.getApplicableService().getName());
        }
        
        return dto;
    }
}
