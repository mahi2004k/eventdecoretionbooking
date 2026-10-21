package com.decor.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private String coverImageUrl;

    private boolean active = true;

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
