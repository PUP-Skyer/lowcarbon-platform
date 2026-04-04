package com.lowcarbon.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carbon_footprint_trend")
public class CarbonFootprintTrend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "month", length = 10)
    private String month;

    @Column(name = "avg_emission", precision = 10, scale = 2)
    private BigDecimal avgEmission;

    @Column(name = "avg_reduction", precision = 10, scale = 2)
    private BigDecimal avgReduction;

    @Column(name = "active_users")
    private Integer activeUsers;
}
