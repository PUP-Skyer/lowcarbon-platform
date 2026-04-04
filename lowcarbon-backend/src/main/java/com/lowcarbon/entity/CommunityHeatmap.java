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
@Table(name = "community_heatmap")
public class CommunityHeatmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "community_name", length = 50)
    private String communityName;

    @Column(name = "month", length = 10)
    private String month;

    @Column(name = "emission_index", precision = 10, scale = 2)
    private BigDecimal emissionIndex;
}
