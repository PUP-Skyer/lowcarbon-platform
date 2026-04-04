package com.lowcarbon.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ScriptService {

    // 预设的视频脚本模板（实际应调用LLM API生成）
    private static final Map<String, String> SCRIPT_TEMPLATES = Map.of(
        "report", "A professional data visualization video showing carbon reduction trends. " +
                  "Open with a sleek dark blue dashboard displaying animated line charts and bar graphs. " +
                  "Numbers scroll up showing key metrics. Smooth camera transitions between data panels. " +
                  "End with tagline and call to action. Cinematic lighting, 4K quality.",
        "story", "A heartwarming personal carbon footprint review. " +
                 "Follow a person through their daily eco-friendly activities: cycling, using public transport, " +
                 "eating plant-based meals. Warm golden hour lighting. Time-lapse transitions. " +
                 "End with inspiring text overlay about their environmental impact.",
        "rank", "An energetic leaderboard reveal video. " +
                "Start with countdown animation. Rankings appear one by one with satisfying sound effects. " +
                "Top 3 communities get special celebration animations with confetti and glowing effects. " +
                "End with motivational message about next week's challenge.",
        "edu", "An educational explainer video about environmental topics. " +
               "Clean motion graphics style with icons and text overlays. " +
               "Step-by-step visual explanations with smooth transitions. " +
               "Friendly narrator tone, bright colors, easy to understand."
    );

    public String generateScript(String type, Map<String, Object> data) {
        String template = SCRIPT_TEMPLATES.getOrDefault(type, SCRIPT_TEMPLATES.get("report"));

        // 在实际项目中，这里应调用火山方舟 LLM API
        // 目前使用模板 + 数据填充的方式模拟
        StringBuilder script = new StringBuilder(template);

        if (data != null) {
            if (data.containsKey("dateRange")) {
                script.append(" Time range: ").append(data.get("dateRange")).append(".");
            }
            if (data.containsKey("topic")) {
                script.append(" Topic: ").append(data.get("topic")).append(".");
            }
        }

        return script.toString();
    }

    public String generateSeedancePrompt(String type, Map<String, Object> data) {
        String script = generateScript(type, data);
        // 转换为 Seedance 2.0 适用的英文提示词格式
        return script + " 15 seconds, high quality, cinematic.";
    }
}
