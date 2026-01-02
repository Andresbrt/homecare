package com.cleanhome.backend.model;

import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_usages")
public class CouponUsage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime usedAt;
    
    @PrePersist
    protected void onCreate() {
        usedAt = LocalDateTime.now();
    }

    public CouponUsage() {
    }

    public CouponUsage(Long id, Coupon coupon, User user, Booking booking, LocalDateTime usedAt) {
        this.id = id;
        this.coupon = coupon;
        this.user = user;
        this.booking = booking;
        this.usedAt = usedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Coupon getCoupon() {
        return coupon;
    }

    public void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }
}
