package com.cleanhome.backend.model;

import com.cleanhome.backend.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "loyalty_points")
public class LoyaltyPoints {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer currentPoints = 0;
    
    @Column(nullable = false)
    private Integer totalEarned = 0;
    
    @Column(nullable = false)
    private Integer totalSpent = 0;
    
    public void addPoints(Integer points) {
        this.currentPoints += points;
        this.totalEarned += points;
    }
    
    public void spendPoints(Integer points) {
        if (this.currentPoints >= points) {
            this.currentPoints -= points;
            this.totalSpent += points;
        } else {
            throw new IllegalStateException("No tienes suficientes puntos");
        }
    }

    public LoyaltyPoints() {
    }

    public LoyaltyPoints(Long id, User user, Integer currentPoints, Integer totalEarned, Integer totalSpent) {
        this.id = id;
        this.user = user;
        this.currentPoints = currentPoints;
        this.totalEarned = totalEarned;
        this.totalSpent = totalSpent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getCurrentPoints() {
        return currentPoints;
    }

    public void setCurrentPoints(Integer currentPoints) {
        this.currentPoints = currentPoints;
    }

    public Integer getTotalEarned() {
        return totalEarned;
    }

    public void setTotalEarned(Integer totalEarned) {
        this.totalEarned = totalEarned;
    }

    public Integer getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Integer totalSpent) {
        this.totalSpent = totalSpent;
    }
}
