package com.decor.booking.controller;

import com.decor.booking.entity.DecorationEvent;
import com.decor.booking.service.DecorationEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class DecorationController {

    private final DecorationEventService service;

    public DecorationController(
            DecorationEventService service) {
        this.service = service;
    }

    // Get all active events
    @GetMapping
    public List<DecorationEvent> getAllEvents() {
        return service.getAllEvents();
    }

    // Get one event by ID
    @GetMapping("/{id}")
    public ResponseEntity<DecorationEvent> getEventById(
            @PathVariable Long id) {

        return service.getEventById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Filter events by category
    @GetMapping("/category/{category}")
    public List<DecorationEvent> getEventsByCategory(
            @PathVariable String category) {

        return service.getEventsByCategory(category);
    }
}