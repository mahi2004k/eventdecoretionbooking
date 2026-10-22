package com.decor.booking.service;

import com.decor.booking.entity.Booking;
import com.decor.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WhatsAppService whatsAppService;

    public BookingService(BookingRepository bookingRepository, WhatsAppService whatsAppService) {
        this.bookingRepository = bookingRepository;
        this.whatsAppService = whatsAppService;
    }

    public Booking saveBooking(Booking booking) {
        // 1. Save booking to MySQL database
        Booking savedBooking = bookingRepository.save(booking);

        // 2. Send instant WhatsApp alert to Admin
        whatsAppService.sendAdminBookingNotification(savedBooking);

        return savedBooking;
    }
}