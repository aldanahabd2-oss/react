package com.rectassets.backend.service;

import com.rectassets.backend.exception.ResourceNotFoundException;
import com.rectassets.backend.model.Asset;
import com.rectassets.backend.repository.AssetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Asset create(Asset asset) {
        asset.setId(null);
        normalize(asset);
        return assetRepository.save(asset);
    }

    @Transactional(readOnly = true)
    public Asset findById(Long id) {
        return assetRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Asset> findAll(Pageable pageable) {
        return assetRepository.findAll(pageable);
    }

    public Asset update(Long id, Asset updates) {
        Asset existing = findById(id);
        existing.setTag(updates.getTag());
        existing.setName(updates.getName());
        existing.setType(updates.getType());
        existing.setAssignedTo(updates.getAssignedTo());
        existing.setDepartment(updates.getDepartment());
        existing.setStatus(updates.getStatus());
        existing.setPurchaseDate(updates.getPurchaseDate());
        normalize(existing);
        return assetRepository.save(existing);
    }

    public void delete(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with id: " + id);
        }
        assetRepository.deleteById(id);
    }

    private void normalize(Asset asset) {
        if (asset.getAssignedTo() == null || asset.getAssignedTo().isBlank()) {
            asset.setAssignedTo("Unassigned");
        }
        if (asset.getDepartment() == null || asset.getDepartment().isBlank()) {
            asset.setDepartment("General");
        }
    }
}
