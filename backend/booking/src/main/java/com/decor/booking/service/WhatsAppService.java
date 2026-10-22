package com.decor.booking.service;

import com.decor.booking.entity.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsAppService {

    @Value("${ultramsg.instance.id}")
    private String instanceId;

    @Value("${ultramsg.token}")
    private String token;

    @Value("${admin.whatsapp.number}")
    private String adminWhatsAppNumber;

    public void sendAdminBookingNotification(Booking booking) {
        String url = "https://api.ultramsg.com/" + instanceId + "/messages/chat";

        String messageBody = String.format(
                "🚨 *NEW DECORATION BOOKING RECEIVED!*\n\n" +
                        "📌 *Event:* %s\n" +
                        "👤 *Customer:* %s\n" +
                        "📞 *Phone:* %s\n" +
                        "📅 *Event Date:* %s\n" +
                        "⏰ *Time Slot:* %s\n" +
                        "📍 *Address:* %s",
                booking.getEventName(),
                booking.getCustomerName(),
                booking.getCustomerPhone(),
                booking.getEventDate(),
                booking.getTimeSlot(),
                booking.getVenueAddress()
        );

        try {
            // Configure explicit timeouts so network hangs don't slow down saving
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000); // 5 seconds
            factory.setReadTimeout(5000);

            RestTemplate restTemplate = new RestTemplate(factory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> bodyMap = new LinkedMultiValueMap<>();
            bodyMap.add("token", token);
            bodyMap.add("to", adminWhatsAppNumber);
            bodyMap.add("body", messageBody);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(bodyMap, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            System.out.println("UltraMsg Success Response: " + response.getBody());

        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message: " + e.getMessage());
        }
    }
}