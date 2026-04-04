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
@Table(name = "scene_emission")
public class SceneEmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scene_name", length = 50)
    private String sceneName;

    @Column(name = "direct_emission", precision = 10, scale = 2)
    private BigDecimal directEmission;

    @Column(name = "indirect_emission", precision = 10, scale = 2)
    private BigDecimal indirectEmission;

    @Column(name = "carbon_offset", precision = 10, scale = 2)
    private BigDecimal carbonOffset;

    @Column(name = "month", length = 10)
    private String month;
}
