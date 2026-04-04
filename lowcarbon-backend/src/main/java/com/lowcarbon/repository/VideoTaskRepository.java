package com.lowcarbon.repository;

import com.lowcarbon.entity.VideoTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoTaskRepository extends JpaRepository<VideoTask, Long> {
    List<VideoTask> findAllByOrderByCreatedAtDesc();
    List<VideoTask> findByStatusOrderByCreatedAtDesc(String status);
    List<VideoTask> findByTypeOrderByCreatedAtDesc(String type);
}
