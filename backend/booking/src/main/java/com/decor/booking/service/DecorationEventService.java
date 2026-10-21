package com.decor.booking.service;

import com.decor.booking.entity.DecorationEvent;
import com.decor.booking.repository.DecorationEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DecorationEventService {

    private final DecorationEventRepository repository;

    public DecorationEventService(
            DecorationEventRepository repository) {
        this.repository = repository;
    }

    public List<DecorationEvent> getAllEvents() {
        return repository.findByActiveTrue();
    }

    public Optional<DecorationEvent> getEventById(Long id) {
        return repository.findById(id)
                .filter(DecorationEvent::isActive);
    }

    public List<DecorationEvent> getEventsByCategory(
            String category) {
        return repository
                .findByCategoryIgnoreCaseAndActiveTrue(category);
    }
}