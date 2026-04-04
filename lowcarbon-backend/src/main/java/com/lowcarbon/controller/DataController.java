package com.lowcarbon.controller;

import com.lowcarbon.entity.*;
import com.lowcarbon.service.DataService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin
public class DataController {

    private final DataService dataService;

    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/scene-emission")
    public List<SceneEmission> getSceneEmission() {
        return dataService.getAllSceneEmissions();
    }

    @GetMapping("/credit-source")
    public List<CreditSource> getCreditSource() {
        return dataService.getCreditSources();
    }

    @GetMapping("/user-carbon")
    public List<UserCarbon> getUserCarbon() {
        return dataService.getUserCarbonData();
    }

    @GetMapping("/footprint-trend")
    public List<CarbonFootprintTrend> getFootprintTrend() {
        return dataService.getCarbonFootprintTrend();
    }

    @GetMapping("/activity-funnel")
    public List<ActivityFunnel> getActivityFunnel() {
        return dataService.getActivityFunnel();
    }

    @GetMapping("/community-heatmap")
    public List<CommunityHeatmap> getCommunityHeatmap() {
        return dataService.getCommunityHeatmap();
    }

    @GetMapping("/lowcarbon-rank")
    public List<Map<String, Object>> getLowcarbonRank() {
        return dataService.getLowcarbonRank();
    }

    @GetMapping("/user-performance")
    public List<Map<String, Object>> getUserPerformance() {
        return dataService.getUserPerformance();
    }

    @GetMapping("/kpi")
    public Map<String, Object> getKpiData() {
        return dataService.getKpiData();
    }
}
