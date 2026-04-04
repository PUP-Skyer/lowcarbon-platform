package com.lowcarbon.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "video_task")
public class VideoTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "type", length = 50, nullable = false)
    private String type;

    @Column(name = "status", length = 20)
    private String status = "pending";

    @Column(name = "script_text", columnDefinition = "TEXT")
    private String scriptText;

    @Column(name = "prompt_text", columnDefinition = "TEXT")
    private String promptText;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "params_json", columnDefinition = "TEXT")
    private String paramsJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
