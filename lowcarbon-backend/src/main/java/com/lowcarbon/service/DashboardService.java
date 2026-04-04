package com.lowcarbon.service;

import com.lowcarbon.entity.Dashboard;
import com.lowcarbon.repository.DashboardRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public List<Dashboard> getAllDashboards() {
        return dashboardRepository.findAll();
    }

    public Dashboard getDashboardById(Long id) {
        return dashboardRepository.findById(id).orElse(null);
    }

    public Dashboard createDashboard(Dashboard dashboard) {
        dashboard.setCreatedAt(LocalDateTime.now());
        dashboard.setUpdatedAt(LocalDateTime.now());
        return dashboardRepository.save(dashboard);
    }

    public void deleteDashboard(Long id) {
        dashboardRepository.deleteById(id);
    }
}
