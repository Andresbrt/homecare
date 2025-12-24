package com.cleanhome.backend.controller;

import com.cleanhome.backend.service.ConfigService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ConfigController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(ConfigService.class)
@TestPropertySource(properties = {
        "ai.enabled=true",
        "ai.model=gpt-5.1-codex-max"
})
class ConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ConfigService configService;

    // Mocks necesarios para el contexto de seguridad
    @MockBean
    private com.cleanhome.backend.security.JwtUtils jwtUtils;

    @MockBean
    private com.cleanhome.backend.security.AuthTokenFilter authTokenFilter;

    @MockBean
    private com.cleanhome.backend.service.UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void resetConfig() {
        configService.setAiEnabled(true);
        configService.setAiModel("gpt-5.1-codex-max");
    }

    @Test
    void getAiConfig_shouldReturnCurrentConfig() throws Exception {
        configService.setAiEnabled(true);
        configService.setAiModel("gpt-5.1-codex-max");

        mockMvc.perform(get("/api/config/ai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.model").value("gpt-5.1-codex-max"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateAiConfig_asAdmin_shouldUpdateAndReturnConfig() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("enabled", false);
        body.put("model", "gpt-4.2-mini");

        mockMvc.perform(put("/api/config/ai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.model").value("gpt-4.2-mini"));

        assertThat(configService.isAiEnabled()).isFalse();
        assertThat(configService.getAiModel()).isEqualTo("gpt-4.2-mini");
    }


}
