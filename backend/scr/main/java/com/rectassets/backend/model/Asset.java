package com.rectassets.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Asset tag is required")
    @Column(nullable = false, unique = true)
    private String tag;

    @NotBlank(message = "Asset name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Asset type is required")
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String assignedTo = "Unassigned";

    @Column(nullable = false)
    private String department = "General";

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    private LocalDate purchaseDate;

    public Asset() {
    }

    public Asset(
            String tag,
            String name,
            String type,
            String assignedTo,
            String department,
            String status,
            LocalDate purchaseDate) {
        this.tag = tag;
        this.name = name;
        this.type = type;
        this.assignedTo = assignedTo;
        this.department = department;
        this.status = status;
        this.purchaseDate = purchaseDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
}
