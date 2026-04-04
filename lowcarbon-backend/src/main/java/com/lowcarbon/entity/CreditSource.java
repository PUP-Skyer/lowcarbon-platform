package com.lowcarbon.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "credit_source")
public class CreditSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_name", length = 50)
    private String sourceName;

    @Column(name = "credit_amount")
    private Integer creditAmount;

    @Column(name = "month", length = 10)
    private String month;
}
