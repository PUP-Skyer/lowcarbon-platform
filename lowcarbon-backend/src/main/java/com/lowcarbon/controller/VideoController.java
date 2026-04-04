package com.lowcarbon.controller;

import com.lowcarbon.entity.VideoTask;
import com.lowcarbon.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video")
@CrossOrigin(origins = "*")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping("/tasks")
    public ResponseEntity<List<VideoTask>> getAllTasks(
            @RequestParam(value = "status", required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(videoService.getTasksByStatus(status));
        }
        return ResponseEntity.ok(videoService.getAllTasks());
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable(value = "id") Long id) {
        VideoTask task = videoService.getTaskById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }

    @PostMapping("/generate")
    public ResponseEntity<VideoTask> generateVideo(@RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        String type = (String) request.get("type");
        @SuppressWarnings("unchecked")
        Map<String, Object> params = (Map<String, Object>) request.get("params");

        if (title == null || type == null) {
            return ResponseEntity.badRequest().build();
        }

        VideoTask task = videoService.createTask(title, type, params);
        return ResponseEntity.ok(task);
    }

    @PostMapping("/callback")
    public ResponseEntity<VideoTask> handleCallback(@RequestBody Map<String, Object> request) {
        Long id = Long.valueOf(request.get("id").toString());
        String videoUrl = (String) request.get("videoUrl");
        String coverUrl = (String) request.get("coverUrl");
        Integer duration = request.get("duration") != null ?
            Integer.valueOf(request.get("duration").toString()) : 15;

        VideoTask task = videoService.handleCallback(id, videoUrl, coverUrl, duration);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable(value = "id") Long id) {
        videoService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(videoService.getVideoStats());
    }
}
