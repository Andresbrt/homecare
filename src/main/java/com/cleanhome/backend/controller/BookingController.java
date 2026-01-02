package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.BookingCreateDto;
import com.cleanhome.backend.dto.BookingResponseDto;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.Service;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.BookingStatus;
import com.cleanhome.backend.repository.BookingRepository;
import com.cleanhome.backend.repository.ServiceRepository;
import com.cleanhome.backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Bookings", description = "Endpoints para gestión de reservas de servicios")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Operation(summary = "Crear nueva reserva")
    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingCreateDto bookingDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            
            User customer = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Service service = serviceRepository.findById(bookingDto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
            
            Booking booking = new Booking();
            booking.setCustomer(customer);
            booking.setService(service);
            booking.setServiceProvider(service.getServiceProvider());
            booking.setStartDateTime(bookingDto.getStartDateTime());
            booking.setEstimatedDurationHours(bookingDto.getEstimatedDurationHours());
            booking.setSpecialInstructions(bookingDto.getSpecialInstructions());
            booking.setServiceAddress(bookingDto.getServiceAddress());
            booking.setServiceCity(bookingDto.getServiceCity());
            booking.setServiceState(bookingDto.getServiceState());
            booking.setServicePostalCode(bookingDto.getServicePostalCode());
            booking.setServiceLatitude(bookingDto.getServiceLatitude());
            booking.setServiceLongitude(bookingDto.getServiceLongitude());
            booking.setStatus(BookingStatus.PENDING);
            booking.setTotalAmount(service.getBasePrice());
            
            Booking savedBooking = bookingRepository.save(booking);
            
            BookingResponseDto response = modelMapper.map(savedBooking, BookingResponseDto.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error al crear la reserva: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Obtener reservas del usuario autenticado")
    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getMyBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Booking> bookings = bookingRepository.findByCustomerOrderByStartDateTimeDesc(user);
        List<BookingResponseDto> bookingDtos = bookings.stream()
                .map(booking -> modelMapper.map(booking, BookingResponseDto.class))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(bookingDtos);
    }
    
    @Operation(summary = "Obtener reserva por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .map(booking -> ResponseEntity.ok(modelMapper.map(booking, BookingResponseDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Actualizar estado de reserva")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam BookingStatus status) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            booking.setStatus(status);
            Booking updatedBooking = bookingRepository.save(booking);
            
            BookingResponseDto response = modelMapper.map(updatedBooking, BookingResponseDto.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error al actualizar el estado: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Cancelar reserva")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            booking.setStatus(BookingStatus.CANCELLED);
            Booking updatedBooking = bookingRepository.save(booking);
            
            BookingResponseDto response = modelMapper.map(updatedBooking, BookingResponseDto.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error al cancelar la reserva: " + e.getMessage()));
        }
    }
    
    // Response DTOs
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
