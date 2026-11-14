package com.rectassets.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rectassets.backend.exception.ResourceNotFoundException;
import com.rectassets.backend.model.Asset;
import com.rectassets.backend.repository.AssetRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetService assetService;

    private Asset sample;

    @BeforeEach
    void setUp() {
        sample = new Asset(
                "LP-014",
                "Lenovo ThinkPad X1 Carbon",
                "Laptop",
                "Omar Saleh",
                "Engineering",
                "In Use",
                LocalDate.of(2025, 1, 20));
        sample.setId(1L);
    }

    @Test
    void create_savesAssetAndClearsId() {
        Asset incoming = new Asset(
                "LP-099",
                "Test Laptop",
                "Laptop",
                "",
                "",
                "Available",
                LocalDate.of(2026, 1, 1));
        incoming.setId(99L);

        when(assetRepository.save(any(Asset.class))).thenAnswer(invocation -> {
            Asset toSave = invocation.getArgument(0);
            assertThat(toSave.getId()).isNull();
            Asset saved = new Asset(
                    toSave.getTag(),
                    toSave.getName(),
                    toSave.getType(),
                    toSave.getAssignedTo(),
                    toSave.getDepartment(),
                    toSave.getStatus(),
                    toSave.getPurchaseDate());
            saved.setId(10L);
            return saved;
        });

        Asset created = assetService.create(incoming);

        ArgumentCaptor<Asset> captor = ArgumentCaptor.forClass(Asset.class);
        verify(assetRepository).save(captor.capture());
        assertThat(captor.getValue().getAssignedTo()).isEqualTo("Unassigned");
        assertThat(captor.getValue().getDepartment()).isEqualTo("General");
        assertThat(created.getId()).isEqualTo(10L);
        assertThat(created.getTag()).isEqualTo("LP-099");
    }

    @Test
    void findById_returnsAssetWhenPresent() {
        when(assetRepository.findById(1L)).thenReturn(Optional.of(sample));

        Asset found = assetService.findById(1L);

        assertThat(found.getTag()).isEqualTo("LP-014");
        verify(assetRepository).findById(1L);
    }

    @Test
    void findById_throwsWhenMissing() {
        when(assetRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetService.findById(42L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("42");
    }

    @Test
    void findAll_returnsPaginatedResults() {
        Pageable pageable = PageRequest.of(0, 2);
        Page<Asset> page = new PageImpl<>(List.of(sample), pageable, 1);
        when(assetRepository.findAll(pageable)).thenReturn(page);

        Page<Asset> result = assetService.findAll(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(assetRepository).findAll(pageable);
    }

    @Test
    void update_modifiesExistingAsset() {
        when(assetRepository.findById(1L)).thenReturn(Optional.of(sample));
        when(assetRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Asset updates = new Asset(
                "LP-014",
                "Updated Name",
                "Laptop",
                "New Owner",
                "IT",
                "Under Repair",
                LocalDate.of(2025, 2, 1));

        Asset updated = assetService.update(1L, updates);

        assertThat(updated.getName()).isEqualTo("Updated Name");
        assertThat(updated.getAssignedTo()).isEqualTo("New Owner");
        assertThat(updated.getStatus()).isEqualTo("Under Repair");
        verify(assetRepository).save(sample);
    }

    @Test
    void delete_removesWhenExists() {
        when(assetRepository.existsById(1L)).thenReturn(true);

        assetService.delete(1L);

        verify(assetRepository).deleteById(1L);
    }

    @Test
    void delete_throwsWhenMissing() {
        when(assetRepository.existsById(9L)).thenReturn(false);

        assertThatThrownBy(() -> assetService.delete(9L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(assetRepository, never()).deleteById(9L);
    }
}
