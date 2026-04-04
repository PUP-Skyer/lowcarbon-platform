package com.lowcarbon.repository;

import com.lowcarbon.entity.UserCarbon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCarbonRepository extends JpaRepository<UserCarbon, Long> {
}
