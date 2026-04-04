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
@Table(name = "user_carbon")
public class UserCarbon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", length = 50)
    private String userName;

    @Column(name = "lowcarbon_actions")
    private Integer lowcarbonActions;

    @Column(name = "carbon_emission", precision = 10, scale = 2)
    private BigDecimal carbonEmission;

    @Column(name = "month", length = 10)
    private String month;
}
