package com.decor.booking;

import com.decor.booking.entity.DecorationEvent;
import com.decor.booking.repository.DecorationEventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DecorationEventRepository repository;

    public DataInitializer(DecorationEventRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {

        if (repository.count() > 0) {
            return;
        }

        List<DecorationEvent> events = List.of(
                new DecorationEvent(
                        "Wedding Decoration",
                        "Wedding",
                        "Beautiful wedding stages, mandaps and floral decorations.",
                        "/images/events/wedding.jpg",
                        true
                ),
                new DecorationEvent(
                        "Ring Ceremony",
                        "Ring Ceremony",
                        "Elegant stage setups for your special ring ceremony.",
                        "/images/events/ring-ceremony.jpg",
                        true
                ),
                new DecorationEvent(
                        "Engagement Decoration",
                        "Engagement",
                        "Celebrate your engagement with a beautiful backdrop.",
                        "/images/events/engagement.jpg",
                        true
                ),
                new DecorationEvent(
                        "Birthday Decoration",
                        "Birthday",
                        "Colorful balloon arches and creative birthday themes.",
                        "/images/events/birthday.jpg",
                        true
                ),
                new DecorationEvent(
                        "Anniversary Decoration",
                        "Anniversary",
                        "Romantic decorations for memorable anniversaries.",
                        "/images/events/anniversary.jpg",
                        true
                ),
                new DecorationEvent(
                        "Haldi Ceremony",
                        "Haldi",
                        "Traditional yellow floral decoration for your Haldi.",
                        "/images/events/haldi.jpg",
                        true
                ),
                new DecorationEvent(
                        "Mehendi Ceremony",
                        "Mehendi",
                        "Vibrant traditional decor for your Mehendi celebration.",
                        "/images/events/mehendi.jpg",
                        true
                ),
                new DecorationEvent(
                        "Baby Shower",
                        "Baby Shower",
                        "Pastel balloons, floral backdrops and welcoming themes.",
                        "/images/events/baby-shower.jpg",
                        true
                ),
                new DecorationEvent(
                        "Naming Ceremony",
                        "Naming Ceremony",
                        "Lovely decoration for your baby's naming celebration.",
                        "/images/events/naming-ceremony.jpg",
                        true
                ),
                new DecorationEvent(
                        "Corporate Events",
                        "Corporate",
                        "Professional stage and venue decoration for business events.",
                        "/images/events/corporate.jpg",
                        true
                )
        );

        repository.saveAll(events);

        System.out.println("Sample decoration events inserted into MySQL!");
    }
}