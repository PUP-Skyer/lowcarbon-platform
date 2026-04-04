package com.lowcarbon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.lowcarbon")
public class LowCarbonApplication {

    public static void main(String[] args) {
        SpringApplication.run(LowCarbonApplication.class, args);
    }
}
