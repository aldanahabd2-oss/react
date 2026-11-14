package com.rectassets.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rectassets.backend.exception.GlobalExceptionHandler;
import com.rectassets.backend.exception.ResourceNotFoundException;
import com.rectassets.backend.model.Asset;
import com.rectassets.backend.service.AssetService;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class AssetControllerTest {

    @Mock
    private AssetService assetService;

    @InjectMocks
    private AssetController assetController;

    private MockMvc mockMvc;
    private Asset sample;

    private static final String SAMPLE_JSON = """
            {
              "tag": "PC-001",
              "name": "Dell OptiPlex 7090",
              "type": "Desktop",
              "assignedTo": "Sara Al-Hassan",
              "department": "Finance",
              "status": "In Use",
              "purchaseDate": "2024-03-12"
            }
            """;

    private static final String UPDATED_JSON = """
            {
              "tag": "PC-001",
              "name": "Updated Desktop",
              "type": "Desktop",
              "assignedTo": "Sara Al-Hassan",
              "department": "Finance",
              "status": "Under Repair",
              "purchaseDate": "2024-03-12"
            }
            """;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(assetController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        sample = new Asset(
                "PC-001",
                "Dell OptiPlex 7090",
                "Desktop",
                "Sara Al-Hassan",
                "Finance",
                "In Use",
                LocalDate.of(2024, 3, 12));
        sample.setId(1L);
    }

    @Test
    void create_returnsCreatedAsset() throws Exception {
        when(assetService.create(any(Asset.class))).thenReturn(sample);

        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(SAMPLE_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.tag").value("PC-001"));
    }

    @Test
    void getById_returnsAsset() throws Exception {
        when(assetService.findById(1L)).thenReturn(sample);

        mockMvc.perform(get("/api/assets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dell OptiPlex 7090"));
    }

    @Test
    void getById_returns404WhenMissing() throws Exception {
        when(assetService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Asset not found with id: 99"));

        mockMvc.perform(get("/api/assets/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Asset not found with id: 99"));
    }

    @Test
    void getAll_returnsPaginatedResults() throws Exception {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("id").ascending());
        when(assetService.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(sample), pageable, 1));

        mockMvc.perform(get("/api/assets").param("page", "0").param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].tag").value("PC-001"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.size").value(5));
    }

    @Test
    void update_returnsUpdatedAsset() throws Exception {
        Asset updated = new Asset(
                "PC-001",
                "Updated Desktop",
                "Desktop",
                "Sara Al-Hassan",
                "Finance",
                "Under Repair",
                LocalDate.of(2024, 3, 12));
        updated.setId(1L);
        when(assetService.update(eq(1L), any(Asset.class))).thenReturn(updated);

        mockMvc.perform(put("/api/assets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(UPDATED_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Desktop"))
                .andExpect(jsonPath("$.status").value("Under Repair"));
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        doNothing().when(assetService).delete(1L);

        mockMvc.perform(delete("/api/assets/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404WhenMissing() throws Exception {
        doThrow(new ResourceNotFoundException("Asset not found with id: 7"))
                .when(assetService)
                .delete(7L);

        mockMvc.perform(delete("/api/assets/7"))
                .andExpect(status().isNotFound());
    }
}
