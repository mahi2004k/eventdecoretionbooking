package com.decor.booking.controller;

import com.decor.booking.entity.DecorationEvent;
import com.decor.booking.service.DecorationEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class DecorationController {

    private final DecorationEventService service;
    private final String UPLOAD_DIR = "uploads/";

    public DecorationController(DecorationEventService service) {
        this.service = service;
    }

    // Get all active events
    @GetMapping
    public List<DecorationEvent> getAllEvents() {
        return service.getAllEvents();
    }

    // Get one event by ID
    @GetMapping("/{id}")
    public ResponseEntity<DecorationEvent> getEventById(@PathVariable Long id) {
        return service.getEventById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Filter events by category
    @GetMapping("/category/{category}")
    public List<DecorationEvent> getEventsByCategory(@PathVariable String category) {
        return service.getEventsByCategory(category);
    }

    // Updated POST endpoint to handle direct file uploads (Cover Image, Gallery Photos, Video)
    @PostMapping
    public ResponseEntity<DecorationEvent> createEvent(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "detailedDescription", required = false) String detailedDescription,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestParam(value = "galleryImages", required = false) MultipartFile[] galleryImages,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile
    ) {
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            DecorationEvent event = new DecorationEvent();
            event.setName(name);
            event.setCategory(category);
            event.setDescription(description);
            event.setDetailedDescription(detailedDescription);
            event.setPrice(price);
            event.setActive(true);

            // 1. Save Cover Image
            if (coverImage != null && !coverImage.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + coverImage.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.copy(coverImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                event.setCoverImageUrl("/uploads/" + fileName);
            }

            // 2. Save Multiple Gallery Images
            List<String> galleryPaths = new ArrayList<>();
            if (galleryImages != null) {
                for (MultipartFile file : galleryImages) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = Paths.get(UPLOAD_DIR + fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        galleryPaths.add("/uploads/" + fileName);
                    }
                }
            }
            event.setGalleryImages(galleryPaths);

            // 3. Save Video File
            if (videoFile != null && !videoFile.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + videoFile.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.copy(videoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                event.setVideoUrl("/uploads/" + fileName);
            }

            DecorationEvent savedEvent = service.saveEvent(event);
            return ResponseEntity.ok(savedEvent);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    // PUT endpoint to update an existing event by ID
    @PutMapping("/{id}")
    public ResponseEntity<DecorationEvent> updateEvent(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "detailedDescription", required = false) String detailedDescription,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestParam(value = "galleryImages", required = false) MultipartFile[] galleryImages,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile
    ) {
        return service.getEventById(id).map(existingEvent -> {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();

                existingEvent.setName(name);
                existingEvent.setCategory(category);
                existingEvent.setDescription(description);
                existingEvent.setDetailedDescription(detailedDescription);
                existingEvent.setPrice(price);

                // Update Cover Image if a new file was uploaded
                if (coverImage != null && !coverImage.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + coverImage.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR + fileName);
                    Files.copy(coverImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    existingEvent.setCoverImageUrl("/uploads/" + fileName);
                }

                // Update Gallery Images if new files were uploaded
                if (galleryImages != null && galleryImages.length > 0) {
                    List<String> newGalleryPaths = new ArrayList<>();
                    for (MultipartFile file : galleryImages) {
                        if (!file.isEmpty()) {
                            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                            Path filePath = Paths.get(UPLOAD_DIR + fileName);
                            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                            newGalleryPaths.add("/uploads/" + fileName);
                        }
                    }
                    if (!newGalleryPaths.isEmpty()) {
                        existingEvent.setGalleryImages(newGalleryPaths);
                    }
                }

                // Update Video File if a new video was uploaded
                if (videoFile != null && !videoFile.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + videoFile.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR + fileName);
                    Files.copy(videoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    existingEvent.setVideoUrl("/uploads/" + fileName);
                }

                DecorationEvent updatedEvent = service.saveEvent(existingEvent);
                return ResponseEntity.ok(updatedEvent);

            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().<DecorationEvent>build();
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}