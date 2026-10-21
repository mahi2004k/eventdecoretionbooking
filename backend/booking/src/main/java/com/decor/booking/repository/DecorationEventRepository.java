package com.decor.booking.repository;

import com.decor.booking.entity.DecorationEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecorationEventRepository extends JpaRepository<DecorationEvent, Long> {

    List<DecorationEvent> findByActiveTrue();

    List<DecorationEvent> findByCategoryIgnoreCaseAndActiveTrue(
            String category);
}
