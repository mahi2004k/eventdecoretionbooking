package com.decor.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private LocalDate eventDate; // Date selected by user

    @Column(nullable = false)
    private String timeSlot; // Morning, Afternoon, Evening, Night

    @Column(length = 1000, nullable = false)
    private String venueAddress; // Event location

    @Column(nullable = false)
    private String eventName; // Selected event (e.g. Wedding Decor)

    private LocalDateTime bookingCreatedDate;

    private String status;

    @PrePersist
    public void prePersist() {
        if (this.bookingCreatedDate == null) {
            this.bookingCreatedDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}