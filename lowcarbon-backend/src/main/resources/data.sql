-- scene_emission: 5 scenes x 1 month
INSERT INTO scene_emission (scene_name, direct_emission, indirect_emission, carbon_offset, month) VALUES
('绿色出行', 120.50, 45.30, 30.00, '2024-01'),
('低碳饮食', 85.20, 32.10, 15.50, '2024-01'),
('绿色消费', 200.80, 88.60, 42.00, '2024-01'),
('节能居家', 150.30, 55.40, 35.00, '2024-01'),
('绿色办公', 95.60, 28.90, 20.00, '2024-01');

-- credit_source: 6 entries
INSERT INTO credit_source (source_name, credit_amount, month) VALUES
('步行出行', 50, '2024-01'),
('骑行通勤', 80, '2024-01'),
('公交地铁', 60, '2024-01'),
('素食日', 40, '2024-01'),
('垃圾分类', 30, '2024-01'),
('节约用水', 25, '2024-01');

-- user_carbon: 10 users
INSERT INTO user_carbon (user_name, lowcarbon_actions, carbon_emission, month) VALUES
('张三', 45, 120.50, '2024-01'),
('李四', 38, 98.30, '2024-01'),
('王五', 52, 85.60, '2024-01'),
('赵六', 28, 145.20, '2024-01'),
('孙七', 61, 72.40, '2024-01'),
('周八', 33, 110.80, '2024-01'),
('吴九', 19, 168.50, '2024-01'),
('郑十', 42, 95.30, '2024-01'),
('钱十一', 55, 68.90, '2024-01'),
('陈十二', 25, 135.60, '2024-01');

-- carbon_footprint_trend: 12 months
INSERT INTO carbon_footprint_trend (month, avg_emission, avg_reduction, active_users) VALUES
('2024-01', 185.50, 12.30, 1250),
('2024-02', 178.20, 15.60, 1320),
('2024-03', 170.80, 18.90, 1400),
('2024-04', 165.30, 22.40, 1480),
('2024-05', 158.60, 25.80, 1550),
('2024-06', 152.40, 28.50, 1620),
('2024-07', 148.90, 30.20, 1700),
('2024-08', 145.20, 32.80, 1750),
('2024-09', 140.50, 35.60, 1820),
('2024-10', 135.80, 38.40, 1900),
('2024-11', 130.20, 41.50, 1980),
('2024-12', 125.60, 45.30, 2050);

-- activity_funnel: 5 stages
INSERT INTO activity_funnel (stage_name, user_count) VALUES
('浏览活动', 5000),
('报名参与', 3200),
('完成签到', 2800),
('提交成果', 2100),
('获得积分', 1800);

-- community_heatmap: 7 communities x 6 months = 42 entries
INSERT INTO community_heatmap (community_name, month, emission_index) VALUES
('阳光花园', '2024-01', 85.20),
('阳光花园', '2024-02', 82.50),
('阳光花园', '2024-03', 78.30),
('阳光花园', '2024-04', 75.60),
('阳光花园', '2024-05', 72.10),
('阳光花园', '2024-06', 68.90),
('翠湖社区', '2024-01', 92.40),
('翠湖社区', '2024-02', 88.70),
('翠湖社区', '2024-03', 85.20),
('翠湖社区', '2024-04', 81.50),
('翠湖社区', '2024-05', 78.30),
('翠湖社区', '2024-06', 74.60),
('碧水湾', '2024-01', 78.90),
('碧水湾', '2024-02', 75.30),
('碧水湾', '2024-03', 72.80),
('碧水湾', '2024-04', 69.50),
('碧水湾', '2024-05', 66.20),
('碧水湾', '2024-06', 63.80),
('绿城花园', '2024-01', 95.60),
('绿城花园', '2024-02', 92.10),
('绿城花园', '2024-03', 88.50),
('绿城花园', '2024-04', 85.20),
('绿城花园', '2024-05', 82.30),
('绿城花园', '2024-06', 79.80),
('星河湾', '2024-01', 88.30),
('星河湾', '2024-02', 85.60),
('星河湾', '2024-03', 82.10),
('星河湾', '2024-04', 78.90),
('星河湾', '2024-05', 75.50),
('星河湾', '2024-06', 72.30),
('锦绣华庭', '2024-01', 72.50),
('锦绣华庭', '2024-02', 70.20),
('锦绣华庭', '2024-03', 67.80),
('锦绣华庭', '2024-04', 65.30),
('锦绣华庭', '2024-05', 62.90),
('锦绣华庭', '2024-06', 60.50),
('龙湖天街', '2024-01', 90.10),
('龙湖天街', '2024-02', 87.30),
('龙湖天街', '2024-03', 84.60),
('龙湖天街', '2024-04', 81.20),
('龙湖天街', '2024-05', 78.50),
('龙湖天街', '2024-06', 75.80);

