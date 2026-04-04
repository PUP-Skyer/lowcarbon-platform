package com.lowcarbon.service;

import com.lowcarbon.entity.*;
import com.lowcarbon.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataService {

    private final SceneEmissionRepository sceneEmissionRepository;
    private final CreditSourceRepository creditSourceRepository;
    private final UserCarbonRepository userCarbonRepository;
    private final CarbonFootprintTrendRepository carbonFootprintTrendRepository;
    private final ActivityFunnelRepository activityFunnelRepository;
    private final CommunityHeatmapRepository communityHeatmapRepository;

    public DataService(SceneEmissionRepository sceneEmissionRepository,
                       CreditSourceRepository creditSourceRepository,
                       UserCarbonRepository userCarbonRepository,
                       CarbonFootprintTrendRepository carbonFootprintTrendRepository,
                       ActivityFunnelRepository activityFunnelRepository,
                       CommunityHeatmapRepository communityHeatmapRepository) {
        this.sceneEmissionRepository = sceneEmissionRepository;
        this.creditSourceRepository = creditSourceRepository;
        this.userCarbonRepository = userCarbonRepository;
        this.carbonFootprintTrendRepository = carbonFootprintTrendRepository;
        this.activityFunnelRepository = activityFunnelRepository;
        this.communityHeatmapRepository = communityHeatmapRepository;
    }

    public List<SceneEmission> getAllSceneEmissions() {
        return sceneEmissionRepository.findAll();
    }

    public List<CreditSource> getCreditSources() {
        return creditSourceRepository.findAll();
    }

    public List<UserCarbon> getUserCarbonData() {
        return userCarbonRepository.findAll();
    }

    public List<CarbonFootprintTrend> getCarbonFootprintTrend() {
        return carbonFootprintTrendRepository.findAll();
    }

    public List<ActivityFunnel> getActivityFunnel() {
        return activityFunnelRepository.findAll();
    }

    public List<CommunityHeatmap> getCommunityHeatmap() {
        return communityHeatmapRepository.findAll();
    }

    public List<Map<String, Object>> getLowcarbonRank() {
        List<UserCarbon> allUsers = userCarbonRepository.findAll();
        Map<String, List<UserCarbon>> grouped = allUsers.stream()
                .collect(Collectors.groupingBy(u -> u.getUserName() != null ? u.getUserName() : "unknown"));

        List<Map<String, Object>> rankList = new ArrayList<>();
        for (Map.Entry<String, List<UserCarbon>> entry : grouped.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", entry.getKey());
            int totalActions = entry.getValue().stream()
                    .mapToInt(u -> u.getLowcarbonActions() != null ? u.getLowcarbonActions() : 0)
                    .sum();
            BigDecimal totalEmission = entry.getValue().stream()
                    .map(u -> u.getCarbonEmission() != null ? u.getCarbonEmission() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            item.put("lowcarbonActions", totalActions);
            item.put("carbonEmission", totalEmission);
            rankList.add(item);
        }

        rankList.sort((a, b) -> ((Integer) b.get("lowcarbonActions")).compareTo((Integer) a.get("lowcarbonActions")));
        return rankList;
    }

    public List<Map<String, Object>> getUserPerformance() {
        List<UserCarbon> allUsers = userCarbonRepository.findAll();
        List<Map<String, Object>> performanceList = new ArrayList<>();

        for (UserCarbon user : allUsers) {
            Map<String, Object> perf = new HashMap<>();
            perf.put("userName", user.getUserName());
            perf.put("lowcarbonActions", user.getLowcarbonActions());
            perf.put("carbonEmission", user.getCarbonEmission());

            int actions = user.getLowcarbonActions() != null ? user.getLowcarbonActions() : 0;
            String level;
            if (actions >= 50) {
                level = "低碳达人";
            } else if (actions >= 30) {
                level = "低碳先锋";
            } else if (actions >= 15) {
                level = "低碳践行者";
            } else {
                level = "低碳新手";
            }
            perf.put("level", level);
            performanceList.add(perf);
        }

        performanceList.sort((a, b) -> ((Integer) b.get("lowcarbonActions")).compareTo((Integer) a.get("lowcarbonActions")));
        return performanceList;
    }

    public Map<String, Object> getKpiData() {
        Map<String, Object> kpi = new HashMap<>();

        List<UserCarbon> users = userCarbonRepository.findAll();
        int registeredUsers = (int) users.stream()
                .map(UserCarbon::getUserName)
                .distinct()
                .count();
        kpi.put("registeredUsers", registeredUsers);

        List<CarbonFootprintTrend> trends = carbonFootprintTrendRepository.findAll();
        int activeUsers = trends.stream()
                .mapToInt(t -> t.getActiveUsers() != null ? t.getActiveUsers() : 0)
                .max()
                .orElse(0);
        kpi.put("activeUsers", activeUsers);

        BigDecimal totalReduction = trends.stream()
                .map(t -> t.getAvgReduction() != null ? t.getAvgReduction() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        kpi.put("totalCarbonReduction", totalReduction.setScale(2, RoundingMode.HALF_UP));

        int totalCredits = creditSourceRepository.findAll().stream()
                .mapToInt(c -> c.getCreditAmount() != null ? c.getCreditAmount() : 0)
                .sum();
        kpi.put("totalCreditsIssued", totalCredits);

        return kpi;
    }
}
