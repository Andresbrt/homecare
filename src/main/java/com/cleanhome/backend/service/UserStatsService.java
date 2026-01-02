package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.UserStatsDTO;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.BookingStatus;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserStatsService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final RatingRepository ratingRepository;
    private final PaymentRepository paymentRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReferralRepository referralRepository;
    private final LoyaltyPointsRepository loyaltyPointsRepository;

    public UserStatsService(UserRepository userRepository,
                            BookingRepository bookingRepository,
                            RatingRepository ratingRepository,
                            PaymentRepository paymentRepository,
                            FavoriteRepository favoriteRepository,
                            ReferralRepository referralRepository,
                            LoyaltyPointsRepository loyaltyPointsRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.ratingRepository = ratingRepository;
        this.paymentRepository = paymentRepository;
        this.favoriteRepository = favoriteRepository;
        this.referralRepository = referralRepository;
        this.loyaltyPointsRepository = loyaltyPointsRepository;
    }

    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        UserStatsDTO stats = new UserStatsDTO();
        stats.setUserId(userId);
        stats.setFullName(user.getFirstName() + " " + user.getLastName());
        stats.setEmail(user.getEmail());
        stats.setMemberSince(user.getCreatedAt());

        // Bookings
        Long totalBookings = bookingRepository.countByCustomer(user);
        Long completedBookings = bookingRepository.countByCustomerAndStatus(user, BookingStatus.COMPLETED);
        Long cancelledBookings = bookingRepository.countByCustomerAndStatus(user, BookingStatus.CANCELLED);
        Long activeBookings = bookingRepository.countByCustomerAndStatus(user, BookingStatus.CONFIRMED);

        stats.setTotalBookings(totalBookings != null ? totalBookings.intValue() : 0);
        stats.setCompletedBookings(completedBookings != null ? completedBookings.intValue() : 0);
        stats.setCancelledBookings(cancelledBookings != null ? cancelledBookings.intValue() : 0);
        stats.setActiveBookings(activeBookings != null ? activeBookings.intValue() : 0);

        // Ratings given
        Long ratingsGiven = ratingRepository.countByUser(user);
        stats.setRatingsGiven(ratingsGiven != null ? ratingsGiven.intValue() : 0);

        // Total spent
        BigDecimal totalSpent = paymentRepository.sumPaidAmountsByUser(user);
        stats.setTotalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO);

        // Favorites
        Long favoritesCount = favoriteRepository.countByUser(user);
        stats.setFavoritesCount(favoritesCount != null ? favoritesCount.intValue() : 0);

        // Referrals
        Long referralsCount = referralRepository.countCompletedByReferrer(user);
        stats.setReferralsCount(referralsCount != null ? referralsCount.intValue() : 0);

        // Loyalty points
        loyaltyPointsRepository.findByUser(user).ifPresent(points -> {
            stats.setLoyaltyPoints(points.getCurrentPoints());
            stats.setTotalPointsEarned(points.getTotalEarned());
        });

        return stats;
    }
}