-- dashboard: 1 default dashboard
INSERT INTO dashboard (name, description, config_json, created_at, updated_at) VALUES
('低碳数据总览', '低碳生活平台数据总览仪表盘', '{"layout":[{"i":"kpi","x":0,"y":0,"w":12,"h":2},{"i":"scene","x":0,"y":2,"w":6,"h":4},{"i":"trend","x":6,"y":2,"w":6,"h":4},{"i":"funnel","x":0,"y":6,"w":4,"h":4},{"i":"credit","x":4,"y":6,"w":4,"h":4},{"i":"heatmap","x":8,"y":6,"w":4,"h":4}]}', NOW(), NOW());

-- 视频生成任务表
CREATE TABLE IF NOT EXISTS video_task (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL COMMENT '视频标题',
  type VARCHAR(50) NOT NULL COMMENT '视频类型: report/story/rank/edu',
  status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/generating/completed/failed',
  script_text TEXT COMMENT 'AI生成的视频脚本',
  prompt_text TEXT COMMENT 'Seedance提示词',
  video_url VARCHAR(500) COMMENT '视频文件URL',
  cover_url VARCHAR(500) COMMENT '封面图URL',
  duration INT COMMENT '视频时长(秒)',
  params_json TEXT COMMENT '生成参数JSON',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO video_task (title, type, status, script_text, prompt_text, video_url, duration, params_json) VALUES
('2026年Q1碳减排数据报告', 'report', 'completed', 
 'A professional data visualization video showing carbon reduction trends for Q1 2026. Open with animated dashboard displaying line charts and bar graphs. Numbers scroll up showing 1,884 tons total carbon reduction, up 15.2%. Green energy icons glow. End with tagline: Building a Greener Future Together.',
 'A professional data visualization video showing carbon reduction trends for Q1 2026. Open with a sleek dark blue dashboard displaying animated line charts and bar graphs. Numbers scroll up: 1,884 tons total carbon reduction, up 15.2% quarter over quarter. Smooth camera pan across KPI cards. Green energy icons glow softly. End with platform logo and tagline: "Building a Greener Future Together". Cinematic lighting, 4K quality. Background music: uplifting electronic ambient. 15 seconds.',
 '/videos/sample-report.mp4', 15, '{"dateRange":"2026-Q1","metrics":["reduction","users"]}'),
('你的2026低碳之年', 'story', 'completed',
 'A heartwarming personal carbon footprint review video. A young person rides a bicycle through a tree-lined city path. Camera follows with warm golden light. Transition to trees growing from small to tall. End with text overlay: "You made a difference this year."',
 'Heartwarming personal carbon footprint review. A young person rides a bicycle through a tree-lined city path in golden hour light. Camera follows with smooth tracking shot. Transition to time-lapse of trees growing from small saplings to tall trees. Overlay text appears: "You rode 1,200km this year, equivalent to planting 50 trees." End with warm smile and text: "You made a difference." Soft piano music, warm color grading, 15 seconds.',
 '/videos/sample-story.mp4', 15, '{"userId":"user-001","style":"warm"}'),
('本周社区碳减排排行榜', 'rank', 'generating',
 NULL,
 NULL, NULL, NULL, '{"community":"sunshine","period":"weekly"}'),
('垃圾分类低碳指南', 'edu', 'pending',
 NULL,
 NULL, NULL, NULL, '{"topic":"waste-sorting","count":1}');
