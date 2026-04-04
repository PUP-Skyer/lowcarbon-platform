package com.lowcarbon.controller;

import com.lowcarbon.entity.Dashboard;
import com.lowcarbon.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public List<Dashboard> getAllDashboards() {
        return dashboardService.getAllDashboards();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getDashboardById(@PathVariable Long id) {
        Dashboard dashboard = dashboardService.getDashboardById(id);
        if (dashboard == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dashboard);
    }

    @PostMapping
    public Dashboard createDashboard(@RequestBody Dashboard dashboard) {
        return dashboardService.createDashboard(dashboard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDashboard(@PathVariable Long id) {
        dashboardService.deleteDashboard(id);
        return ResponseEntity.noContent().build();
    }
}
