package com.decor.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "decoration_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DecorationEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String description;

    @Column(length = 3000)
    private String detailedDescription; // For full details on the event details page

    private String coverImageUrl;

    private Double price; // Starting price for the event package

    @ElementCollection
    @CollectionTable(name = "event_gallery_images", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "image_url", length = 1000)
    private List<String> galleryImages; // Stores multiple related work photos

    @Column(length = 1000)
    private String videoUrl; // For event setup video embed link

    private boolean active = true;

    // Existing constructor (retained for backward compatibility)
    public DecorationEvent(
            String name,
            String category,
            String description,
            String coverImageUrl,
            boolean active) {

        this.name = name;
        this.category = category;
        this.description = description;
        this.coverImageUrl = coverImageUrl;
        this.active = active;
    }
}