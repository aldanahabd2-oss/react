package com.rectassets.backend.config;

import com.rectassets.backend.model.Asset;
import com.rectassets.backend.repository.AssetRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedAssets(AssetRepository assetRepository) {
        return args -> {
            if (assetRepository.count() > 0) {
                return;
            }

            assetRepository.saveAll(List.of(
                    new Asset(
                            "PC-001",
                            "Dell OptiPlex 7090",
                            "Desktop",
                            "Sara Al-Hassan",
                            "Finance",
                            "In Use",
                            LocalDate.of(2024, 3, 12)),
                    new Asset(
                            "LP-014",
                            "Lenovo ThinkPad X1 Carbon",
                            "Laptop",
                            "Omar Saleh",
                            "Engineering",
                            "In Use",
                            LocalDate.of(2025, 1, 20)),
                    new Asset(
                            "MN-008",
                            "LG UltraFine 27\"",
                            "Monitor",
                            "Unassigned",
                            "IT",
                            "Available",
                            LocalDate.of(2023, 11, 5)),
                    new Asset(
                            "SV-002",
                            "HP ProLiant DL380",
                            "Server",
                            "IT Infrastructure",
                            "IT",
                            "In Use",
                            LocalDate.of(2022, 8, 18)),
                    new Asset(
                            "LP-021",
                            "MacBook Pro 14",
                            "Laptop",
                            "Noura Ali",
                            "Design",
                            "In Use",
                            LocalDate.of(2025, 6, 1)),
                    new Asset(
                            "PC-010",
                            "HP EliteDesk 800",
                            "Desktop",
                            "Unassigned",
                            "HR",
                            "Available",
                            LocalDate.of(2024, 9, 15))));
        };
    }
}
