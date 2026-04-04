package com.lowcarbon.service;

import com.lowcarbon.entity.VideoTask;
import com.lowcarbon.repository.VideoTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class VideoService {

    @Autowired
    private VideoTaskRepository videoTaskRepository;

    public List<VideoTask> getAllTasks() {
        return videoTaskRepository.findAllByOrderByCreatedAtDesc();
    }

    public VideoTask getTaskById(Long id) {
        return videoTaskRepository.findById(id).orElse(null);
    }

    public List<VideoTask> getTasksByStatus(String status) {
        return videoTaskRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public VideoTask createTask(String title, String type, Map<String, Object> params) {
        VideoTask task = new VideoTask();
        task.setTitle(title);
        task.setType(type);
        task.setStatus("pending");
        task.setParamsJson(params != null ? params.toString() : "{}");
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        VideoTask saved = videoTaskRepository.save(task);

        // 异步模拟生成流程
        simulateGeneration(saved.getId());

        return saved;
    }

    public VideoTask handleCallback(Long id, String videoUrl, String coverUrl, Integer duration) {
        VideoTask task = videoTaskRepository.findById(id).orElse(null);
        if (task != null) {
            task.setStatus("completed");
            task.setVideoUrl(videoUrl);
            task.setCoverUrl(coverUrl);
            task.setDuration(duration);
            task.setUpdatedAt(LocalDateTime.now());
            videoTaskRepository.save(task);
        }
        return task;
    }

    public void deleteTask(Long id) {
        videoTaskRepository.deleteById(id);
    }

    // 模拟异步视频生成（实际应调用Seedance API）
    private void simulateGeneration(Long taskId) {
        new Thread(() -> {
            try {
                // 模拟步骤1：生成脚本
                Thread.sleep(2000);
                VideoTask task1 = videoTaskRepository.findById(taskId).orElse(null);
                if (task1 != null) {
                    task1.setStatus("generating");
                    task1.setScriptText("AI generated script for task " + taskId);
                    task1.setPromptText("Professional carbon data visualization video...");
                    videoTaskRepository.save(task1);
                }

                // 模拟步骤2：视频生成中
                Thread.sleep(5000);

                // 模拟步骤3：生成完成
                VideoTask task2 = videoTaskRepository.findById(taskId).orElse(null);
                if (task2 != null) {
                    task2.setStatus("completed");
                    task2.setVideoUrl("/videos/generated-" + taskId + ".mp4");
                    task2.setCoverUrl("/covers/generated-" + taskId + ".jpg");
                    task2.setDuration(15);
                    task2.setUpdatedAt(LocalDateTime.now());
                    videoTaskRepository.save(task2);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    // 获取视频统计信息
    public Map<String, Object> getVideoStats() {
        List<VideoTask> all = videoTaskRepository.findAll();
        long total = all.size();
        long completed = all.stream().filter(t -> "completed".equals(t.getStatus())).count();
        long generating = all.stream().filter(t -> "generating".equals(t.getStatus())).count();
        long pending = all.stream().filter(t -> "pending".equals(t.getStatus())).count();
        long failed = all.stream().filter(t -> "failed".equals(t.getStatus())).count();

        return Map.of(
            "total", total,
            "completed", completed,
            "generating", generating,
            "pending", pending,
            "failed", failed
        );
    }
}
